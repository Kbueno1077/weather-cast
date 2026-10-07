import { queryClient } from "@/services/queryClient";
import { fetchWeatherData } from "@/services/Weather/WeatherApi";
import {
  ForecastType,
  CurrentWeatherType,
  UnitSettings,
  CurrentCityType,
  DailyForecastType,
  isWeatherFailure,
} from "@/types/weather";
import { coordToString, sameCity } from "@/utils/utilities";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InitStateType = {
  currentWeather: CurrentWeatherType | null;
  hourlyWeather: ForecastType | null;
  dailyWeather: DailyForecastType | null;
  currentCity: CurrentCityType | null;
  savedCities: CurrentCityType[];
  locationPermission: "denied" | "accepted" | "N/A";
  error: boolean;
  message: string;
  code: number;
  isLoading: boolean;
};

export type DefaultStateType = InitStateType & {
  unitSettings: UnitSettings;
};

export type WeatherActions = {
  changeCurrentCity: (cityData: CurrentCityType) => Promise<void>;
  setStoreFromData: (data: {
    currentWeather: CurrentWeatherType;
    hourlyWeather: ForecastType;
    dailyWeather: DailyForecastType;
  }) => void;
  changeSettingsUnit: <K extends keyof UnitSettings>(
    key: K,
    unit: UnitSettings[K]
  ) => void;
  addSavedCity: (cityData: CurrentCityType) => void;
  removeSavedCity: (
    city: Pick<CurrentCityType, "city" | "state" | "country">
  ) => void;
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
  error: false,
  message: "",
  code: 200,
  isLoading: false,
};

const defaultUnits: UnitSettings = {
  temperatureUnit: "°C",
  windSpeedUnit: "km/h",
  pressureUnit: "hPa",
  precipitationUnit: "mm",
  distanceUnit: "km",
  is12Hour: true,
};

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      ...defaultState,
      unitSettings: defaultUnits,

      setStoreFromData: (data) =>
        set({
          currentWeather: data.currentWeather,
          hourlyWeather: data.hourlyWeather,
          dailyWeather: data.dailyWeather,
          error: false,
          message: "",
          code: 200,
          isLoading: false,
        }),

      changeCurrentCity: async (cityData) => {
        const latitude = coordToString(cityData.latitude);
        const longitude = coordToString(cityData.longitude);
        const currentCity: CurrentCityType = {
          ...cityData,
          latitude,
          longitude,
        };

        if (!latitude || !longitude) {
          set({
            isLoading: false,
            error: true,
            code: 400,
            message: "That place is missing coordinates",
            currentCity,
          });
          return;
        }

        set({ isLoading: true, error: false, message: "" });
        const data = await fetchWeatherData(latitude, longitude);

        if (isWeatherFailure(data)) {
          set({
            isLoading: false,
            error: true,
            code: data.code,
            message: data.message,
            currentCity,
          });
          return;
        }

        set({
          ...data,
          isLoading: false,
          error: false,
          code: 200,
          message: "",
          currentCity,
        });
      },

      changeSettingsUnit: (key, unit) =>
        set((state) => ({
          unitSettings: {
            ...state.unitSettings,
            [key]: unit,
          },
        })),

      addSavedCity: (cityData) =>
        set((state) => {
          const nextCity: CurrentCityType = {
            ...cityData,
            latitude: coordToString(cityData.latitude),
            longitude: coordToString(cityData.longitude),
          };
          if (state.savedCities.some((saved) => sameCity(saved, nextCity))) {
            return state;
          }
          return { savedCities: [...state.savedCities, nextCity] };
        }),

      removeSavedCity: (city) =>
        set((state) => ({
          savedCities: state.savedCities.filter((saved) => !sameCity(saved, city)),
        })),

      removeAll: () => {
        queryClient.removeQueries({ queryKey: ["weather"] });
        set((state) => ({
          ...defaultState,
          unitSettings: state.unitSettings,
          locationPermission: state.locationPermission,
        }));
      },

      setLocationPermission: (permission) =>
        set({ locationPermission: permission }),
    }),
    {
      name: "weather-storage",
      partialize: (state) => ({
        unitSettings: state.unitSettings,
        savedCities: state.savedCities,
        currentCity: state.currentCity,
        locationPermission: state.locationPermission,
      }),
    }
  )
);
