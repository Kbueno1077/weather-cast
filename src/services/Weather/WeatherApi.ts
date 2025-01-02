import { weatherCacheService } from "./WeatherCache";

export async function fetchWeatherData(
  city: string,
  state: string,
  countryCode: string,
  latitude: string,
  longitude: string
) {
  const cacheKey = weatherCacheService.generateCacheKey(latitude, longitude);

  // Check cache first
  const cachedData = weatherCacheService.get(cacheKey);
  if (cachedData) {
    // If we have cached data but it's stale, trigger a background refresh
    if (cachedData.isStale) {
      setTimeout(() => {
        fetchFreshData().catch(console.error);
      }, 100);
    }
    return cachedData;
  }

  return fetchFreshData();

  async function fetchFreshData() {
    console.log("Fetching fresh weather data");
    try {
      const apiKey = import.meta.env.VITE_WHEATHER_API_KEY;
      const baseUrl = "https://api.tomorrow.io/v4/weather";

      const responses = await Promise.all([
        fetch(
          `${baseUrl}/realtime?location=${latitude},${longitude}&apikey=${apiKey}`
        ),
        fetch(
          `${baseUrl}/forecast?location=${latitude},${longitude}&timesteps=1h&apikey=${apiKey}`
        ),
        fetch(
          `${baseUrl}/forecast?location=${latitude},${longitude}&timesteps=1d&apikey=${apiKey}`
        ),
      ]);

      // Check for rate limiting on any response
      for (const response of responses) {
        if (!response.ok) {
          const data = await response.json();
          if (data.code === 429001) {
            return {
              error: true,
              code: 429001,
              message: "Rate limit reached. Please try again later.",
            };
          }
          throw new Error(`API Error: ${response.status}`);
        }
      }

      const [currentWeatherData, hourlyForecastData, dailyForecastData] =
        await Promise.all(responses.map((r) => r.json()));

      // Process hourly forecast to show every 6 hours for next 24 hours
      const next24hours = hourlyForecastData.timelines.hourly
        .filter((_: unknown, index: number) => index % 6 === 0)
        .slice(0, 6);

      const responseData = {
        currentWeather: currentWeatherData,
        hourlyWeather: {
          ...hourlyForecastData,
          timelines: { hourly: next24hours },
        },
        dailyWeather: dailyForecastData,
      };

      // Cache the successful response
      weatherCacheService.set(cacheKey, responseData);
      return responseData;
    } catch (error) {
      // If fetch fails and we have stale data, return it
      const staleData = weatherCacheService.get(cacheKey);
      if (staleData) {
        console.log("Fetch failed, returning stale data");
        return staleData;
      }
      console.error("Weather API Error:", error);
      const weatherError = {
        code: 500,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        type: "API_ERROR" as const,
      };
      return { error: weatherError };
    }
  }
}
