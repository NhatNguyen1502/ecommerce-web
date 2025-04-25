import { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../types/Category";
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

export const postCategory = async (data: CreateCategoryPayload, onSuccess: () => void, onError: (error: any) => void) => {
  await request({
    method: "post",
    url: "/api/categories",
    data,
    onSuccess,
    onError,
  });
}

export const putCategory = async (id: string, data: UpdateCategoryPayload, onSuccess: () => void, onError: (error: any) => void) => {
  await request({
    method: "put",
    url: `/api/categories/${id}`,
    data,
    onSuccess,
    onError,
  })
}

export const deleteCategory = async (id: string, onSuccess: () => void, onError: (error: any) => void) => {
  await request({
    method: "delete",
    url: `/api/categories/${id}`,
    onSuccess,
    onError,
  });
}

