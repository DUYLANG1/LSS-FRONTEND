interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache: Record<string, CacheItem<any>> = {};
  private maxAge: number = 5 * 60 * 1000; // 5 minutes default

  constructor(maxAgeMs?: number) {
    if (maxAgeMs) {
      this.maxAge = maxAgeMs;
    }
  }

  get<T>(key: string): T | null {
    const item = this.cache[key];
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > this.maxAge) {
      // Cache expired
      delete this.cache[key];
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  invalidate(key: string): void {
    delete this.cache[key];
  }

  invalidateAll(): void {
    this.cache = {};
  }
}

export const apiCache = new ApiCache();