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
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRating {
  id: string;
  rating: number;
  content?: string;
  createdAt: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
  }
}

export interface ProductPayload{
  name: string;
  categoryId: string;
  description: string;
  price: number;
  quantity: number;
  image: File;
  isFeatured: boolean;
}

export interface ProductRatingPayload{
  rating: number;
  content?: string;
}