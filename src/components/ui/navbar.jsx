import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';
import GlassCard from './glass-card';

/**
 * Navbar component with glassmorphism effect
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Navbar component
 */
const Navbar = ({ 
  className,
  ...props 
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={cn("sticky top-0 z-50 w-full", className)} {...props}>
      <GlassCard className="px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Food Explorer
          </span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Search
            </Link>
            <Link 
              to="/barcode" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Barcode
            </Link>
            <Link 
              to="/filter" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Filter
            </Link>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            ) : (
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            )}
          </button>
          
          <button 
            className="md:hidden w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            aria-label="Toggle menu"
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
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </nav>
      </GlassCard>
      
      {/* Mobile navigation menu - would be expanded with state management in a full implementation */}
      <div className="md:hidden hidden">
        <GlassCard className="mt-2 p-4 flex flex-col space-y-3">
          <Link 
            to="/" 
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </Link>
          <Link 
            to="/search" 
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Search
          </Link>
          <Link 
            to="/barcode" 
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Barcode
          </Link>
          <Link 
            to="/filter" 
            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Filter
          </Link>
        </GlassCard>
      </div>
    </header>
  );
};

export default Navbar;
