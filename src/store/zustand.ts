import { loadWeather } from "@/services/loadWeather";
import {
  ForecastType,
  CurrentWeatherType,
  UnitSettings,
  CurrentCityType,
  DailyForecastType,
} from "@/types/OpenWeatherTypes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InitStateType = {
  currentWeather: CurrentWeatherType | null;
  hourlyWeather: ForecastType | null;
  dailyWeather: DailyForecastType | null;
  currentCity: {
    city: string | null;
    state?: string | null;
    country?: string | null;
    countryName?: string | null;
    latitude?: string | null;
    longitude?: string | null;
  } | null;

  savedCities: {
    city: string;
    state?: string;
    country?: string;
    countryName?: string;
    latitude?: string;
    longitude?: string;
  }[];
  locationPermission: "denied" | "accepted" | "N/A";
};

export type DefaultStateType = InitStateType & {
  unitSettings: UnitSettings;
};

export type WeatherActions = {
  changeCurrentCity: (cityData: {
    city: string;
    countryCode?: string;
    state?: string;
    countryName?: string;
  }) => void;

  setStoreFromData: (data: object) => void;
  setCurrentWeather: (currentWeather: CurrentWeatherType) => void;
  setDailyWeather: (dailyWeather: DailyForecastType) => void;
  setHourlyWeather: (hourlyWeather: ForecastType) => void;

  changeSettingsUnit: (
    key: keyof DefaultStateType["unitSettings"],
    unit: string | boolean
  ) => void;

  addSavedCity: (cityData: CurrentCityType) => void;
  removeSavedCity: (city: string) => void;
  removeAll: () => void;
  setLocationPermission: (permission: "denied" | "accepted" | "N/A") => void;
};

export type WeatherStore = DefaultStateType & WeatherActions;

export const defaultState: InitStateType = {
  currentWeather: null,
  dailyWeather: null,
  hourlyWeather: null,
  currentCity: null,
  savedCities: [],
  locationPermission: "N/A",
};

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      // STATES
      ...defaultState,

      unitSettings: {
        temperatureUnit: "°C",
        windSpeedUnit: "km/h",
        pressureUnit: "hPa",
        precipitationUnit: "mm",
        distanceUnit: "km",
        is12Hour: true,
      },

      // SETS
      setStoreFromData: (data: object) =>
        set((state) => ({ ...state, ...data })),
      setCurrentWeather: (currentWeather: CurrentWeatherType) =>
        set({ currentWeather }),
      setDailyWeather: (dailyWeather: DailyForecastType) =>
        set({ dailyWeather }),
      setHourlyWeather: (hourlyWeather: ForecastType) => set({ hourlyWeather }),

      // ACTIONS
      changeCurrentCity: async (cityData: {
        city: string;
        countryCode?: string;
        state?: string;
        countryName?: string;
        latitude?: string;
        longitude?: string;
      }) => {
        const request = new Request(
          `${window.location.origin}?${new URLSearchParams({
            city: cityData.city,
            state: cityData.state || "",
            countryCode: cityData.countryCode || "",
            latitude: cityData.latitude || "",
            longitude: cityData.longitude || "",
          })}`
        );

        const data = await loadWeather(request);

        set({
          ...data,
          currentCity: {
            city: cityData.city,
            state: cityData.state,
            country: cityData.countryCode,
            countryName: cityData.countryName,
            latitude: cityData.latitude,
            longitude: cityData.longitude,
          },
        });
      },

      changeSettingsUnit: (
        key: keyof DefaultStateType["unitSettings"],
        unit: string | boolean
      ) =>
        set((state) => ({
          unitSettings: {
            ...state.unitSettings,
            [key]: unit,
          },
        })),

      addSavedCity: (cityData: CurrentCityType) =>
        set((state) => ({
          savedCities: [...state.savedCities, cityData],
        })),
      removeSavedCity: (city: string) =>
        set((state) => ({
          savedCities: state.savedCities.filter((c) => c.city !== city),
        })),
      removeAll: () =>
        set((state) => ({ ...defaultState, unitSettings: state.unitSettings })),
      setLocationPermission: (permission: "denied" | "accepted" | "N/A") =>
        set({ locationPermission: permission }),
    }),

    // PERSIST
    {
      name: "weather-storage", // unique name for the storage
      partialize: (state) => ({
        ...state,
      }),
    }
  )
);

export const getCurrentUnitSettings = (
  key: keyof DefaultStateType["unitSettings"]
) => {
  if (typeof window !== "undefined") {
    const storedSettings = window.localStorage.getItem("weather-storage");
    if (storedSettings) {
      const state = JSON.parse(storedSettings);
      return state.state.unitSettings[key];
    }
  }
};
