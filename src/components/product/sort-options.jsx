import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

/**
 * SortOptions component - Provides sorting options for product listings
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current sort option value
 * @param {Function} props.onChange - Callback when sort option changes
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - SortOptions component
 */
const SortOptions = ({
  value,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="grade-asc">Nutrition Grade (Best first)</SelectItem>
          <SelectItem value="grade-desc">Nutrition Grade (Worst first)</SelectItem>
          <SelectItem value="calories-asc">Calories (Lowest first)</SelectItem>
          <SelectItem value="calories-desc">Calories (Highest first)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortOptions;