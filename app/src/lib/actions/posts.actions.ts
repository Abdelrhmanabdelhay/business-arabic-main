// "use client";
import { keepPreviousData } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

import { queryClient } from "../react-query";
import { BlogPost } from "@/types/blog.types";

interface PostsResponse {
  blogs: BlogPost[];
  page: number;
  limit: number;
  total: number;
}

const firstLvl = "/blog";

const GetPosts = ({
  limit,
  page,
  keyword,
  filter,
}: {
  limit: number;
  page: number;
  keyword?: string;
  filter?: string;
}) => {
  const { useGetQuery } = useApi();
  let url = `/blog?limit=${limit}&page=${page}${
    filter ? `&fields=${filter}` : ""
  }${keyword ? `&keyword=${keyword}` : ""}`;

  const { data, isPending, isError, error, isSuccess, refetch } = useGetQuery<PostsResponse>(url, undefined, {
    placeholderData: keepPreviousData,
  });

  return { data, isPending, isError, error, isSuccess, refetch };
};

const GetPost = ({ id }: { enabled?: boolean; id: string }) => {
  const { useGetQuery } = useApi();
  const { data, isPending, isError, error, isSuccess } = useGetQuery<BlogPost>(`${firstLvl}/${id}`);

  return { data, isPending, isError, error, isSuccess };
};

const AddPostMutation = () => {
  const { usePostMutation } = useApi();
  const {
    mutateAsync: addPost,
    isPending,
    error,
    isError,
    isSuccess,
  } = usePostMutation(`${firstLvl}`, {
    onSuccess: () => {
      queryClient.refetchQueries({
        predicate: (query) => (query.queryKey[0] as string).startsWith("/blog?"),
        exact: false,
      });
    },
  });

  return {
    addPost,
    isPending,
    error,
    isError,
    isSuccess,
  };
};
const EditPostMutation = ({ id }: { id: string }) => {
  const { usePatchMutation } = useApi();
  const {
    mutateAsync: editPost,
    isPending,
    error,
    isError,
    isSuccess,
  } = usePatchMutation(`${firstLvl}/${id}`, {
    onSuccess: (newData: BlogPost) => {
      queryClient.setQueryData([`${firstLvl}/${newData.id}`, null], newData);

      queryClient.refetchQueries({
        predicate: (query) => (query.queryKey[0] as string).startsWith("/blog?"),
        exact: false,
      });
    },
  });

  return {
    editPost,
    isPending,
    error,
    isError,
    isSuccess,
  };
};
const DeletePostMutation = ({ id }: { id: string }) => {
  const { useDeleteMutation } = useApi();
  const {
    mutateAsync: deletePost,
    isPending,
    error,
    isError,
    isSuccess,
  } = useDeleteMutation(`${firstLvl}/${id}`, {
    onSuccess: () => {
      queryClient.refetchQueries({
        predicate: (query) => (query.queryKey[0] as string).startsWith("/blog?"),
        exact: false,
      });
    },
  });

  return {
    deletePost,
    isPending,
    error,
    isError,
    isSuccess,
  };
};

export { GetPosts, GetPost, AddPostMutation, EditPostMutation, DeletePostMutation };
