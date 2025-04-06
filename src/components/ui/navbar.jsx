import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';
import { applyGlass } from '../../lib/glassmorphism';

/**
 * Navbar component - Main navigation bar for the application
 * 
 * @returns {JSX.Element} - Navbar component
 */
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={cn(
      'sticky top-0 z-50 w-full border-b',
      applyGlass('navbar', theme)
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              Food Browser
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/search" className="text-sm font-medium hover:text-primary">
                Search
              </Link>
              <Link to="/barcode" className="text-sm font-medium hover:text-primary">
                Barcode
              </Link>
              <Link to="/filter" className="text-sm font-medium hover:text-primary">
                Filter
              </Link>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;