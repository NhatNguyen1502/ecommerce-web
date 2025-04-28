import { UpdateStatusPayload, User } from "@/types/User";
import request from "@/utils/Axiosconfig";

export const getCustomers = async (page: number, size: number, onError: (error: any) => void) => {
  const res = await request({
    method: "get",
    url: `/admin/api/users?page=${page}&size=${size}`,
    onError,
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
    url: `/admin/api/users/${id}`,
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
    url: `/admin/api/users/${id}/status`,
    data,
    onSuccess,
    onError,
  });
};
