import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useTheme } from "../../lib/theme-context";
import { applyGlass, glassUtils } from "../../lib/glassmorphism";

/**
 * MainNav component - Primary navigation for the application
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - MainNav component
 */
const MainNav = ({ className, ...props }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items with icons
  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      href: "/search",
      label: "Search",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      href: "/barcode",
      label: "Barcode",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zM13 12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2v1h1v-1h-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  // Track scroll position for navbar effects
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b shadow-md" : "border-b-0",
        applyGlass("nav", theme, scrolled ? "bg-opacity-90" : "bg-opacity-70")
      )}
    >
      <div className="container flex h-16 items-center px-4 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-6 group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
            <span className="text-white font-bold text-sm">FE</span>
          </div>
          <div className="flex flex-col">
            <span className="hidden md:inline-block font-bold text-lg transition-colors group-hover:text-green-600 dark:group-hover:text-green-400">
              Food Explorer
            </span>
            <span className="hidden md:inline-block text-xs text-muted-foreground">
              Discover Nutrition
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all",
                "hover:bg-green-100/50 dark:hover:bg-green-900/20 hover:shadow-sm",
                location.pathname === item.href
                  ? "text-green-700 dark:text-green-400 bg-green-100/80 dark:bg-green-900/30 shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "transition-transform",
                  location.pathname === item.href ? "scale-110" : ""
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="ml-auto flex items-center space-x-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              "rounded-full p-2 transition-all duration-300",
              "bg-gray-100 dark:bg-gray-800 hover:shadow-md",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "border border-gray-200 dark:border-gray-700"
            )}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "md:hidden rounded-full p-2 transition-all duration-300",
              "bg-green-100 dark:bg-green-900/30 hover:shadow-md",
              "hover:bg-green-200 dark:hover:bg-green-800/40",
              "border border-green-200 dark:border-green-800/50",
              isMobileMenuOpen ? "rotate-90" : ""
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-700 dark:text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-700 dark:text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Animated slide down */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          "border-t border-green-100 dark:border-green-900/30",
          "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md",
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col py-4 px-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 text-sm font-medium transition-all py-3 px-2 rounded-lg",
                "hover:bg-green-50 dark:hover:bg-green-900/20",
                location.pathname === item.href
                  ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                  : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-green-600 dark:text-green-500">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default MainNav;
