import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProductsByCategory } from "../lib/api/foodApi";
import { PageHeader, PageContent, PageSection } from "../components/ui/layout";
import ProductCard from "../components/product/product-card";
import { Button } from "../components/ui/button";
import MultiCategoryFilter from "../components/product/multi-category-filter";
import NutritionRangeFilter from "../components/product/nutrition-range-filter";
import SortOptions from "../components/product/sort-options";

/**
 * FilterPage component - Advanced filtering and sorting for food products
 *
 * @returns {JSX.Element} - FilterPage component
 */
const FilterPage = () => {
  // State for selected categories (multi-select)
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // State for nutritional filters
  const [nutritionFilters, setNutritionFilters] = useState({
    sugar: { min: 0, max: 100, enabled: false },
    fat: { min: 0, max: 100, enabled: false },
    salt: { min: 0, max: 100, enabled: false },
    calories: { min: 0, max: 1000, enabled: false },
  });
  
  // State for sorting
  const [sortOption, setSortOption] = useState("name-asc");
  
  // State for pagination
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const PAGE_SIZE = 24;

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Fetch products based on selected categories
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    isFetching: isProductsFetching,
    isPreviousData,
  } = useQuery({
    queryKey: ["filteredProducts", selectedCategories, page],
    queryFn: () => {
      // If no categories selected, don't fetch
      if (selectedCategories.length === 0) return { products: [], count: 0, page: 1, page_count: 1 };
      
      // For now, just use the first selected category (we'll enhance this later)
      return getProductsByCategory(selectedCategories[0], page, PAGE_SIZE);
    },
    enabled: selectedCategories.length > 0,
    keepPreviousData: true,
  });

  // Update allProducts when new data is fetched
  useEffect(() => {
    if (productsData?.products) {
      if (page === 1) {
        setAllProducts(productsData.products);
      } else {
        setAllProducts((prev) => [...prev, ...productsData.products]);
      }
    }
  }, [productsData, page]);

  // Reset page when categories change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [selectedCategories]);

  // Handle category selection/deselection
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
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

  // Handle sort option change
  const handleSortChange = (value) => {
    setSortOption(value);
  };

  // Handle load more button click
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

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

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return (a.product_name || "").localeCompare(b.product_name || "");
      case "name-desc":
        return (b.product_name || "").localeCompare(a.product_name || "");
      case "grade-asc":
        return (a.nutrition_grade_fr || "e").localeCompare(b.nutrition_grade_fr || "e");
      case "grade-desc":
        return (b.nutrition_grade_fr || "e").localeCompare(a.nutrition_grade_fr || "e");
      case "calories-asc":
        return (a.nutriments?.energy_kcal_100g || 0) - (b.nutriments?.energy_kcal_100g || 0);
      case "calories-desc":
        return (b.nutriments?.energy_kcal_100g || 0) - (a.nutriments?.energy_kcal_100g || 0);
      default:
        return 0;
    }
  });

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="rounded-lg border bg-card p-4 shadow-sm"
        >
          <div className="aspect-square w-full bg-muted animate-pulse rounded-md"></div>
          <div className="mt-3 space-y-2">
            <div className="h-2 w-16 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      ));
  };

  return (
    <>
      <PageHeader
        title="Advanced Filtering"
        description="Filter and sort food products by multiple criteria"
      />

      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                <MultiCategoryFilter
                  categories={categoriesData?.tags?.slice(0, 20) || []}
                  selectedCategories={selectedCategories}
                  onToggleCategory={handleCategoryToggle}
                  isLoading={isCategoriesLoading}
                />
                
                {isCategoriesError && (
                  <p className="text-sm text-destructive mt-2">Failed to load categories</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-lg font-medium mb-4">Nutrition Filters</h3>
              
              <div className="space-y-4">
                {/* Sugar filter */}
                <NutritionRangeFilter
                  nutrient="sugar"
                  label="Sugar"
                  unit="g"
                  min={nutritionFilters.sugar.min}
                  max={nutritionFilters.sugar.max}
                  step={1}
                  enabled={nutritionFilters.sugar.enabled}
                  onToggle={() => handleNutritionFilterToggle('sugar')}
                  onChange={(min, max) => {
                    handleNutritionFilterChange('sugar', 'min', min);
                    handleNutritionFilterChange('sugar', 'max', max);
                  }}
                />
                
                {/* Fat filter */}
                <NutritionRangeFilter
                  nutrient="fat"
                  label="Fat"
                  unit="g"
                  min={nutritionFilters.fat.min}
                  max={nutritionFilters.fat.max}
                  step={1}
                  enabled={nutritionFilters.fat.enabled}
                  onToggle={() => handleNutritionFilterToggle('fat')}
                  onChange={(min, max) => {
                    handleNutritionFilterChange('fat', 'min', min);
                    handleNutritionFilterChange('fat', 'max', max);
                  }}
                />
                
                {/* Salt filter */}
                <NutritionRangeFilter
                  nutrient="salt"
                  label="Salt"
                  unit="g"
                  min={nutritionFilters.salt.min}
                  max={nutritionFilters.salt.max}
                  step={0.1}
                  enabled={nutritionFilters.salt.enabled}
                  onToggle={() => handleNutritionFilterToggle('salt')}
                  onChange={(min, max) => {
                    handleNutritionFilterChange('salt', 'min', min);
                    handleNutritionFilterChange('salt', 'max', max);
                  }}
                />
                
                {/* Calories filter */}
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

            <div className="rounded-lg border bg-card p-4">
              <h3 className="text-lg font-medium mb-4">Sort By</h3>
              
              <SortOptions 
                value={sortOption} 
                onChange={handleSortChange} 
              />
            </div>
          </div>

          {/* Products grid */}
          <div className="md:col-span-3">
            {selectedCategories.length === 0 ? (
              <div className="text-center py-8 rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-2">Select Categories</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Please select at least one category to view products.
                </p>
              </div>
            ) : isProductsLoading && page === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderSkeletons()}
              </div>
            ) : isProductsError ? (
              <div className="rounded-lg border bg-card p-6 text-center">
                <h3 className="text-lg font-medium mb-2">
                  Error loading products
                </h3>
                <p className="text-muted-foreground mb-4">
                  {productsError?.message ||
                    "Failed to load products. Please try again."}
                </p>
                <Button onClick={() => setPage(1)} variant="outline">
                  Retry
                </Button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-8 rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your filters or selecting different categories.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {sortedProducts.length} products
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedCategories([]);
                      setNutritionFilters({
                        sugar: { min: 0, max: 100, enabled: false },
                        fat: { min: 0, max: 100, enabled: false },
                        salt: { min: 0, max: 100, enabled: false },
                        calories: { min: 0, max: 1000, enabled: false },
                      });
                      setSortOption("name-asc");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                  
                  {/* Show loading skeletons when fetching more */}
                  {isProductsFetching && page > 1 && renderSkeletons()}
                </div>

                {/* Load more button */}
                {productsData?.products?.length > 0 && 
                 productsData?.page < productsData?.page_count && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isProductsFetching}
                      variant="outline"
                      className="min-w-[150px]"
                    >
                      {isProductsFetching ? (
                        <>
                          <svg
                            className="mr-2 h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
};

export default FilterPage;