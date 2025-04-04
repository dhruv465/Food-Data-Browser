import React, { useState } from 'react';
import Layout, { PageHeader, PageContent, PageSection } from '../components/ui/layout';
import CategorySelector from '../components/product/category-selector';
import ProductListNew from '../components/product/product-list-new';
import SearchBar from '../components/product/search-bar';
import { useNavigate } from 'react-router-dom';

/**
 * HomePage component - Redesigned main landing page
 * 
 * @returns {JSX.Element} - HomePage component
 */
const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('breakfast-cereals');
  const navigate = useNavigate();
  
  // Popular food categories
  const popularCategories = [
    { id: 'breakfast-cereals', name: 'Breakfast Cereals' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'bread', name: 'Bread' },
    { id: 'chocolate', name: 'Chocolate' }
  ];

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Food Product Explorer"
        description="Discover detailed information about food products from around the world. Search, filter, and explore nutritional data with ease."
      />
      
      <div className="w-full max-w-xl mx-auto mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <PageSection title="Browse Categories">
        <CategorySelector
          categories={popularCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          className="mb-6"
        />
        
        <ProductListNew category={selectedCategory} />
      </PageSection>
    </Layout>
  );
};

export default HomePage;