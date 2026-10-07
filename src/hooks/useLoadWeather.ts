import { reverseGeocode } from "@/services/geocode";
import { fetchWeatherData } from "@/services/Weather/WeatherApi";
import { useWeatherStore } from "@/store/zustand";
import { isWeatherFailure } from "@/types/weather";
import { coordToString, hasCoords, parseCoord } from "@/utils/utilities";
import { useQuery } from "@tanstack/react-query";

function permissionMessage(permission: "denied" | "accepted" | "N/A") {
  switch (permission) {
    case "accepted":
      return "";
    case "denied":
      return "Permission denied by user";
    case "N/A":
      return "Location access is required";
    default: {
      const unreachable: never = permission;
      return unreachable;
    }
  }
}

function isGeoError(error: unknown): error is GeolocationPositionError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "number"
  );
}

function geolocationMessage(error: GeolocationPositionError) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Permission denied by user";
    case error.POSITION_UNAVAILABLE:
      return "Location information unavailable";
    case error.TIMEOUT:
      return "Location request timed out";
    default:
      return "Location information unavailable";
  }
}

async function getGeolocation() {
  if (!navigator.geolocation) throw new Error("Geolocation not supported");

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 60_000,
    });
  }).catch((error: unknown) => {
    if (isGeoError(error)) throw new Error(geolocationMessage(error));
    throw new Error("Location information unavailable");
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export function useLoadWeather() {
  const locationPermission = useWeatherStore((state) => state.locationPermission);

  const query = useQuery({
    queryKey: ["weather", locationPermission],
    queryFn: async () => {
      const store = useWeatherStore.getState();
      let city = store.currentCity;

      if (!hasCoords(city)) {
        const message = permissionMessage(store.locationPermission);
        if (message) throw new Error(message);

        const coords = await getGeolocation();
        const place = await reverseGeocode(coords.latitude, coords.longitude);
        city = {
          city: place.name,
          state: place.state,
          country: place.countryCode,
          countryName: place.countryName,
          latitude: coordToString(coords.latitude),
          longitude: coordToString(coords.longitude),
        };
        useWeatherStore.setState({ currentCity: city });
      }

      const latitude = coordToString(city?.latitude);
      const longitude = coordToString(city?.longitude);
      if (parseCoord(latitude) == null || parseCoord(longitude) == null) {
        throw new Error("Missing latitude or longitude");
      }

      const weather = await fetchWeatherData(latitude, longitude);
      if (isWeatherFailure(weather)) throw new Error(weather.message);

      store.setStoreFromData(weather);
      return weather;
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading: query.isPending,
    error: query.error instanceof Error ? query.error.message : "",
    refetch: query.refetch,
  };
}
