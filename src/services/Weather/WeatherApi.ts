import type { WeatherResponse } from "@/types/weather";
import { isWeatherFailure } from "@/types/weather";
import { weatherCacheService } from "./WeatherCache";

export async function fetchWeatherData(
  latitude: string,
  longitude: string
): Promise<WeatherResponse> {
  const cacheKey = weatherCacheService.generateCacheKey(latitude, longitude);
  const cachedData = weatherCacheService.get(cacheKey);
  if (cachedData) return cachedData;

  const params = new URLSearchParams({ latitude, longitude });
  const response = await fetch(`/api/weather?${params.toString()}`);
  const data = (await response.json()) as WeatherResponse;

  if (!response.ok || isWeatherFailure(data)) {
    if (isWeatherFailure(data)) return data;
    return {
      error: true,
      code: response.status,
      message: "Weather service request failed",
    };
  }

  weatherCacheService.set(cacheKey, data);
  return data;
}
