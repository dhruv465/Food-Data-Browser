import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProductsByName } from "../lib/api/foodApi";
import { PageHeader, PageContent, PageSection } from "../components/ui/layout";
import SearchBar from "../components/product/search-bar";
import ProductCard from "../components/product/product-card";
import { Button } from "../components/ui/button";
import { useDebounce } from "../hooks/use-debounce";

/**
 * SearchPage component - Redesigned search page
 *
 * @returns {JSX.Element} - SearchPage component
 */
const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const PAGE_SIZE = 24;

  // Use our custom debounce hook to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Update search term when URL query parameter changes
  useEffect(() => {
    const newSearchTerm = queryParams.get("q") || "";
    setSearchTerm(newSearchTerm);
    setPage(1);
    setAllProducts([]);
  }, [location.search]);

  // Reset page and clear products when debounced search term changes
  useEffect(() => {
    setPage(1); // Reset to first page on new search
    setAllProducts([]); // Clear previous results on new search
  }, [debouncedSearchTerm]);

  // Fetch products using React Query
  const { data, isLoading, isError, error, isFetching, isPreviousData } =
    useQuery({
      queryKey: ["search", debouncedSearchTerm, page],
      queryFn: () => searchProductsByName(debouncedSearchTerm, page, PAGE_SIZE),
      enabled: debouncedSearchTerm.length > 2, // Only search when term is at least 3 characters
      keepPreviousData: true,
    });

  // Update allProducts when new data is fetched
  useEffect(() => {
    if (data?.products) {
      if (page === 1) {
        setAllProducts(data.products);
      } else {
        setAllProducts((prev) => [...prev, ...data.products]);
      }
    }
  }, [data, page]);

  // Handle search submission
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle load more button click
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="rounded-lg border bg-card p-4 shadow-sm"
        >
          <div className="aspect-square w-full bg-muted animate-pulse rounded-md"></div>
          <div className="mt-3 space-y-2">
            <div className="h-2 w-16 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      ));
  };

  return (
    <>
      <PageHeader
        title="Search Results"
        description={
          debouncedSearchTerm
            ? `Showing results for "${debouncedSearchTerm}"`
            : "Enter a search term to find products"
        }
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setDebouncedSearchTerm("");
              // Update URL without search parameter
              window.history.pushState({}, "", "/search");
            }}
            disabled={!debouncedSearchTerm}
          >
            Clear Search
          </Button>
        }
      />

      <div className="w-full max-w-xl mx-auto mb-8">
        <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      </div>

      <PageSection>
        {/* Search instructions */}
        {!debouncedSearchTerm && (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Start Searching</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter at least 3 characters to search for products by name, brand,
              or ingredients.
            </p>
          </div>
        )}

        {/* Search too short warning */}
        {debouncedSearchTerm && debouncedSearchTerm.length < 3 && (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">
              Search term too short
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Please enter at least 3 characters to search.
            </p>
          </div>
        )}

        {/* Search results */}
        {debouncedSearchTerm && debouncedSearchTerm.length >= 3 && (
          <div className="space-y-6">
            {/* Results count */}
            {!isLoading && !isError && data?.products && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {data.count > 0
                    ? `Found ${data.count} products matching "${debouncedSearchTerm}"`
                    : `No products found matching "${debouncedSearchTerm}"`}
                </p>
              </div>
            )}

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Render products */}
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              {/* Render skeletons while loading */}
              {(isLoading || (isFetching && isPreviousData && page === 1)) &&
                renderSkeletons()}
            </div>

            {/* Load more button */}
            {data?.products?.length > 0 && data?.page < data?.page_count && (
              <div className="mt-8 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  variant="outline"
                  className="min-w-[150px]"
                >
                  {isFetching ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}

            {/* No results */}
            {!isLoading &&
              !isFetching &&
              debouncedSearchTerm.length >= 3 &&
              allProducts.length === 0 && (
                <div className="text-center py-8">
                  <h2 className="text-xl font-semibold mb-2">
                    No products found
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Try a different search term or check your spelling.
                  </p>
                </div>
              )}

            {/* Error state */}
            {isError && !isLoading && (
              <div className="rounded-lg border bg-card p-6 text-center">
                <h3 className="text-lg font-medium mb-2">
                  Error loading products
                </h3>
                <p className="text-muted-foreground mb-4">
                  {error?.message ||
                    "Failed to load products. Please try again."}
                </p>
                <Button onClick={() => setPage(1)} variant="outline">
                  Retry
                </Button>
              </div>
            )}
          </div>
        )}
      </PageSection>
    </>
  );
};

export default SearchPage;
