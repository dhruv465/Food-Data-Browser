/**
 * CORS Proxy utility for handling content blocker issues
 */

// Minimal headers for API requests
const API_HEADERS = {
  'Accept': 'application/json'
};

// Base URL for OpenFoodFacts API
const OPENFOODFACTS_BASE_URL = 'https://world.openfoodfacts.org';

/**
 * Fetches data with appropriate CORS handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The response data
 */
export const fetchWithCorsProxy = async (url, options = {}) => {
  // Prepare the URL
  const targetUrl = url.startsWith('http') ? url : 
                   url.startsWith('/offapi') ? url.replace('/offapi', OPENFOODFACTS_BASE_URL) : 
                   url;

  // First try with CORS enabled
  try {
    const corsResponse = await fetch(targetUrl, {
      ...options,
      mode: 'cors',
      headers: {
        ...options.headers,
        ...API_HEADERS
      }
    });

    if (corsResponse.ok) {
      return await corsResponse.json();
    }
  } catch (corsError) {
    console.log('CORS request failed, falling back to no-cors');
  }

  // Fall back to no-cors if CORS fails
  try {
    const response = await fetch(targetUrl, {
      ...options,
      mode: 'no-cors',
      headers: {
        ...options.headers,
        ...API_HEADERS
      },
      credentials: 'omit'
    });

    // Handle opaque responses
    if (response.type === 'opaque') {
      // Use a CORS proxy as last resort
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${targetUrl}`;
      const proxyResponse = await fetch(proxyUrl, {
        headers: API_HEADERS
      });
      
      if (!proxyResponse.ok) {
        throw new Error(`Proxy request failed: ${proxyResponse.status}`);
      }
      return await proxyResponse.json();
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
};

/**
 * Checks if the current environment is likely to have content blockers
 * @returns {boolean} - True if content blockers are likely active
 */
export const isContentBlockerEnvironment = () => {
  return import.meta.env.MODE === 'production';
};

/**
 * Determines the best API base URL to use based on environment
 * @returns {string} - The API base URL
 */
export const getApiBaseUrl = () => {
  return import.meta.env.MODE === 'development' 
    ? '/offapi' 
    : OPENFOODFACTS_BASE_URL;
};
