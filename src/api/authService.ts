import request from '../utils/Axiosconfig';
import { SignInPayload, SignUpPayload } from './../types/User';

export const postSignIn = async (
  data: Omit<SignInPayload, "confirmPassword">,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) => {
  await request({
    method: "post",
    url: "/auth/sign-in",
    data,
    onSuccess,
    onError,
  });
};

export const postSignUp = async (data: Omit<SignUpPayload,'confirmPassword'>, onSuccess: () => void, onError: (error: any) => void) => {
  await request({
    method: "post",
    url: "/auth/sign-up",
    data,
    onSuccess,
    onError,
  });
};

export const postLogOut = async (
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  await request({
    method: "post",
    url: "/auth/logout",
    onSuccess,
    onError,
  });
};