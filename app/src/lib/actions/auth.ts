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

export const setSecureCookie = (name: string, value: string, expirationDays = 30) => {
  setCookie(null, name, value, {
    maxAge: expirationDays * 24 * 60 * 60,
    path: "/",
    secure: false, // مهم
    sameSite: "lax",
  });
};

// Fixed signInMutation
const SignInMutation = () => {
  const { usePostMutation } = useApi();
  const { mutateAsync, isPending } = usePostMutation<AuthResponse, LoginInput>("/auth/signIn");

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

const Logout = async () => {
  
  try {
    // Clear all auth-related cookies with proper options
    const authCookies = ["token", "CRED"];

    authCookies.forEach((cookieName) => {
      destroyCookie(null, cookieName, {
        path: "/",
  secure: true,
  sameSite: "lax", // بدل 
      });
    });

    // Redirect to login page
    window.location.href = "/signIn";

    // Show success message
    toast.success("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Error during logout");
  }
};

export { SignInMutation, SignUpMutation, Logout };
