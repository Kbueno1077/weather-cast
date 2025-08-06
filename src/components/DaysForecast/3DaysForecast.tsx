import { format } from "@formkit/tempo";
import BoxWrapper from "@/components/ui/BoxWrapper/BoxWrapper";
import Divider from "@/components/ui/Divider/Divider";
import LazyWeatherIcon from "@/components/ui/LazyWeatherIcon/LazyWeatherIcon";
import React from "react";
import { getCurrentUnitSettings, useWeatherStore } from "@/store/zustand";
import { convertTemperature, weatherCodeToIconName } from "@/utils/utilities";

const Weather3DaysForecast = () => {
  const { dailyWeather } = useWeatherStore((state) => state);
  const temperatureUnit = getCurrentUnitSettings("temperatureUnit");

  return (
    <BoxWrapper className="w-full sm:min-w-[320px] px-8 bg-transparent">
      <h2 className="text-sm mb-2">3-DAY FORECAST</h2>
      <div className="flex flex-col gap-3">
        {dailyWeather?.timelines.daily.map((forecast, index: number) => {
          if (index > 2) return;

          const date = new Date(forecast.time);
          const isDaytime = date.getHours() >= 6 && date.getHours() < 18;

          return (
            <React.Fragment key={forecast.time}>
              <div className="flex py-2 items-center justify-between">
                <p className="text-sm">
                  {index === 0
                    ? "Today"
                    : format(date, "dddd, MMMM D, YYYY", "en").split(",")[0]}
                </p>

                <div className="flex gap-1 items-center">
                  {forecast?.values.weatherCodeMin ===
                  forecast?.values.weatherCodeMax ? (
                    <LazyWeatherIcon
                      name={weatherCodeToIconName(
                        forecast?.values.weatherCodeMin || 0,
                        isDaytime
                      )}
                      className="w-12 h-12 my-2"
                      alt="Weather condition"
                    />
                  ) : (
                    <>
                      <LazyWeatherIcon
                        name={weatherCodeToIconName(
                          forecast?.values.weatherCodeMin || 0,
                          isDaytime
                        )}
                        className="w-12 h-12 my-2"
                        alt="Weather condition"
                      />
                      /
                      <LazyWeatherIcon
                        name={weatherCodeToIconName(
                          forecast?.values.weatherCodeMax || 0,
                          isDaytime
                        )}
                        className="w-12 h-12 my-2"
                        alt="Weather condition"
                      />
                    </>
                  )}

                  <p className="text-sm text-primary-foreground">
                    {forecast.text}
                  </p>
                </div>
                <div className="flex gap-1">
                  <p className="text-sm font-bold text-primary-foreground">
                    {
                      convertTemperature(forecast.values.temperatureMin || 0)[
                        temperatureUnit as keyof typeof convertTemperature
                      ]
                    }
                  </p>
                  <p className="text-sm font-bold">
                    /
                    {
                      convertTemperature(forecast.values.temperatureMax || 0)[
                        temperatureUnit as keyof typeof convertTemperature
                      ]
                    }
                  </p>
                </div>
              </div>

              {index < 2 ? <Divider /> : null}
            </React.Fragment>
          );
        })}
      </div>
    </BoxWrapper>
  );
};
export default Weather3DaysForecast;
