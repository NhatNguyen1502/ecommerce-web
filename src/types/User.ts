export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  role: "customer" | "admin";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phoneNumber: string;
};

export type SignInPayload = {
  email: string;
  password: string;
}

export type UpdateStatusPayload = {
  isActive: boolean
}