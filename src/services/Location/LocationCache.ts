interface CacheEntry {
  data: any;
  timestamp: number;
}

class LocationCacheService {
  private cache: Record<string, CacheEntry> = {};
  private readonly CACHE_DURATION = 10 * 60 * 100000; // 1000 minutes
  private readonly MAX_CACHE_SIZE = 1000; // Limit total cache entries

  generateCacheKey(city: string, state: string, countryCode: string) {
    return `${city.toLowerCase()}-${state.toLowerCase()}-${countryCode}`;
  }

  get(cacheKey: string) {
    this.cleanupExpiredEntries();
    const cachedEntry = this.cache[cacheKey];
    const currentTime = Date.now();

    return cachedEntry &&
      currentTime - cachedEntry.timestamp < this.CACHE_DURATION
      ? cachedEntry.data
      : null;
  }

  set(cacheKey: string, data: any) {
    this.cleanupExpiredEntries();

    // If cache is at max size, remove the oldest entry
    if (Object.keys(this.cache).length >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.findOldestCacheKey();
      if (oldestKey) delete this.cache[oldestKey];
    }

    this.cache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };
  }

  private cleanupExpiredEntries() {
    const currentTime = Date.now();
    Object.keys(this.cache).forEach((key) => {
      if (currentTime - this.cache[key].timestamp >= this.CACHE_DURATION) {
        delete this.cache[key];
      }
    });
  }

  private findOldestCacheKey(): string | null {
    if (Object.keys(this.cache).length === 0) return null;

    return Object.entries(this.cache).reduce((oldest, current) =>
      current[1].timestamp < oldest[1].timestamp ? current : oldest
    )[0];
  }

  // Optional: Clear entire cache
  clear() {
    this.cache = {};
  }
}

export const loactionCacheService = new LocationCacheService();
