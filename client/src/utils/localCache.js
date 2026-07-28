const CACHE_PREFIX = "vidyamarg_cache_";
const CACHE_EXPIRY_HOURS = 24;

// Save data to local cache with timestamp
export const saveToCache = (key, data) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + CACHE_EXPIRY_HOURS * 60 * 60 * 1000,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheItem));
    return true;
  } catch (error) {
    console.error("Cache save failed:", error);
    return false;
  }
};

// Get data from cache (returns null if expired or not found)
export const getFromCache = (key) => {
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const cacheItem = JSON.parse(item);

    // Check if expired
    if (Date.now() > cacheItem.expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return cacheItem.data;
  } catch (error) {
    console.error("Cache read failed:", error);
    return null;
  }
};

// Clear a specific cache entry
export const clearCache = (key) => {
  localStorage.removeItem(CACHE_PREFIX + key);
};

// Clear all VidyaMarg cache
export const clearAllCache = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
};

// Get cache age in minutes
export const getCacheAge = (key) => {
  try {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;
    const cacheItem = JSON.parse(item);
    return Math.round((Date.now() - cacheItem.timestamp) / (1000 * 60));
  } catch {
    return null;
  }
};