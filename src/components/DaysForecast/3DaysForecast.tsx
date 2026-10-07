import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import Divider from "@/components/ui/Divider/Divider";
import LazyWeatherIcon from "@/components/ui/LazyWeatherIcon/LazyWeatherIcon";
import { useWeatherStore } from "@/store/zustand";
import {
  convertTemperature,
  formatWeekday,
  weatherCodeLabel,
  weatherCodeToIconName,
} from "@/utils/utilities";
import { Fragment } from "react";

const Weather3DaysForecast = () => {
  const dailyWeather = useWeatherStore((state) => state.dailyWeather);
  const temperatureUnit = useWeatherStore((state) => state.unitSettings.temperatureUnit);
  const days = (dailyWeather?.timelines.daily ?? []).slice(0, 3);

  return (
    <BoxWrapper className="w-full sm:min-w-[320px] px-8 bg-transparent">
      <h2 className="text-sm mb-2">3-DAY FORECAST</h2>
      <div className="flex flex-col gap-3">
        {days.map((forecast, index) => {
          const date = new Date(forecast.time);
          const isDaytime = date.getHours() >= 6 && date.getHours() < 18;
          const code = forecast.values.weatherCodeMax ?? forecast.values.weatherCodeMin ?? 0;
          const label = forecast.text || weatherCodeLabel(code);

          return (
            <Fragment key={forecast.time}>
              <div className="flex py-2 items-center justify-between gap-3">
                <p className="text-sm">
                  {index === 0 ? "Today" : formatWeekday(date)}
                </p>
                <div className="flex gap-1 items-center">
                  <LazyWeatherIcon
                    name={weatherCodeToIconName(code, isDaytime)}
                    className="w-12 h-12 my-2"
                    alt={label || "Weather condition"}
                  />
                  <p className="text-sm text-primary-foreground">{label}</p>
                </div>
                <div className="flex gap-1">
                  <p className="text-sm font-bold text-primary-foreground">
                    {convertTemperature(forecast.values.temperatureMin || 0)[temperatureUnit]}
                  </p>
                  <p className="text-sm font-bold">
                    / {convertTemperature(forecast.values.temperatureMax || 0)[temperatureUnit]}
                  </p>
                </div>
              </div>
              {index < days.length - 1 ? <Divider /> : null}
            </Fragment>
          );
        })}
      </div>
    </BoxWrapper>
  );
};

export default Weather3DaysForecast;
