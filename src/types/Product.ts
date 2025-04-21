export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  images: string[];
  isFeatured: boolean;
  averageRating: number;
  ratingCount: number;
  createdOn: string;
  lastUpdatedOn: string;
}

export interface ProductRating {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdOn: string;
}

export interface ProductFilter {
  categoryId?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}