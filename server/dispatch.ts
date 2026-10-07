import { weatherDataFields } from "../src/utils/weatherMaps.ts";
import type {
  CityResult,
  ForecastPoint,
  WeatherFailure,
  WeatherSuccess,
} from "../src/types/weather.ts";

type Env = Record<string, string | undefined>;

export type ApiResult = {
  status: number;
  headers: Record<string, string>;
  body: string | Buffer;
};

const ALLOWED_FIELDS = new Set(weatherDataFields.map((field) => field.key));
const tileCache = new Map<string, { body: Buffer; contentType: string; expires: number }>();
const MAX_TILE_CACHE = 200;
let activeTileFetches = 0;
const tileWaiters: Array<() => void> = [];

async function withTileSlot<T>(task: () => Promise<T>) {
  while (activeTileFetches >= 3) {
    await new Promise<void>((resolve) => tileWaiters.push(resolve));
  }
  activeTileFetches += 1;
  try {
    return await task();
  } finally {
    activeTileFetches -= 1;
    const next = tileWaiters.shift();
    next?.();
  }
}

function json(status: number, payload: unknown, cache = "no-store"): ApiResult {
  return {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cache,
    },
    body: JSON.stringify(payload),
  };
}

function failure(status: number, code: number, message: string): ApiResult {
  const payload: WeatherFailure = { error: true, code, message };
  return json(status, payload);
}

function apiKey(env: Env) {
  return (
    env.WEATHER_API_KEY ||
    env.VITE_WEATHER_API_KEY ||
    env.VITE_WHEATHER_API_KEY ||
    ""
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function parseCoord(value: string | null, min: number, max: number) {
  if (value == null || value.trim() === "") return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  return parsed;
}

function hourStamp() {
  const time = new Date();
  time.setMinutes(0, 0, 0);
  return time.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function normalizePoint(point: unknown) {
  if (!isRecord(point)) return null;
  const time = point.time ?? point.startTime;
  if (typeof time !== "string" || !isRecord(point.values)) return null;
  return {
    time,
    text: typeof point.text === "string" ? point.text : "",
    values: point.values as unknown as ForecastPoint["values"],
  };
}

async function tomorrowJson(url: string) {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  const data = await readJson(response);

  if (!response.ok) {
    const code =
      isRecord(data) && typeof data.code === "number" ? data.code : response.status;
    if (response.status === 429 || code === 429001) {
      return {
        ok: false as const,
        code: 429001,
        message: "Rate limit reached. Please try again later.",
      };
    }
    const message =
      isRecord(data) && typeof data.message === "string"
        ? data.message
        : "Weather service request failed";
    return { ok: false as const, code, message };
  }

  return { ok: true as const, data };
}

async function handleWeather(url: URL, env: Env): Promise<ApiResult> {
  const key = apiKey(env);
  if (!key) {
    return failure(500, 500, "Weather service is not configured");
  }

  const latitude = parseCoord(url.searchParams.get("latitude"), -90, 90);
  const longitude = parseCoord(url.searchParams.get("longitude"), -180, 180);
  if (latitude == null || longitude == null) {
    return failure(400, 400, "Missing latitude or longitude");
  }

  const location = `${latitude},${longitude}`;
  const realtimeUrl = new URL("https://api.tomorrow.io/v4/weather/realtime");
  realtimeUrl.searchParams.set("location", location);
  realtimeUrl.searchParams.set("units", "metric");
  realtimeUrl.searchParams.set("apikey", key);

  const forecastUrl = new URL("https://api.tomorrow.io/v4/weather/forecast");
  forecastUrl.searchParams.set("location", location);
  forecastUrl.searchParams.set("timesteps", "1h,1d");
  forecastUrl.searchParams.set("units", "metric");
  forecastUrl.searchParams.set("apikey", key);

  const [realtime, forecast] = await Promise.all([
    tomorrowJson(realtimeUrl.toString()),
    tomorrowJson(forecastUrl.toString()),
  ]);

  if (!realtime.ok) return failure(realtime.code === 429001 ? 429 : 502, realtime.code, realtime.message);
  if (!forecast.ok) return failure(forecast.code === 429001 ? 429 : 502, forecast.code, forecast.message);

  if (!isRecord(realtime.data) || !isRecord(realtime.data.data)) {
    return failure(502, 502, "Weather service returned an unexpected response");
  }

  const timelines = isRecord(forecast.data) ? forecast.data.timelines : null;
  if (!isRecord(timelines) || !Array.isArray(timelines.hourly) || !Array.isArray(timelines.daily)) {
    return failure(502, 502, "Weather service returned an unexpected forecast");
  }

  const hourly = timelines.hourly
    .map(normalizePoint)
    .filter((point): point is ForecastPoint => point !== null)
    .filter((_, index) => index % 3 === 0)
    .slice(0, 8);

  const daily = timelines.daily
    .map(normalizePoint)
    .filter((point): point is ForecastPoint => point !== null)
    .slice(0, 7);

  const payload: WeatherSuccess = {
    currentWeather: realtime.data as unknown as WeatherSuccess["currentWeather"],
    hourlyWeather: { timelines: { hourly } },
    dailyWeather: { timelines: { daily } },
  };

  return json(200, payload, "private, max-age=300");
}

function placeName(address: Record<string, unknown>, displayName: string) {
  const candidates = [
    address.city,
    address.town,
    address.village,
    address.municipality,
    address.hamlet,
    address.county,
  ];
  const named = candidates.find((value) => typeof value === "string" && value.length > 0);
  if (typeof named === "string") return named;
  return displayName.split(",")[0]?.trim() || displayName;
}

function toCityResult(place: Record<string, unknown>): CityResult | null {
  const address = isRecord(place.address) ? place.address : {};
  const latitude = typeof place.lat === "string" ? place.lat : "";
  const longitude = typeof place.lon === "string" ? place.lon : "";
  const displayName = typeof place.display_name === "string" ? place.display_name : "";
  if (!latitude || !longitude || !displayName) return null;

  const countryCode =
    typeof address.country_code === "string" ? address.country_code.toUpperCase() : "";

  return {
    id: String(place.place_id ?? `${latitude},${longitude}`),
    name: placeName(address, displayName),
    state: typeof address.state === "string" ? address.state : "",
    countryName: typeof address.country === "string" ? address.country : "",
    countryCode,
    latitude,
    longitude,
  };
}

async function nominatim(url: URL) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "WeatherCast/0.1 (personal weather app)",
    },
  });
  if (!response.ok) {
    return {
      ok: false as const,
      result: failure(502, 502, "City search is unavailable right now"),
    };
  }
  return { ok: true as const, data: await readJson(response) };
}

