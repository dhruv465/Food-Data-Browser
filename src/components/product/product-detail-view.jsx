import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { getNutritionGradeColor, getFallbackImageUrl, formatNutritionValue } from '../../lib/utils';
import { Button } from '../ui/button';
import { useTheme } from '../../lib/theme-context';
import { applyGlass } from '../../lib/glassmorphism';

/**
 * ProductDetailView component - Displays detailed product information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - ProductDetailView component
 */
const ProductDetailView = ({ product, isLoading, className }) => {
  const { theme } = useTheme();
  // Early return for loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-8 animate-pulse", className)}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image skeleton */}
          <div className="w-full md:w-1/3 aspect-square bg-muted rounded-lg"></div>
          
          {/* Content skeleton */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-24 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Extract product data
  const {
    product_name,
    brands,
    image_url,
    image_front_url,
    image_front_small_url,
    ingredients_text,
    nutriments = {},
    nutrition_grades,
    ecoscore_grade,
    nova_group,
    categories_tags = [],
    labels_tags = [],
    countries_tags = [],
  } = product || {};

  // Format categories and labels
  const formattedCategories = categories_tags
    .map(tag => tag.replace('en:', ''))
    .map(cat => cat.split(':').pop().replace(/-/g, ' '))
    .join(', ');

  const formattedLabels = labels_tags
    .map(tag => tag.replace('en:', ''))
    .join(', ');

  // Nutrition facts
  const nutritionData = [
    { name: 'Energy', value: nutriments.energy, unit: 'kcal' },
    { name: 'Fat', value: nutriments.fat, unit: 'g' },
    { name: 'Saturated Fat', value: nutriments['saturated-fat'], unit: 'g' },
    { name: 'Carbohydrates', value: nutriments.carbohydrates, unit: 'g' },
    { name: 'Sugars', value: nutriments.sugars, unit: 'g' },
    { name: 'Fiber', value: nutriments.fiber, unit: 'g' },
    { name: 'Proteins', value: nutriments.proteins, unit: 'g' },
    { name: 'Salt', value: nutriments.salt, unit: 'g' },
    { name: 'Sodium', value: nutriments.sodium, unit: 'g' },
  ];

  // Get nutrition grade color
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
    <div className={cn("space-y-8", className)}>
      {/* Product header */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product image */}
        <div className="w-full md:w-1/3">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <img
                src={image_url || image_front_url || image_front_small_url || getFallbackImageUrl()}
                alt={product_name || 'Food product'}
                className="object-contain w-full h-full"
                onError={(e) => {
                  e.target.src = getFallbackImageUrl();
                }}
              />
          </div>
        </div>
        
        {/* Product info */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-tight">{product_name}</h1>
            {brands && <p className="text-lg text-muted-foreground">{brands}</p>}
          </div>
          
          {/* Product scores */}
          <div className="flex flex-wrap gap-3">
            {nutrition_grades && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <span 
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white",
                    getNutritionBadgeClass(nutrition_grades)
                  )}
                >
                  {nutrition_grades.toUpperCase()}
                </span>
                <div>
                  <p className="text-xs font-medium">Nutrition Grade</p>
                  <p className="text-sm">{nutrition_grades.toUpperCase()}</p>
                </div>
              </div>
            )}
            
            {ecoscore_grade && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                  {ecoscore_grade.toUpperCase()}
                </span>
                <div>
                  <p className="text-xs font-medium">Eco Score</p>
                  <p className="text-sm">{ecoscore_grade.toUpperCase()}</p>
                </div>
              </div>
            )}
            
            {nova_group && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                  {nova_group}
                </span>
                <div>
                  <p className="text-xs font-medium">NOVA Group</p>
                  <p className="text-sm">Processing Level {nova_group}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Categories */}
          {formattedCategories && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-1">Categories</h2>
              <p>{formattedCategories}</p>
            </div>
          )}
          
          {/* Labels */}
          {formattedLabels && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-1">Labels</h2>
              <div className="flex flex-wrap gap-1">
                {labels_tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
                  >
                    {tag.replace('en:', '')}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Back button */}
          <div className="pt-2">
            <Button variant="outline" asChild>
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <div className="p-4 rounded-lg border bg-card">
            <p className="whitespace-pre-line">
              {ingredients_text || 'No ingredients information available'}
            </p>
          </div>
        </div>
        
        {/* Nutrition facts */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Nutrition Facts</h2>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Nutrient</th>
                  <th className="px-4 py-2 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {nutritionData.map((item, index) => (
                  <tr key={index} className="bg-card">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2 text-right">
                      {formatNutritionValue(item.value, item.unit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;