"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

const ProductFilters = ({
  onSortChange = () => {},
  activeFilters = {},
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  // Default empty filters if not provided
  const safeActiveFilters = activeFilters || {};

  // Sort options
  const sortOptions = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "grade_asc", label: "Nutrition Grade (Low to High)" },
    { id: "grade_desc", label: "Nutrition Grade (High to Low)" },
    { id: "calories_asc", label: "Calories (Low to High)" },
    { id: "calories_desc", label: "Calories (High to Low)" },
  ];

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen]);

  return (
    <div className="bg-background border rounded-lg shadow-sm w-full max-w-screen-lg mx-auto mb-6 relative z-50">
      <div className="flex items-center justify-end p-3 gap-2">


        {/* Sort Dropdown */}
        <div ref={sortDropdownRef} className="relative sort-dropdown">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border hover:bg-muted/50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 16 4 4 4-4" />
              <path d="M7 20V4" />
              <path d="M11 4h10" />
              <path d="M11 8h7" />
              <path d="M11 12h4" />
            </svg>
            <span className="hidden sm:inline">Sort:</span>{" "}
            {sortOptions.find((opt) => opt.id === safeActiveFilters.sort)
              ?.label || "Default"}
          </button>
          {isSortOpen && (
            <div className="absolute right-0 mt-1 w-48 p-1 rounded-md shadow-lg bg-card border z-50">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSortChange?.(option.id);
                    setIsSortOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-md text-sm",
                    safeActiveFilters.sort === option.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
