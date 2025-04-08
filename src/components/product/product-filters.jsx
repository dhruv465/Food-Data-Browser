import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Button } from "../ui/button";

/**
 * ProductFilters Component
 *
 * @param {Object} props
 * @param {string[]} props.categories - Array of available category options
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Function} props.onSortChange - Callback when sort option changes
 * @param {Object} props.activeFilters - Current active filters
 * @param {string[]} props.activeFilters.categories - Selected categories
 * @param {Object} props.activeFilters.nutrition - Selected nutrition values
 * @param {string} props.activeFilters.sort - Selected sort option
 */
const ProductFilters = ({
  categories = [],
  onFilterChange = () => {},
  onSortChange = () => {},
  activeFilters = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  // Default empty filters if not provided
  const safeActiveFilters = activeFilters || {};

  // Nutrition range options
  const nutritionRanges = [
    { id: "sugar", label: "Sugar", unit: "g", min: 0, max: 100 },
    { id: "calories", label: "Calories", unit: "kcal", min: 0, max: 1000 },
    { id: "protein", label: "Protein", unit: "g", min: 0, max: 50 },
  ];

  // Sort options
  const sortOptions = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "grade_asc", label: "Grade (Low to High)" },
    { id: "grade_desc", label: "Grade (High to Low)" },
    { id: "calories_asc", label: "Calories (Low to High)" },
    { id: "calories_desc", label: "Calories (High to Low)" },
  ];

  const handlePanelClick = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
    setIsExpanded(true);
  };

  const handleFilterChange = (type, value) => {
    onFilterChange?.({ ...safeActiveFilters, [type]: value });
  };

  return (
    <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b sticky top-0">
      <div className="container mx-auto px-4 py-4">
        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 md:flex-none"
          >
            <span className="mr-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
              {isExpanded ? "Hide" : "Show"} Filters
            </span>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-2"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
            </motion.span>
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                {/* Active Filters Summary */}
                {(safeActiveFilters.categories?.length > 0 ||
                  Object.keys(safeActiveFilters.nutrition || {}).length >
                    0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="col-span-full mb-4 flex flex-wrap gap-2"
                  >
                    {safeActiveFilters.categories?.map((category) => (
                      <motion.span
                        key={category}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium shadow-sm hover:bg-primary/15 transition-colors"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {category}
                        <button
                          onClick={() =>
                            handleFilterChange(
                              "categories",
                              safeActiveFilters.categories.filter(
                                (c) => c !== category
                              )
                            )
                          }
                          className="ml-2 hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 p-0.5"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                    {Object.entries(safeActiveFilters.nutrition || {}).map(
                      ([key, value]) => {
                        const range = nutritionRanges.find((r) => r.id === key);
                        if (!range) return null;
                        return (
                          <motion.span
                            key={key}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium shadow-sm hover:bg-primary/15 transition-colors"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            {range.label}: {value}
                            {range.unit}
                            <button
                              onClick={() => {
                                const updatedNutrition = {
                                  ...safeActiveFilters.nutrition,
                                };
                                delete updatedNutrition[key];
                                handleFilterChange(
                                  "nutrition",
                                  updatedNutrition
                                );
                              }}
                              className="ml-2 hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 p-0.5"
                            >
                              ×
                            </button>
                          </motion.span>
                        );
                      }
                    )}
                  </motion.div>
                )}
                {/* Categories Panel */}
                <motion.div
                  className={`rounded-xl border shadow-sm bg-card p-5 cursor-pointer transition-colors ${
                    activePanel === "categories"
                      ? "border-primary ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handlePanelClick("categories")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
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
                    <h3 className="font-semibold">Categories</h3>
                  </div>
                  <AnimatePresence>
                    {activePanel === "categories" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-2 gap-2"
                      >
                        {categories.map((category) => (
                          <motion.button
                            key={category}
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentCategories =
                                safeActiveFilters.categories || [];
                              const newCategories = currentCategories.includes(
                                category
                              )
                                ? currentCategories.filter(
                                    (c) => c !== category
                                  )
                                : [...currentCategories, category];
                              handleFilterChange("categories", newCategories);
                            }}
                            className={`px-3 py-1 rounded-full text-sm ${
                              safeActiveFilters.categories?.includes(category)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {category}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Nutrition Ranges Panel */}
                <motion.div
                  className={`rounded-xl border shadow-sm bg-card p-5 cursor-pointer transition-colors ${
                    activePanel === "nutrition"
                      ? "border-primary ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handlePanelClick("nutrition")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
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
                    <h3 className="font-semibold">Nutrition Filters</h3>
                  </div>
                  <AnimatePresence>
                    {activePanel === "nutrition" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {nutritionRanges.map((range) => (
                          <div key={range.id} className="space-y-2">
                            <label className="text-sm font-medium">
                              {range.label} ({range.unit})
                            </label>
                            <input
                              type="range"
                              min={range.min}
                              max={range.max}
                              value={
                                safeActiveFilters.nutrition?.[range.id] ||
                                range.min
                              }
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                handleFilterChange("nutrition", {
                                  ...(safeActiveFilters.nutrition || {}),
                                  [range.id]: value,
                                });
                              }}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{range.min}</span>
                              <span>
                                {safeActiveFilters.nutrition?.[range.id] ||
                                  range.min}
                              </span>
                              <span>{range.max}</span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Sort Options Panel */}
                <motion.div
                  className={`rounded-xl border shadow-sm bg-card p-5 cursor-pointer transition-colors ${
                    activePanel === "sort"
                      ? "border-primary ring-1 ring-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => handlePanelClick("sort")}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
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
                    <h3 className="font-semibold">Sort By</h3>
                  </div>
                  <AnimatePresence>
                    {activePanel === "sort" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {sortOptions.map((option) => (
                          <motion.button
                            key={option.id}
                            onClick={() => onSortChange?.(option.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                              safeActiveFilters.sort === option.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {option.label}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Active Filters Display */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-wrap gap-2 mt-4"
              >
                {safeActiveFilters.categories?.map((category) => (
                  <motion.span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {category}
                    <button
                      onClick={() =>
                        handleFilterChange(
                          "categories",
                          safeActiveFilters.categories.filter(
                            (c) => c !== category
                          )
                        )
                      }
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
                {Object.entries(safeActiveFilters.nutrition || {}).map(
                  ([key, value]) => {
                    const range = nutritionRanges.find((r) => r.id === key);
                    if (!range) return null;
                    return (
                      <motion.span
                        key={key}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {range.label}: {value}
                        {range.unit}
                        <button
                          onClick={() => {
                            const updatedNutrition = {
                              ...safeActiveFilters.nutrition,
                            };
                            delete updatedNutrition[key];
                            handleFilterChange("nutrition", updatedNutrition);
                          }}
                          className="ml-2 hover:text-destructive"
                        >
                          ×
                        </button>
                      </motion.span>
                    );
                  }
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductFilters;
