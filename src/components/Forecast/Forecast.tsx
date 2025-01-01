import { format } from "@formkit/tempo";
import { Divider } from "@nextui-org/react";
import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import LazyWeatherIcon from "@/components/ui/LazyWeatherIcon/LazyWeatherIcon";
import React from "react";
import { getCurrentUnitSettings, useWeatherStore } from "@/store/zustand";
import { convertTemperature, weatherCodeToIconName } from "@/utils/utilities";

interface ForecastProps {
  transparent?: boolean;
}

const WeatherForecast: React.FC<ForecastProps> = ({ transparent = false }) => {
  const { hourlyWeather, unitSettings } = useWeatherStore((state) => state);

  const is12Hour = unitSettings.is12Hour;
  const temperatureUnit = getCurrentUnitSettings("temperatureUnit");

  return (
    <BoxWrapper
      className={`w-full px-6 sm:px-12 py-8 ${
        transparent ? "bg-transparent" : ""
      }`}
    >
      <h2 className="text-sm mb-4 sm:-ml-6">
        {!transparent ? "24H FORECAST" : "12H FORECAST"}
      </h2>

      <div className="flex overflow-x-auto scrollbar-hide gap-4">
        {hourlyWeather?.timelines?.hourly.map((forecast, index: number) => {
          if (transparent && index > 2) return null;

          const currentTime = new Date(forecast.time);
          const isDaytime =
            currentTime.getHours() >= 6 && currentTime.getHours() < 18;

          return (
            <React.Fragment key={forecast.time}>
              <div className="flex flex-col gap-2 text-center ">
                <h3 className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {format(forecast.time, is12Hour ? "h:mm A" : "HH:mm", "en")}
                </h3>
                <div className="flex items-center justify-center">
                  <LazyWeatherIcon
                    name={weatherCodeToIconName(
                      forecast?.values.weatherCode || 0,
                      isDaytime
                    )}
                    className="w-[80px] h-[80px]"
                    alt="Weather condition"
                  />
                </div>

                <p className="text-xl text-primary-foreground whitespace-nowrap overflow-hidden text-ellipsis">{`${
                  convertTemperature(forecast.values.temperature || 0)[
                    temperatureUnit as keyof typeof convertTemperature
                  ]
                }°`}</p>
              </div>

              {index < hourlyWeather?.timelines?.hourly.length - 1 ? (
                <Divider
                  orientation="vertical"
                  className="bg-gray-600 w-[1px] mx-auto"
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </BoxWrapper>
  );
};

export default WeatherForecast;
