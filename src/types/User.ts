export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
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