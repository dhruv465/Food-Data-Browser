import React from 'react';
import FilterableProductList from '../components/product/filterable-product-list';

/**
 * FilterPage component - Page for advanced filtering and sorting
 * 
 * @returns {JSX.Element} - FilterPage component
 */
const FilterPage = () => {
  return (
    <div className="space-y-8">
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Advanced Filtering
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Filter and sort food products by multiple categories, nutritional values, and more.
        </p>
      </section>
      
      <FilterableProductList />
    </div>
  );
};

export default FilterPage;
