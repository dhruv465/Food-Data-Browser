import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/ui/app-layout';
import BarcodePage from './pages/barcode';
import HomePage from './pages/home';
import ProductDetailPage from './pages/product-detail';

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