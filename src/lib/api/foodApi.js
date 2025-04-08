// --- START OF FILE foodApi.js ---

import axios from 'axios';
import { ERROR_MESSAGES, DEFAULT_PAGE_SIZE, DEFAULT_RETRY_COUNT } from '../api-config';

// Use the real Open Food Facts API Base URL
const API_BASE_URL = 'https://world.openfoodfacts.org';

// Create axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Utility function to retry a failed API call with exponential backoff
 * @param {Function} apiCall - The API call function to retry
 * @param {Array} args - Arguments to pass to the API call function
 * @param {number} retries - Number of retries remaining
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} - Promise with the response data or error
 */
const retryApiCall = async (apiCall, args, retries = DEFAULT_RETRY_COUNT, delay = 1000) => {
  try {
    return await apiCall(...args);
  } catch (error) {
    // Check navigator.onLine before retrying network errors
    if (retries > 0 && (!navigator.onLine || error.message === ERROR_MESSAGES.NETWORK_ERROR || error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED')) {
      console.warn(`API call failed (${error.message}), retrying... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryApiCall(apiCall, args, retries - 1, delay * 2); // Exponential backoff
    }
    // If not retrying or it's not a retryable error, transform and throw
    throw transformApiError(error);
  }
};

// Helper to transform Axios errors into consistent error messages
const transformApiError = (error) => {
    if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        // Optionally return a specific error or message for cancellations
        return new Error("Request canceled");
    }
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("API Error Response:", error.response.status, error.response.data);
      if (error.response.status === 404) {
        error.message = ERROR_MESSAGES.NOT_FOUND;
      } else if (error.response.status >= 500) {
        error.message = ERROR_MESSAGES.SERVER_ERROR;
      } else {
        error.message = `API request failed with status ${error.response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received (network error, timeout, etc.)
      console.error("API No Response:", error.request);
       // Check online status
      if (!navigator.onLine) {
          error.message = ERROR_MESSAGES.NETWORK_ERROR;
      } else if (error.code === 'ECONNABORTED') {
          error.message = 'Request timed out. Please try again.';
      } else {
          // Could be CORS, DNS, refused connection etc. Treat as network error for user.
          error.message = ERROR_MESSAGES.NETWORK_ERROR;
      }
    } else {
      // Something happened in setting up the request
      console.error("API Request Setup Error:", error.message);
      error.message = ERROR_MESSAGES.GENERAL_ERROR;
    }
    // Return the error object itself (or a new Error(error.message))
    return error;
};


/**
 * Check if the API is available
 * Uses a lightweight endpoint like categories.json
 * @returns {Promise<boolean>} - Promise that resolves to true if API is available, false otherwise
 */
const checkApiAvailability = async () => {
  // Skip check if offline
  if (!navigator.onLine) {
      console.warn("Offline, skipping API availability check.");
      return false; // Treat as unavailable if offline
  }
  try {
    // Use the direct base URL for the check
    await api.get(`${API_BASE_URL}/categories.json`, { timeout: 5000 }); // Using direct URL
    return true;
  } catch (error) {
    // Log the specific error for debugging but return false for availability
    console.error('API availability check failed:', error.message);
    return false;
  }
};

// Request interceptor (optional, keep if needed)
api.interceptors.request.use(
  (config) => {
    // console.log('Making API request:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error); // Don't transform request errors here
  }
);

// Response interceptor (simplified, as transformation happens in retry/catch blocks)
api.interceptors.response.use(
  (response) => {
    return response; // Pass successful responses through
  },
  (error) => {
    // We will handle error transformation within the retryApiCall or the main function's catch block
    // This interceptor now just passes the raw Axios error along
    return Promise.reject(error);
  }
);

/**
 * Get products by category
 * @param {string|string[]} category - Category name or array of category names
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Number of items per page
 * @returns {Promise} - Promise with the response data
 */
export const getProductsByCategory = async (category, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  if (!category) {
    console.error("getProductsByCategory called without a category.");
    return Promise.reject(new Error("Category is required."));
  }

  const apiAvailable = await checkApiAvailability();
  if (!apiAvailable) {
    // Throw specific network error if offline or check failed
    return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
  }

  const apiCallFn = async (cat, pg, pgSize) => {
      let categoryName = '';
      if (Array.isArray(cat)) {
        if (cat.length === 0) {
          // Return empty result immediately if category array is empty
          return { products: [], count: 0, page: 1, page_count: 1 };
        }
        categoryName = cat[0]; // Using the first category if multiple
      } else {
        categoryName = cat;
      }
      // Ensure categoryName is properly encoded for the URL
      const encodedCategoryName = encodeURIComponent(categoryName);
      // Construct the full URL using the direct API base
      const url = `${API_BASE_URL}/category/${encodedCategoryName}.json?page=${pg}&page_size=${pgSize}`;
      console.log("Fetching:", url); // Log the actual URL being fetched
      const response = await api.get(url);
      return response.data;
  };

  try {
      // Pass arguments correctly to retryApiCall
      return await retryApiCall(apiCallFn, [category, page, pageSize], DEFAULT_RETRY_COUNT);
  } catch (error) {
      // Error should already be transformed by retryApiCall's catch block
      console.error(`Error in getProductsByCategory:`, error.message);
      // Re-throw the transformed error
      throw error;
  }
};


/**
 * Search products by name
 * @param {string} searchTerm - Search term
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Number of items per page
 * @returns {Promise} - Promise with the response data
 */
export const searchProductsByName = async (searchTerm, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  if (!searchTerm || searchTerm.trim() === '') {
      console.warn("searchProductsByName called with empty search term.");
      // Return an empty result structure consistent with API response
      return Promise.resolve({ products: [], count: 0, page: 1, page_size: pageSize });
  }

  const apiAvailable = await checkApiAvailability();
  if (!apiAvailable) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
  }

  const apiCallFn = async (term, pg, pgSize) => {
      const encodedSearchTerm = encodeURIComponent(term);
      // Construct the full URL using the direct API base and the CGI endpoint
      const url = `${API_BASE_URL}/cgi/search.pl?search_terms=${encodedSearchTerm}&json=true&page=${pg}&page_size=${pgSize}&search_simple=1`; // Added search_simple=1 common practice
      console.log("Fetching:", url);
      const response = await api.get(url);
      // Basic validation of response structure
       if (!response.data || typeof response.data.count !== 'number' || !Array.isArray(response.data.products)) {
            console.error("Unexpected API response structure:", response.data);
            throw new Error("Received invalid data format from API.");
        }
      return response.data;
  };

  try {
      return await retryApiCall(apiCallFn, [searchTerm, page, pageSize], DEFAULT_RETRY_COUNT);
  } catch (error) {
      console.error(`Error in searchProductsByName for "${searchTerm}":`, error.message);
      throw error; // Re-throw transformed error
  }
};

/**
 * Get categories
 * @returns {Promise} - Promise with the response data containing categories (tags)
 */
export const getCategories = async () => {

  const apiAvailable = await checkApiAvailability();
  if (!apiAvailable) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
  }

  const apiCallFn = async () => {
      // Construct the full URL using the direct API base
      const url = `${API_BASE_URL}/categories.json`;
      console.log("Fetching:", url);
      const response = await api.get(url);
       // Expecting { tags: [...] } structure based on OFF documentation
       if (!response.data || !Array.isArray(response.data.tags)) {
            console.error("Unexpected API response structure for categories:", response.data);
            throw new Error("Received invalid data format for categories.");
        }
      return response.data; // The response likely contains a 'tags' array
  };

  try {
      return await retryApiCall(apiCallFn, [], DEFAULT_RETRY_COUNT);
  } catch (error) {
      console.error('Error in getCategories:', error.message);
      throw error; // Re-throw transformed error
  }
};


/**
 * Get product by barcode
 * @param {string} barcode - Product barcode
 * @returns {Promise} - Promise with the response data (product details)
 */
export const getProductByBarcode = async (barcode) => {
  if (!barcode || typeof barcode !== 'string' || barcode.trim() === '') {
      console.error("getProductByBarcode called without a valid barcode.");
      return Promise.reject(new Error("Barcode is required and must be a non-empty string."));
  }

  const apiAvailable = await checkApiAvailability();
  if (!apiAvailable) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
  }

  const apiCallFn = async (bc) => {
      // Ensure barcode is clean (e.g., trim whitespace)
      const cleanBarcode = bc.trim();
      // Construct the full URL using the direct API base and v0 endpoint
      // Note: The API might return status 0/1 within the JSON, check response.data.status
      const url = `${API_BASE_URL}/api/v0/product/${cleanBarcode}.json`;
      console.log("Fetching:", url);
      const response = await api.get(url);

      // Check for OpenFoodFacts specific 'product not found' status within the JSON response
      if (response.data.status === 0 || !response.data.product) {
        // Throw a specific "Not Found" error that can be caught later
        const notFoundError = new Error(ERROR_MESSAGES.NOT_FOUND);
        notFoundError.status = 404; // Mimic HTTP status
        throw notFoundError;
      }
       // Basic validation
        if (typeof response.data.status === 'undefined') {
            console.error("Unexpected API response structure for barcode:", response.data);
            throw new Error("Received invalid data format from barcode lookup.");
        }

      return response.data; // Contains { status: 1, product: {...}, code: barcode } on success
  };

  try {
      return await retryApiCall(apiCallFn, [barcode], DEFAULT_RETRY_COUNT);
  } catch (error) {
      // Handle the specific 'Not Found' error thrown from apiCallFn
        if (error.message === ERROR_MESSAGES.NOT_FOUND && error.status === 404) {
            console.warn(`Product not found for barcode "${barcode}"`);
             throw error; // Re-throw the specific not found error
        }
      // Handle other transformed errors
      console.error(`Error in getProductByBarcode for "${barcode}":`, error.message);
      throw error; // Re-throw transformed error
  }
};

export default {
  getProductsByCategory,
  searchProductsByName,
  getProductByBarcode,
  getCategories,
};
// --- END OF FILE foodApi.js ---