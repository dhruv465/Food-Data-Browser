import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/ui/app-layout';
import BarcodePage from './pages/barcode';
import HomePage from './pages/home';
import ProductDetailPage from './pages/product-detail';
import SearchPage from './pages/search';
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