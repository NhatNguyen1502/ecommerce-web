import { Link } from "react-router-dom";
import { ShoppingCart, Star, AlertCircle } from "lucide-react";
import type { Product } from "../../types/Product";
import Button from "../ui/CustomButton";
import { formatVND } from "@/helpers/formatCurrency";
import { addToCart } from "@/api/cartService";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CART_ITEM_COUNT } from "@/constants/queryKeys";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isOutOfStock = product.quantity <= 0;
  const queryClient = useQueryClient();


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
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

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full relative"
    >
      {/* Product Image with gradient overlay on hover */}
      <div className="aspect-square overflow-hidden bg-gray-50 relative">
        <img
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute top-3 left-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium px-3 py-1 rounded-r-full shadow-sm">
          Featured
        </div>
      )}

      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-3 right-0 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-l-full shadow-sm">
          Out of Stock
        </div>
      )}

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3 bg-gray-50 rounded-full px-3 py-1 w-fit">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {product.averageRating?.toFixed(1)}
            </span>
          </div>
          <span className="mx-1.5 text-gray-300">•</span>
          <span className="text-xs text-gray-500">
            {product.ratingCount}{" "}
            {product.ratingCount === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Quantity Indicator */}
        <div className="mb-3 flex items-center">
          <span className="text-sm text-gray-600">
            {isOutOfStock ? (
              <span className="flex items-center text-red-500">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                Out of stock
              </span>
            ) : (
              <span>
                In stock:{" "}
                <span className="font-medium">{product.quantity}</span>
              </span>
            )}
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-100">
          <div className="font-bold text-gray-900 text-lg">
            {formatVND(product.price)}
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
            className={`flex items-center rounded-full transition-all duration-300 ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200"
                : "hover:shadow-md"
            }`}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            {isOutOfStock ? "Sold Out" : "Add"}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
