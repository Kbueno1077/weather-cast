export type CurrentCityType = {
  city: string;
  state?: string;
  country?: string;
  countryName?: string;
  latitude?: string;
  longitude?: string;
};

export type CityResult = {
  id: string;
  name: string;
  state: string;
  countryName: string;
  countryCode: string;
  latitude: string;
  longitude: string;
};

export interface WeatherValues {
  temperature: number;
  temperatureApparent: number;
  temperatureMin?: number;
  temperatureMax?: number;
  precipitationProbability?: number;
  precipitationType?: number | string;
  precipitationIntensity?: number;
  windSpeed: number;
  windDirection: number;
  windGust?: number;
  humidity: number;
  pressureSurfaceLevel: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  weatherCode?: number;
  particulateMatter25?: number;
  particulateMatter10?: number;
  epaHealthCategory?: number;
  weatherCodeMin?: number;
  weatherCodeMax?: number;
}

export interface CurrentWeatherType {
  data: {
    time: string;
    values: WeatherValues;
  };
  location: { lat: number; lon: number; name: string; type: string };
}

export interface ForecastPoint {
  time: string;
  text: string;
  values: WeatherValues;
}

export interface ForecastType {
  timelines: {
    hourly: ForecastPoint[];
  };
}

export interface DailyForecastType {
  timelines: {
    daily: ForecastPoint[];
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

export type WeatherSuccess = {
  currentWeather: CurrentWeatherType;
  hourlyWeather: ForecastType;
  dailyWeather: DailyForecastType;
};

export type WeatherFailure = {
  error: true;
  code: number;
  message: string;
};

export type WeatherResponse = WeatherSuccess | WeatherFailure;

export function isWeatherFailure(
  value: WeatherResponse
): value is WeatherFailure {
  return "error" in value && value.error === true;
}
