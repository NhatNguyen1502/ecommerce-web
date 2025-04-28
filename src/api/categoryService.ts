import { Product } from "@/types/Product";
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/Category";
import request from "../utils/Axiosconfig";
import { categories } from "./mockData";

export const getCategories = async () => {
  const res = await request({
    method: "get",
    url: "/api/categories",
  });

  return res.data as Category[];
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const category = categories.find((c) => c.id === id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const createCategory = async (
  data: CreateCategoryPayload,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "post",
    url: "/admin/api/categories",
    data,
    onSuccess,
    onError,
  });
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryPayload,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "put",
    url: `/admin/api/categories/${id}`,
    data,
    onSuccess,
    onError,
  });
};

export const deleteCategory = async (
  id: string,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "delete",
    url: `/admin/api/categories/${id}`,
    onSuccess,
    onError,
  });
};

export const getProductByCategory = async (
  id: string,
  page: number,
  size: number
) => {
  const res = await request({
    method: "get",
    url: `/api/categories/${id}/products?page=${page}&size=${size}`,
  });

  return {
    content: res.data.content as Product[],
    totalPages: res.data.totalPages,
    totalElements: res.data.totalElements,
    currentPage: res.data.currentPage,
  };
};
