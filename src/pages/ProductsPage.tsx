import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { getProducts } from "../api/productService";
import { getCategories } from "../api/categoryService";
import { getCategoryById } from "../api/categoryService";
import { ProductFilter } from "../types/Product";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/CustomButton";

const ProductsPage = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [filter, setFilter] = useState<ProductFilter>({
    categoryId: categoryId || undefined,
    searchTerm: searchTerm || undefined,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update filter when URL params change
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      categoryId: categoryId || undefined,
      searchTerm: searchTerm || undefined,
    }));
  }, [categoryId, searchTerm]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", filter],
    queryFn: () => getProducts(filter),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: currentCategory } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId!),
    enabled: !!categoryId,
  });

  const handleCategoryFilterChange = (id?: string) => {
    setFilter((prev) => ({
      ...prev,
      categoryId: id,
    }));
  };

  const handleFeaturedFilterChange = (featured?: boolean) => {
    setFilter((prev) => ({
      ...prev,
      featured,
    }));
  };

  const clearFilters = () => {
    setFilter({
      searchTerm: searchTerm || undefined,
    });
  };

  const toggleFilterMobile = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="mb-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {currentCategory
            ? `${currentCategory.name}`
            : searchTerm
            ? `Search results for "${searchTerm}"`
            : "All Products"}
        </h1>
        {currentCategory && (
          <p className="mt-2 text-gray-600">{currentCategory.description}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={toggleFilterMobile}
            className="w-full flex items-center justify-center"
            leftIcon={<Filter className="h-4 w-4" />}
          >
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters Sidebar - Desktop always visible, mobile conditional */}
        <div
          className={`md:w-64 bg-white p-4 rounded-lg shadow-sm ${
            isFilterOpen ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all-categories"
                  name="category"
                  checked={!filter.categoryId}
                  onChange={() => handleCategoryFilterChange(undefined)}
                  className="h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor="all-categories"
                  className="ml-2 text-sm text-gray-700"
                >
                  All Categories
                </label>
              </div>
              {categories?.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`category-${category.id}`}
                    name="category"
                    checked={filter.categoryId === category.id}
                    onChange={() => handleCategoryFilterChange(category.id)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Product Status</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="featured-all"
                  name="featured"
                  checked={filter.featured === undefined}
                  onChange={() => handleFeaturedFilterChange(undefined)}
                  className="h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor="featured-all"
                  className="ml-2 text-sm text-gray-700"
                >
                  All Products
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="featured-only"
                  name="featured"
                  checked={filter.featured === true}
                  onChange={() => handleFeaturedFilterChange(true)}
                  className="h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor="featured-only"
                  className="ml-2 text-sm text-gray-700"
                >
                  Featured Only
                </label>
              </div>
            </div>
          </div>

          {/* Applied Filters */}
          {(filter.minPrice ||
            filter.maxPrice ||
            filter.featured !== undefined) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-2">Applied Filters</h3>
              <div className="flex flex-wrap gap-2">
                {filter.featured && (
                  <div className="flex items-center bg-gray-100 text-xs rounded-full px-3 py-1">
                    Featured Only
                    <button
                      onClick={() =>
                        setFilter((prev) => ({ ...prev, featured: undefined }))
                      }
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <LoadingSpinner className="py-12" />
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
