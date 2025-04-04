/**
 * API configuration for OpenFoodFacts API
 * Contains settings for caching, retries, and other API-related configurations
 */

// Default stale time for queries (5 minutes)
export const DEFAULT_STALE_TIME = 5 * 60 * 1000;

// Default cache time for queries (30 minutes)
export const DEFAULT_CACHE_TIME = 30 * 60 * 1000;

// Default retry count for failed queries
export const DEFAULT_RETRY_COUNT = 2;

// Default retry delay (in ms)
export const DEFAULT_RETRY_DELAY = 1000;

// Default page size for pagination
export const DEFAULT_PAGE_SIZE = 24;

// API rate limiting - max requests per minute
export const MAX_REQUESTS_PER_MINUTE = 60;

// Configure React Query defaults
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      cacheTime: DEFAULT_CACHE_TIME,
      retry: DEFAULT_RETRY_COUNT,
      retryDelay: DEFAULT_RETRY_DELAY,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  },
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Product not found. Please check the information and try again.',
  GENERAL_ERROR: 'An error occurred. Please try again.',
};
