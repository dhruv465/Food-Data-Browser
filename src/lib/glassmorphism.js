/**
 * Glassmorphism utility functions and constants
 * Provides consistent styling for glassmorphism effects across the application
 */

import { cn } from './utils';

// Base glassmorphism styles for different color modes
export const glassBase = {
  light: 'bg-white/70 backdrop-blur-md border border-white/30 shadow-lg',
  dark: 'bg-zinc-900/70 backdrop-blur-md border border-zinc-800/50 shadow-lg'
};

// Glassmorphism variants for different components
export const glassVariants = {
  card: {
    light: 'bg-white/60 backdrop-blur-md border border-white/30 shadow-lg',
    dark: 'bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 shadow-lg'
  },
  nav: {
    light: 'bg-white/80 backdrop-blur-md border-b border-white/30 shadow-sm',
    dark: 'bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 shadow-sm'
  },
  modal: {
    light: 'bg-white/80 backdrop-blur-md border border-white/30 shadow-xl',
    dark: 'bg-zinc-900/80 backdrop-blur-md border border-zinc-800/50 shadow-xl'
  },
  input: {
    light: 'bg-white/50 backdrop-blur-sm border border-white/30',
    dark: 'bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50'
  }
};

/**
 * Apply glassmorphism effect to an element based on theme
 * 
 * @param {string} variant - The variant of glassmorphism to apply (card, nav, modal, input)
 * @param {string} theme - The current theme (light or dark)
 * @param {string} className - Additional CSS classes
 * @returns {string} - Combined CSS classes for glassmorphism effect
 */
export const applyGlass = (variant = 'card', theme = 'light', className = '') => {
  const baseStyles = glassVariants[variant]?.[theme] || glassBase[theme];
  return cn(baseStyles, className);
};

/**
 * Get glassmorphism styles for a specific variant and theme
 * 
 * @param {string} variant - The variant of glassmorphism to apply
 * @param {string} theme - The current theme (light or dark)
 * @returns {string} - CSS classes for glassmorphism effect
 */
export const getGlassStyles = (variant = 'card', theme = 'light') => {
  return glassVariants[variant]?.[theme] || glassBase[theme];
};

// Additional glassmorphism-specific utility classes
export const glassUtils = {
  hover: 'transition-all hover:bg-opacity-80 hover:shadow-md',
  active: 'active:bg-opacity-90 active:shadow-sm',
  glow: {
    light: 'after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-b after:from-white/10 after:to-transparent after:opacity-50 after:blur-sm',
    dark: 'after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-b after:from-zinc-700/10 after:to-transparent after:opacity-50 after:blur-sm'
  }
};