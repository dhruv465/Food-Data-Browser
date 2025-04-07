import axios from 'axios';
import { ERROR_MESSAGES, DEFAULT_PAGE_SIZE, DEFAULT_RETRY_COUNT } from '../api-config';
// Removed mock data imports as we no longer want to use fallback mock data

// Create axios instance
// BaseURL is not set here, as we use relative paths for the proxy
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
    await api.get('/offapi/categories.json', { timeout: 5000 });
    return true;
  } catch (error) {
    console.error('API availability check failed:', error.message);
    return false;
  }
};

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
 * @param {string|string[]} category - Category name or array of category names
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
    // Check if API is available
    const apiAvailable = await checkApiAvailability();
    
    if (!apiAvailable) {
      // If API is not available, throw an error instead of using mock data
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    // Try to get data from API with retry mechanism
    const apiCallFn = async () => {
      // Handle single category or multiple categories
      if (Array.isArray(category)) {
        // If multiple categories, use the first one for now
        // In a real implementation, we would use a more sophisticated approach
        // like combining results from multiple API calls or using a more advanced API endpoint
        if (category.length === 0) {
          return { products: [], count: 0, page: 1, page_count: 1 };
        }
        const response = await api.get(`/offapi/category/${category[0]}.json?page=${page}&page_size=${pageSize}`);
        return response.data;
      } else {
        // Single category (original behavior)
        const response = await api.get(`/offapi/category/${category}.json?page=${page}&page_size=${pageSize}`);
        return response.data;
      }
    };
    return await retryApiCall(apiCallFn, [], DEFAULT_RETRY_COUNT);
  } catch (error) {
    console.error(`Error in getProductsByCategory:`, error);
    // Propagate the error to the UI instead of returning mock data
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
    // Check if API is available
    const apiAvailable = await checkApiAvailability();
    
    if (!apiAvailable) {
      // If API is not available, throw an error instead of using mock data
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    // Try to get data from API with retry mechanism
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const apiCallFn = async () => {
      const response = await api.get(`/offapi/cgi/search.pl?search_terms=${encodedSearchTerm}&json=true&page=${page}&page_size=${pageSize}`);
      return response.data;
    };
    return await retryApiCall(apiCallFn, [], DEFAULT_RETRY_COUNT);
  } catch (error) {
    console.error(`Error in searchProductsByName for "${searchTerm}":`, error);
    // Propagate the error to the UI instead of returning mock data
    throw error;
  }
};

/**
 * Get categories
 * @returns {Promise} - Promise with the response data
 */
export const getCategories = async () => {
  try {
    // Check if API is available
    const apiAvailable = await checkApiAvailability();
    
    if (!apiAvailable) {
      // If API is not available, throw an error instead of using mock data
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    // Try to get data from API with retry mechanism
    const apiCallFn = async () => {
      const response = await api.get('/offapi/categories.json');
      return response.data;
    };
    return await retryApiCall(apiCallFn, [], DEFAULT_RETRY_COUNT);
  } catch (error) {
    console.error('Error in getCategories:', error);
    // Propagate the error to the UI instead of returning mock data
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
    return Promise.reject(new Error("Barcode is required.")); // Prevent API call without barcode
  }
  
  try {
    // Check if API is available
    const apiAvailable = await checkApiAvailability();
    
    if (!apiAvailable) {
      // If API is not available, throw an error instead of using mock data
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    // Try to get data from API with retry mechanism
    const apiCallFn = async () => {
      const response = await api.get(`/offapi/api/v0/product/${barcode}.json`);
      return response.data;
    };
    return await retryApiCall(apiCallFn, [], DEFAULT_RETRY_COUNT);
  } catch (error) {
    console.error(`Error in getProductByBarcode for "${barcode}":`, error);
    // Propagate the error to the UI instead of returning mock data
    throw error;
  }
};

/**
 * Get products with advanced filtering
 * @param {Object} filters - Filter options
 * @param {string[]} filters.categories - Array of category IDs
 * @param {Object} filters.nutrition - Nutrition filters
 * @param {string} filters.sortBy - Sort option
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Number of items per page
 * @returns {Promise} - Promise with the response data
 */
export const getProductsWithFilters = async (filters = {}, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  const { categories = [], nutrition = {}, sortBy = 'name-asc' } = filters;
  
  try {
    // For now, we'll use the existing getProductsByCategory function
    // In a real implementation, we would use a more sophisticated approach
    // that directly applies all filters at the API level
    
    // Get products by categories
    let productsData;
    if (categories.length > 0) {
      productsData = await getProductsByCategory(categories, page, pageSize);
    } else {
      return { products: [], count: 0, page: 1, page_count: 1 };
    }
    
    // The filtering by nutrition values and sorting will be done client-side
    // In a real implementation, these would be handled by the API
    
    return productsData;
  } catch (error) {
    console.error('Error in getProductsWithFilters:', error);
    throw error;
  }
};

export default {
  getProductsByCategory,
  searchProductsByName,
  getProductByBarcode,
  getCategories,
  getProductsWithFilters,
};