async function handleGeocode(url: URL): Promise<ApiResult> {
  const query = url.searchParams.get("q")?.trim() ?? "";
  const latitude = parseCoord(url.searchParams.get("latitude"), -90, 90);
  const longitude = parseCoord(url.searchParams.get("longitude"), -180, 180);

  if (query) {
    if (query.length < 2 || query.length > 80) {
      return json(200, { results: [] as CityResult[] });
    }

    const endpoint = new URL("https://nominatim.openstreetmap.org/search");
    endpoint.searchParams.set("q", query);
    endpoint.searchParams.set("format", "jsonv2");
    endpoint.searchParams.set("addressdetails", "1");
    endpoint.searchParams.set("limit", "8");

    const lookup = await nominatim(endpoint);
    if (!lookup.ok) return lookup.result;
    if (!Array.isArray(lookup.data)) {
      return failure(502, 502, "City search is unavailable right now");
    }

    const results = lookup.data
      .filter(isRecord)
      .map(toCityResult)
      .filter((place): place is CityResult => place !== null);

    return json(200, { results }, "private, max-age=60");
  }

  if (latitude == null || longitude == null) {
    return failure(400, 400, "Provide a search query or coordinates");
  }

  const endpoint = new URL("https://nominatim.openstreetmap.org/reverse");
  endpoint.searchParams.set("lat", String(latitude));
  endpoint.searchParams.set("lon", String(longitude));
  endpoint.searchParams.set("format", "jsonv2");
  endpoint.searchParams.set("addressdetails", "1");

  const lookup = await nominatim(endpoint);
  if (!lookup.ok) return lookup.result;
  if (!isRecord(lookup.data)) {
    return failure(502, 502, "City search is unavailable right now");
  }
  const place = toCityResult(lookup.data);
  if (!place) return failure(404, 404, "Location not found");
  return json(200, place, "private, max-age=86400");
}

async function handleTile(url: URL, env: Env): Promise<ApiResult> {
  const key = apiKey(env);
  if (!key) return failure(500, 500, "Weather service is not configured");

  const z = Number(url.searchParams.get("z"));
  const x = Number(url.searchParams.get("x"));
  const y = Number(url.searchParams.get("y"));
  const field = url.searchParams.get("field") ?? "";

  const validTile =
    Number.isInteger(z) &&
    z >= 0 &&
    z <= 18 &&
    Number.isInteger(x) &&
    x >= 0 &&
    Number.isInteger(y) &&
    y >= 0 &&
    ALLOWED_FIELDS.has(field);

  if (!validTile) return failure(400, 400, "Invalid map tile request");

  const stamp = hourStamp();
  const cacheKey = `${z}/${x}/${y}/${field}/${stamp}`;
  const cached = tileCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return {
      status: 200,
      headers: {
        "content-type": cached.contentType,
        "cache-control": "public, max-age=3600",
      },
      body: cached.body,
    };
  }

  const upstream = new URL(
    `https://api.tomorrow.io/v4/map/tile/${z}/${x}/${y}/${field}/${stamp}.png`
  );
  upstream.searchParams.set("apikey", key);

  const response = await withTileSlot(() => fetch(upstream));
  if (!response.ok) {
    return failure(502, response.status, "Weather map is unavailable right now");
  }

  const body = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "image/png";
  if (tileCache.size >= MAX_TILE_CACHE) {
    const oldest = tileCache.keys().next().value;
    if (oldest) tileCache.delete(oldest);
  }
  tileCache.set(cacheKey, {
    body,
    contentType,
    expires: Date.now() + 60 * 60 * 1000,
  });

  return {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=3600",
    },
    body,
  };
}

export async function dispatchApi(url: URL, env: Env): Promise<ApiResult> {
  try {
    switch (url.pathname) {
      case "/api/weather":
        return await handleWeather(url, env);
      case "/api/geocode":
        return await handleGeocode(url);
      case "/api/map-tile":
        return await handleTile(url, env);
      default:
        return failure(404, 404, "Not found");
    }
  } catch (error) {
    console.error("Weather API proxy failed", error);
    return failure(500, 500, "Weather service request failed");
  }
}
