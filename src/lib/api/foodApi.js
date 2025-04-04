import axios from 'axios';
import { ERROR_MESSAGES, DEFAULT_PAGE_SIZE } from '../api-config';

// Base URL for the OpenFoodFacts API
const BASE_URL = 'https://world.openfoodfacts.org';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You could add additional headers or auth tokens here if needed
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
      if (error.response.status === 404) {
        error.message = ERROR_MESSAGES.NOT_FOUND;
      } else if (error.response.status >= 500) {
        error.message = ERROR_MESSAGES.SERVER_ERROR;
      }
    } else if (error.request) {
      // The request was made but no response was received
      error.message = ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      // Something happened in setting up the request
      error.message = ERROR_MESSAGES.GENERAL_ERROR;
    }
    return Promise.reject(error);
  }
);

/**
 * Get products by category
 * @param {string} category - Category name
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Number of items per page
 * @returns {Promise} - Promise with the response data
 */
export const getProductsByCategory = async (category, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  try {
    const response = await api.get(`/category/${category}.json?page=${page}&page_size=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
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
    const response = await api.get(`/cgi/search.pl?search_terms=${encodedSearchTerm}&json=true&page=${page}&page_size=${pageSize}`);
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
    const response = await api.get(`/api/v0/product/${barcode}.json`);
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
    const response = await api.get('/categories.json');
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
