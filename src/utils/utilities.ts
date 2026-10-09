import type { CurrentCityType } from "@/types/weather";
import { WeatherIconName } from "./weatherIcons";

const WEATHER_LABELS: Record<number, string> = {
  0: "Unknown",
  1000: "Clear",
  1100: "Mostly clear",
  1101: "Partly cloudy",
  1102: "Mostly cloudy",
  1001: "Cloudy",
  2000: "Fog",
  2100: "Light fog",
  3000: "Light wind",
  3001: "Wind",
  3002: "Strong wind",
  4000: "Drizzle",
  4001: "Rain",
  4200: "Light rain",
  4201: "Heavy rain",
  5000: "Snow",
  5001: "Flurries",
  5100: "Light snow",
  5101: "Heavy snow",
  6000: "Freezing drizzle",
  6001: "Freezing rain",
  6200: "Light freezing rain",
  6201: "Heavy freezing rain",
  7000: "Ice pellets",
  7101: "Heavy ice pellets",
  7102: "Light ice pellets",
  8000: "Thunderstorm",
};

export function weatherCodeLabel(code: number | undefined) {
  if (code == null) return "";
  return WEATHER_LABELS[code] ?? "";
}

export function parseCoord(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function coordToString(value: unknown) {
  const parsed = parseCoord(value);
  return parsed == null ? "" : String(parsed);
}

export function hasCoords(
  city:
    | {
        latitude?: string | number | null;
        longitude?: string | number | null;
      }
    | null
    | undefined
) {
  if (!city) return false;
  return parseCoord(city.latitude) != null && parseCoord(city.longitude) != null;
}

export function sameCity(
  a: Pick<CurrentCityType, "city" | "state" | "country">,
  b: Pick<CurrentCityType, "city" | "state" | "country">
) {
  return (
    a.city === b.city &&
    (a.state ?? "") === (b.state ?? "") &&
    (a.country ?? "") === (b.country ?? "")
  );
}

export function formatClockTime(value: string | Date, is12Hour: boolean) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    hour12: is12Hour,
  }).format(date);
}

export function formatWeekday(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en", { weekday: "long" }).format(date);
}

export function convertTemperature(celsius: number) {
  return {
    "°C": Math.round(celsius),
    "°F": Math.round((celsius * 9) / 5 + 32),
  };
}

export function convertWindSpeed(metersPerSecond: number) {
  return {
    "km/h": Math.round(metersPerSecond * 3.6),
    "m/s": Math.round(metersPerSecond),
    knots: Math.round(metersPerSecond * 1.94384),
  };
}

export function convertPressure(hPa: number) {
  return {
    hPa: Math.round(hPa),
    kPa: Number((hPa / 10).toFixed(1)),
    in: Number((hPa * 0.02953).toFixed(2)),
    mm: Math.round(hPa * 0.75006),
  };
}

export function convertPrecipitation(mm: number) {
  return {
    mm: Number(mm.toFixed(1)),
    in: Number((mm / 25.4).toFixed(2)),
  };
}

export function convertDistance(km: number) {
  return {
    km: Number(km.toFixed(1)),
    mi: Number((km * 0.621371).toFixed(1)),
  };
}

export function weatherCodeToIconName(
  code: number,
  isDay = false
): WeatherIconName {
  switch (code) {
    case 1000:
    case 1100:
      return isDay ? "clear-day" : "clear-night";
    case 1101:
      return isDay ? "partly-cloudy-day" : "partly-cloudy-night";
    case 1102:
    case 1001:
      return isDay ? "cloudy-day" : "cloudy-night";
    case 2000:
    case 2100:
      return isDay ? "fog-day" : "fog-night";
    case 3000:
      return isDay ? "wind-beaufort-2-day" : "wind-beaufort-2-night";
    case 3001:
      return isDay ? "wind-beaufort-5-day" : "wind-beaufort-5-night";
    case 3002:
      return isDay ? "wind-beaufort-8-day" : "wind-beaufort-8-night";
    case 4000:
      return isDay ? "drizzle-day" : "drizzle-night";
    case 4001:
    case 4200:
    case 4201:
      return isDay ? "rain-day" : "rain-night";
    case 5000:
    case 5001:
    case 5100:
    case 5101:
      return isDay ? "snow-day" : "snow-night";
    case 6000:
    case 6001:
    case 6200:
    case 6201:
      return isDay ? "sleet-day" : "sleet-night";
    case 7000:
    case 7101:
    case 7102:
      return isDay ? "hail-day" : "hail-night";
    case 8000:
      return isDay ? "thunderstorm-day" : "thunderstorm-night";
    default:
      return "not-available";
  }
}
