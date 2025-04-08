"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const ProductFilters = ({
  categories = [
    "Beverages",
    "Dairy",
    "Snacks",
    "Fruits",
    "Vegetables",
    "Grains",
  ],
  onFilterChange = () => {},
  onSortChange = () => {},
  activeFilters = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("categories");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterPanelRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Default empty filters if not provided
  const safeActiveFilters = activeFilters || {};

  // Nutrition range options
  const nutritionRanges = [
    { id: "sugar", label: "Sugar", unit: "g", min: 0, max: 50 },
    { id: "calories", label: "Calories", unit: "kcal", min: 0, max: 1000 },
    { id: "protein", label: "Protein", unit: "g", min: 0, max: 50 },
  ];

  // Sort options
  const sortOptions = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "grade_asc", label: "Nutrition Grade (Low to High)" },
    { id: "grade_desc", label: "Nutrition Grade (High to Low)" },
    { id: "calories_asc", label: "Calories (Low to High)" },
    { id: "calories_desc", label: "Calories (High to Low)" },
  ];

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortOpen(false);
      }
    };

    if (isExpanded || isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, isSortOpen]);

  const handleFilterChange = (type, value) => {
    onFilterChange?.({ ...safeActiveFilters, [type]: value });
  };

  const handleClearAllFilters = () => {
    onFilterChange?.({ sort: safeActiveFilters.sort });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (safeActiveFilters.categories?.length)
      count += safeActiveFilters.categories.length;
    if (safeActiveFilters.nutrition)
      count += Object.keys(safeActiveFilters.nutrition).length;
    return count;
  };

  return (
    <div className="bg-background border rounded-lg shadow-sm w-full max-w-screen-lg mx-auto mb-6 relative z-50">
      {/* Filter Bar */}
      <div className="flex items-center justify-between p-3 gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Filter Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
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
              <line x1="21" y1="4" x2="14" y2="4" />
              <line x1="10" y1="4" x2="3" y2="4" />
              <line x1="21" y1="12" x2="12" y2="12" />
              <line x1="8" y1="12" x2="3" y2="12" />
              <line x1="21" y1="20" x2="16" y2="20" />
              <line x1="12" y1="20" x2="3" y2="20" />
              <line x1="14" y1="2" x2="14" y2="6" />
              <line x1="8" y1="10" x2="8" y2="14" />
              <line x1="16" y1="18" x2="16" y2="22" />
            </svg>
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          {/* Active Filters Pills */}
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {safeActiveFilters.categories?.map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                {category}
                <button
                  onClick={() => {
                    const newCategories = safeActiveFilters.categories.filter(
                      (c) => c !== category
                    );
                    handleFilterChange("categories", newCategories);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
            {Object.entries(safeActiveFilters.nutrition || {}).map(
              ([key, value]) => {
                const range = nutritionRanges.find((r) => r.id === key);
                if (!range) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {range.label} {value}
                    {range.unit}
                    <button
                      onClick={() => {
                        const updatedNutrition = {
                          ...safeActiveFilters.nutrition,
                        };
                        delete updatedNutrition[key];
                        handleFilterChange("nutrition", updatedNutrition);
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                );
              }
            )}
            {getActiveFilterCount() > 5 && (
              <span className="text-xs text-muted-foreground">
                +{getActiveFilterCount() - 5} more
              </span>
            )}
          </div>
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

        {/* Clear All Button */}
        {getActiveFilterCount() > 0 && (
          <button
            onClick={handleClearAllFilters}
            className="text-xs text-destructive hover:text-destructive/80 px-2 py-1"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Floating Filter Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            ref={filterPanelRef}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-[90vw] md:w-[400px] h-screen bg-background border-l shadow-lg z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full overflow-hidden">
              {/* Sidebar Navigation */}
              <div className="border-b bg-muted/30 sticky top-0 z-10">
                <nav className="p-2">
                  <button
                    onClick={() => setActiveSection("categories")}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm mb-1 flex items-center gap-2",
                      activeSection === "categories"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
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
                    Categories
                    {safeActiveFilters.categories?.length > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 bg-primary/20 text-xs rounded-full">
                        {safeActiveFilters.categories.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveSection("nutrition")}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2",
                      activeSection === "nutrition"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
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
                      <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
                      <path d="M2 20h20" />
                      <path d="M14 12v.01" />
                    </svg>
                    Nutrition Values
                    {safeActiveFilters.nutrition &&
                      Object.keys(safeActiveFilters.nutrition).length > 0 && (
                        <span className="ml-auto px-1.5 py-0.5 bg-primary/20 text-xs rounded-full">
                          {Object.keys(safeActiveFilters.nutrition).length}
                        </span>
                      )}
                  </button>
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-4 overflow-y-auto h-[calc(100vh-120px)]">
                {/* Categories Section */}
                {activeSection === "categories" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-2">
                      Select Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            const currentCategories =
                              safeActiveFilters.categories || [];
                            const newCategories = currentCategories.includes(
                              category
                            )
                              ? currentCategories.filter((c) => c !== category)
                              : [...currentCategories, category];
                            handleFilterChange("categories", newCategories);
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-sm transition-colors",
                            safeActiveFilters.categories?.includes(category)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutrition Ranges Section */}
                {activeSection === "nutrition" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-2">
                      Nutrition Values
                    </h3>
                    <div className="space-y-6">
                      {nutritionRanges.map((range) => (
                        <div key={range.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">
                              {range.label}
                            </label>
                            <span className="text-sm font-medium">
                              {safeActiveFilters.nutrition?.[range.id] ||
                                range.min}
                              {range.unit}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={range.min}
                            max={range.max}
                            value={
                              safeActiveFilters.nutrition?.[range.id] ||
                              range.min
                            }
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value);
                              handleFilterChange("nutrition", {
                                ...(safeActiveFilters.nutrition || {}),
                                [range.id]: value,
                              });
                            }}
                            className="w-full h-2 accent-primary bg-muted rounded-full appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {range.min}
                              {range.unit}
                            </span>
                            <span>
                              {range.max}
                              {range.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t flex justify-between items-center bg-muted/10 sticky bottom-0 z-10">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-sm text-destructive hover:text-destructive/80"
                >
                  Clear All Filters
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors ml-auto"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;
