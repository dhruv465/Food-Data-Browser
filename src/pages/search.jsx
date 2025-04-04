import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchProductsByName } from '../lib/api/foodApi';
import ProductCard from '../components/product/product-card';
import ProductSkeleton from '../components/product/product-skeleton';
import GlassContainer from '../components/ui/glass-container';
import GlassCard from '../components/ui/glass-card';

/**
 * SearchPage component - Page for searching products
 * 
 * @returns {JSX.Element} - SearchPage component
 */
const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const PAGE_SIZE = 24;

  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page on new search
      setAllProducts([]); // Clear previous results on new search
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch products using React Query
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['search', debouncedSearchTerm, page],
    queryFn: () => searchProductsByName(debouncedSearchTerm, page, PAGE_SIZE),
    enabled: debouncedSearchTerm.length > 2, // Only search when term is at least 3 characters
    keepPreviousData: true,
  });

  // Update allProducts when new data is fetched
  useEffect(() => {
    if (data?.products) {
      if (page === 1) {
        setAllProducts(data.products);
      } else {
        setAllProducts(prev => [...prev, ...data.products]);
      }
    }
  }, [data, page]);

  // Handle load more button click
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(8).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="w-full">
        <ProductSkeleton />
      </div>
    ));
  };

  // Check if there are more products to load
  const hasMore = data?.page && data?.page_count 
    ? data.page < data.page_count 
    : false;

  return (
    <div className="space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Search Food Products
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Search for any food product by name to discover detailed nutritional information.
        </p>
      </section>
      
      <GlassContainer className="p-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for food products..."
              className="w-full p-4 pr-12 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
          
          {debouncedSearchTerm && debouncedSearchTerm.length < 3 && (
            <p className="mt-2 text-sm text-gray-500">
              Please enter at least 3 characters to search
            </p>
          )}
        </div>
      </GlassContainer>
      
      {debouncedSearchTerm.length > 2 && (
        <GlassContainer className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {isLoading ? 'Searching...' : `Results for "${debouncedSearchTerm}"`}
          </h2>
          
          {isError && (
            <div className="text-red-500 text-center mb-4">
              Error: {error?.message || 'Failed to load search results'}
            </div>
          )}
          
          {!isLoading && !isError && allProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No products found for "{debouncedSearchTerm}"</p>
              <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map(product => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
            
            {(isLoading || isFetching) && renderSkeletons()}
          </div>
          
          {!isLoading && !isError && hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isFetching}
                className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
              >
                {isFetching ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </GlassContainer>
      )}
    </div>
  );
};

export default SearchPage;
