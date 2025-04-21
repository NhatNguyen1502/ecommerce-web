import { Product, ProductFilter, ProductRating } from '../types/Product';
import { products, productRatings } from './mockData';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async (filter?: ProductFilter): Promise<Product[]> => {
  // Simulate API call
  await delay(800);
  
  let filteredProducts = [...products];
  
  if (filter) {
    // Filter by category
    if (filter.categoryId) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === filter.categoryId);
    }
    
    // Filter by search term
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
      );
    }
    
    // Filter by price range
    if (filter.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filter.minPrice!);
    }
    if (filter.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filter.maxPrice!);
    }
    
    // Filter featured products
    if (filter.featured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.isFeatured === filter.featured);
    }
  }
  
  return filteredProducts;
};

export const getProductById = async (id: string): Promise<Product> => {
  // Simulate API call
  await delay(500);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return product;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  // Simulate API call
  await delay(800);
  
  return products.filter(p => p.isFeatured);
};

export const getProductRatings = async (productId: string): Promise<ProductRating[]> => {
  // Simulate API call
  await delay(600);
  
  return productRatings.filter(r => r.productId === productId);
};

export const addProductRating = async (rating: Omit<ProductRating, 'id' | 'createdOn'>): Promise<ProductRating> => {
  // Simulate API call
  await delay(1000);
  
  // Create new rating
  const newRating: ProductRating = {
    id: String(productRatings.length + 1),
    ...rating,
    createdOn: new Date().toISOString(),
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
    product.lastUpdatedOn = new Date().toISOString();
  }
  
  return newRating;
};