import { getCurrentUnitSettings, useWeatherStore } from "@/store/zustand";
import { convertTemperature, weatherCodeToIconName } from "@/utils/utilities";
import LazyWeatherIcon from "@/components/ui/LazyWeatherIcon/LazyWeatherIcon";
import { Button } from "@nextui-org/react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { CurrentCityType } from "@/types/OpenWeatherTypes";

const WeatherNow = () => {
  const {
    currentCity,
    savedCities,
    addSavedCity,
    removeSavedCity,
    currentWeather,
  } = useWeatherStore((state) => state);
  const currentTime = new Date();
  const isDaytime = currentTime.getHours() >= 6 && currentTime.getHours() < 18;

  const iconName = weatherCodeToIconName(
    currentWeather?.data.values.weatherCode || 0,
    isDaytime
  );

  const isSaved = savedCities.find(
    (s) =>
      s.city === currentCity?.city &&
      s.state === currentCity?.state &&
      s.country === currentCity?.country
  );

  const temperatureUnit = getCurrentUnitSettings("temperatureUnit");

  return (
    <div
      className="w-full flex justify-between items-center p-8"
      role="region"
      aria-label="Current weather information"
    >
      <div>
        <div className="flex gap-5 mb-6">
          <div>
            <h2 className="text-4xl mb-1 text-primary-foreground">
              {currentCity?.city}
            </h2>
            <p className="text-sm">
              Chance of rain:{" "}
              <span aria-label="Precipitation probability">
                {currentWeather?.data.values.precipitationProbability}%
              </span>
            </p>
          </div>

          <Button
            className="mt-2"
            isIconOnly
            variant="flat"
            onPress={
              isSaved
                ? () => removeSavedCity(currentCity?.city || "")
                : () => addSavedCity(currentCity as CurrentCityType)
            }
            aria-label={isSaved ? "Remove from saved cities" : "Save city"}
          >
            {isSaved ? (
              <FaStar aria-hidden="true" />
            ) : (
              <FaRegStar aria-hidden="true" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-center">
            <p
              className="text-6xl font-bold text-primary-foreground"
              aria-label={`Current temperature: ${
                currentWeather?.data.values.temperature
              }${getCurrentUnitSettings("temperatureUnit")}`}
            >
              {
                convertTemperature(
                  currentWeather?.data.values.temperature || 0
                )[temperatureUnit as keyof typeof convertTemperature]
              }
              {temperatureUnit}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <LazyWeatherIcon
          name={iconName}
          className="w-48 h-48"
          alt={`Current weather condition: ${iconName}`}
        />
      </div>
    </div>
  );
};

export default WeatherNow;
