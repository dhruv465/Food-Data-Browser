"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import CategoryChip from "./category-chip";
import { Slider } from "../ui/slider";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductFilters = ({
  onSortChange = () => {},
  onFilterChange = () => {},
  onClearAllFilters = () => {},
  categories = [],
  activeFilters = {},
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const sortDropdownRef = useRef(null);
  const filtersDropdownRef = useRef(null);
  const categoriesDropdownRef = useRef(null);

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

  // NEW: Handle clearing all filters
  const handleClearAllFilters = () => {
    // Reset selected categories
    setSelectedCategories([]);
    
    // Reset nutrition values to defaults
    setNutritionValues({
      sugar: 100,
      calories: 1000,
      protein: 100
    });
    
    // Update parent component with cleared filters
    onFilterChange({
      ...safeActiveFilters,
      categories: [],
      nutrition: {
        sugar: 100,
        calories: 1000,
        protein: 100
      }
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

      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target)
      ) {
        setIsCategoriesOpen(false);
      }
    };

    if (isSortOpen || isFiltersOpen || isCategoriesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen, isFiltersOpen, isCategoriesOpen]);

  // Log categories for debugging
  useEffect(() => {
    console.log("Categories in ProductFilters:", categories);
  }, [categories]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-background border rounded-lg shadow-sm w-full max-w-screen-lg mx-auto mb-6 relative z-50"
    >
      <div className="flex flex-wrap items-center justify-between p-3 gap-2">
        {/* Category Filter Section - now a dropdown */}
        <div className="flex items-center gap-2">
          <div ref={categoriesDropdownRef} className="relative categories-dropdown">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
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
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Categories</span>
              {selectedCategories.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </motion.button>
            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-1 w-64 p-2 rounded-md shadow-lg bg-card border z-50 max-h-60 overflow-y-auto"
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between px-3 py-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        <span className="text-sm">{category}</span>
                        {selectedCategories.includes(category) && (
                          <Check size={16} className="text-primary" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No categories available</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Dropdown */}
          <div ref={filtersDropdownRef} className="relative filter-dropdown">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>
            <AnimatePresence>
              {isFiltersOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-1 w-72 p-4 rounded-md shadow-lg bg-card border z-50"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Dropdown */}
          <div ref={sortDropdownRef} className="relative sort-dropdown">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
              <span className="max-w-24 truncate">
                {sortOptions.find((opt) => opt.id === safeActiveFilters.sort)
                  ?.label || "Default"}
              </span>
            </motion.button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-1 w-60 p-1 rounded-md shadow-lg bg-card border z-50"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Active Filters Display */}
      <AnimatePresence>
        {(selectedCategories.length > 0 || Object.values(nutritionValues).some(v => v !== 100 && v !== 1000)) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <AnimatePresence>
                  {selectedCategories.map(category => (
                    <motion.span
                      key={category}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md flex items-center gap-1"
                    >
                      {category}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCategoryToggle(category)}
                        className="text-primary hover:text-primary/80"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </motion.span>
                  ))}
                </AnimatePresence>
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
              
              {/* Clear All Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleClearAllFilters();
                  onClearAllFilters();
                }}
                className="text-sm text-destructive hover:text-destructive/80 transition-colors"
              >
                Clear All
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductFilters;