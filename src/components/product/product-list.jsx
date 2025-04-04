import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByCategory } from '../../lib/api/foodApi';
import ProductCard from './product-card';
import ProductSkeleton from './product-skeleton';
import GlassContainer from '../ui/glass-container';

/**
 * ProductList component to display a list of food products
 * 
 * @param {Object} props - Component props
 * @param {string} props.category - Category to filter products by
 * @returns {JSX.Element} - ProductList component
 */
const ProductList = ({ category = 'breakfast-cereals' }) => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const PAGE_SIZE = 24;

  // Fetch products using React Query
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['products', category, page],
    queryFn: () => getProductsByCategory(category, page, PAGE_SIZE),
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
    <GlassContainer className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Explore Food Products
      </h2>
      
      {isError && (
        <div className="text-red-500 text-center mb-4">
          Error: {error?.message || 'Failed to load products'}
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
  );
};

export default ProductList;
