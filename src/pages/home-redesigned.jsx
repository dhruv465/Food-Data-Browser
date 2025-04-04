import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductsByCategory, getCategories, searchProductsByName } from '../lib/api/foodApi';
import PageLayout, { PageHeader, PageContent, PageSection, PageGrid } from '../components/ui/page-layout';
import Dashboard, { DashboardHeader, DashboardGrid, DashboardCard, QuickLink } from '../components/ui/dashboard';
import ProductGrid from '../components/product/product-grid';
import SearchBar from '../components/product/search-bar';
import CategorySelector from '../components/product/category-selector';
import ProductCardNew from '../components/product/product-card-new';

/**
 * HomeRedesigned component - Redesigned main landing page with dashboard layout
 * 
 * @returns {JSX.Element} - HomeRedesigned component
 */
const HomeRedesigned = () => {
  const [selectedCategory, setSelectedCategory] = useState('breakfast-cereals');
  const navigate = useNavigate();
  
  // Fetch categories from API
  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    isError: categoriesError 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    select: (data) => {
      // Transform API response to the format needed by CategorySelector
      if (data && data.tags) {
        return data.tags
          .filter(tag => tag.products > 100) // Only include categories with significant products
          .slice(0, 8) // Limit to 8 categories
          .map(tag => ({
            id: tag.id,
            name: tag.name.replace(/^en:/, '').split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
          }));
      }
      return [];
    },
    // Fallback to default categories if API fails
    onError: (error) => {
      console.error('Error fetching categories:', error);
    }
  });

  // Use default categories if API fails or while loading
  const popularCategories = categoriesData || [
    { id: 'breakfast-cereals', name: 'Breakfast Cereals' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'bread', name: 'Bread' },
    { id: 'chocolate', name: 'Chocolate' }
  ];

  // Fetch products for selected category
  const { 
    data: categoryProductsData, 
    isLoading: categoryProductsLoading,
    isError: categoryProductsError,
    error: categoryProductsErrorData
  } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => getProductsByCategory(selectedCategory, 1, 8),
    enabled: !!selectedCategory,
  });

  // Fetch featured products (using a search for organic products as an example)
  const { 
    data: featuredProductsData, 
    isLoading: featuredProductsLoading,
    isError: featuredProductsError
  } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => searchProductsByName('organic', 1, 4),
  });

  // Extract products from API response
  const categoryProducts = categoryProductsData?.products || [];
  const featuredProducts = featuredProductsData?.products || [];

  // Sample stats for dashboard - these could also be fetched from an API
  // but for now we'll keep them static as they're UI elements
  const dashboardStats = [
    {
      label: 'Total Products',
      value: '10,483',
      description: 'Products in database',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: 'Categories',
      value: '156',
      description: 'Food categories',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      label: 'Organic Products',
      value: '2,845',
      description: '27% of database',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: 'Vegan Products',
      value: '1,932',
      description: '18% of database',
      trend: 'up',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <PageLayout>
      {/* Dashboard Header with Stats */}
      <DashboardHeader
        title="Food Product Explorer"
        description="Discover detailed information about food products from around the world."
        stats={dashboardStats}
        action={
          <button 
            onClick={() => navigate('/search')} 
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            Advanced Search
          </button>
        }
      />
      
      {/* Search Bar */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search for any food product..."
          className="shadow-lg"
        />
      </div>
      
      {/* Quick Links */}
      <DashboardGrid columns={4}>
        <QuickLink
          title="Scan Barcode"
          description="Quickly look up products by scanning their barcode"
          to="/barcode"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zM13 12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2v1h1v-1h-1z" clipRule="evenodd" />
            </svg>
          }
        />
        <QuickLink
          title="Advanced Filters"
          description="Filter products by nutrition, ingredients, and more"
          to="/filter"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          }
        />
        <QuickLink
          title="Nutrition Guide"
          description="Learn about nutrition facts and dietary information"
          to="/nutrition"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          }
        />
        <QuickLink
          title="Compare Products"
          description="Side-by-side comparison of multiple food products"
          to="/compare"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
        />
      </DashboardGrid>
      
      {/* Featured Products */}
      <DashboardCard
        title="Featured Products"
        description="Highlighted products you might be interested in"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        }
        action={
          <button 
            onClick={() => navigate('/search?featured=true')} 
            className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          >
            View all
          </button>
        }
      >
        {featuredProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, index) => (
              <div key={`skeleton-${index}`} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="aspect-square w-full bg-muted animate-pulse rounded-md"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                  <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProductsError ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Failed to load featured products. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map(product => (
              <ProductCardNew key={product.id} product={product} />
            ))}
          </div>
        )}
      </DashboardCard>
      
      {/* Browse Categories */}
      <PageSection title="Browse Categories">
        <CategorySelector
          categories={popularCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          className="mb-6"
          isLoading={categoriesLoading}
        />
        
        <ProductGrid 
          products={categoryProducts} 
          loading={categoryProductsLoading} 
        />
        
        {categoryProductsError && (
          <div className="text-center py-4 mt-4">
            <p className="text-muted-foreground">
              {categoryProductsErrorData?.message || 'Failed to load products. Please try again later.'}
            </p>
          </div>
        )}
      </PageSection>
    </PageLayout>
  );
};

export default HomeRedesigned;