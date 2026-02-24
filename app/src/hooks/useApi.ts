import {
  useMutation,
  useQuery,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import { axiosInstance } from "@/lib/axios";

type HttpMethod = "get" | "post" | "patch" | "delete" | "put";

export function useApi() {
  async function fetchData<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await axiosInstance.get<T>(url, config);

    return response.data;
  }

  async function mutateData<T>({
    url,
    method,
    data,
    config,
  }: {
    url: string;
    method: HttpMethod;
    data?: any;
    config?: AxiosRequestConfig;
  }): Promise<T> {
    let response;

    if (method === "delete") {
      response = await axiosInstance.delete<T>(url, { ...config, data });
    } else {
      response = await axiosInstance[method]<T>(url, data, config);
    }

    return response.data;
  }

  return {
    useGetQuery: <TData = unknown, TError = AxiosError>(
      url: string,
      config?: AxiosRequestConfig,
      options?: Omit<
        UseQueryOptions<
          TData,
          TError,
          TData,
          [string, AxiosRequestConfig | undefined]
        >,
        "queryKey" | "queryFn"
      >,
    ) =>
      useQuery<TData, TError, TData, [string, AxiosRequestConfig | undefined]>({
        queryKey: [url, config],
        queryFn: ({ queryKey: [url, config] }) => fetchData<TData>(url, config),
        ...options,
      }),

    usePostMutation: <
      TData = unknown,
      TVariables = unknown,
      TError = AxiosError,
    >(
      url: string,
      options?: Omit<
        UseMutationOptions<TData, TError, TVariables>,
        "mutationFn"
      >,
    ) =>
      useMutation<TData, TError, TVariables>({
        mutationFn: (data: TVariables) => {
          const config: AxiosRequestConfig = {};

          if (data instanceof FormData) {
            config.headers = { "Content-Type": "multipart/form-data" };
          }

          return mutateData<TData>({ url, method: "post", data, config });
        },
        ...options,
      }),

    usePatchMutation: <
      TData = unknown,
      TVariables = unknown,
      TError = AxiosError,
    >(
      url: string,
      options?: Omit<
        UseMutationOptions<TData, TError, TVariables>,
        "mutationFn"
      >,
    ) =>
      useMutation<TData, TError, TVariables>({
        mutationFn: (data: TVariables) => {
          const config: AxiosRequestConfig = {};

          if (data instanceof FormData) {
            config.headers = { "Content-Type": "multipart/form-data" };
          }

          return mutateData<TData>({ url, method: "patch", data, config });
        },
        ...options,
      }),

    usePutMutation: <
      TData = unknown,
      TVariables = unknown,
      TError = AxiosError,
    >(
      url: string,
      options?: Omit<
        UseMutationOptions<TData, TError, TVariables>,
        "mutationFn"
      >,
    ) =>
      useMutation<TData, TError, TVariables>({
        mutationFn: (data: TVariables) => {
          const config: AxiosRequestConfig = {};

          if (data instanceof FormData) {
            config.headers = { "Content-Type": "multipart/form-data" };
          }

          return mutateData<TData>({ url, method: "put", data, config });
        },
        ...options,
      }),

    useDeleteMutation: <
      TData = unknown,
      TVariables = unknown,
      TError = AxiosError,
    >(
      url: string,
      options?: Omit<
        UseMutationOptions<TData, TError, TVariables>,
        "mutationFn"
      >,
    ) =>
      useMutation<TData, TError, TVariables>({
        mutationFn: (data?: TVariables) =>
          mutateData<TData>({ url, method: "delete", data }),
        ...options,
      }),
  };
}
