import { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Minus,
  Plus,
  ShoppingCart,
  Star,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { getProductById, getProductRatings } from "../api/productService";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/CustomButton";
import ProductReviews from "../components/product/ProductReviews";
import ProductRatingForm from "../components/product/ProductRatingForm";
import { formatVND } from "@/helpers/formatCurrency";
import { CART_ITEM_COUNT, PRODUCT, PRODUCT_RATINGS } from "@/constants/queryKeys";
import { addToCart } from "@/api/cartService";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  // Reset quantity to 1 when product changes
  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  let averageRating = 0;
  if (ratings) {
    averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;
  }

  const isOutOfStock = !product || product.quantity <= 0;
  const maxQuantity = product?.quantity || 0;

  const incrementQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value) || 1;
    // Ensure quantity is between 1 and available stock
    const validValue = Math.min(Math.max(1, newValue), maxQuantity);
    setQuantity(validValue);
  };

  const handleAddToCart = () => {
    if (product && !isOutOfStock) {
      const productPayload = { productId: product.id, quantity: 1 };
      addToCart(
        productPayload,
        () => {
          toast.success("Product added to cart");
          queryClient.invalidateQueries({ queryKey: [CART_ITEM_COUNT] });
        },
        (error) => {
          toast.error(error.response.data.message);
        }
      );
    }
  };

  const handleMoveToLogin = () => {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    navigate("/login");
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
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-red-500 text-white px-4 py-2 rounded-md font-bold text-lg">
                  OUT OF STOCK
                </div>
              </div>
            )}
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
                    index < Math.floor(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : index < averageRating
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

          {/* Stock Status */}
          <div className="mb-4">
            {isOutOfStock ? (
              <div className="flex items-center text-red-500 font-medium">
                <AlertCircle className="h-5 w-5 mr-2" />
                Out of Stock
              </div>
            ) : (
              <div className="flex items-center text-green-600">
                <span className="font-medium">In Stock:</span>
                <span className="ml-2">{product.quantity} items available</span>
              </div>
            )}
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
              <div
                className={`flex items-center border border-gray-300 rounded-md mr-4 ${
                  isOutOfStock ? "opacity-50" : ""
                }`}
              >
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={isOutOfStock}
                  className="w-12 text-center border-none focus:ring-0 disabled:bg-gray-100"
                />
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= maxQuantity || isOutOfStock}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1"
                leftIcon={<ShoppingCart className="h-5 w-5" />}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            {!isOutOfStock && quantity === maxQuantity && (
              <p className="text-amber-600 text-sm mt-2">
                You've reached the maximum available quantity for this product.
              </p>
            )}
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
              <span className="font-medium text-gray-900">In stock: </span>
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
                <ProductRatingForm productId={productId!} />
              </div>
            ) : (
              <div className="mb-10 bg-gray-50 p-6 rounded-lg">
                <p className="mb-4">
                  Please{" "}
                  <button
                    onClick={handleMoveToLogin}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    login
                  </button>{" "}
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
