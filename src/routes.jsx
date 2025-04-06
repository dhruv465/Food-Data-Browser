import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import BarcodePage from './pages/barcode';
import SearchPage from './pages/search';
import FilterPage from './pages/filter';
import ProductDetailPage from './pages/product-detail';

/**
 * AppRoutes component - Application routing configuration
 * 
 * @returns {JSX.Element} - Routes configuration
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/barcode" element={<BarcodePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/filter" element={<FilterPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
    </Routes>
  );
};

export default AppRoutes;