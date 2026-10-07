import LazyWeatherIcon from "@/components/ui/LazyWeatherIcon/LazyWeatherIcon";
import { useWeatherStore } from "@/store/zustand";
import type { CurrentCityType } from "@/types/weather";
import { convertTemperature, sameCity, weatherCodeToIconName } from "@/utils/utilities";
import { Button } from "@heroui/react";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

const WeatherNow = () => {
  const currentCity = useWeatherStore((state) => state.currentCity);
  const savedCities = useWeatherStore((state) => state.savedCities);
  const addSavedCity = useWeatherStore((state) => state.addSavedCity);
  const removeSavedCity = useWeatherStore((state) => state.removeSavedCity);
  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const temperatureUnit = useWeatherStore((state) => state.unitSettings.temperatureUnit);
  const currentTime = new Date();
  const isDaytime = currentTime.getHours() >= 6 && currentTime.getHours() < 18;

  const iconName = weatherCodeToIconName(
    currentWeather?.data.values.weatherCode || 0,
    isDaytime
  );

  const isSaved = currentCity
    ? savedCities.some((saved) => sameCity(saved, currentCity))
    : false;

  const temperature = convertTemperature(currentWeather?.data.values.temperature || 0)[
    temperatureUnit
  ];

  const saveCity = () => {
    if (!currentCity?.city) return;
    const city: CurrentCityType = {
      city: currentCity.city,
      state: currentCity.state,
      country: currentCity.country,
      countryName: currentCity.countryName,
      latitude: currentCity.latitude,
      longitude: currentCity.longitude,
    };
    if (isSaved) removeSavedCity(city);
    else addSavedCity(city);
  };

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
                {currentWeather?.data.values.precipitationProbability ?? "–"}%
              </span>
            </p>
          </div>

          <Button
            className="mt-2"
            isIconOnly
            variant="flat"
            onPress={saveCity}
            aria-label={isSaved ? "Remove from saved cities" : "Save city"}
            isDisabled={!currentCity?.city}
          >
            {isSaved ? <FaStar aria-hidden="true" /> : <FaRegStar aria-hidden="true" />}
          </Button>
        </div>

        <p
          className="text-6xl font-bold text-primary-foreground"
          aria-label={`Current temperature: ${temperature}${temperatureUnit}`}
        >
          {temperature}
          {temperatureUnit}
        </p>
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
