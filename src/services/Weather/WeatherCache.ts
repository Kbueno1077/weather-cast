import type { WeatherSuccess } from "@/types/weather";

interface CacheEntry {
  data: WeatherSuccess;
  timestamp: number;
}

class WeatherCacheService {
  private cache: Record<string, CacheEntry> = {};
  private readonly CACHE_DURATION = 30 * 60 * 1000;
  private readonly MAX_CACHE_SIZE = 20;
  private readonly STORAGE_KEY = "weather_cache";

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedCache = localStorage.getItem(this.STORAGE_KEY);
      if (savedCache) {
        this.cache = JSON.parse(savedCache) as Record<string, CacheEntry>;
      }
    } catch (error) {
      console.error("Error loading cache from storage:", error);
      this.cache = {};
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
    const roundedLat = Number(latitude).toFixed(3);
    const roundedLon = Number(longitude).toFixed(3);
    return `${roundedLat},${roundedLon}`;
  }

  get(cacheKey: string): WeatherSuccess | null {
    this.cleanupExpiredEntries();
    const cachedEntry = this.cache[cacheKey];
    if (!cachedEntry) return null;
    if (Date.now() - cachedEntry.timestamp >= this.CACHE_DURATION) return null;
    return cachedEntry.data;
  }

  set(cacheKey: string, data: WeatherSuccess) {
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
      if (currentTime - this.cache[key].timestamp >= this.CACHE_DURATION) {
        delete this.cache[key];
        changed = true;
      }
    });

    if (changed) this.saveToStorage();
  }

  private findOldestCacheKey(): string | null {
    const entries = Object.entries(this.cache);
    if (entries.length === 0) return null;
    return entries.reduce((oldest, current) =>
      current[1].timestamp < oldest[1].timestamp ? current : oldest
    )[0];
  }
}

export const weatherCacheService = new WeatherCacheService();
