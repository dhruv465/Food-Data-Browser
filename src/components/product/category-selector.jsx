import React from 'react';
import { cn } from '../../lib/utils';

/**
 * CategorySelector component - Modern category selection with pills
 * 
 * @param {Object} props - Component props
 * @param {Array} props.categories - List of category objects with id and name
 * @param {string} props.selectedCategory - Currently selected category id
 * @param {Function} props.onSelectCategory - Category selection callback
 * @param {boolean} props.isLoading - Whether categories are loading
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - CategorySelector component
 */
const CategorySelector = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  isLoading = false,
  className,
  ...props
}) => {
  // Render loading skeletons if isLoading is true
  if (isLoading) {
    return (
      <div 
        className={cn(
          "w-full overflow-auto pb-2",
          className
        )}
        {...props}
      >
        <div className="flex flex-nowrap gap-2 min-w-full">
          {Array(6).fill(0).map((_, index) => (
            <div 
              key={`skeleton-${index}`}
              className="px-4 py-2 rounded-full bg-secondary/30 animate-pulse w-24 h-9"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "w-full overflow-auto pb-2",
        className
      )}
      {...props}
    >
      <div className="flex flex-nowrap gap-2 min-w-full">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              "border border-transparent",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
            )}
            aria-current={selectedCategory === category.id ? "page" : undefined}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;