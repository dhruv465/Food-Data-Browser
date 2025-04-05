import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { getNutritionGradeColor, getFallbackImageUrl } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';
import { applyGlass } from '../../lib/glassmorphism';

/**
 * ProductCardNew component - Redesigned product card with modern styling
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - ProductCardNew component
 */
const ProductCardNew = ({ product, className }) => {
  const { theme } = useTheme();
  // Extract product data
  const {
    id,
    product_name,
    brands,
    image_url,
    image_front_url,
    image_front_small_url,
    categories_tags = [],
    nutrition_grades,
    ingredients_text,
  } = product;


  // Format category for display
  const category = categories_tags[0]?.replace('en:', '') || 'Unknown';
  const formattedCategory = category.split(':').pop().replace(/-/g, ' ');
  
  // Format brand name
  const brandName = brands || 'Unknown brand';

  // Truncate long text
  const truncateText = (text, maxLength = 60) => {
    if (!text) return 'No information available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Get nutrition grade badge color
  const getNutritionBadgeClass = (grade) => {
    if (!grade) return 'bg-gray-300';
    
    const gradeColors = {
      'a': 'bg-green-500',
      'b': 'bg-lime-500',
      'c': 'bg-yellow-500',
      'd': 'bg-orange-500',
      'e': 'bg-red-500',
    };
    
    return gradeColors[grade.toLowerCase()] || 'bg-gray-300';
  };

  return (
    <Link 
      to={`/product/${id}`} 
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-md relative",
        applyGlass('card', theme, 'hover:translate-y-[-2px]'),
        className
      )}
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image_url || image_front_url || image_front_small_url || getFallbackImageUrl()}
          alt={product_name || 'Food product'}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            e.target.src = getFallbackImageUrl();
          }}
        />
        
        {/* Nutrition grade badge */}
        {nutrition_grades && (
          <div className="absolute top-2 right-2 z-10">
            <span 
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white",
                getNutritionBadgeClass(nutrition_grades)
              )}
              title={`Nutrition Grade: ${nutrition_grades.toUpperCase()}`}
            >
              {nutrition_grades.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      {/* Product info */}
      <div className="flex flex-1 flex-col space-y-2 p-4">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {formattedCategory}
        </p>
        
        {/* Product name */}
        <h3 className="font-medium leading-tight">
          {truncateText(product_name || 'Unknown product')}
        </h3>
        
        {/* Ingredients */}
        {ingredients_text && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {truncateText(ingredients_text, 100)}
          </p>
        )}
        
        {/* Nutrition Grade */}
        <div className="mt-auto pt-2">
          {nutrition_grades && (
            <div 
              className={cn(
                "text-sm px-3 py-1 rounded-full inline-flex items-center",
                getNutritionBadgeClass(nutrition_grades)
              )}
            >
              <span className="text-white font-medium">
                Nutrition Grade: {nutrition_grades.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCardNew;
