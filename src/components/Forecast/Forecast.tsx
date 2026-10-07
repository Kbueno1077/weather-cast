import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import LazyWeatherIcon from "@/components/ui/LazyWeatherIcon/LazyWeatherIcon";
import { useWeatherStore } from "@/store/zustand";
import {
  convertTemperature,
  formatClockTime,
  weatherCodeToIconName,
} from "@/utils/utilities";
import { Divider } from "@heroui/react";
import { Fragment } from "react";

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
    <BoxWrapper
      className={`w-full px-6 sm:px-12 py-8 ${compact ? "bg-transparent" : ""}`}
    >
      <h2 className="text-sm mb-4 sm:-ml-6">HOURLY FORECAST</h2>

      <div className="flex overflow-x-auto scrollbar-hide gap-4">
        {visibleHours.map((forecast, index) => {
          const currentTime = new Date(forecast.time);
          const isDaytime =
            currentTime.getHours() >= 6 && currentTime.getHours() < 18;

          return (
            <Fragment key={forecast.time}>
              <div className="flex flex-col gap-2 text-center">
                <h3 className="text-sm whitespace-nowrap">
                  {formatClockTime(forecast.time, is12Hour)}
                </h3>
                <div className="flex items-center justify-center">
                  <LazyWeatherIcon
                    name={weatherCodeToIconName(
                      forecast.values.weatherCode || 0,
                      isDaytime
                    )}
                    className="w-[80px] h-[80px]"
                    alt="Weather condition"
                  />
                </div>
                <p className="text-xl text-primary-foreground whitespace-nowrap">
                  {convertTemperature(forecast.values.temperature || 0)[temperatureUnit]}°
                </p>
              </div>

              {index < visibleHours.length - 1 ? (
                <Divider orientation="vertical" className="bg-gray-600 w-[1px] mx-auto" />
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </BoxWrapper>
  );
};

export default WeatherForecast;
