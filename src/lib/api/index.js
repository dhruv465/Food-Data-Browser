import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE, ERROR_MESSAGES } from '../api-config';

const API_BASE_URL = 'https://world.openfoodfacts.org/';

// Helper function to handle API errors
const handleApiError = (error) => {
  // Check if the error might be related to content blockers
  const isContentBlockerError = 
    error.message?.includes('ERR_BLOCKED_BY_CONTENT_BLOCKER') ||
    error.message?.includes('content blocker') ||
    error.message?.includes('sentry.io');
  
  if (isContentBlockerError) {
    console.warn('Content blocker detected. This may affect error reporting but API calls should continue.');
    // For content blocker errors, log but don't throw to prevent breaking the app
    return { error: ERROR_MESSAGES.GENERAL_ERROR };
  }
  
  if (!navigator.onLine) {
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
  if (error.response) {
    const status = error.response.status;
    if (status === 404) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }
    if (status >= 500) {
      throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    }
  }
  throw new Error(ERROR_MESSAGES.GENERAL_ERROR);
};

// Fetch product by ID
export function useProduct(productId) {
  return useQuery(
    ['product', productId],
    async () => {
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.product;
      } catch (error) {
        // If aborted due to timeout
        if (error.name === 'AbortError') {
          console.error('Request timed out');
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }
        
        const result = handleApiError(error);
        // If handleApiError returns a result instead of throwing (for content blocker errors)
        if (result) return {};
        
        // This will only execute if handleApiError didn't throw or return
        throw error;
      }
    },
    {
      enabled: !!productId,
      suspense: true,
      retry: 2,
      retryDelay: 1000,
    }
  );
}

// Search products with infinite loading
export function useProductSearch(searchQuery) {
  return useInfiniteQuery(
    ['products', searchQuery],
    async ({ pageParam = 1 }) => {
      try {
        const params = new URLSearchParams({
          search_terms: searchQuery,
          page_size: DEFAULT_PAGE_SIZE,
          page: pageParam,
        });

        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_BASE_URL}/search?${params}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        // If aborted due to timeout
        if (error.name === 'AbortError') {
          console.error('Request timed out');
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }
        
        const result = handleApiError(error);
        // If handleApiError returns a result instead of throwing (for content blocker errors)
        if (result) return { products: [], count: 0, page: pageParam, page_count: 1 };
        
        // This will only execute if handleApiError didn't throw or return
        throw error;
      }
    },
    {
      enabled: !!searchQuery,
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage.page;
        const totalPages = Math.ceil(lastPage.count / DEFAULT_PAGE_SIZE);
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      suspense: true,
      retry: 2,
      retryDelay: 1000,
    }
  );
}

// Fetch product by barcode
export function useProductByBarcode(barcode) {
  return useQuery(
    ['product', 'barcode', barcode],
    async () => {
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${API_BASE_URL}/product/${barcode}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.product;
      } catch (error) {
        // If aborted due to timeout
        if (error.name === 'AbortError') {
          console.error('Request timed out');
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }
        
        const result = handleApiError(error);
        // If handleApiError returns a result instead of throwing (for content blocker errors)
        if (result) return {};
        
        // This will only execute if handleApiError didn't throw or return
        throw error;
      }
    },
    {
      enabled: !!barcode,
      suspense: true,
      retry: 2,
      retryDelay: 1000,
    }
  );
}