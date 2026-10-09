import type { CityResult } from "@/types/weather";

export async function searchCities(query: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/api/geocode?${params.toString()}`, { signal });
  const data = (await response.json()) as { results?: CityResult[]; message?: string };
  if (!response.ok) {
    throw new Error(data.message || "City search failed");
  }
  return data.results ?? [];
}

export async function reverseGeocode(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });
  const response = await fetch(`/api/geocode?${params.toString()}`);
  const data = (await response.json()) as CityResult & { message?: string; error?: boolean };
  if (!response.ok || data.error) {
    throw new Error(data.message || "Could not identify this location");
  }
  return data;
}
