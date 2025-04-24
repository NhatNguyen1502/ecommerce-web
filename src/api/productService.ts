import { Product, ProductRating } from '../types/Product';
import { products, productRatings } from './mockData';

import request from "../utils/Axiosconfig";

export const getProducts = async (page: number, size: number) => {
  const res = await request({
    method: "get",
    url: `/api/products?page=${page}&size=${size}`,
  });

  return {
    content: res.data.content as Product[],
    totalPages: res.data.totalPages,
    totalElements: res.data.totalElements,
    currentPage: res.data.currentPage || page,
  };
};

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProductById = async (id: string): Promise<Product> => {
  // Simulate API call
  await delay(500);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return product;
};

export const getFeaturedProducts = async () => {
    const res = await request({
      method: "get",
      url: "/api/products/featured",
    });

    return res.data.content as Product[];
};

export const getProductRatings = async (productId: string): Promise<ProductRating[]> => {
  // Simulate API call
  await delay(600);
  
  return productRatings.filter(r => r.productId === productId);
};


export const createProduct = async (data: FormData, onSuccess: () => void, onError: (error: any) => void) => {
  await request({
    method: "post",
    url: "/api/products",
    data,
    onSuccess,
    onError,
  })
}

export const updateProduct = async (
  id: string,
  data: FormData,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "put",
    url: "/api/products/" + id,
    data,
    onSuccess,
    onError,
  });
};

export const deleteProduct = async (
  id: string,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "delete",
    url: `/api/products/${id}`,
    onSuccess,
    onError,
  });
};

export const addProductRating = async (rating: Omit<ProductRating, 'id' | 'createdOn'>): Promise<ProductRating> => {
  // Simulate API call
  await delay(1000);
  
  // Create new rating
  const newRating: ProductRating = {
    id: String(productRatings.length + 1),
    ...rating,
  };
  
  // In a real app, this would add the rating to the database
  productRatings.push(newRating);
  
  // Update product average rating
  const product = products.find(p => p.id === rating.productId);
  if (product) {
    const productRatingsList = productRatings.filter(r => r.productId === rating.productId);
    const totalRating = productRatingsList.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = totalRating / productRatingsList.length;
    product.ratingCount = productRatingsList.length;
  }
  return newRating;
};