import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getProductsByCategory } from '../../lib/api/foodApi';
import ProductCard from './product-card';
import ProductSkeleton from './product-skeleton';
import GlassContainer from '../ui/glass-container';
import MultiSelect from '../ui/multi-select';
import RangeSlider from '../ui/range-slider';
import SortSelect from '../ui/sort-select';

/**
 * FilterableProductList component to display a list of food products with filtering and sorting
 * 
 * @returns {JSX.Element} - FilterableProductList component
 */
const FilterableProductList = () => {
  // State for filters and sorting
  const [selectedCategories, setSelectedCategories] = useState(['breakfast-cereals']);
  const [maxSugar, setMaxSugar] = useState(100);
  const [maxFat, setMaxFat] = useState(100);
  const [sortOption, setSortOption] = useState('name-asc');

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Format categories for MultiSelect
  const categoryOptions = categoriesData?.tags
    ? categoriesData.tags
        .slice(0, 20) // Limit to first 20 categories for simplicity
        .map(tag => ({
          value: tag.id,
          label: tag.name,
        }))
    : [
        { value: 'breakfast-cereals', label: 'Breakfast Cereals' },
        { value: 'dairy', label: 'Dairy' },
        { value: 'snacks', label: 'Snacks' },
        { value: 'beverages', label: 'Beverages' },
        { value: 'fruits', label: 'Fruits' },
      ];

  // Sorting options
  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'grade-asc', label: 'Nutrition Grade (Best first)' },
    { value: 'grade-desc', label: 'Nutrition Grade (Worst first)' },
    { value: 'calories-asc', label: 'Calories (Lowest first)' },
    { value: 'calories-desc', label: 'Calories (Highest first)' },
  ];

  // Fetch products using React Query
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['products', selectedCategories, page],
    queryFn: () => {
      // Use first category for API call (API limitation)
      const category = selectedCategories[0] || 'breakfast-cereals';
      return getProductsByCategory(category, page, PAGE_SIZE);
    },
    enabled: selectedCategories.length > 0,
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

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [selectedCategories, sortOption]);

  // Filter products by nutritional values
  const filteredProducts = allProducts.filter(product => {
    const nutriments = product.nutriments || {};
    
    // Filter by sugar content
    if (maxSugar < 100 && nutriments.sugars > maxSugar) {
      return false;
    }
    
    // Filter by fat content
    if (maxFat < 100 && nutriments.fat > maxFat) {
      return false;
    }
    
    // Filter by selected categories (if more than one)
    if (selectedCategories.length > 1) {
      const productCategories = product.categories_tags || [];
      return selectedCategories.some(category => 
        productCategories.includes(category) || 
        productCategories.includes(`en:${category}`)
      );
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return (a.product_name || '').localeCompare(b.product_name || '');
      case 'name-desc':
        return (b.product_name || '').localeCompare(a.product_name || '');
      case 'grade-asc':
        return (a.nutrition_grades || 'z').localeCompare(b.nutrition_grades || 'z');
      case 'grade-desc':
        return (b.nutrition_grades || 'z').localeCompare(a.nutrition_grades || 'z');
      case 'calories-asc':
        return (a.nutriments?.energy || 0) - (b.nutriments?.energy || 0);
      case 'calories-desc':
        return (b.nutriments?.energy || 0) - (a.nutriments?.energy || 0);
      default:
        return 0;
    }
  });

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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Filters</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Categories</label>
          <MultiSelect
            options={categoryOptions}
            selectedValues={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Sugar</label>
          <RangeSlider
            min={0}
            max={100}
            value={maxSugar}
            onChange={setMaxSugar}
            unit="g"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Fat</label>
          <RangeSlider
            min={0}
            max={100}
            value={maxFat}
            onChange={setMaxFat}
            unit="g"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <SortSelect
            options={sortOptions}
            value={sortOption}
            onChange={setSortOption}
          />
        </div>
      </div>
      
      <GlassContainer className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Products
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {sortedProducts.length} products found
          </span>
        </div>
        
        {isError && (
          <div className="text-red-500 text-center mb-4">
            Error: {error?.message || 'Failed to load products'}
          </div>
        )}
        
        {!isLoading && !isError && sortedProducts.length === 0 && !isFetching && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">No products found matching your filters</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filter criteria</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
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
    </div>
  );
};

export default FilterableProductList;
