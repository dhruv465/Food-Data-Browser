import axios from 'axios';
import { ERROR_MESSAGES, DEFAULT_PAGE_SIZE, DEFAULT_RETRY_COUNT } from '../api-config';

// Define the proxy endpoint as the base for all calls
const API_PROXY_ENDPOINT = '/api/offproxy'; // All requests go through this Vercel function

// Create axios instance
const api = axios.create({
  // No base URL here, we use the full proxy path in requests
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout slightly for proxy layer
});

/**
 * Utility function to retry a failed API call with exponential backoff
 */
const retryApiCall = async (apiCall, args, retries = DEFAULT_RETRY_COUNT, delay = 1000) => {
  try {
    return await apiCall(...args);
  } catch (error) {
    // Retry on network errors or 5xx server errors from the proxy or upstream API
    if (retries > 0 && (error.message === ERROR_MESSAGES.NETWORK_ERROR || error.code === 'ECONNREFUSED' || error.response?.status >= 500)) {
      console.log(`API call via proxy failed, retrying... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryApiCall(apiCall, args, retries - 1, delay * 2); // Exponential backoff
    }
    // Don't retry client errors like 404 Not Found immediately
    if (error.message === ERROR_MESSAGES.NOT_FOUND) {
        console.warn("Caught Not Found error, not retrying.");
    }
    throw error; // Re-throw error if no retries left or it's not a retryable error
  }
};

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // console.log('Making API request via proxy:', config.url); // Optional: Log requests
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    // Check for OpenFoodFacts specific 'product not found' status within a successful proxy response
    if (response.data?.status === 0 && response.config.url.includes('/api/v0/product/')) {
        console.warn("Proxy returned success, but OFF status is 0 (Product Not Found)");
        // Throw a specific error type that can be caught downstream
        const notFoundError = new Error(ERROR_MESSAGES.NOT_FOUND);
        notFoundError.name = 'ProductNotFoundError'; // Custom error name
        throw notFoundError;
    }
    return response;
  },
  (error) => {
    // Transform error messages to be more user-friendly
    if (error.response) {
      console.error("API Proxy Error Response:", error.response.status, error.response.data);
      if (error.response.status === 404) {
        // Could be 404 from the proxy itself OR from OpenFoodFacts via proxy
         error.message = ERROR_MESSAGES.NOT_FOUND;
      } else if (error.response.status >= 500) {
        error.message = ERROR_MESSAGES.SERVER_ERROR + (error.response.data?.message ? ` (${error.response.data.message})` : '');
      } else {
        error.message = `Proxy request failed with status ${error.response.status}` + (error.response.data?.message ? ` (${error.response.data.message})` : '');
      }
    } else if (error.request) {
      console.error("API Proxy No Response:", error.request);
      error.message = ERROR_MESSAGES.NETWORK_ERROR;
    } else if (error.name === 'ProductNotFoundError') {
        // Handle the specific error thrown in the success interceptor
        error.message = ERROR_MESSAGES.NOT_FOUND;
    }
     else {
      console.error("API Request Setup/Unknown Error:", error.message);
      error.message = ERROR_MESSAGES.GENERAL_ERROR;
    }
    return Promise.reject(error);
  }
);


/**
 * Get products by category
 */
export const getProductsByCategory = async (category, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  if (!category) {
    console.error("getProductsByCategory called without a category.");
    return Promise.reject(new Error("Category is required."));
  }

  try {
    const apiCallFn = async () => {
      let categoryName = Array.isArray(category) ? category[0] : category;
      if (!categoryName && Array.isArray(category) && category.length > 0) categoryName = category[0];
      if (!categoryName) return { products: [], count: 0, page: 1, page_count: 1 };

      const targetPath = `/category/${categoryName}.json`;
      const url = `${API_PROXY_ENDPOINT}${targetPath}?page=${page}&page_size=${pageSize}`;
      const response = await api.get(url);
      return response.data;
    };
    return await retryApiCall(apiCallFn, []); // Use default retry count
  } catch (error) {
    // Errors are now handled by the interceptor, just log here if needed
    // console.error(`Error caught in getProductsByCategory:`, error.message);
    throw error; // Propagate error
  }
};

/**
 * Search products by name
 */
export const searchProductsByName = async (searchTerm, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
   if (!searchTerm || searchTerm.trim() === "") {
     console.log("Skipping search for empty term.");
     return { products: [], count: 0, page: 1, page_count: 0 };
   }
  try {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const apiCallFn = async () => {
      const targetPath = `/cgi/search.pl`;
      const url = `${API_PROXY_ENDPOINT}${targetPath}?search_terms=${encodedSearchTerm}&json=true&page=${page}&page_size=${pageSize}`;
      const response = await api.get(url);
      return response.data;
    };
    return await retryApiCall(apiCallFn, []);
  } catch (error) {
    // console.error(`Error caught in searchProductsByName for "${searchTerm}":`, error.message);
    throw error;
  }
};

/**
 * Get categories
 */
export const getCategories = async () => {
  try {
    const apiCallFn = async () => {
      const targetPath = `/categories.json`;
      const url = `${API_PROXY_ENDPOINT}${targetPath}`;
      const response = await api.get(url);
      return response.data;
    };
    return await retryApiCall(apiCallFn, []);
  } catch (error) {
    // console.error('Error caught in getCategories:', error.message);
    throw error;
  }
};

/**
 * Get product by barcode
 */
export const getProductByBarcode = async (barcode) => {
  if (!barcode) {
    console.error("getProductByBarcode called without a barcode.");
    return Promise.reject(new Error("Barcode is required."));
  }

  try {
    const apiCallFn = async () => {
      const targetPath = `/api/v0/product/${barcode}.json`;
      const url = `${API_PROXY_ENDPOINT}${targetPath}`;
      const response = await api.get(url);
      // The success interceptor now handles the status=0 case
      return response.data;
    };
    // Use fewer retries for specific product lookups as 404 is common and not retryable
    return await retryApiCall(apiCallFn, [], 1);
  } catch (error) {
     // Errors (including specific Not Found) are handled by interceptors
     // console.error(`Error caught in getProductByBarcode for "${barcode}":`, error.message);
    throw error;
  }
};

// Default export
export default {
  getProductsByCategory,
  searchProductsByName,
  getProductByBarcode,
  getCategories,
};