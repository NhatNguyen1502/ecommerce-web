import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { addProductRating } from "../../api/productService";
import Button from "../ui/CustomButton";
import { ProductRatingPayload } from "@/types/Product";
import toast from "react-hot-toast";
import { PRODUCT, PRODUCT_RATINGS } from "@/constants/queryKeys";

interface ProductRatingFormProps {
  productId: string;
}

const ProductRatingForm = ({ productId }: ProductRatingFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ProductRatingPayload) =>
      addProductRating(productId, data, () => {
        // Invalidate the cache to refresh the data
        queryClient.invalidateQueries({
          queryKey: [PRODUCT_RATINGS, productId],
        });
        queryClient.invalidateQueries({ queryKey: [PRODUCT, productId] });

        // Reset form
        setRating(0);
        setComment("");
      },
      (error) => {
        toast.error(error.message);
      },)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      return;
    }

    mutation.mutate({
      rating,
      content: comment.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Star Rating */}
      <div className="mb-4">
        <div className="flex items-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    (hoverRating || rating) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {rating ? `You rated this ${rating} out of 5` : "Click to rate"}
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Your Review (optional)
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Share your experience with this product..."
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={rating === 0 || mutation.isPending}
        isLoading={mutation.isPending}
      >
        Submit Review
      </Button>

      {mutation.isSuccess && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md">
          Thank you for your review!
        </div>
      )}
    </form>
  );
};

export default ProductRatingForm;

