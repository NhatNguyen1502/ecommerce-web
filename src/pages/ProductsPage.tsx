import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/CustomButton";
import { CATEGORIES } from "@/constants/queryKeys";
import { Category } from "@/types/Category";

const ProductsPage = () => {
  const { categoryId } = useParams();
  const queryClient = useQueryClient();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const categories =
    (queryClient.getQueryState([CATEGORIES])?.data as Category[]) || [];

  const handleCategoryFilterChange = (categoryId: string) => {
    if (categoryId === "") navigate("/products");
    else navigate(`/products/category/${categoryId}`);
  };

  const toggleFilterMobile = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="mb-12">
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
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all-categories"
                  name="category"
                  checked={!categoryId}
                  onChange={() => handleCategoryFilterChange("")}
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
                    checked={categoryId === category.id}
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
        </div>

        {/* Product Grid */}
        {/* <div className="flex-1">
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
        </div> */}
      </div>
    </div>
  );
};

export default ProductsPage;


