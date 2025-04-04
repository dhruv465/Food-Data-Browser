import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import GlassCard from './glass-card';

/**
 * MultiSelect component for selecting multiple options
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the select
 * @param {Array} props.options - Array of options to select from
 * @param {Array} props.selectedValues - Array of selected values
 * @param {Function} props.onChange - Function to call when selection changes
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - MultiSelect component
 */
const MultiSelect = ({ 
  label,
  options = [],
  selectedValues = [],
  onChange,
  className,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Toggle option selection
  const toggleOption = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(item => item !== value)
      : [...selectedValues, value];
    
    onChange(newSelectedValues);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.multi-select-container')) {
      setIsOpen(false);
    }
  };

  // Add event listener when dropdown is open
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative multi-select-container", className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-sm">
          {selectedValues.length === 0 
            ? 'Select options...' 
            : `${selectedValues.length} selected`}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>
      
      {isOpen && (
        <GlassCard className="absolute z-10 w-full mt-1 max-h-60 overflow-auto">
          <div className="p-2">
            {options.map((option) => (
              <div 
                key={option.value} 
                className="flex items-center p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-md cursor-pointer"
                onClick={() => toggleOption(option.value)}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">{option.label}</span>
              </div>
            ))}
            
            {options.length === 0 && (
              <div className="p-2 text-sm text-gray-500">No options available</div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default MultiSelect;
