import React from 'react';
import { cn } from '../../lib/utils';
import GlassCard from './glass-card';

/**
 * RangeSlider component for filtering by numeric values
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the slider
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.value - Current value
 * @param {Function} props.onChange - Function to call when value changes
 * @param {string} props.unit - Unit to display (e.g., 'g', 'kcal')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - RangeSlider component
 */
const RangeSlider = ({ 
  label,
  min = 0,
  max = 100,
  value,
  onChange,
  unit = '',
  className,
  ...props 
}) => {
  // Calculate percentage for styling the slider
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {value}{unit}
          </span>
        </div>
      )}
      
      <GlassCard className="p-1 h-10 flex items-center">
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          {/* Filled track */}
          <div 
            className="absolute h-full bg-blue-500 rounded-full" 
            style={{ width: `${percentage}%` }}
          />
          
          {/* Thumb */}
          <div 
            className="absolute w-6 h-6 bg-white dark:bg-gray-100 rounded-full shadow transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
            style={{ left: `${percentage}%`, top: '50%' }}
          />
          
          {/* Hidden input for accessibility */}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </GlassCard>
      
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
