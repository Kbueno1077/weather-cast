import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import LazyWeatherIcon from "@/components/ui/LazyWeatherIcon/LazyWeatherIcon";
import { useWeatherStore } from "@/store/zustand";
import { cn } from "@/utils/cn";
import {
  convertTemperature,
  formatWeekday,
  weatherCodeLabel,
  weatherCodeToIconName,
} from "@/utils/utilities";

interface DailyForecastListProps {
  title: string;
  limit?: number;
  className?: string;
}

const percent = (value: number, min: number, span: number) =>
  span === 0 ? 0 : ((value - min) / span) * 100;

export default function DailyForecastList({ title, limit, className }: DailyForecastListProps) {
  const dailyWeather = useWeatherStore((state) => state.dailyWeather);
  const currentTemperature = useWeatherStore(
    (state) => state.currentWeather?.data.values.temperature
  );
  const temperatureUnit = useWeatherStore((state) => state.unitSettings.temperatureUnit);
  const days = (dailyWeather?.timelines.daily ?? []).slice(0, limit);

  const lows = days.map((day) => day.values.temperatureMin ?? 0);
  const highs = days.map((day) => day.values.temperatureMax ?? 0);
  const periodMin = Math.min(...lows);
  const periodMax = Math.max(...highs);
  const span = periodMax - periodMin;

  return (
    <BoxWrapper className={cn("w-full sm:min-w-[320px]", className)}>
      <h2 className="eyebrow mb-2">{title}</h2>
      <ol className="divide-y divide-line">
        {days.map((forecast, index) => {
          const date = new Date(forecast.time);
          const isDaytime = date.getHours() >= 6 && date.getHours() < 18;
          const code = forecast.values.weatherCodeMax ?? forecast.values.weatherCodeMin ?? 0;
          const label = forecast.text || weatherCodeLabel(code);
          const low = lows[index];
          const high = highs[index];
          const isToday = index === 0;
          const showNow = isToday && currentTemperature != null;

          return (
            <li
              key={forecast.time}
              className="grid grid-cols-[minmax(0,1fr)_2.5rem_8.5rem] items-center gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_2.5rem_10rem]"
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "truncate text-sm font-medium",
                    isToday ? "text-primary-foreground" : "text-primary-foreground/85"
                  )}
                >
                  {isToday ? "Today" : formatWeekday(date)}
                </p>
                {label && <p className="truncate text-xs">{label}</p>}
              </div>

              <LazyWeatherIcon
                name={weatherCodeToIconName(code, isDaytime)}
                className="size-10"
                alt={label || "Weather condition"}
              />

              <div
                className="flex items-center gap-2 text-sm tabular-nums"
                aria-label={`Low ${convertTemperature(low)[temperatureUnit]}°, high ${convertTemperature(high)[temperatureUnit]}°`}
              >
                <span className="w-7 text-right">{convertTemperature(low)[temperatureUnit]}°</span>
                <div className="relative h-1.5 flex-1 rounded-full bg-white/[0.07]">
                  <div
                    className="absolute inset-y-0 rounded-full bg-linear-to-r from-accent to-warm"
                    style={{
                      left: `${percent(low, periodMin, span)}%`,
                      right: `${100 - percent(high, periodMin, span)}%`,
                    }}
                  />
                  {showNow && (
                    <div
                      className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-primary"
                      style={{
                        left: `${Math.min(100, Math.max(0, percent(currentTemperature, periodMin, span)))}%`,
                      }}
                    />
                  )}
                </div>
                <span className="w-7 font-semibold text-primary-foreground">
                  {convertTemperature(high)[temperatureUnit]}°
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </BoxWrapper>
  );
}
