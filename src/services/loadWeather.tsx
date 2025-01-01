// loadWeather.tsx
import { fetchWeatherData } from "@/services/Weather/WeatherApi";

export async function loadWeather(request: Request) {
  const url = new URL(request.url);

  const city = url.searchParams.get("city") || "";
  const state = url.searchParams.get("state") || "";
  const countryCode = url.searchParams.get("countryCode") || "";
  const latitude = url.searchParams.get("latitude") || "";
  const longitude = url.searchParams.get("longitude") || "";

  if (!latitude || !longitude) {
    throw new Error("Missing latitude or longitude");
  }

  try {
    return await fetchWeatherData(
      city,
      state,
      countryCode,
      latitude,
      longitude
    );
  } catch (error) {
    console.error("Error loading weather:", error);
    throw error;
  }
}
