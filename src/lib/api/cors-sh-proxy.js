/**
 * CORS.sh Proxy utility for handling CORS issues
 * This file provides a dedicated implementation for using cors.sh as a CORS proxy
 */

// CORS.sh proxy URL with API key
// The API key should be provided by the user
const CORS_SH_PROXY = 'https://cors.sh/?';

// Headers required for cors.sh
const CORS_SH_HEADERS = {
  'x-cors-api-key': 'YOUR_API_KEY_HERE', // Replace with your actual API key
};

/**
 * Fetches data through the cors.sh proxy
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The response data
 */
export const fetchWithCorsShProxy = async (url, options = {}) => {
  // Ensure we have proper fetch options
  const fetchOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...CORS_SH_HEADERS,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  try {
    console.log(`Fetching with cors.sh proxy: ${url}`);
    
    // Construct the proxied URL
    const proxiedUrl = `${CORS_SH_PROXY}${url}`;
    
    const response = await fetch(proxiedUrl, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Cors.sh proxy fetch failed:', error.message);
    throw error;
  }
};