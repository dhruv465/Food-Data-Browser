import axios from 'axios';
import { ERROR_MESSAGES, DEFAULT_PAGE_SIZE, DEFAULT_RETRY_COUNT, getApiBaseUrl } from '../api-config'; // Importing getApiBaseUrl

// Use appropriate API base URL based on environment
const API_BASE_URL = getApiBaseUrl();

// Create axios instance - No BaseURL needed here as we construct full paths below
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
    if (retries > 0 && (error.message === ERROR_MESSAGES.NETWORK_ERROR || error.code === 'ECONNREFUSED')) {
      console.log(`API call failed, retrying... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryApiCall(apiCall, args, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

/**
 * Check if the API is available
 * @returns {Promise<boolean>} - Promise that resolves to true if API is available, false otherwise
 */
const checkApiAvailability = async () => {
  try {
    // Use the determined base URL for the check
    await api.get(`/offapi/categories.json`, { timeout: 5000 }); // Updated to use /offapi
    return true;
  } catch (error) {
    console.error('API availability check failed:', error.message);
    return false;
  }
};

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error Response:", error.response);
      if (error.response.status === 404) {
        error.message = ERROR_MESSAGES.NOT_FOUND;
      } else if (error.response.status >= 500) {
        error.message = ERROR_MESSAGES.SERVER_ERROR;
      } else {
        error.message = `API request failed with status ${error.response.status}`;
      }
    } else if (error.request) {
      console.error("API No Response:", error.request);
      error.message = ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      console.error("API Request Setup Error:", error.message);
      error.message = ERROR_MESSAGES.GENERAL_ERROR;
    }
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

  try {
    const apiAvailable = await checkApiAvailability();
    if (!apiAvailable) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    const apiCallFn = async () => {
      let categoryName = '';
      if (Array.isArray(category)) {
        if (category.length === 0) {
          return { products: [], count: 0, page: 1, page_count: 1 };
        }
        categoryName = category[0]; // Using the first category if multiple
      } else {
        categoryName = category;
      }
      const url = `/offapi/category/${categoryName}.json?page=${page}&page_size=${pageSize}`; // Updated to use /offapi
      const response = await api.get(url);
      return response.data;
    };
    return await retryApiCall(apiCallFn, [], DEFAULT_RETRY_COUNT);
  } catch (error) {
    console.error(`Error in getProductsByCategory:`, error);
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
  try {
    const apiAvailable = await checkApiAvailability();
    if (!apiAvailable) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const apiCallFn = async () => {
      const url = `/offapi/cgi/search.pl?search_terms=${encodedSearchTerm}&json=true&page=${page}&page_size=${pageSize}`; // Updated to use /offapi
      const response = await api.get(url);
      return response.data;
    };
    return await retryApiCall(apiCallFn, [], DEFAULT_RETRY_COUNT);
  } catch (error) {
    console.error(`Error in searchProductsByName for "${searchTerm}":`, error);
    throw error;
  }
};

/**
 * Get categories
 * @returns {Promise} - Promise with the response data
 */
export const getCategories = async () => {
  try {
    const apiAvailable = await checkApiAvailability();
    if (!apiAvailable) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    const apiCallFn = async () => {
      const url = `/offapi/categories.json`; // Updated to use /offapi
      const response = await api.get(url);
      return response.data;
    };
    return await retryApiCall(apiCallFn, [], DEFAULT_RETRY_COUNT);
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
};

/**
 * Get product by barcode
 * @param {string} barcode - Product barcode
 * @returns {Promise} - Promise with the response data
 */
export const getProductByBarcode = async (barcode) => {
  if (!barcode) {
    console.error("getProductByBarcode called without a barcode.");
    return Promise.reject(new Error("Barcode is required."));
  }

  try {
    const apiAvailable = await checkApiAvailability();
    if (!apiAvailable) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    const apiCallFn = async () => {
      const url = `/offapi/api/v0/product/${barcode}.json`; // Updated to use /offapi
      const response = await api.get(url);
      return response.data;
    };
    return await retryApiCall(apiCallFn, [], DEFAULT_RETRY_COUNT);
  } catch (error) {
    console.error(`Error in getProductByBarcode for "${barcode}":`, error);
    throw error;
  }
};

export default {
  getProductsByCategory,
  searchProductsByName,
  getProductByBarcode,
  getCategories,
};
