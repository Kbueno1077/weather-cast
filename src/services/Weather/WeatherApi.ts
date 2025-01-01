import { weatherCacheService } from "./WeatherCache";

interface WeatherError {
  code: number;
  message: string;
  type: "API_ERROR" | "RATE_LIMIT" | "NETWORK_ERROR";
}

export async function fetchWeatherData(
  city: string,
  state: string,
  countryCode: string,
  latitude: string,
  longitude: string
) {
  const cacheKey = weatherCacheService.generateCacheKey(
    city,
    state,
    countryCode,
    latitude,
    longitude
  );

  // Check cache first
  const cachedData = weatherCacheService.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    const [
      currentWeatherResponse,
      hourlyForecastWeatherResponse,
      dailyForecastWeatherResponse,
    ] = await Promise.all([
      fetch(
        `https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&apikey=${
          import.meta.env.VITE_WHEATHER_API_KEY
        }`
      ),
      fetch(
        `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&timesteps=1h&apikey=${
          import.meta.env.VITE_WHEATHER_API_KEY
        }`
      ),
      fetch(
        `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&timesteps=1d&apikey=${
          import.meta.env.VITE_WHEATHER_API_KEY
        }`
      ),
    ]);

    const currentWeatherData = await currentWeatherResponse.json();
    const hourlyForecastData = await hourlyForecastWeatherResponse.json();
    const dailyForecastData = await dailyForecastWeatherResponse.json();

    if (
      currentWeatherData.code === 429001 ||
      dailyForecastData.code === 429001 ||
      hourlyForecastData.code === 429001
    ) {
      return {
        error: true,
        code: 429001,
        message:
          "The request limit for this resource has been reached for the current rate limit window. Wait and retry the operation, or examine your API request volume.",
      };
    }

    if (
      !currentWeatherData &&
      !dailyForecastData &&
      !hourlyForecastData?.timelines
    ) {
      throw new Error("Could not load weather for this location");
    }

    const next24hours = hourlyForecastData.timelines.hourly
      .map((hour: unknown, hourIndex: number) => {
        if (hourIndex % 6 === 0) {
          return hour;
        } else {
          return null;
        }
      })
      .filter((hour: unknown) => hour)
      .slice(0, 6);

    hourlyForecastData.timelines.hourly = next24hours;

    // Prepare the response data
    const responseData = {
      currentWeather: currentWeatherData,
      hourlyWeather: hourlyForecastData,
      dailyWeather: dailyForecastData,
    };

    // Cache the new data
    weatherCacheService.set(cacheKey, { ...responseData });

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      const weatherError: WeatherError = {
        code: 500,
        message: error.message || "Unknown error occurred",
        type: "API_ERROR",
      };

      console.error("Weather API Error:", weatherError);
      return { error: weatherError };
    } else {
      console.error("Weather API Error:", error);
      return {
        error: {
          code: 500,
          message: "Unknown error occurred",
          type: "API_ERROR",
        },
      };
    }
  }
}
