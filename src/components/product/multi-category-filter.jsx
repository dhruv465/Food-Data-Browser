import React from "react";
import { cn } from "../../lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

/**
 * MultiCategoryFilter component - Allows selection of multiple categories
 *
 * @param {Object} props - Component props
 * @param {Array} props.categories - List of category objects with id and name
 * @param {Array} props.selectedCategories - Array of selected category ids
 * @param {Function} props.onToggleCategory - Category toggle callback
 * @param {boolean} props.isLoading - Whether categories are loading
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - MultiCategoryFilter component
 */
const MultiCategoryFilter = ({
  categories = [],
  selectedCategories = [],
  onToggleCategory,
  isLoading = false,
  className,
  ...props
}) => {
  // Render loading skeletons if isLoading is true
  if (isLoading) {
    return (
      <div className={cn("w-full space-y-2", className)} {...props}>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex items-center space-x-2"
            >
              <div className="h-4 w-4 rounded bg-muted animate-pulse"></div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-2", className)} {...props}>
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <Checkbox
            id={`category-${category.id}`}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={() => onToggleCategory(category.id)}
          />
          <Label
            htmlFor={`category-${category.id}`}
            className="text-sm cursor-pointer"
          >
            {category.name}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default MultiCategoryFilter;
