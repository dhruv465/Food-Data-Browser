import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductGrid, {
  ProductCardSkeleton,
} from "../components/product/product-grid";
import SearchBar from "../components/product/search-bar";
import { getCategories, searchProductsByName } from "../lib/api/foodApi";

const HomeRedesigned = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageSize = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("popularity");
  
  // Check URL for search query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryTerm = queryParams.get('q');
    if (queryTerm) {
      setSearchTerm(queryTerm);
    }
  }, [location.search]);

  // Fetch categories for filter sidebar
  const { data: categoriesData } = useInfiniteQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return undefined;
    },
  });

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allProducts", searchTerm, selectedCategory, sortBy],
    queryFn: ({ pageParam = 1 }) =>
      searchProductsByName(searchTerm, pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      if (
        !lastPage ||
        !lastPage.products ||
        lastPage.products.length < pageSize
      ) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const allProducts =
    productsData?.pages.flatMap((page) => page.products) || [];

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Discover Healthy & Delicious Foods
          </h1>
          <div className="w-full max-w-xl mx-auto">
            <SearchBar
              className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg"
              onSearch={(term) => {
                setSearchTerm(term);
                // Update URL without navigating away
                if (term.trim()) {
                  const newUrl = `/?q=${encodeURIComponent(term.trim())}`;
                  window.history.pushState({ path: newUrl }, '', newUrl);
                } else {
                  window.history.pushState({}, '', '/');
                }
              }}
              initialValue={searchTerm}
            />
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 z-20 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="popularity">Sort by: Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest First</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/barcode")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${
                    isHovered ? "rotate-12" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Scan Barcode
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Panel */}
            {showFilters && (
              <div className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6 md:mb-0 order-1 md:order-none">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span>All Categories</span>
                    </label>
                    {categoriesData?.pages?.[0]?.tags
                      ?.slice(0, 10)
                      .map((category) => (
                        <label key={category.id} className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value={category.id}
                            checked={selectedCategory === category.id}
                            onChange={() => setSelectedCategory(category.id)}
                            className="mr-2 text-green-600 focus:ring-green-500"
                          />
                          <span>{category.name}</span>
                        </label>
                      )) ||
                      [
                        "Breakfast Cereals",
                        "Dairy",
                        "Snacks",
                        "Beverages",
                        "Fruits",
                      ].map((cat) => (
                        <label key={cat} className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value={cat.toLowerCase()}
                            checked={selectedCategory === cat.toLowerCase()}
                            onChange={() =>
                              setSelectedCategory(cat.toLowerCase())
                            }
                            className="mr-2 text-green-600 focus:ring-green-500"
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Price Range
                  </h4>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Nutrition Filters */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Nutrition
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span>Low Sugar</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span>Low Fat</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span>High Protein</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span>Organic</span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 100]);
                  }}
                  className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-grow order-2 md:order-none">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : "Featured Products"}
                </h2>
                {searchTerm && (
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      window.history.pushState({}, '', '/');
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Search
                  </button>
                )}
              </div>
            </div>

              <ProductGrid products={allProducts} loading={productsLoading} />

              {productsError && (
                <div className="text-center py-4 mt-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">
                    Failed to load products. Please try again later.
                  </p>
                </div>
              )}

              {isFetchingNextPage && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <ProductCardSkeleton key={index} className="mt-7" />
                    ))}
                </div>
              )}

              <div className="flex justify-center mt-8">
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeRedesigned;
