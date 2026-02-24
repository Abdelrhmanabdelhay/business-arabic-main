"use client";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user.type";
import { queryClient } from "../react-query";
import { z } from "zod";
import { keepPreviousData } from "@tanstack/react-query";
import { setSecureCookie } from "./auth";

const addUserInputSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["user", "admin", "super admin"]),
});

type AddUserInput = z.infer<typeof addUserInputSchema>;

interface usersResponse {
  users: User[];
  allUsersCount: number;
  resultsCount: number;
  page: number;
  limit: number;
  message?: string;
}

const GetUsers = ({ search, limit, page }: { search?: string; limit: number; page: number }) => {
  const { useGetQuery } = useApi();

  let url = "/users";

  if (search && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(search)) {
    url += `/search?email=${search}`;
  } else if (search) {
    url += `?fullName=${search}`;
  } else {
    url += `?limit=${limit}&page=${page}`;
  }
  const { data, isPending, isError, error, isSuccess } = useGetQuery<usersResponse>(url, undefined, {
    placeholderData: keepPreviousData,
  });

  return { data, isPending, isError, error, isSuccess };
};

const GetProfile = () => {
  const { useGetQuery } = useApi();

  const { data, isPending, isError, error, isSuccess } = useGetQuery<User>(`/users/me`);

  setSecureCookie("CRED", JSON.stringify(data));

  return { data, isPending, isError, error, isSuccess };
};
const GetUser = ({ enabled = true, id }: { enabled?: boolean; id: string }) => {
  const { useGetQuery } = useApi();

  const { data, isPending, isError, error, isSuccess } = useGetQuery<User>(`/users/${id}`);

  return { data, isPending, isError, error, isSuccess };
};

const AddUserMutation = ({ page }: { page: number }) => {
  const { usePostMutation } = useApi();

  const {
    mutateAsync: addUser,
    isPending,
    error,
    isError,
    isSuccess,
  } = usePostMutation<usersResponse, AddUserInput>("/users/insert", {
    onSuccess: () => {
      queryClient.refetchQueries({
        predicate: (query) => (query.queryKey[0] as string).startsWith("/users"),
        exact: false,
      });
      // queryClient.invalidateQueries("/users?limit");
    },
  });

  return { addUser, isPending, error, isError, isSuccess };
};

const UpdateUserMutation = ({ id, page }: { id: string; page: number }) => {
  const { usePatchMutation } = useApi();

  const {
    mutateAsync: updateUser,
    isPending,
    error,
    isError,
    isSuccess,
  } = usePatchMutation(`/users/${id}`, {
    onSuccess: (newData: User) => {
      queryClient.setQueryData([`/users/${newData?.id}`, null], newData);

      queryClient.refetchQueries({
        predicate: (query) => (query.queryKey[0] as string).startsWith("/users?limit"),
        exact: false,
      });
    },
  });

  return { updateUser, isPending, error, isError, isSuccess };
};
const DeleteUserMutation = ({ id }: { id: string }) => {
  const { useDeleteMutation } = useApi();

  const {
    mutateAsync: deleteUser,
    isPending,
    error,
    isError,
    isSuccess,
  } = useDeleteMutation(`/users/${id}`, {
    onSuccess: () => {
      // queryClient.invalidateQueries("/users?limit");
      queryClient.refetchQueries({
        predicate: (query) => (query.queryKey[0] as string).startsWith("/users?limit"),
        exact: false,
      });
    },
  });

  return { deleteUser, isPending, error, isError, isSuccess };
};

export { GetUser, GetProfile, GetUsers, AddUserMutation, UpdateUserMutation, DeleteUserMutation };
