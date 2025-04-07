import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCardNew from "../components/product/product-card";
import SearchBar from "../components/product/search-bar";
import { Button } from "../components/ui/button";
import { searchProductsByName } from "../lib/api/foodApi";

const HomeRedesigned = () => {
  const location = useLocation();
  const pageSize = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [nutritionFilters, setNutritionFilters] = useState({
    sugar: { min: 0, max: 100, enabled: false },
    fat: { min: 0, max: 100, enabled: false },
    salt: { min: 0, max: 100, enabled: false },
    calories: { min: 0, max: 1000, enabled: false },
  });

  // Handle category toggle
  const handleToggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle nutrition filter changes
  const handleNutritionFilterChange = (nutrient, field, value) => {
    setNutritionFilters((prev) => ({
      ...prev,
      [nutrient]: {
        ...prev[nutrient],
        [field]: value,
      },
    }));
  };

  // Handle nutrition filter toggle
  const handleNutritionFilterToggle = (nutrient) => {
    setNutritionFilters((prev) => ({
      ...prev,
      [nutrient]: {
        ...prev[nutrient],
        enabled: !prev[nutrient].enabled,
      },
    }));
  };
  
  // Check URL for search query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryTerm = queryParams.get('q');
    if (queryTerm) {
      setSearchTerm(queryTerm);
    }
  }, [location.search]);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allProducts", searchTerm],
    queryFn: ({ pageParam = 1 }) =>
      searchProductsByName(searchTerm, pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      if (
        !lastPage ||
        !lastPage.products ||
        lastPage.products.length < pageSize
      ) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const allProducts =
    productsData?.pages.flatMap((page) => page.products) || [];

  // Filter products based on nutrition filters
  const filteredProducts = allProducts.filter((product) => {
    // Skip filtering if no nutrition filters are enabled
    if (!Object.values(nutritionFilters).some((filter) => filter.enabled)) {
      return true;
    }

    // Check each enabled filter
    if (nutritionFilters.sugar.enabled && product.nutriments && product.nutriments.sugars_100g) {
      if (product.nutriments.sugars_100g < nutritionFilters.sugar.min ||
          product.nutriments.sugars_100g > nutritionFilters.sugar.max) {
        return false;
      }
    }

    if (nutritionFilters.fat.enabled && product.nutriments && product.nutriments.fat_100g) {
      if (product.nutriments.fat_100g < nutritionFilters.fat.min ||
          product.nutriments.fat_100g > nutritionFilters.fat.max) {
        return false;
      }
    }

    if (nutritionFilters.salt.enabled && product.nutriments && product.nutriments.salt_100g) {
      if (product.nutriments.salt_100g < nutritionFilters.salt.min ||
          product.nutriments.salt_100g > nutritionFilters.salt.max) {
        return false;
      }
    }

    if (nutritionFilters.calories.enabled && product.nutriments && product.nutriments.energy_kcal_100g) {
      if (product.nutriments.energy_kcal_100g < nutritionFilters.calories.min ||
          product.nutriments.energy_kcal_100g > nutritionFilters.calories.max) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Discover Healthy & Delicious Foods
          </h1>
          <div className="w-full max-w-xl mx-auto space-y-4">
            <SearchBar
              className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg"
              onSearch={(term) => {
                setSearchTerm(term);
                // Update URL without navigating away
                if (term.trim()) {
                  const newUrl = `/?q=${encodeURIComponent(term.trim())}`;
                  window.history.pushState({ path: newUrl }, '', newUrl);
                } else {
                  window.history.pushState({}, '', '/');
                }
              }}
              initialValue={searchTerm}
            />
            <Button
              variant="secondary"
              className="w-full bg-white/10 backdrop-blur-md border-white/20 shadow-lg hover:bg-white/20 text-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Filters
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Filters
                </>
              )}
            </Button>
            {showFilters && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-lg space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-2">Categories</h3>
                  <MultiCategoryFilter
                    categories={[
                      { id: 'snacks', name: 'Snacks' },
                      { id: 'beverages', name: 'Beverages' },
                      { id: 'dairy', name: 'Dairy' },
                      { id: 'cereals', name: 'Cereals' },
                      { id: 'fruits', name: 'Fruits' },
                    ]}
                    selectedCategories={selectedCategories}
                    onToggleCategory={handleToggleCategory}
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Nutrition</h3>
                  <div className="space-y-4">
                    <NutritionRangeFilter
                      nutrient="sugar"
                      label="Sugar"
                      min={nutritionFilters.sugar.min}
                      max={nutritionFilters.sugar.max}
                      enabled={nutritionFilters.sugar.enabled}
                      onToggle={() => handleNutritionFilterToggle('sugar')}
                      onChange={(min, max) => {
                        handleNutritionFilterChange('sugar', 'min', min);
                        handleNutritionFilterChange('sugar', 'max', max);
                      }}
                    />
                    <NutritionRangeFilter
                      nutrient="fat"
                      label="Fat"
                      min={nutritionFilters.fat.min}
                      max={nutritionFilters.fat.max}
                      enabled={nutritionFilters.fat.enabled}
                      onToggle={() => handleNutritionFilterToggle('fat')}
                      onChange={(min, max) => {
                        handleNutritionFilterChange('fat', 'min', min);
                        handleNutritionFilterChange('fat', 'max', max);
                      }}
                    />
                    <NutritionRangeFilter
                      nutrient="salt"
                      label="Salt"
                      min={nutritionFilters.salt.min}
                      max={nutritionFilters.salt.max}
                      enabled={nutritionFilters.salt.enabled}
                      onToggle={() => handleNutritionFilterToggle('salt')}
                      onChange={(min, max) => {
                        handleNutritionFilterChange('salt', 'min', min);
                        handleNutritionFilterChange('salt', 'max', max);
                      }}
                    />
                    <NutritionRangeFilter
                      nutrient="calories"
                      label="Calories"
                      unit="kcal"
                      min={nutritionFilters.calories.min}
                      max={nutritionFilters.calories.max}
                      step={10}
                      enabled={nutritionFilters.calories.enabled}
                      onToggle={() => handleNutritionFilterToggle('calories')}
                      onChange={(min, max) => {
                        handleNutritionFilterChange('calories', 'min', min);
                        handleNutritionFilterChange('calories', 'max', max);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {searchTerm ? `Search Results for "${searchTerm}"` : "Featured Products"}
            </h2>
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  window.history.pushState({}, '', '/');
                }}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Search
              </button>
            )}
          </div>
        </div>

        {productsError ? (
          <div className="text-center py-12">
            <p className="text-destructive">Error loading products. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCardNew key={product.id} product={product} />
              ))}
            </div>

            {/* Loading States */}
            {(productsLoading || isFetchingNextPage) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasNextPage && !productsLoading && (
              <div className="text-center mt-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'Loading more...' : 'Load more products'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomeRedesigned;
