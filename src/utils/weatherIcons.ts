// Pre-load all SVG paths into a mapping object
export const weatherIconPaths = {
  "clear-day": () => import("../public/weather/clear-day.svg"),
  "clear-night": () => import("../public/weather/clear-night.svg"),
  "partly-cloudy-day": () => import("../public/weather/partly-cloudy-day.svg"),
  "partly-cloudy-night": () =>
    import("../public/weather/partly-cloudy-night.svg"),
  "cloudy-day": () => import("../public/weather/cloudy.svg"),
  "cloudy-night": () => import("../public/weather/cloudy.svg"),

  "fog-day": () => import("../public/weather/fog-day.svg"),
  "fog-night": () => import("../public/weather/fog-night.svg"),

  "wind-beaufort-2-day": () => import("../public/weather/wind-beaufort-2.svg"),
  "wind-beaufort-2-night": () =>
    import("../public/weather/wind-beaufort-2.svg"),
  "wind-beaufort-5-day": () => import("../public/weather/wind-beaufort-5.svg"),
  "wind-beaufort-5-night": () =>
    import("../public/weather/wind-beaufort-5.svg"),
  "wind-beaufort-8-day": () => import("../public/weather/wind-beaufort-8.svg"),
  "wind-beaufort-8-night": () =>
    import("../public/weather/wind-beaufort-8.svg"),

  "drizzle-day": () => import("../public/weather/drizzle.svg"),
  "drizzle-night": () => import("../public/weather/drizzle.svg"),

  "rain-day": () => import("../public/weather/rain.svg"),
  "rain-night": () => import("../public/weather/rain.svg"),

  "snow-day": () => import("../public/weather/snow.svg"),
  "snow-night": () => import("../public/weather/snow.svg"),

  "sleet-day": () => import("../public/weather/sleet.svg"),
  "sleet-night": () => import("../public/weather/sleet.svg"),

  "hail-day": () => import("../public/weather/hail.svg"),
  "hail-night": () => import("../public/weather/hail.svg"),

  "thunderstorm-day": () => import("../public/weather/thunderstorms-day.svg"),
  "thunderstorm-night": () =>
    import("../public/weather/thunderstorms-night.svg"),
  "not-available": () => import("../public/weather/not-available.svg"),
} as const;

export type WeatherIconName = keyof typeof weatherIconPaths;
