/**
 * CORS Proxy utility for handling content blocker issues
 * Exclusively uses cors.sh as the CORS proxy
 */

// CORS.sh proxy URL
const CORS_SH_PROXY = 'https://cors.sh/?';

// Headers for cors.sh API
const CORS_SH_HEADERS = {
  'x-cors-api-key': import.meta.env.VITE_CORS_SH_API_KEY || '', // Use env variable
};

// Base URL for OpenFoodFacts API
const OPENFOODFACTS_BASE_URL = 'https://world.openfoodfacts.org';

/**
 * Creates a URL with the cors.sh proxy
 * @param {string} url - The original URL to proxy
 * @returns {string} - The proxied URL
 */
export const createProxiedUrl = (url) => {
  return `${CORS_SH_PROXY}${url}`;
};

/**
 * Fetches data using the cors.sh proxy
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The response data
 */
export const fetchWithCorsProxy = async (url, options = {}) => {
  // Ensure we have proper fetch options with CORS mode
  const fetchOptions = {
    ...options,
    mode: 'cors',
    headers: {
      ...options.headers,
      ...CORS_SH_HEADERS,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  // Prepare the URL for the proxy
  const targetUrl = url.startsWith('http') ? url : 
                   url.startsWith('/offapi') ? url.replace('/offapi', OPENFOODFACTS_BASE_URL) : 
                   url;
  
  // Create the proxied URL
  const proxiedUrl = createProxiedUrl(targetUrl);
  
  try {
    const response = await fetch(proxiedUrl, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch with cors.sh proxy failed:', error.message);
    throw error;
  }
};

/**
 * Checks if the current environment is likely to have content blockers
 * @returns {boolean} - True if content blockers are likely active
 */
export const isContentBlockerEnvironment = () => {
  // Check if we're in production (Vercel deployment)
  const isProduction = import.meta.env.MODE === 'production';
  
  // Always use our CORS proxy in production to avoid CORS issues
  return isProduction;
};

/**
 * Determines the best API base URL to use based on environment
 * @returns {string} - The API base URL
 */
export const getApiBaseUrl = () => {
  // In development, use the Vite proxy
  if (import.meta.env.MODE === 'development') {
    return '/offapi';
  }
  
  // In production, use the OpenFoodFacts API directly (with cors.sh proxy)
  return OPENFOODFACTS_BASE_URL;
};
