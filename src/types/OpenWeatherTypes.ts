// Tomorrow.io API TypeScript Types

// Comprehensive type for API responses
export interface TomorrowIOResponse {
  data: {
    timelines: {
      hourly: TimelineData[];
      daily: TimelineData[];
      current: TimelineData;
    };
    location: {
      lat: number;
      lon: number;
      name: string;
      type: string;
    };
  };
}

export type CurrentCityType = {
  city: string;
  state?: string;
  country?: string;
  countryName?: string;
  latitude?: string;
  longitude?: string;
};

// Timeline data structure (used for hourly, daily, and current)
export interface TimelineData {
  time: string; // ISO 8601 format date-time
  intervals?: IntervalData[];
  values: WeatherValues;
}

// Detailed weather values
export interface WeatherValues {
  // Temperature
  temperature: number;
  temperatureApparent: number;
  temperatureMin?: number;
  temperatureMax?: number;

  // Precipitation
  precipitationProbability?: number;
  precipitationType?: "rain" | "snow" | "freezing_rain" | "none";
  precipitationIntensity?: number;

  // Wind
  windSpeed: number;
  windDirection: number;
  windGust?: number;

  // Other atmospheric conditions
  humidity: number;
  pressureSurfaceLevel: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;

  // Weather condition codes
  weatherCode?: number;

  // Air Quality (if applicable)
  particulateMatter25?: number;
  particulateMatter10?: number;
  epaHealthCategory?: number;

  weatherCodeMin?: number;
  weatherCodeMax?: number;
}

// Interval data for more granular information
export interface IntervalData {
  startTime: string;
  values: WeatherValues;
}

// Specific Types for Different API Endpoints
export interface CurrentWeatherType {
  data: {
    time: string;
    values: WeatherValues;
  };

  location: { lat: number; lon: number; name: string; type: string };
}

export interface ForecastType {
  timelines: {
    hourly: Array<{
      time: string;
      text: string;

      values: WeatherValues;
    }>;
  };
}

export interface DailyForecastType {
  timelines: {
    daily: Array<{
      time: string;
      text: string;

      values: WeatherValues;
    }>;
  };
}

export type UnitSettings = {
  temperatureUnit: "°C" | "°F";
  windSpeedUnit: "km/h" | "m/s" | "knots";
  pressureUnit: "hPa" | "in" | "kPa" | "mm";
  precipitationUnit: "mm" | "in";
  distanceUnit: "km" | "mi";
  is12Hour: boolean;
};

// Weather Code Mapping (for reference)
export const WeatherCodeMapping = {
  0: "Unknown",
  1000: "Clear, Sunny",
  1100: "Mostly Clear",
  1101: "Partly Cloudy",
  1102: "Mostly Cloudy",
  1001: "Cloudy",
  2000: "Fog",
  2100: "Light Fog",
  3000: "Light Wind",
  3001: "Wind",
  3002: "Strong Wind",
  4000: "Drizzle",
  4001: "Rain",
  4200: "Light Rain",
  4201: "Heavy Rain",
  5000: "Snow",
  5001: "Flurries",
  5100: "Light Snow",
  5101: "Heavy Snow",
  6000: "Freezing Drizzle",
  6001: "Freezing Rain",
  6200: "Light Freezing Rain",
  6201: "Heavy Freezing Rain",
  7000: "Ice Pellets",
  7101: "Heavy Ice Pellets",
  7102: "Light Ice Pellets",
  8000: "Thunderstorm",
};

// Error Response Type
export interface ErrorResponse {
  status: number;
  message: string;
  details?: string;
}
