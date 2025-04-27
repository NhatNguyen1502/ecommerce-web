import { Product, ProductRating, ProductRatingPayload } from '../types/Product';

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

export const getProductById = async (id: string) => {
  const res = await request({
    method: "get",
    url: `/api/products/${id}`,
  });

  return res.data as Product;
};

export const getFeaturedProducts = async (page: number, size: number) => {
    const res = await request({
      method: "get",
      url: `/api/products/featured?page=${page}&size=${size}`,
    });

    return {
      content: res.data.content as Product[],
      totalPages: res.data.totalPages,
      totalElements: res.data.totalElements,
      currentPage: res.data.currentPage || page,
    };
};

export const getProductRatings = async (productId: string) => {
  const res = await request({
    method: "get",
    url: `/api/products/${productId}/reviews`,
  });
  return res.data as ProductRating[];
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

export const addProductRating = async (
  id: string,
  data: ProductRatingPayload,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "post",
    url: `/api/products/${id}/reviews`,
    data,
    onSuccess,
    onError,
  });
};