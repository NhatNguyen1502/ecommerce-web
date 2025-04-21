import { Product, ProductRating } from '../types/Product';
import { Category } from '../types/Category';

// Mock Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Smartphones',
    description: 'Latest smartphones from top brands',
  },
  {
    id: '2',
    name: 'Tablets',
    description: 'Tablet devices for work and entertainment',
  },
  {
    id: '3',
    name: 'Accessories',
    description: 'Phone accessories including cases, chargers, and more',
  },
  {
    id: '4',
    name: 'Wearables',
    description: 'Smart watches and fitness trackers',
  },
];

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    categoryId: '1',
    description: 'The latest iPhone with A16 Bionic chip, 48MP camera, and Dynamic Island.',
    price: 999,
    images: [
      'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg',
      'https://images.pexels.com/photos/5750003/pexels-photo-5750003.jpeg',
    ],
    isFeatured: true,
    averageRating: 4.8,
    ratingCount: 256,
    createdOn: '2023-09-15T00:00:00Z',
    lastUpdatedOn: '2023-09-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23 Ultra',
    categoryId: '1',
    description: 'The ultimate Galaxy experience with S Pen, 200MP camera, and Snapdragon 8 Gen 2 processor.',
    price: 1199,
    images: [
      'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    ],
    isFeatured: true,
    averageRating: 4.7,
    ratingCount: 189,
    createdOn: '2023-02-10T00:00:00Z',
    lastUpdatedOn: '2023-02-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'Google Pixel 7 Pro',
    categoryId: '1',
    description: 'Experience the best of Google with the Pixel 7 Pro featuring Tensor G2 chip and advanced camera system.',
    price: 899,
    images: [
      'https://images.pexels.com/photos/1229456/pexels-photo-1229456.jpeg',
      'https://images.pexels.com/photos/3585089/pexels-photo-3585089.jpeg',
    ],
    isFeatured: false,
    averageRating: 4.6,
    ratingCount: 145,
    createdOn: '2023-05-25T00:00:00Z',
    lastUpdatedOn: '2023-05-25T00:00:00Z',
  },
  {
    id: '4',
    name: 'iPad Pro 12.9"',
    categoryId: '2',
    description: 'The ultimate iPad experience with M2 chip, Liquid Retina XDR display, and Apple Pencil support.',
    price: 1099,
    images: [
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
      'https://images.pexels.com/photos/4260477/pexels-photo-4260477.jpeg',
    ],
    isFeatured: true,
    averageRating: 4.9,
    ratingCount: 112,
    createdOn: '2023-04-18T00:00:00Z',
    lastUpdatedOn: '2023-04-18T00:00:00Z',
  },
  {
    id: '5',
    name: 'AirPods Pro 2',
    categoryId: '3',
    description: 'Next-generation AirPods Pro with advanced noise cancellation and spatial audio.',
    price: 249,
    images: [
      'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg',
      'https://images.pexels.com/photos/4925916/pexels-photo-4925916.jpeg',
    ],
    isFeatured: false,
    averageRating: 4.7,
    ratingCount: 324,
    createdOn: '2023-03-10T00:00:00Z',
    lastUpdatedOn: '2023-03-10T00:00:00Z',
  },
  {
    id: '6',
    name: 'Apple Watch Series 8',
    categoryId: '4',
    description: 'Advanced health features, including temperature sensing and Crash Detection.',
    price: 399,
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg',
    ],
    isFeatured: true,
    averageRating: 4.5,
    ratingCount: 98,
    createdOn: '2023-06-12T00:00:00Z',
    lastUpdatedOn: '2023-06-12T00:00:00Z',
  },
];

// Mock Product Ratings
export const productRatings: ProductRating[] = [
  {
    id: '1',
    productId: '1',
    userId: '2',
    rating: 5,
    comment: "The best iPhone I've ever owned. The camera is amazing!",
    createdOn: '2023-10-05T14:48:00Z',
  },
  {
    id: '2',
    productId: '1',
    userId: '1',
    rating: 4,
    comment: 'Great phone but battery life could be better.',
    createdOn: '2023-09-28T09:15:00Z',
  },
  {
    id: '3',
    productId: '2',
    userId: '2',
    rating: 5,
    comment: 'The S Pen is a game changer for productivity.',
    createdOn: '2023-03-15T16:30:00Z',
  },
];