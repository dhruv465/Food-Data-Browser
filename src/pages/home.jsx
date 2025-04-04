import React, { useState } from 'react';
import ProductList from '../components/product/product-list';
import GlassContainer from '../components/ui/glass-container';

/**
 * HomePage component - Main landing page with product listing
 * 
 * @returns {JSX.Element} - HomePage component
 */
const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('breakfast-cereals');
  
  // Popular food categories
  const popularCategories = [
    { id: 'breakfast-cereals', name: 'Breakfast Cereals' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'fruits', name: 'Fruits' }
  ];

  return (
    <div className="space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Food Product Explorer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover detailed information about food products from around the world.
          Search, filter, and explore nutritional data with ease.
        </p>
      </section>
      
      <GlassContainer className="p-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {popularCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/50 dark:bg-white/10 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </GlassContainer>
      
      <ProductList category={selectedCategory} />
    </div>
  );
};

export default HomePage;
