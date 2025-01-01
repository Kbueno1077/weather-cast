import { loactionCacheService } from "./LocationCache";

export async function fetchLocationData(
  city: string,
  state: string,
  countryCode: string
) {
  const cacheKey = loactionCacheService.generateCacheKey(
    city,
    state,
    countryCode
  );

  // Check cache first
  const cachedData = loactionCacheService.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    // Fetch geocoding data
    const geocodingResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${countryCode}&limit=3&appid=${
        import.meta.env.VITE_WHEATHER_API_KEY
      }`
    );

    const locationData = await geocodingResponse.json();

    if (!locationData || locationData.length === 0) {
      throw new Error("Location not found");
    }

    // Extract coordinates from the first result
    const coordinates = {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
      name: locationData[0].name,
      locationData,
    };

    // Prepare the response data
    const responseData = { coordinates };

    // Cache the new data
    loactionCacheService.set(cacheKey, responseData);

    return responseData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}
