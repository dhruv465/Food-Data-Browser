import { useEffect } from 'react';
import { ERROR_MESSAGES } from '../lib/api-config';

/**
 * Custom hook to manage API loading and error states
 * @param {boolean} isLoading - Loading state from React Query
 * @param {boolean} isError - Error state from React Query
 * @param {object} error - Error object from React Query
 */
export function useApiState({ isLoading, isError, error }) {
  useEffect(() => {
    if (isError) {
      console.error(error?.message || ERROR_MESSAGES.GENERAL_ERROR);
    }
  }, [isError, error]);

  return {
    isLoading,
    isError,
    error,
  };
}
