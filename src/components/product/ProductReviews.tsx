import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { ProductRating } from '../../types/Product';
import { format } from 'date-fns';

interface ProductReviewsProps {
  ratings: ProductRating[];
}

const ProductReviews = ({ ratings }: ProductReviewsProps) => {
  const [sortBy, setSortBy] = useState<'recent' | 'highestRated' | 'lowestRated'>('recent');
  
  const sortedRatings = [...ratings].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    } else if (sortBy === 'highestRated') {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });
  
  if (ratings.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }
  
  // Calculate rating stats
  const totalRatings = ratings.length;
  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
  const ratingCounts = {
    5: ratings.filter(r => r.rating === 5).length,
    4: ratings.filter(r => r.rating === 4).length,
    3: ratings.filter(r => r.rating === 3).length,
    2: ratings.filter(r => r.rating === 2).length,
    1: ratings.filter(r => r.rating === 1).length,
  };

  return (
    <div>
      {/* Rating Summary */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < Math.floor(averageRating) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : index < averageRating 
                      ? 'text-yellow-400 fill-yellow-400 opacity-50' 
                      : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">Based on {totalRatings} reviews</div>
        </div>
        
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const percentage = (ratingCounts[star as keyof typeof ratingCounts] / totalRatings) * 100;
            
            return (
              <div key={star} className="flex items-center">
                <div className="flex items-center w-20">
                  <span className="text-sm font-medium text-gray-700 mr-2">{star}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full mr-2">
                  <div
                    className="h-2.5 bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 w-10">
                  {ratingCounts[star as keyof typeof ratingCounts]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">All Reviews ({ratings.length})</h3>
        <div>
          <label htmlFor="sort-by" className="text-sm text-gray-600 mr-2">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="highestRated">Highest Rated</option>
            <option value="lowestRated">Lowest Rated</option>
          </select>
        </div>
      </div>
      
      {/* Reviews List */}
      <div className="space-y-6">
        {sortedRatings.map(rating => (
          <div key={rating.id} className="border-b border-gray-200 pb-6">
            <div className="flex items-start">
              <div className="bg-gray-100 rounded-full p-3 mr-4">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < rating.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {rating.rating}/5
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {format(new Date(rating.createdOn), 'MMM dd, yyyy')}
                </div>
                {rating.comment && (
                  <p className="text-gray-700">{rating.comment}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;