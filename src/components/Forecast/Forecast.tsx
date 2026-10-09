import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import LazyWeatherIcon from "@/components/ui/LazyWeatherIcon/LazyWeatherIcon";
import { useWeatherStore } from "@/store/zustand";
import { cn } from "@/utils/cn";
import {
  convertTemperature,
  formatClockTime,
  weatherCodeToIconName,
} from "@/utils/utilities";
import { LuDroplet } from "react-icons/lu";

interface ForecastProps {
  compact?: boolean;
}

const WeatherForecast = ({ compact = false }: ForecastProps) => {
  const hourlyWeather = useWeatherStore((state) => state.hourlyWeather);
  const is12Hour = useWeatherStore((state) => state.unitSettings.is12Hour);
  const temperatureUnit = useWeatherStore((state) => state.unitSettings.temperatureUnit);
  const hours = hourlyWeather?.timelines.hourly ?? [];
  const visibleHours = compact ? hours.slice(0, 4) : hours;

  return (
    <BoxWrapper className={cn("w-full", compact && "bg-transparent")}>
      <h2 className="eyebrow mb-4">Hourly forecast</h2>

      <ol className="-mx-2 flex snap-x gap-1 overflow-x-auto scrollbar-hide">
        {visibleHours.map((forecast, index) => {
          const time = new Date(forecast.time);
          const isDaytime = time.getHours() >= 6 && time.getHours() < 18;
          const rain = forecast.values.precipitationProbability ?? 0;
          const isNow = index === 0;

          return (
            <li
              key={forecast.time}
              className={cn(
                "flex min-w-[72px] flex-1 snap-start flex-col items-center gap-2 rounded-2xl px-2 py-4",
                isNow && "bg-white/[0.05] ring-1 ring-white/5 ring-inset"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isNow && "text-primary-foreground"
                )}
              >
                {isNow ? "Now" : formatClockTime(forecast.time, is12Hour)}
              </span>
              <LazyWeatherIcon
                name={weatherCodeToIconName(forecast.values.weatherCode || 0, isDaytime)}
                className="size-14"
                alt="Weather condition"
              />
              <span className="font-display text-lg font-medium text-primary-foreground tabular-nums">
                {convertTemperature(forecast.values.temperature || 0)[temperatureUnit]}°
              </span>
              <span
                className={cn(
                  "flex h-4 items-center gap-0.5 text-[11px] tabular-nums text-accent",
                  rain < 20 && "invisible"
                )}
              >
                <LuDroplet aria-hidden="true" size={10} />
                {rain}%
              </span>
            </li>
          );
        })}
      </ol>
    </BoxWrapper>
  );
};

export default WeatherForecast;
