import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, Filter, SortDesc } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { cn } from '../../lib/utils';
import { applyGlass } from '../../lib/glassmorphism';
import { useTheme } from '../../lib/theme-context';

/**
 * FilterSortPanel component - Modern filtering and sorting interface
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Function} props.onSortChange - Callback when sort changes
 * @param {Array} props.categories - Available categories
 * @returns {JSX.Element} - FilterSortPanel component
 */
const FilterSortPanel = ({ onFilterChange, onSortChange, categories = [] }) => {
  const { theme } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sugarRange, setSugarRange] = useState([0, 100]);
  const [sortOption, setSortOption] = useState(null);
  
  // Common food categories if none provided
  const defaultCategories = [
    'Beverages', 'Dairy', 'Snacks', 'Fruits', 'Vegetables', 
    'Grains', 'Proteins', 'Condiments', 'Desserts', 'Bakery'
  ];
  
  const availableCategories = categories.length > 0 ? categories : defaultCategories;
  
  // Sort options
  const sortOptions = [
    { id: 'name-asc', label: 'Name (A-Z)', icon: '↓' },
    { id: 'name-desc', label: 'Name (Z-A)', icon: '↑' },
    { id: 'grade-asc', label: 'Nutrition Grade (Best)', icon: '★' },
    { id: 'grade-desc', label: 'Nutrition Grade (Worst)', icon: '☆' },
    { id: 'calories-asc', label: 'Lowest Calories', icon: '↓' },
    { id: 'calories-desc', label: 'Highest Calories', icon: '↑' },
  ];

  // Update filters when selections change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        sugar: sugarRange,
      });
    }
  }, [selectedCategories, sugarRange, onFilterChange]);

  // Update sort when selection changes
  useEffect(() => {
    if (onSortChange && sortOption) {
      onSortChange(sortOption);
    }
  }, [sortOption, onSortChange]);

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSugarRange([0, 100]);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Filter Button */}
        <div className="relative">
          <Button 
            variant="outline" 
            className="w-full md:w-auto flex items-center gap-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4" />
            Filter Products
            {isFilterOpen ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
          
          {/* Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute z-50 mt-2 w-72 md:w-96 p-4 rounded-lg shadow-lg",
                  applyGlass("panel", theme)
                )}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filter Options</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategories.includes(category) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all hover:scale-105",
                          selectedCategories.includes(category) 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-background hover:bg-muted"
                        )}
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                        {selectedCategories.includes(category) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Sugar Range */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Sugar per serving</h4>
                    <span className="text-xs text-muted-foreground">
                      {sugarRange[0]}g - {sugarRange[1]}g
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 100]}
                    value={sugarRange}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={setSugarRange}
                    className="my-4"
                  />
                </div>
                
                {/* Filter Actions */}
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Sort Button */}
        <div className="relative">
          <Button 
            variant="outline" 
            className="w-full md:w-auto flex items-center gap-2"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <SortDesc className="h-4 w-4" />
            Sort Products
            {isSortOpen ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
          
          {/* Sort Panel */}
          <AnimatePresence>
            {isSortOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute z-50 mt-2 w-64 p-4 rounded-lg shadow-lg right-0",
                  applyGlass("panel", theme)
                )}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Sort Options</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setIsSortOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors",
                        sortOption === option.id 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      )}
                      onClick={() => {
                        setSortOption(option.id);
                        setIsSortOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                        <span>{option.icon}</span>
                      </div>
                      <span>{option.label}</span>
                      {sortOption === option.id && (
                        <div className="ml-auto w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(selectedCategories.length > 0 || sugarRange[0] > 0 || sugarRange[1] < 100) && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap items-center gap-2 mt-2"
        >
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {/* Category Pills */}
          {selectedCategories.map(category => (
            <Badge 
              key={category} 
              variant="secondary"
              className="flex items-center gap-1 animate-fadeIn"
            >
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleCategory(category)}
              />
            </Badge>
          ))}
          
          {/* Sugar Range Pill */}
          {(sugarRange[0] > 0 || sugarRange[1] < 100) && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 animate-fadeIn"
            >
              Sugar: {sugarRange[0]}g - {sugarRange[1]}g
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSugarRange([0, 100])}
              />
            </Badge>
          )}
          
          {/* Clear All Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs" 
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </motion.div>
      )}
      
      {/* Sort Indicator */}
      {sortOption && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mt-2"
        >
          <span className="text-sm text-muted-foreground">Sorted by:</span>
          <Badge variant="secondary">
            {sortOptions.find(opt => opt.id === sortOption)?.label}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs" 
            onClick={() => setSortOption(null)}
          >
            Clear
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FilterSortPanel;