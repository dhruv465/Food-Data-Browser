import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductByBarcode } from '../lib/api/foodApi';
import GlassContainer from '../components/ui/glass-container';
import GlassCard from '../components/ui/glass-card';
import { getNutritionGradeColor, getFallbackImageUrl, formatNutritionValue } from '../lib/utils';

/**
 * ProductDetailPage component - Displays detailed information about a product
 * 
 * @returns {JSX.Element} - ProductDetailPage component
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  
  // Fetch product details using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductByBarcode(id),
  });

  // Extract product data
  const product = data?.product || {};
  
  // Nutrition facts from the product
  const nutriments = product?.nutriments || {};
  
  // Format nutrition table data
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

  // Extract labels and tags
  const labels = product?.labels_tags?.map(tag => tag.replace('en:', '')) || [];
  
  // Loading state
  if (isLoading) {
    return (
      <GlassContainer className="p-6 animate-pulse">
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-full md:w-2/3 space-y-4">
            <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </GlassContainer>
    );
  }

  // Error state
  if (isError) {
    return (
      <GlassContainer className="p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error?.message || 'Failed to load product details'}
          </p>
          <Link 
            to="/"
            className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </GlassContainer>
    );
  }

  return (
    <div className="space-y-8">
      <Link 
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-1" 
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
      
      <GlassContainer className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-24 rounded-xl overflow-hidden bg-white/30 dark:bg-black/30 p-2">
              <img
                src={product.image_url || getFallbackImageUrl()}
                alt={product.product_name || 'Food product'}
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.src = getFallbackImageUrl();
                }}
              />
              
              {product.nutrition_grades && (
                <div className="absolute top-6 right-6">
                  <span className={`${getNutritionGradeColor(product.nutrition_grades)} text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl`}>
                    {product.nutrition_grades.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="w-full md:w-2/3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.product_name || 'Unknown Product'}</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {product.generic_name || product.product_name}
              </p>
              {product.brands && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Brand: {product.brands}
                </p>
              )}
            </div>
            
            {/* Categories */}
            {product.categories && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Categories</h2>
                <p className="text-gray-600 dark:text-gray-300">{product.categories}</p>
              </div>
            )}
            
            {/* Ingredients */}
            {product.ingredients_text && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
                <p className="text-gray-600 dark:text-gray-300">{product.ingredients_text}</p>
              </div>
            )}
            
            {/* Labels & Tags */}
            {labels.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Labels & Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {labels.map((label, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Nutrition Facts */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Nutrition Facts</h2>
              <GlassCard className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nutrient
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/20 dark:bg-black/20 divide-y divide-gray-200 dark:divide-gray-700">
                    {nutritionData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                          {formatNutritionValue(item.value, item.unit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </div>
            
            {/* Additional Information */}
            {product.serving_size && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Serving Information</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Serving size: {product.serving_size}
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default ProductDetailPage;
