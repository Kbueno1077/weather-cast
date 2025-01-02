interface CacheEntry {
  data: unknown;
  timestamp: number;
}

interface CacheData {
  isStale?: boolean;
  [key: string]: unknown;
}

class WeatherCacheService {
  private cache: Record<string, CacheEntry> = {};
  private readonly CACHE_DURATION = 60 * 60 * 1000; // Increased to 1 hour
  private readonly MAX_CACHE_SIZE = 1000;
  private readonly STORAGE_KEY = "weather_cache";

  constructor() {
    // Load cache from localStorage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedCache = localStorage.getItem(this.STORAGE_KEY);
      if (savedCache) {
        this.cache = JSON.parse(savedCache);
      }
    } catch (error) {
      console.error("Error loading cache from storage:", error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error("Error saving cache to storage:", error);
    }
  }

  generateCacheKey(latitude: string, longitude: string) {
    // Round coordinates to reduce slight variations
    const roundedLat = Number(latitude).toFixed(3);
    const roundedLon = Number(longitude).toFixed(3);
    return `---${roundedLat}-${roundedLon}`;
  }

  get(cacheKey: string): CacheData | null {
    this.cleanupExpiredEntries();
    const cachedEntry = this.cache[cacheKey];
    const currentTime = Date.now();

    if (cachedEntry) {
      const age = currentTime - cachedEntry.timestamp;

      // If data is fresh enough, return it
      if (age < this.CACHE_DURATION) {
        console.log(
          "Returning cached weather data, age:",
          Math.round(age / 1000 / 60),
          "minutes"
        );
        return cachedEntry.data as CacheData;
      }

      // If data is stale but we have it, still return it but trigger a background refresh
      console.log("Returning stale cached data, will refresh in background");
      return {
        ...(cachedEntry.data as object),
        isStale: true,
      };
    }

    return null;
  }

  set(cacheKey: string, data: unknown) {
    this.cleanupExpiredEntries();

    if (Object.keys(this.cache).length >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.findOldestCacheKey();
      if (oldestKey) delete this.cache[oldestKey];
    }

    this.cache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };

    this.saveToStorage();
  }

  private cleanupExpiredEntries() {
    const currentTime = Date.now();
    let changed = false;

    Object.keys(this.cache).forEach((key) => {
      if (currentTime - this.cache[key].timestamp >= this.CACHE_DURATION * 2) {
        delete this.cache[key];
        changed = true;
      }
    });

    if (changed) {
      this.saveToStorage();
    }
  }

  private findOldestCacheKey(): string | null {
    if (Object.keys(this.cache).length === 0) return null;
    return Object.entries(this.cache).reduce((oldest, current) =>
      current[1].timestamp < oldest[1].timestamp ? current : oldest
    )[0];
  }

  clear() {
    this.cache = {};
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const weatherCacheService = new WeatherCacheService();
