import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCardNew from "../components/product/product-card";
import ProductFilters from "../components/product/product-filters";
import SearchBar from "../components/product/search-bar";
import { getCategories, searchProductsByName } from "../lib/api/foodApi";
import { useTheme } from "../lib/theme-context";

const Home = () => {
  const location = useLocation();
  const pageSize = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortOption, setSortOption] = useState(null);
  const { theme } = useTheme();

  // Check URL for search query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryTerm = queryParams.get("q");
    if (queryTerm) {
      setSearchTerm(queryTerm);
    }
  }, [location.search]);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allProducts", searchTerm],
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

  const allProducts = useMemo(() => {
    let products = productsData?.pages.flatMap((page) => page.products) || [];

    // Apply category filters
    if (activeFilters.categories?.length > 0) {
      products = products.filter((product) =>
        activeFilters.categories.some((category) =>
          product.categories_tags?.some((tag) => {
            const normalizedTag = tag.replace('en:', '').split(':').pop().replace(/-/g, ' ').toLowerCase();
            const normalizedCategory = category.toLowerCase();
            return normalizedTag === normalizedCategory;
          })
        )
      );
    }

    // Apply nutrition filters
    if (activeFilters.nutrition) {
      const { sugar, calories, protein } = activeFilters.nutrition;
      products = products.filter((product) => {
        const nutriments = product.nutriments || {};
        if (sugar !== undefined && nutriments.sugars_100g > sugar) return false;
        if (calories !== undefined && nutriments.energy_kcal_100g <= calories) return true;
        if (protein !== undefined && nutriments.proteins_100g <= protein) return true;
        return sugar === undefined && calories === undefined && protein === undefined;
      });
    }

    // Apply sorting
    if (sortOption) {
      products = [...products].sort((a, b) => {
        switch (sortOption) {
          case "name_asc":
            return (a.product_name || "").localeCompare(b.product_name || "");
          case "name_desc":
            return (b.product_name || "").localeCompare(a.product_name || "");
          case "grade_asc":
            return (a.nutriscore_grade || "z").localeCompare(
              b.nutriscore_grade || "z"
            );
          case "grade_desc":
            return (b.nutriscore_grade || "z").localeCompare(
              a.nutriscore_grade || "z"
            );
          case "calories_asc":
            return (
              (a.nutriments?.energy_kcal_100g || 0) -
              (b.nutriments?.energy_kcal_100g || 0)
            );
          case "calories_desc":
            return (
              (b.nutriments?.energy_kcal_100g || 0) -
              (a.nutriments?.energy_kcal_100g || 0)
            );
          default:
            return 0;
        }
      });
    }

    return products;
  }, [productsData, activeFilters, sortOption]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        if (categoriesData && categoriesData.tags) {
          const topCategories = categoriesData.tags.slice(0, 15).map((tag) => {
            const name = tag.name.split(":").pop().replace(/-/g, " ");
            return name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          });
          setAvailableCategories(topCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setAvailableCategories([
          "Beverages",
          "Dairy",
          "Snacks",
          "Fruits",
          "Vegetables",
          "Grains",
          "Proteins",
          "Condiments",
          "Desserts",
          "Bakery",
        ]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
          <div className="w-full max-w-xl mx-auto space-y-4">
            <SearchBar
              className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg"
              onSearch={(term) => {
                setSearchTerm(term);
                if (term.trim()) {
                  const newUrl = `/?q=${encodeURIComponent(term.trim())}`;
                  window.history.pushState({ path: newUrl }, "", newUrl);
                } else {
                  window.history.pushState({}, "", "/");
                }
              }}
              initialValue={searchTerm}
            />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <ProductFilters
        categories={availableCategories}
        onFilterChange={setActiveFilters}
        onSortChange={setSortOption}
        activeFilters={activeFilters}
        onClose={() => setIsExpanded(false)}
      />

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12 relative transition-all duration-300">
        {/* Main Content Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {searchTerm
                  ? `Search Results for "${searchTerm}"`
                  : "Featured Products"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {allProducts.length} products found
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  window.history.pushState({}, "", "/");
                }}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Search
              </button>
            )}
          </div>
        </motion.div>

        {productsError ? (
          <div className="text-center py-12">
            <p className="text-destructive">
              Error loading products. Please try again later.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {allProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <ProductCardNew product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {allProducts.length === 0 && !productsLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <p className="text-lg font-medium mb-2">No products found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search term
                  </p>
                </motion.div>
              )}
            </div>

            {(productsLoading || isFetchingNextPage) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {hasNextPage && !productsLoading && (
              <div className="text-center mt-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : "Load more products"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
