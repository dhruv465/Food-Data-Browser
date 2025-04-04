import axios from 'axios';
import { ERROR_MESSAGES, DEFAULT_PAGE_SIZE } from '../api-config';

// Base URL for the OpenFoodFacts API is handled by the proxy in vite.config.ts
// No need for BASE_URL or CORS_PROXY here anymore for constructing request URLs.

// Create axios instance
// BaseURL is not set here, as we use relative paths for the proxy
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You could add additional headers or auth tokens here if needed
    // console.log('Making API request:', config.url); // Optional: Log requests for debugging
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
    // Transform error messages to be more user-friendly
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("API Error Response:", error.response);
      if (error.response.status === 404) {
        error.message = ERROR_MESSAGES.NOT_FOUND;
      } else if (error.response.status >= 500) {
        error.message = ERROR_MESSAGES.SERVER_ERROR;
      } else {
         // Include status code for other client errors
         error.message = `API request failed with status ${error.response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API No Response:", error.request);
      error.message = ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      // Something happened in setting up the request
      console.error("API Request Setup Error:", error.message);
      error.message = ERROR_MESSAGES.GENERAL_ERROR;
    }
    return Promise.reject(error);
  }
);

/**
 * Get products by category
 * @param {string} category - Category name (e.g., 'breakfast-cereals')
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Number of items per page
 * @returns {Promise} - Promise with the response data
 */
export const getProductsByCategory = async (category, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  if (!category) {
    console.error("getProductsByCategory called without a category.");
    return Promise.reject(new Error("Category is required.")); // Prevent API call without category
  }
  try {
    // Use the proxied path '/offapi/' defined in vite.config.ts
    const response = await api.get(`/offapi/category/${category}.json?page=${page}&page_size=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category "${category}":`, error);
    // Re-throw the error after logging so React Query handles it
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
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    // Use the proxied path '/offapi/' defined in vite.config.ts
    const response = await api.get(`/offapi/cgi/search.pl?search_terms=${encodedSearchTerm}&json=true&page=${page}&page_size=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products by name:', error);
    throw error;
  }
};

/**
 * Get product by barcode
 * @param {string} barcode - Product barcode
 * @returns {Promise} - Promise with the response data
 */
export const getProductByBarcode = async (barcode) => {
  try {
    // Use the proxied path '/offapi/' defined in vite.config.ts
    const response = await api.get(`/offapi/api/v0/product/${barcode}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    throw error;
  }
};

/**
 * Get all available categories
 * @returns {Promise} - Promise with the response data
 */
export const getCategories = async () => {
  try {
    // Use the proxied path '/offapi/' defined in vite.config.ts
    const response = await api.get(`/offapi/categories.json`);
    // The categories endpoint returns an object with a 'tags' array
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export default {
  getProductsByCategory,
  searchProductsByName,
  getProductByBarcode,
  getCategories,
};