/**
 * Modern UI utility functions and constants
 * Provides consistent styling for flat design effects across the application
 */

import { cn } from './utils';

// Base flat design styles for different color modes
export const flatBase = {
  light: 'bg-white border border-gray-100 shadow-sm',
  dark: 'bg-zinc-900 border border-zinc-800 shadow-md'
};

// Flat design variants for different components
export const flatVariants = {
  card: {
    light: 'bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow',
    dark: 'bg-zinc-900 border border-zinc-800 shadow-md hover:shadow-lg transition-shadow'
  },
  nav: {
    light: 'bg-white border-b border-gray-100 shadow-sm',
    dark: 'bg-zinc-900 border-b border-zinc-800 shadow-md'
  },
  modal: {
    light: 'bg-white border border-gray-100 shadow-lg',
    dark: 'bg-zinc-900 border border-zinc-800 shadow-xl'
  },
  input: {
    light: 'bg-gray-50 border border-gray-200',
    dark: 'bg-zinc-800 border border-zinc-700'
  },
  sidebar: {
    light: 'bg-white border-r border-gray-100',
    dark: 'bg-zinc-900 border-r border-zinc-800'
  }
};

/**
 * Apply flat design effect to an element based on theme
 * 
 * @param {string} variant - The variant of flat design to apply (card, nav, modal, input)
 * @param {string} theme - The current theme (light or dark)
 * @param {string} className - Additional CSS classes
 * @returns {string} - Combined CSS classes for flat design effect
 */
export const applyGlass = (variant = 'card', theme = 'light', className = '') => {
  const baseStyles = flatVariants[variant]?.[theme] || flatBase[theme];
  return cn(baseStyles, className);
};

/**
 * Get flat design styles for a specific variant and theme
 * 
 * @param {string} variant - The variant of flat design to apply
 * @param {string} theme - The current theme (light or dark)
 * @returns {string} - CSS classes for flat design effect
 */
export const getGlassStyles = (variant = 'card', theme = 'light') => {
  return flatVariants[variant]?.[theme] || flatBase[theme];
};

// Additional flat design-specific utility classes
export const flatUtils = {
  hover: 'transition-all hover:shadow-md dark:hover:shadow-lg',
  active: 'active:shadow-sm',
  accent: {
    light: 'border-l-4 border-l-primary',
    dark: 'border-l-4 border-l-primary'
  }
};

// Keep the original function names for backward compatibility
export const glassBase = flatBase;
export const glassVariants = flatVariants;
export const glassUtils = flatUtils;