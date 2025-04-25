import { UpdateStatusPayload, User } from "@/types/User";
import request from "@/utils/Axiosconfig";

export const getCustomers = async (page: number, size: number) => {
  const res = await request({
    method: "get",
    url: `/api/users?page=${page}&size=${size}`,
  });

  return {
    content: res.data.content as User[],
    totalPages: res.data.totalPages,
    totalElements: res.data.totalElements,
    currentPage: res.data.currentPage || page,
  };
};

export const deleteCustomer = async (id: string, onSuccess: () => void, onError: (error: any) => void) => {
   await request({
    method: "delete",
    url: `/api/users/${id}`,
    onSuccess,
    onError,
  });
};

export const updateCustomerStatus = async (
  id: string,
  data: UpdateStatusPayload,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "patch",
    url: `/api/users/${id}/status`,
    data,
    onSuccess,
    onError,
  });
};
