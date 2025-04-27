import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/api/productService";
import { getCategories } from "@/api/categoryService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProductCard from "@/components/product/ProductCard";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryBadge from "@/components/category/CategoryBadge";
import { CATEGORIES, FEATURED_PRODUCTS } from "@/constants/queryKeys";
import { useInfiniteScroll } from "@/hooks/UseInfiniteScrollOptions";
import { Link } from "react-router-dom";

export default function HomePage() {
  // Use useInfiniteQuery for featured products
  const {
    data: featuredProductsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: productsLoading,
  } = useInfiniteQuery({
    queryKey: [FEATURED_PRODUCTS],
    queryFn: ({ pageParam = 0 }) => getFeaturedProducts(pageParam, 8),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages - 1
        ? lastPage.currentPage + 1
        : undefined,
    initialPageParam: 0,
  });

  // Use our custom hook for infinite scrolling
  const { observerTarget } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: [CATEGORIES],
    queryFn: getCategories,
  });

  // Flatten all pages of products into a single array
  const allProducts =
    featuredProductsData?.pages.flatMap((page) => page.content) || [];

  return (
    <div className="space-y-12">
      <HeroBanner />

      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {categoriesLoading ? (
          <LoadingSpinner className="py-8" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <CategoryBadge key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {productsLoading ? (
          <LoadingSpinner className="py-8" />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Loading indicator and observer target */}
            <div ref={observerTarget} className="mt-8 flex justify-center">
              {isFetchingNextPage && <LoadingSpinner />}
              {!hasNextPage && allProducts.length > 0 && (
                <Link
                  to="/products"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <button className="text-sm font-medium">View all</button>
                </Link>
              )}
            </div>
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Genuine Products</h3>
            <p className="text-gray-600">
              We only sell authentic products with full manufacturer warranty.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Competitive pricing and regular deals to save you money.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Support</h3>
            <p className="text-gray-600">
              Expert customer service ready to assist you with your questions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}