import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid, { ProductCardSkeleton } from '../components/product/product-grid';
import PageLayout, { PageSection } from '../components/ui/page-layout';
import { searchProductsByName } from '../lib/api/foodApi';

const HomeRedesigned = () => {
  const navigate = useNavigate();
  const pageSize = 20;
  
  const { 
    data: productsData, 
    isLoading: productsLoading,
    isError: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['allProducts'],
    queryFn: ({ pageParam = 1 }) => searchProductsByName('', pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.products || lastPage.products.length < pageSize) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });


  const allProducts = productsData?.pages.flatMap(page => page.products) || [];
  const featuredProducts = [];

  return (
    <PageLayout>
      {/* ... (previous header, search bar, and quick links sections remain unchanged) ... */}

      {/* All Products Section */}
      <PageSection title="All Products">
        <ProductGrid 
          products={allProducts} 
          loading={productsLoading} 
        />
        
        {productsError && (
          <div className="text-center py-4 mt-4">
            <p className="text-muted-foreground">
              Failed to load products. Please try again later.
            </p>
          </div>
        )}
        
        {isFetchingNextPage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, index) => (
              
              <ProductCardSkeleton key={`skeleton-${index}`} className='mt-7'/>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          {hasNextPage && (
            <button 
              onClick={() => fetchNextPage()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={isFetchingNextPage}
            >
              Load More
            </button>
          )}
        </div>
      </PageSection>
    </PageLayout>
  );
};

export default HomeRedesigned;
