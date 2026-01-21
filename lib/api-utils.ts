import { globalCache } from './cache';

/**
 * Generic API request handler with caching support
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  useCache: boolean = true,
  cacheTtl: number = 5 * 60 * 1000 // 5 minutes
): Promise<T> {
  const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body)}`;

  // Try to get from cache first
  if (useCache) {
    const cached = globalCache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response if caching is enabled
    if (useCache) {
      globalCache.set(cacheKey, data, cacheTtl);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
}

/**
 * Invalidate cache for a specific key or pattern
 */
export function invalidateCache(pattern?: string) {
  if (!pattern) {
    globalCache.clear();
    return;
  }

  // For now, just clear everything since our cache implementation doesn't support pattern matching
  globalCache.clear();
}

/**
 * Prefetch data to warm up the cache
 */
export async function prefetchData<T>(url: string, options: RequestInit = {}) {
  try {
    await apiRequest<T>(url, options, true);
  } catch (error) {
    console.warn(`Failed to prefetch data for ${url}:`, error);
  }
}