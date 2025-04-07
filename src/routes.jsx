import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/ui/app-layout';
import HomePage from './pages/home';
import SearchPage from './pages/search';
import ProductDetailPage from './pages/product-detail';
import BarcodePage from './pages/barcode';
/**
 * AppRoutes component - Application routing configuration
 * 
 * @returns {JSX.Element} - Routes configuration
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'product/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'barcode',
        element: <BarcodePage />,
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;