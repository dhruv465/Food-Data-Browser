import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/glass-card';
import { getNutritionGradeColor, getFallbackImageUrl } from '../../lib/utils';

/**
 * ProductCard component to display food product information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @returns {JSX.Element} - ProductCard component
 */
const ProductCard = ({ product }) => {
  // Extract product data
  const {
    id,
    product_name,
    image_url,
    categories_tags = [],
    ingredients_text,
    nutrition_grades,
  } = product;

  // Format category for display
  const category = categories_tags[0]?.replace('en:', '') || 'Unknown';
  
  // Truncate long text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No information available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Link to={`/product/${id}`} className="block h-full">
      <GlassCard className="h-full flex flex-col p-4 hover:scale-[1.02] transition-transform">
        <div className="relative mb-3 overflow-hidden rounded-lg aspect-square">
          <img
            src={image_url || getFallbackImageUrl()}
            alt={product_name || 'Food product'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = getFallbackImageUrl();
            }}
          />
          {nutrition_grades && (
            <div className="absolute top-2 right-2">
              <span className={`${getNutritionGradeColor(nutrition_grades)} text-white font-bold rounded-full w-8 h-8 flex items-center justify-center`}>
                {nutrition_grades.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
            {category}
          </div>
          
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {product_name || 'Unknown Product'}
          </h3>
          
          {ingredients_text && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-auto line-clamp-3">
              <span className="font-medium">Ingredients: </span>
              {truncateText(ingredients_text, 80)}
            </p>
          )}
        </div>
      </GlassCard>
    </Link>
  );
};

export default ProductCard;
