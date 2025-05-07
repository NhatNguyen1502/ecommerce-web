import { AddToCartPayload, CartItem, UpdateCartItemPayload } from "@/types/Cart";
import request from "@/utils/Axiosconfig";

export const addToCart = async (
  data: AddToCartPayload,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "post",
    url: "/customer/api/cart/add",
    data,
    onSuccess,
    onError,
  });
};

export const checkoutCart = async (
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "post",
    url: "/customer/api/cart/checkout",
    onSuccess,
    onError,
  });
};

export const getCartItemCount = async () => {
  const res = await request({
    method: "get",
    url: "/customer/api/cart/count",
  });

  return res.data;
};

export const getCartItems = async () => {
  const res = await request({
    method: "get",
    url: "/customer/api/cart",
  });
  return res.data as CartItem[];
};

export const updateCartItemQuantity = async (
  data: UpdateCartItemPayload,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "patch",
    url: "/customer/api/cart/update-quantity",
    data,
    onSuccess,
    onError,
  });
};