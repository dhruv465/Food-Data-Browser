/**
 * API configuration for OpenFoodFacts API with proxy support
 */

// Base URL for API requests
export const getApiBaseUrl = () => {
  // In development, use the Vite dev server proxy
  if (import.meta.env.DEV) {
    return '/api';
  }
  // In production, use the Vercel serverless function
  return '/api';
};

// API endpoints
export const API_ENDPOINTS = {
  search: (query) => `${getApiBaseUrl()}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1`,
  product: (barcode) => `${getApiBaseUrl()}/api/v0/product/${barcode}.json`,
};

// Default request headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'FoodDataBrowser/1.0',
};

// Error handling
export const handleApiError = (error) => {
  console.error('API Error:', error);
  throw new Error(error.message || 'An error occurred while fetching data');
};