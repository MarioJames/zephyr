/**
 * URL sync utility functions
 * Used for synchronizing URL parameters when switching sessions and topics
 */

/**
 * Sync URL parameters
 * @param params - Object containing key-value pairs to sync to URL
 */
export const syncUrlParams = (params: Record<string, string | undefined>) => {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  
  // Set or delete each parameter
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  
  // Use pushState to update URL without page refresh
  window.history.pushState(null, '', url.toString());
};

/**
 * Get URL parameters
 * @param keys - Array of parameter keys to retrieve
 * @returns Object containing the requested parameters
 */
export const getUrlParams = (keys: string[]) => {
  if (typeof window === 'undefined') {
    return Object.fromEntries(keys.map(key => [key, null]));
  }
  
  const url = new URL(window.location.href);
  return Object.fromEntries(
    keys.map(key => [key, url.searchParams.get(key)])
  );
};