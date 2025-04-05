import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByCategory } from '../../lib/api/foodApi';
import ProductCard from './product-card';
import { Button } from '../ui/button';

/**
 * ProductListNew component - Redesigned product list with modern styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.category - Category to filter products by
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - ProductListNew component
 */
const ProductListNew = ({ category = 'breakfast-cereals', className }) => {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const PAGE_SIZE = 24;

  // Fetch products using React Query
  const { data, isLoading, isError, error, isFetching, isPreviousData } = useQuery({
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
      <div key={`skeleton-${index}`} className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="aspect-square w-full bg-muted animate-pulse rounded-md"></div>
        <div className="mt-3 space-y-2">
          <div className="h-2 w-16 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
          <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    ));
  };

  // Handle error state
  if (isError && !allProducts.length) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Error loading products</h3>
        <p className="text-muted-foreground mb-4">{error?.message || 'Failed to load products. Please try again.'}</p>
        <Button onClick={() => setPage(1)} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Render products */}
        {allProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {/* Render skeletons while loading */}
        {(isLoading || (isFetching && isPreviousData)) && !allProducts.length && renderSkeletons()}
      </div>

      {/* Load more button */}
      {data?.products?.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={isFetching || !data?.products?.length}
            variant="outline"
            className="min-w-[150px]"
          >
            {isFetching ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* No products found */}
      {!isLoading && !isFetching && allProducts.length === 0 && (
        <div className="rounded-lg border bg-card p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try selecting a different category or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default ProductListNew;