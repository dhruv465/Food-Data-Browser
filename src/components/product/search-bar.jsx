import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useDebounce } from "../../hooks/use-debounce";

/**
 * SearchBar component - Modern search input with suggestions
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onSearch - Search callback function
 * @param {string} props.initialValue - Initial search value
 * @param {Function} props.onClear - Clear callback function
 * @returns {JSX.Element} - SearchBar component
 */
const SearchBar = ({ className, onSearch, initialValue = "", onClear, ...props }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use the debounce hook to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Update search term when initialValue changes
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Call onSearch when debounced search term changes
  useEffect(() => {
    if (onSearch && debouncedSearchTerm !== initialValue) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch, initialValue]);

  // Handle input change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
    if (onClear) {
      onClear();
    }
  };

  // Handle focus with animation
  const handleFocus = () => {
    setIsFocused(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)} {...props}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "h-5 w-5 text-muted-foreground transition-colors duration-200",
              isFocused && "text-primary"
            )}
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
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for food products..."
          className={cn(
            "w-full pl-10 pr-10 py-3.5 border-0 rounded-xl",
            "bg-background/80 dark:bg-background/40 backdrop-blur-sm",
            "text-foreground placeholder:text-muted-foreground/60",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200",
            "border border-input hover:border-primary/50",
            isFocused && "border-primary/50 ring-2 ring-primary/20",
            isAnimating && "scale-[1.02] shadow-lg shadow-primary/10"
          )}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors duration-200"
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
