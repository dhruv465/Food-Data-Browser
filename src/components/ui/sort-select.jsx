import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import GlassCard from './glass-card';

/**
 * SortSelect component for sorting products
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the select
 * @param {Array} props.options - Array of options to select from
 * @param {string} props.value - Current selected value
 * @param {Function} props.onChange - Function to call when selection changes
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - SortSelect component
 */
const SortSelect = ({ 
  label,
  options = [],
  value,
  onChange,
  className,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get selected option label
  const selectedOption = options.find(option => option.value === value);
  
  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // Select option
  const selectOption = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.sort-select-container')) {
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
    <div className={cn("relative sort-select-container", className)} {...props}>
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
          {selectedOption?.label || 'Select option...'}
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
                className={`p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-md cursor-pointer ${
                  option.value === value ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                }`}
                onClick={() => selectOption(option.value)}
              >
                <span className="text-sm">{option.label}</span>
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

export default SortSelect;
