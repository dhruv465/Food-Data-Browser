import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE, ERROR_MESSAGES } from '../api-config';
import { fetchWithCorsProxy, isContentBlockerEnvironment, getApiBaseUrl } from './cors-proxy';

// Use appropriate API base URL based on environment
// Use appropriate API base URL based on environment
const API_BASE_URL = getApiBaseUrl() + '/api/v2';

// Helper function to handle API errors
const handleApiError = (error) => {
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
        let data;
        if (isContentBlockerEnvironment()) {
          // Use CORS proxy in environments likely to have content blockers
          data = await fetchWithCorsProxy(`${API_BASE_URL}/product/${productId}`);
        } else {
          // Use regular fetch in development or when content blockers are unlikely
          const response = await fetch(`${API_BASE_URL}/product/${productId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          data = await response.json();
        }
        return data.product;
      } catch (error) {
        handleApiError(error);
      }
    },
    {
      enabled: !!productId,
      suspense: true,
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

        if (isContentBlockerEnvironment()) {
          // Use CORS proxy in environments likely to have content blockers
          return await fetchWithCorsProxy(`${API_BASE_URL}/search?${params}`);
        } else {
          // Use regular fetch in development or when content blockers are unlikely
          const response = await fetch(`${API_BASE_URL}/search?${params}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        }
      } catch (error) {
        handleApiError(error);
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
    }
  );
}

// Fetch product by barcode
export function useProductByBarcode(barcode) {
  return useQuery(
    ['product', 'barcode', barcode],
    async () => {
      try {
        let data;
        if (isContentBlockerEnvironment()) {
          // Use CORS proxy in environments likely to have content blockers
          data = await fetchWithCorsProxy(`${API_BASE_URL}/product/${barcode}`);
        } else {
          // Use regular fetch in development or when content blockers are unlikely
          const response = await fetch(`${API_BASE_URL}/product/${barcode}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          data = await response.json();
        }
        return data.product;
      } catch (error) {
        handleApiError(error);
      }
    },
    {
      enabled: !!barcode,
      suspense: true,
    }
  );
}