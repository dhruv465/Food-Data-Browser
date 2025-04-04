import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';
import { applyGlass } from '../../lib/glassmorphism';

/**
 * AppLayout component - Main layout wrapper with sidebar navigation
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Layout content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - AppLayout component
 */
const AppLayout = ({ 
  children, 
  className,
  ...props 
}) => {
  const { theme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation items with icons
  const navItems = [
    { 
      href: '/', 
      label: 'Home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ) 
    },
    { 
      href: '/search', 
      label: 'Search',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      ) 
    },
    { 
      href: '/barcode', 
      label: 'Barcode',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zM13 12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2v1h1v-1h-1z" clipRule="evenodd" />
        </svg>
      ) 
    },
    { 
      href: '/filter', 
      label: 'Filter',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
      ) 
    },
  ];

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 transform bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-gray-800 md:relative",
          applyGlass('sidebar', theme),
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <span className="text-white font-bold text-sm">FE</span>
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-lg transition-colors group-hover:text-green-600 dark:group-hover:text-green-400">Food Explorer</span>
                <span className="text-xs text-muted-foreground">Discover Nutrition</span>
              </div>
            )}
          </Link>
          
          {/* Toggle button - visible on desktop */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
          
          {/* Close button - visible on mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isSidebarOpen ? "" : "justify-center",
                location.pathname === item.href
                  ? "bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
              )}
            >
              <span className={cn(
                "transition-transform",
                location.pathname === item.href ? "scale-110" : ""
              )}>
                {item.icon}
              </span>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className={cn(
          "sticky top-0 z-30 w-full transition-all duration-300 border-b", 
          applyGlass('nav', theme, "bg-opacity-90")
        )}>
          <div className="flex h-16 items-center px-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden mr-2 rounded-full p-2 transition-all duration-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Page title - could be dynamic based on current route */}
            <h1 className="text-xl font-semibold ml-2">
              {navItems.find(item => item.href === location.pathname)?.label || 'Food Explorer'}
            </h1>
            
            {/* Right side actions */}
            <div className="ml-auto flex items-center space-x-2">
              {/* Theme toggle */}
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className={cn(
          "w-full py-4 text-center text-sm text-muted-foreground border-t",
          applyGlass('nav', theme)
        )}>
          <div className="container mx-auto">
            <p>Food Product Explorer &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
      
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black/50 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

/**
 * ThemeToggle component - Toggle between light and dark mode
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "rounded-full p-2 transition-all duration-300",
        "bg-gray-100 dark:bg-gray-800 hover:shadow-md",
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        "border border-gray-200 dark:border-gray-700"
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default AppLayout;