import { WeatherIconName } from "./weatherIcons";

export function convertTemperature(celsius: number) {
  return {
    kelvin: Number((celsius + 273.15).toFixed(2)),
    celsius: celsius,
    fahrenheit: Number(((celsius * 9) / 5 + 32).toFixed(2)),
    K: Number((celsius + 273.15).toFixed(2)),
    "°C": celsius,
    "°F": Number(((celsius * 9) / 5 + 32).toFixed(2)),
  };
}

export function convertWindSpeed(kmh: number) {
  return {
    "km/h": kmh,
    "m/s": Number((kmh / 3.6).toFixed(2)),
    knots: Number((kmh / 1.852).toFixed(2)),
  };
}

export function weatherCodeToIconName(
  code: number,
  isDay = false
): WeatherIconName {
  switch (code) {
    case 1000:
      return isDay ? "clear-day" : "clear-night";
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
