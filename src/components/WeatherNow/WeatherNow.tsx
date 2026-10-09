import LazyWeatherIcon from "@/components/ui/LazyWeatherIcon/LazyWeatherIcon";
import { useWeatherStore } from "@/store/zustand";
import type { CurrentCityType } from "@/types/weather";
import { cn } from "@/utils/cn";
import {
  convertTemperature,
  sameCity,
  weatherCodeLabel,
  weatherCodeToIconName,
} from "@/utils/utilities";
import { Button } from "@heroui/react";
import { LuMapPin, LuStar, LuUmbrella } from "react-icons/lu";

const WeatherNow = () => {
  const currentCity = useWeatherStore((state) => state.currentCity);
  const savedCities = useWeatherStore((state) => state.savedCities);
  const addSavedCity = useWeatherStore((state) => state.addSavedCity);
  const removeSavedCity = useWeatherStore((state) => state.removeSavedCity);
  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const today = useWeatherStore((state) => state.dailyWeather?.timelines.daily[0]);
  const temperatureUnit = useWeatherStore((state) => state.unitSettings.temperatureUnit);
  const currentTime = new Date();
  const isDaytime = currentTime.getHours() >= 6 && currentTime.getHours() < 18;
  const values = currentWeather?.data.values;

  const iconName = weatherCodeToIconName(values?.weatherCode || 0, isDaytime);
  const condition = weatherCodeLabel(values?.weatherCode);
  const place = currentCity?.countryName || currentCity?.state || currentCity?.country;

  const isSaved = currentCity
    ? savedCities.some((saved) => sameCity(saved, currentCity))
    : false;

  const temperature = convertTemperature(values?.temperature || 0)[temperatureUnit];
  const high = today?.values.temperatureMax;
  const low = today?.values.temperatureMin;

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
      className="flex w-full items-center justify-between gap-4 px-2 py-6 sm:px-8 sm:py-8"
      role="region"
      aria-label="Current weather information"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="min-w-0">
            {place && (
              <p className="eyebrow flex items-center gap-1.5">
                <LuMapPin aria-hidden="true" size={12} />
                {place}
              </p>
            )}
            <h2 className="mt-1.5 font-display text-4xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-5xl">
              {currentCity?.city}
            </h2>
          </div>

          <Button
            className={cn(
              "mt-6 shrink-0 bg-white/5 data-[hover=true]:bg-white/10",
              isSaved ? "text-warm" : "text-foreground"
            )}
            isIconOnly
            radius="full"
            size="sm"
            variant="flat"
            onPress={saveCity}
            aria-label={isSaved ? "Remove from saved cities" : "Save city"}
            aria-pressed={isSaved}
            isDisabled={!currentCity?.city}
          >
            <LuStar aria-hidden="true" size={16} className={isSaved ? "fill-current" : undefined} />
          </Button>
        </div>

        <p
          className="mt-5 font-display text-7xl leading-none font-medium tracking-tighter text-primary-foreground tabular-nums sm:text-8xl"
          aria-label={`Current temperature: ${temperature}${temperatureUnit}`}
        >
          {temperature}
          <span className="ml-1 align-top text-3xl font-normal text-foreground sm:text-4xl">
            {temperatureUnit}
          </span>
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
          {condition && <span className="font-medium text-primary-foreground">{condition}</span>}
          <span className="flex items-center gap-1.5">
            <LuUmbrella aria-hidden="true" size={14} />
            <span aria-label="Precipitation probability">
              {values?.precipitationProbability ?? "–"}%
            </span>
            chance of rain
          </span>
          {high != null && low != null && (
            <span className="tabular-nums">
              H {convertTemperature(high)[temperatureUnit]}° · L{" "}
              {convertTemperature(low)[temperatureUnit]}°
            </span>
          )}
        </div>
      </div>

      <div className="relative isolate shrink-0">
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-[15%] -z-10 rounded-full blur-3xl",
            isDaytime ? "bg-warm/25" : "bg-accent/25"
          )}
        />
        <LazyWeatherIcon
          name={iconName}
          className="size-24 sm:size-44 lg:size-48"
          alt={`Current weather condition: ${iconName}`}
        />
      </div>
    </div>
  );
};

export default WeatherNow;
