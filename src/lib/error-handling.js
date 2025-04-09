/**
 * Error handling utilities for the application
 * Provides fallback mechanisms when error tracking is blocked by content blockers
 */

/**
 * Initialize error handling with fallbacks for when monitoring services are blocked
 * This helps ensure the application continues to function even when services like Sentry are blocked
 */
export function initializeErrorHandling() {
  // Override the global error handler to ensure errors don't break the app
  // when monitoring services like Sentry are blocked
  const originalOnError = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    // Log to console as a fallback when external services are blocked
    console.error('Error caught by fallback handler:', { message, error });
    
    // Continue with any existing error handlers
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error);
    }
    
    // Return true to prevent the default browser error handling
    return true;
  };
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection caught by fallback handler:', event.reason);
  });
  
  // Handle potential content blocker issues with fetch/XHR
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      const response = await originalFetch(...args);
      return response;
    } catch (error) {
      // Log fetch errors that might be related to content blockers
      console.error('Fetch error caught by fallback handler:', error);
      throw error; // Re-throw to maintain original behavior
    }
  };
}

/**
 * Safely execute a function with error handling
 * @param {Function} fn - Function to execute
 * @param {any} fallbackValue - Value to return if function throws
 * @returns {any} - Result of function or fallback value
 */
export function safeExecute(fn, fallbackValue = null) {
  try {
    return fn();
  } catch (error) {
    console.error('Error caught by safeExecute:', error);
    return fallbackValue;
  }
}

/**
 * Create a wrapped version of fetch that handles errors gracefully
 * @returns {Function} - Wrapped fetch function
 */
export function createSafeFetch() {
  return async function safeFetch(...args) {
    try {
      const response = await fetch(...args);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error('Safe fetch error:', error);
      // Return a mock response that won't break the app
      return {
        ok: false,
        status: 0,
        statusText: 'Failed to fetch (possibly blocked by content blocker)',
        json: async () => ({}),
        text: async () => '',
      };
    }
  };
}