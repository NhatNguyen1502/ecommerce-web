export interface Product {
  id: string;
  name: string;
  category : {
    id: string
    name: string 
  }
  description: string;
  price: number;
  imageUrl: string;
  isFeatured: boolean;
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRating {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ProductPayload{
  name: string;
  categoryId: string;
  description: string;
  price: number;
  image: File;
  isFeatured: boolean;
}