import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

/**
 * SearchBar component - Modern search input with suggestions
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onSearch - Search callback function
 * @param {string} props.initialValue - Initial search value
 * @returns {JSX.Element} - SearchBar component
 */
const SearchBar = ({ 
  className, 
  onSearch, 
  initialValue = '',
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update search term when initialValue changes
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Handle input change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Call the onSearch callback if provided
      if (onSearch) {
        onSearch(searchTerm.trim());
      }
      
      // Navigate to search page with search parameter
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "relative w-full",
        className
      )}
      {...props}
    >
      <div className={cn(
        "flex h-10 items-center rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
        "focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2",
        isFocused ? "ring-1 ring-ring ring-offset-2" : ""
      )}>
        {/* Search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        
        {/* Search input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for food products..."
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
        
        {/* Clear button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;