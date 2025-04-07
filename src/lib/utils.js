import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names with Tailwind CSS
 * @param {string[]} inputs - Class names to combine
 * @returns {string} - Combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get nutrition grade color based on grade
 * @param {string} grade - Nutrition grade (A, B, C, D, E)
 * @returns {string} - Tailwind CSS color class
 */
export function getNutritionGradeColor(grade) {
  if (!grade || grade.toUpperCase() === 'UNKNOWN') {
    return { text: 'NG', color: 'bg-gray-500' };
  }
  const gradeUpper = grade.toUpperCase();
  switch (gradeUpper) {
    case 'A':
      return { text: gradeUpper, color: 'bg-green-500' };
    case 'B':
      return { text: gradeUpper, color: 'bg-lime-500' };
    case 'C':
      return { text: gradeUpper, color: 'bg-yellow-500' };
    case 'D':
      return { text: gradeUpper, color: 'bg-orange-500' };
    case 'E':
      return { text: gradeUpper, color: 'bg-red-500' };
    default:
      return { text: 'NG', color: 'bg-gray-500' };
  }
}

/**
 * Format nutrition value with unit
 * @param {number} value - Nutrition value
 * @param {string} unit - Unit of measurement
 * @returns {string} - Formatted nutrition value
 */
export function formatNutritionValue(value, unit = 'g') {
  if (value === undefined || value === null) return 'N/A';
  return `${value}${unit}`;
}

/**
 * Get a fallback image URL when product image is not available
 * @returns {string} - Fallback image URL
 */
export function getFallbackImageUrl() {
  return '/images/food-placeholder.svg';
}
