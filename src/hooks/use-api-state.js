import { useEffect } from 'react';
import { useToast } from './use-toast';
import { ERROR_MESSAGES } from '../lib/api-config';

/**
 * Custom hook to manage API loading and error states
 * @param {boolean} isLoading - Loading state from React Query
 * @param {boolean} isError - Error state from React Query
 * @param {object} error - Error object from React Query
 * @param {boolean} showToast - Whether to show error toast notifications
 */
export function useApiState({
  isLoading,
  isError,
  error,
  showToast = true,
}) {
  const { toast } = useToast();

  useEffect(() => {
    if (isError && showToast) {
      toast({
        title: 'Error',
        description: error?.message || ERROR_MESSAGES.GENERAL_ERROR,
        variant: 'destructive',
      });
    }
  }, [isError, error, showToast, toast]);

  return {
    isLoading,
    isError,
    error,
  };
}