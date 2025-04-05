import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import React from "react";
import ProductGrid, {
  ProductCardSkeleton,
} from "../components/product/product-grid";
import PageLayout from "../components/ui/page-layout";
import { searchProductsByName } from "../lib/api/foodApi";

const HomeRedesigned = () => {
  const navigate = useNavigate();
  const pageSize = 20;

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allProducts"],
    queryFn: ({ pageParam = 1 }) =>
      searchProductsByName("", pageParam, pageSize),
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
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background py-16 -mt-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Discover Healthy Food Choices
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our comprehensive database of food products, their
            nutritional information, and make informed decisions about your
            diet.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/search")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Search Foods
            </button>
            <button
              onClick={() => navigate("/barcode")}
              className="px-6 py-3 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
            >
              Scan Barcode
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Products
          </h2>

          <ProductGrid products={allProducts} loading={productsLoading} />

          {productsError && (
            <div className="text-center py-4 mt-4">
              <p className="text-muted-foreground">
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={isFetchingNextPage}
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomeRedesigned;
