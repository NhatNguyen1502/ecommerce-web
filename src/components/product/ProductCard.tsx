import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Product } from "../../types/Product";
import { useCart } from "../../hooks/useCart";
import Button from "../ui/CustomButton";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Featured
        </div>
      )}

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {product.averageRating?.toFixed(1)}
            </span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {product.ratingCount}{" "}
            {product.ratingCount === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-auto pt-3 flex justify-between items-center">
          <div className="font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="flex items-center"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
