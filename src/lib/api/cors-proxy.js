/**
 * CORS Proxy utility for handling content blocker issues
 * Provides fallback mechanisms for API requests when deployed on Vercel
 */

// Our dedicated serverless proxy endpoint
const OUR_PROXY_ENDPOINT = '/api/food';

// List of potential CORS proxies to try if direct requests fail (as fallbacks)
const CORS_PROXIES = [
  'https://cors.sh/?', // Primary CORS proxy with API key
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url='
];

// Headers for cors.sh API
const CORS_SH_HEADERS = {
  'x-cors-api-key': 'temp_648291871f51611ccc30183a96ea2071', // Replace with your actual API key
};

// Base URL for OpenFoodFacts API
const OPENFOODFACTS_BASE_URL = 'https://world.openfoodfacts.org';

// Flag to determine if we should use cors.sh as primary proxy
const USE_CORS_SH = true;

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
  // Ensure we have proper fetch options with CORS mode
  const fetchOptions = {
    ...options,
    mode: 'cors',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  // First try our dedicated serverless proxy in production
  let useOurProxy = process.env.NODE_ENV === 'production';
  // Fallback to public CORS proxies if our proxy fails
  let proxyIndex = -1;
  let currentUrl = url;
  let attempts = 0;
  const maxAttempts = CORS_PROXIES.length + 2; // +1 for our proxy, +1 for direct request
  
  // If we're using our proxy, prepare the URL
  if (useOurProxy) {
    // Extract the path from the URL
    let path = '';
    
    if (url.startsWith('http')) {
      // For absolute URLs, extract the path after the domain
      const urlObj = new URL(url);
      path = urlObj.pathname + urlObj.search;
    } else if (url.startsWith('/offapi')) {
      // For /offapi URLs, extract the path after /offapi
      path = url.replace('/offapi', '');
    } else {
      // For other URLs, use as is
      path = url;
    }
    
    // Remove leading slash if present
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    
    // Use our serverless proxy
    currentUrl = `${OUR_PROXY_ENDPOINT}/${path}`;
  }
  
  while (attempts < maxAttempts) {
    try {
      if (useOurProxy) {
        console.log(`Attempting fetch with our serverless proxy`);
      } else if (proxyIndex >= 0) {
        console.log(`Attempting fetch with public proxy ${proxyIndex + 1}`);
      } else {
        console.log(`Attempting direct fetch`);
      }
      
      const response = await fetch(currentUrl, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Fetch attempt ${attempts + 1}/${maxAttempts} failed:`, error.message);
      attempts++;
      
      // If we were using our proxy, switch to public proxies
      if (useOurProxy) {
        useOurProxy = false;
        proxyIndex = 0;
        
        // Prepare URL for public proxy
        const targetUrl = url.startsWith('http') ? url : 
                         url.startsWith('/offapi') ? url.replace('/offapi', OPENFOODFACTS_BASE_URL) : 
                         url;
        
        currentUrl = createProxiedUrl(targetUrl, proxyIndex);
      } else {
        // Move to next public proxy
        proxyIndex++;
        
        // Try the next proxy
        if (proxyIndex < CORS_PROXIES.length) {
          // Prepare URL for public proxy
          const targetUrl = url.startsWith('http') ? url : 
                           url.startsWith('/offapi') ? url.replace('/offapi', OPENFOODFACTS_BASE_URL) : 
                           url;
          
          currentUrl = createProxiedUrl(targetUrl, proxyIndex);
        } else {
          // We've tried all proxies, throw the error
          throw error;
        }
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
  
  // Always use our dedicated proxy in production to avoid CORS issues
  // This is especially important for Vercel deployments
  return isProduction;
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
  
  // In production, use our dedicated serverless proxy
  // This ensures we avoid CORS issues completely
  return '/api/food';
};