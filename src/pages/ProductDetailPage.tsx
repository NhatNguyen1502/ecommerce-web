import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, Star, ChevronLeft } from "lucide-react";
import { getProductById, getProductRatings } from "../api/productService";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/CustomButton";
import ProductReviews from "../components/product/ProductReviews";
import ProductRatingForm from "../components/product/ProductRatingForm";
import { formatVND } from "@/helpers/formatCurrency";
import { PRODUCT, PRODUCT_RATINGS } from "@/constants/queryKeys";

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { addToCart } = useCart();

  const { data: product } = useQuery({
    queryKey: [PRODUCT, productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
  });

  const { data: ratings, isLoading: ratingsLoading } = useQuery({
    queryKey: [PRODUCT_RATINGS, productId],
    queryFn: () => getProductRatings(productId!),
    enabled: !!productId,
  });
  let averageRating = 0;
  if (ratings) {
      averageRating = (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) || 0;
  }

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Product Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/products" className="text-blue-600 hover:text-blue-800">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-16">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600">
          Products
        </Link>
        <>
          <span className="mx-2">/</span>
          <Link
            to={`/products/category/${product.category.id}`}
            className="hover:text-blue-600"
          >
            {product.category.name}
          </Link>
        </>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          {product.isFeatured && (
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
              Featured
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index <
                    Math.floor(
                      averageRating
                    )
                      ? "text-yellow-400 fill-yellow-400"
                      : index <
                        averageRating
                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              {averageRating?.toFixed(1)}
            </span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-500">
              {ratings?.length} {ratings?.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900 mb-6">
            {formatVND(product.price)}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Add to Cart */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="flex items-center border border-gray-300 rounded-md mr-4">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-12 text-center border-none focus:ring-0"
                />
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1"
                leftIcon={<ShoppingCart className="h-5 w-5" />}
              >
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div>
              <span className="font-medium text-gray-900">Category:</span>{" "}
              <Link
                to={`/products/category/${product.category.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {product.category.name}
              </Link>
            </div>
            <div>
              <span className="font-medium text-gray-900">Quantity: </span>
              {product.quantity}
            </div>
            <div>
              <span className="font-medium text-gray-900">Added:</span>{" "}
              {new Date(product.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium text-gray-900">Last Updated:</span>{" "}
              {new Date(product.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Customer Reviews
        </h2>

        {ratingsLoading ? (
          <LoadingSpinner className="py-8" />
        ) : (
          <>
            {user ? (
              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <ProductRatingForm productId={productId!}/>
              </div>
            ) : (
              <div className="mb-10 bg-gray-50 p-6 rounded-lg">
                <p className="mb-4">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    login
                  </Link>{" "}
                  to leave a review.
                </p>
              </div>
            )}

            <ProductReviews ratings={ratings || []} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
