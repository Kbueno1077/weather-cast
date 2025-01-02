import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useWeatherStore } from "@/store/zustand";
import { loadWeather } from "@/services/loadWeather"; // Import the new function

interface UseFetchDataOptions<T> {
  initialData?: T | null;
  enabled?: boolean;
  queryKeys?: unknown[];
}

export function useLoadWeather<T = unknown>(
  options: UseFetchDataOptions<T> = {}
) {
  const { initialData = null, enabled = true, queryKeys = [] } = options;
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<string>("");

  const currentLocation = useWeatherStore((state) => state.currentCity);
  const locationPermission = useWeatherStore(
    (state) => state.locationPermission
  );
  const fullQueryKey = ["weather", ...queryKeys];

  const queryFn = async () => {
    if (!enabled) return null;
    setIsLoading(true);

    try {
      let coords = currentLocation;

      if (!coords?.latitude || !coords?.longitude) {
        coords = await getGeolocation(locationPermission);
        const nominatimData = await fetchNominatimData(coords);
        if (nominatimData)
          coords = { ...coords, ...getNominatimAddress(nominatimData) };
      }

      const request = new Request(
        `${window.location.origin}?${new URLSearchParams({
          latitude: coords.latitude.toString(),
          longitude: coords.longitude.toString(),
        })}`
      );

      const weatherData = await loadWeather(request);

      if (!weatherData || (weatherData.error && weatherData.code === 429001))
        throw new Error("Error fetching weather data");

      useWeatherStore.getState().setStoreFromData(weatherData);
      setData(weatherData as T);
      setError("");
      return weatherData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load weather data";

      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const query = useQuery({
    queryKey: fullQueryKey,
    queryFn,
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: queryFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["weather"] }),
  });

  return {
    data,
    isLoading,
    error,
    refetch: query.refetch,
    mutate: mutation.mutate,
  };
}

// Helper functions
async function getGeolocation(permission: string) {
  if (!navigator.geolocation) throw new Error("Geolocation not supported");
  if (permission !== "accepted") throw new Error("Permission denied by user");

  const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 0,
    });
  });

  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

async function fetchNominatimData(coords: {
  latitude: number;
  longitude: number;
}) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
  );
  return response.json();
}

function getNominatimAddress(data: any) {
  const address = data.address || {};
  return {
    city: address.city || "",
    state: address.state || "",
    countryCode: address.country_code || "",
    countryName: address.country || "",
  };
}
