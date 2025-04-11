/**
 * Glassmorphism UI utility functions and constants
 * Provides consistent styling for glassmorphism effects across the application
 */

import { cn } from './utils';

// Base glassmorphism styles for different color modes
export const glassBase = {
    light: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-sm',
    dark: 'bg-zinc-900/80 backdrop-blur-md border border-zinc-800/30 shadow-md'
};

// Glassmorphism variants for different components
export const glassVariants = {
    card: {
        light: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-sm hover:shadow-md transition-all',
        dark: 'bg-zinc-900/80 backdrop-blur-md border border-zinc-800/30 shadow-md hover:shadow-lg transition-all'
    },
    nav: {
        light: 'bg-white/90 backdrop-blur-md border-b border-gray-100/30 shadow-sm',
        dark: 'bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/30 shadow-md'
    },
    modal: {
        light: 'bg-white/90 backdrop-blur-lg border border-white/30 shadow-lg',
        dark: 'bg-zinc-900/90 backdrop-blur-lg border border-zinc-800/30 shadow-xl'
    },
    input: {
        light: 'bg-gray-50/90 backdrop-blur-sm border border-gray-200/50',
        dark: 'bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/50'
    },
    sidebar: {
        light: 'bg-white/90 backdrop-blur-md border-r border-gray-100/30',
        dark: 'bg-zinc-900/90 backdrop-blur-md border-r border-zinc-800/30'
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
    hover: 'transition-all hover:shadow-md dark:hover:shadow-lg hover:bg-opacity-100 dark:hover:bg-opacity-100',
    active: 'active:shadow-sm active:bg-opacity-100 dark:active:bg-opacity-100',
    accent: {
        light: 'border-l-4 border-l-primary',
        dark: 'border-l-4 border-l-primary'
    }
};

// Keep the original function names for backward compatibility
export const flatBase = glassBase;
export const flatVariants = glassVariants;
export const flatUtils = glassUtils;