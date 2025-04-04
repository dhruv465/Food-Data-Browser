import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './lib/theme-context';
import { queryClientConfig } from './lib/api-config';
import GlassmorphicBackground from './components/ui/glassmorphic-background';
import Navbar from './components/ui/navbar';
import GlassContainer from './components/ui/glass-container';
import './App.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/home'));
const SearchPage = lazy(() => import('./pages/search'));
const BarcodePage = lazy(() => import('./pages/barcode'));
const FilterPage = lazy(() => import('./pages/filter'));
const ProductDetailPage = lazy(() => import('./pages/product-detail'));

// Create a client for React Query with optimized configuration
const queryClient = new QueryClient(queryClientConfig);

// Loading fallback component with glassmorphism effect
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <GlassContainer className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold">Loading...</h2>
        <p className="text-gray-600 dark:text-gray-300">Preparing your food data</p>
      </div>
    </GlassContainer>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <GlassContainer className="p-8 text-center my-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </GlassContainer>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <GlassmorphicBackground>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <ErrorBoundary>
                <main className="flex-1 container mx-auto px-4 py-8">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/barcode" element={<BarcodePage />} />
                      <Route path="/filter" element={<FilterPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                    </Routes>
                  </Suspense>
                </main>
              </ErrorBoundary>
              <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Food Product Explorer &copy; {new Date().getFullYear()}</p>
              </footer>
            </div>
          </GlassmorphicBackground>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
