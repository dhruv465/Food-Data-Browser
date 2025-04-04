import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductByBarcode } from '../../lib/api/foodApi';
import GlassCard from '../ui/glass-card';

/**
 * BarcodeSearch component for searching products by barcode
 * 
 * @returns {JSX.Element} - BarcodeSearch component
 */
const BarcodeSearch = () => {
  const [barcode, setBarcode] = useState('');
  const [searchInitiated, setSearchInitiated] = useState(false);
  const navigate = useNavigate();

  // Validate barcode format (basic validation)
  const isValidBarcode = (code) => {
    // Most barcodes are numeric and between 8-14 digits
    return /^\d{8,14}$/.test(code);
  };

  // Fetch product by barcode using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['barcode', barcode],
    queryFn: () => getProductByBarcode(barcode),
    enabled: searchInitiated && isValidBarcode(barcode),
    onSuccess: (data) => {
      if (data?.status === 1 && data?.product?.id) {
        navigate(`/product/${data.product.id}`);
      }
    },
  });

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (barcode.trim()) {
      setSearchInitiated(true);
    }
  };

  // Reset search state
  const handleReset = () => {
    setBarcode('');
    setSearchInitiated(false);
  };

  // Determine error message
  const getErrorMessage = () => {
    if (!isValidBarcode(barcode)) {
      return 'Please enter a valid barcode (8-14 digits)';
    }
    if (data?.status === 0) {
      return `Product with barcode ${barcode} not found`;
    }
    return error?.message || 'An error occurred while searching';
  };

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-bold mb-4">Search by Barcode</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Enter Product Barcode
          </label>
          <div className="relative">
            <input
              id="barcode"
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="e.g., 737628064502"
              className="w-full p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {searchInitiated && !isValidBarcode(barcode) && (
            <p className="mt-1 text-sm text-red-500">
              Please enter a valid barcode (8-14 digits)
            </p>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
      
      {searchInitiated && isError && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
          {getErrorMessage()}
        </div>
      )}
      
      {searchInitiated && data?.status === 0 && (
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg">
          Product with barcode {barcode} not found
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Try example barcodes:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>737628064502 (Peanut Butter)</li>
          <li>3017620422003 (Nutella)</li>
          <li>5449000000996 (Coca-Cola)</li>
        </ul>
      </div>
    </GlassCard>
  );
};

export default BarcodeSearch;
