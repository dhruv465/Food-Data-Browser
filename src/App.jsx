import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './lib/theme-context';
import { queryClientConfig } from './lib/api-config';
import AppLayout from './components/ui/app-layout';
import './index.css'; // Global styles

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/home'));
const SearchPage = lazy(() => import('./pages/search'));
const BarcodePage = lazy(() => import('./pages/barcode'));
const FilterPage = lazy(() => import('./pages/filter'));
const ProductDetailPage = lazy(() => import('./pages/product-detail'));

// Create a client for React Query with optimized configuration
const queryClient = new QueryClient(queryClientConfig);

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
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
        <div className="p-8 text-center my-8 max-w-xl mx-auto border rounded-lg bg-card">
          <h2 className="text-xl font-semibold text-destructive mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
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
          <AppLayout>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/barcode" element={<BarcodePage />} />
                  <Route path="/filter" element={<FilterPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AppLayout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;