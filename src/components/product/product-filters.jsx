"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import CategoryChip from "./category-chip";
import { Slider } from "../ui/slider";

const ProductFilters = ({
  onSortChange = () => {},
  onFilterChange = () => {},
  categories = [],
  activeFilters = {},
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  const filtersDropdownRef = useRef(null);

  // Default empty filters if not provided
  const safeActiveFilters = activeFilters || {};
  
  // Initialize nutrition filter values
  const [nutritionValues, setNutritionValues] = useState({
    sugar: safeActiveFilters.nutrition?.sugar || 100,
    calories: safeActiveFilters.nutrition?.calories || 1000,
    protein: safeActiveFilters.nutrition?.protein || 100
  });
  
  // Initialize selected categories
  const [selectedCategories, setSelectedCategories] = useState(
    safeActiveFilters.categories || []
  );

  // Sort options
  const sortOptions = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "grade_asc", label: "Nutrition Grade (Low to High)" },
    { id: "grade_desc", label: "Nutrition Grade (High to Low)" },
    { id: "calories_asc", label: "Calories (Low to High)" },
    { id: "calories_desc", label: "Calories (High to Low)" },
  ];

  // Handle category selection
  const handleCategoryToggle = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    
    // Update parent component with new filters
    onFilterChange({
      ...safeActiveFilters,
      categories: updatedCategories
    });
  };
  
  // Handle nutrition value changes
  const handleNutritionChange = (type, value) => {
    const updatedValues = { ...nutritionValues, [type]: value };
    setNutritionValues(updatedValues);
    
    // Update parent component with new filters
    onFilterChange({
      ...safeActiveFilters,
      nutrition: updatedValues
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortOpen(false);
      }
      
      if (
        filtersDropdownRef.current &&
        !filtersDropdownRef.current.contains(event.target)
      ) {
        setIsFiltersOpen(false);
      }
    };

    if (isSortOpen || isFiltersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen, isFiltersOpen]);

  return (
    <div className="bg-background border rounded-lg shadow-sm w-full max-w-screen-lg mx-auto mb-6 relative z-50">
      <div className="flex flex-wrap items-center justify-between p-3 gap-2">
        {/* Category Filter Section */}
        <div className="flex-1">
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <CategoryChip
                key={category}
                category={category}
                selected={selectedCategories.includes(category)}
                onToggle={handleCategoryToggle}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div ref={filtersDropdownRef} className="relative filter-dropdown">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border hover:bg-muted/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="hidden sm:inline">Nutrition Filters</span>
            </button>
            {isFiltersOpen && (
              <div className="absolute right-0 mt-1 w-72 p-4 rounded-md shadow-lg bg-card border z-50">
                <div className="space-y-4">
                  {/* Sugar Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Sugar (g)</label>
                      <span className="text-sm text-muted-foreground">{nutritionValues.sugar}g</span>
                    </div>
                    <Slider
                      defaultValue={[nutritionValues.sugar]}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleNutritionChange('sugar', value[0])}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">0g</span>
                      <span className="text-xs text-muted-foreground">100g</span>
                    </div>
                  </div>
                  
                  {/* Calories Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Calories (kcal)</label>
                      <span className="text-sm text-muted-foreground">{nutritionValues.calories} kcal</span>
                    </div>
                    <Slider
                      defaultValue={[nutritionValues.calories]}
                      max={1000}
                      step={10}
                      onValueChange={(value) => handleNutritionChange('calories', value[0])}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">0 kcal</span>
                      <span className="text-xs text-muted-foreground">1000 kcal</span>
                    </div>
                  </div>
                  
                  {/* Protein Slider */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Protein (g)</label>
                      <span className="text-sm text-muted-foreground">{nutritionValues.protein}g</span>
                    </div>
                    <Slider
                      defaultValue={[nutritionValues.protein]}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleNutritionChange('protein', value[0])}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">0g</span>
                      <span className="text-xs text-muted-foreground">100g</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div ref={sortDropdownRef} className="relative sort-dropdown">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border hover:bg-muted/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 16 4 4 4-4" />
                <path d="M7 20V4" />
                <path d="M11 4h10" />
                <path d="M11 8h7" />
                <path d="M11 12h4" />
              </svg>
              <span className="hidden sm:inline">Sort:</span>{" "}
              {sortOptions.find((opt) => opt.id === safeActiveFilters.sort)
                ?.label || "Default"}
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-1 w-48 p-1 rounded-md shadow-lg bg-card border z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onSortChange?.(option.id);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-md text-sm",
                      safeActiveFilters.sort === option.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(selectedCategories.length > 0 || Object.values(nutritionValues).some(v => v !== 100 && v !== 1000)) && (
        <div className="px-3 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategories.map(category => (
              <span key={category} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                {category}
              </span>
            ))}
            {nutritionValues.sugar !== 100 && (
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                Sugar ≤ {nutritionValues.sugar}g
              </span>
            )}
            {nutritionValues.calories !== 1000 && (
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                Calories ≤ {nutritionValues.calories} kcal
              </span>
            )}
            {nutritionValues.protein !== 100 && (
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                Protein ≤ {nutritionValues.protein}g
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
