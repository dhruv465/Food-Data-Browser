import React from 'react';
import { cn } from '../../lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';

/**
 * NutritionRangeFilter component - Allows filtering by nutrition value ranges
 * 
 * @param {Object} props - Component props
 * @param {string} props.nutrient - Nutrient name (e.g., 'sugar', 'fat')
 * @param {string} props.label - Display label for the nutrient
 * @param {string} props.unit - Unit of measurement (e.g., 'g', 'kcal')
 * @param {number} props.min - Minimum value of the range
 * @param {number} props.max - Maximum value of the range
 * @param {number} props.step - Step size for the slider
 * @param {boolean} props.enabled - Whether the filter is enabled
 * @param {Function} props.onToggle - Callback when filter is toggled
 * @param {Function} props.onChange - Callback when range values change
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - NutritionRangeFilter component
 */
const NutritionRangeFilter = ({
  nutrient,
  label,
  unit = 'g',
  min = 0,
  max = 100,
  step = 1,
  enabled = false,
  onToggle,
  onChange,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "w-full",
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Checkbox 
          id={`filter-${nutrient}`}
          checked={enabled}
          onCheckedChange={onToggle}
        />
        <Label htmlFor={`filter-${nutrient}`} className="text-sm font-medium">
          {label} ({unit} per 100g)
        </Label>
      </div>
      
      <div className="pl-6 space-y-2">
        <Slider
          disabled={!enabled}
          min={0}
          max={max}
          step={step}
          value={[min, max]}
          onValueChange={(value) => onChange(value[0], value[1])}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionRangeFilter;