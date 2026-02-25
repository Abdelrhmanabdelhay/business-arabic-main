import { API_URL } from "@/constants/constants";
import axios from "axios";
import { parseCookies } from "nookies";

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Only redirect on client-side
      window.location.href = "/signIn";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
