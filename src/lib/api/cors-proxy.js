/**
 * CORS Proxy utility for handling content blocker issues
 * Provides fallback mechanisms for API requests when deployed on Vercel
 */

// List of potential CORS proxies to try if direct requests fail
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url='
];

// Base URL for OpenFoodFacts API
const OPENFOODFACTS_BASE_URL = 'https://world.openfoodfacts.org';

/**
 * Creates a URL with a CORS proxy
 * @param {string} url - The original URL to proxy
 * @param {number} proxyIndex - Index of the proxy to use (defaults to first one)
 * @returns {string} - The proxied URL
 */
export const createProxiedUrl = (url, proxyIndex = 0) => {
  // If we've tried all proxies, return the original URL as a last resort
  if (proxyIndex >= CORS_PROXIES.length) {
    console.warn('All CORS proxies failed, attempting direct request');
    return url;
  }
  
  // For the allorigins proxy, we need to encode the URL
  if (CORS_PROXIES[proxyIndex].includes('allorigins')) {
    return `${CORS_PROXIES[proxyIndex]}${encodeURIComponent(url)}`;
  }
  
  // For other proxies, just concatenate
  return `${CORS_PROXIES[proxyIndex]}${url}`;
};

/**
 * Fetches data with automatic CORS proxy fallback
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The response data
 */
export const fetchWithCorsProxy = async (url, options = {}) => {
  // First try the original URL (which might be using Vercel rewrites)
  let currentUrl = url;
  let proxyIndex = -1; // Start with no proxy
  let attempts = 0;
  const maxAttempts = CORS_PROXIES.length + 1; // +1 for the original URL
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Attempting fetch with ${proxyIndex >= 0 ? 'proxy ' + (proxyIndex + 1) : 'no proxy'}`);
      const response = await fetch(currentUrl, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Fetch attempt ${attempts + 1}/${maxAttempts} failed:`, error.message);
      attempts++;
      proxyIndex++;
      
      // Try the next proxy
      if (proxyIndex < CORS_PROXIES.length) {
        // If the URL is already absolute, use it directly
        const targetUrl = url.startsWith('http') ? url : 
                         // If it's a relative URL starting with /offapi, replace with the actual base URL
                         url.startsWith('/offapi') ? url.replace('/offapi', OPENFOODFACTS_BASE_URL) : 
                         // Otherwise, just use the URL as is
                         url;
        
        currentUrl = createProxiedUrl(targetUrl, proxyIndex);
      } else {
        // We've tried all proxies, throw the error
        throw error;
      }
    }
  }
  
  throw new Error('All fetch attempts failed');
};

/**
 * Checks if the current environment is likely to have content blockers
 * @returns {boolean} - True if content blockers are likely active
 */
export const isContentBlockerEnvironment = () => {
  // Check if we're in production (Vercel deployment)
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // In the future, we could add more sophisticated detection
  return isProduction && isBrowser;
};

/**
 * Determines the best API base URL to use based on environment
 * @returns {string} - The API base URL
 */
export const getApiBaseUrl = () => {
  // In development, use the Vite proxy
  if (process.env.NODE_ENV === 'development') {
    return '/offapi';
  }
  
  // In production, use the actual API URL
  return OPENFOODFACTS_BASE_URL;
};