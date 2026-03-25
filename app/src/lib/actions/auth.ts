"use client";
import { User } from "@/types/user.type";
import { LoginInput, RegisterInput } from "../schemas/authSchema";
import { setCookie, destroyCookie } from "nookies";
import toast from "react-hot-toast";
import { useApi } from "@/hooks/useApi";

interface AuthResponse {
  user: User;
  token: string;
}

// ================== Cookies ==================
export const setSecureCookie = (
  name: string,
  value: string,
  expirationDays = 30
) => {
  setCookie(null, name, value, {
    maxAge: expirationDays * 24 * 60 * 60,
    path: "/",
    secure: false,
    sameSite: "lax",
  });
};

// ================== Sign In ==================
const SignInMutation = () => {
  const { usePostMutation } = useApi();
  const { mutateAsync, isPending } =
    usePostMutation<AuthResponse, LoginInput>("/auth/signIn");

  const signIn = async (data: LoginInput) => {
    const response = await mutateAsync(data);

    if (response?.token) {
      setSecureCookie("token", response.token);
      setSecureCookie("CRED", JSON.stringify(response.user));
    }

    return response;
  };

  return { signIn, isPending };
};

// ================== Sign Up ==================
const SignUpMutation = () => {
  const { usePostMutation } = useApi();
  const {
    mutateAsync: signUp,
    isPending,
    data,
    isSuccess,
  } = usePostMutation<AuthResponse, RegisterInput>("/auth/signup");

  if (isSuccess && data?.token) {
    setSecureCookie("token", data.token);
  }

  return { signUp, isPending, data };
};

// ================== Forgot Password ==================
const ForgotPasswordMutation = () => {
  const { usePostMutation } = useApi();

  const { mutateAsync, isPending } =
    usePostMutation<{ message: string }, { email: string }>(
      "/auth/forgot-password"
    );

  const forgotPassword = async (data: { email: string }) => {
    const response = await mutateAsync(data);

    toast.success(response.message || "Reset link sent 📩");

    return response;
  };

  return { forgotPassword, isPending };
};

// ================== Reset Password ==================
const ResetPasswordMutation = (token: string) => {
  const { usePostMutation } = useApi();

  const { mutateAsync, isPending } =
    usePostMutation<{ message: string }, { password: string }>(
      `/auth/reset-password/${token}`
    );

  const resetPassword = async (data: { password: string }) => {
    const response = await mutateAsync(data);

    toast.success(response.message || "Password reset successfully ✅");

    return response;
  };

  return { resetPassword, isPending };
};

// ================== Logout ==================
const Logout = async () => {
  try {
    const authCookies = ["token", "CRED"];

    authCookies.forEach((cookieName) => {
      destroyCookie(null, cookieName, {
        path: "/",
        secure: true,
        sameSite: "lax",
      });
    });

    window.location.href = "/";
    toast.success("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Error during logout");
  }
};

export {
  SignInMutation,
  SignUpMutation,
  ForgotPasswordMutation,
  ResetPasswordMutation,
  Logout,
};