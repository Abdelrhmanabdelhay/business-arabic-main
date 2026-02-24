import { keepPreviousData } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

import { queryClient } from "../react-query";
import { IdeaClub } from "@/types/ideas.types";

interface IdeasResponse {
  ideas: IdeaClub[];
  categories?: string[];
  page: number;
  limit: number;
  total: number;
}

const firstLvl = "/ideas";

const GetIdeas = ({
  limit,
  page,
  q,
  filter,
  selectedCategory,
  keyword,
}: {
  limit: number;
  page: number;
  q?: string;
  filter?: string;
  selectedCategory?: string;
  keyword?: string;
}) => {
  const { useGetQuery } = useApi();

  let url = `/ideas?limit=${limit}&page=${page}${
    selectedCategory ? `&category=${selectedCategory}` : ""
  }${keyword ? `&keyword=${keyword}` : ""}`;

  const { data, isPending, isError, error, isSuccess, refetch } = useGetQuery<IdeasResponse>(url, undefined, {
    placeholderData: keepPreviousData,
  });

  return { data, isPending, isError, error, isSuccess, refetch };
};

const GetIdea = ({ id }: { enabled?: boolean; id: string }) => {
  const { useGetQuery } = useApi();
  const { data, isPending, isError, error, isSuccess } = useGetQuery<IdeaClub>(`${firstLvl}/${id}`);

  return { data, isPending, isError, error, isSuccess };
};

const AddIdeaMutation = () => {
  const { usePostMutation } = useApi();
  const {
    mutateAsync: addIdea,
    isPending,
    error,
    isError,
    isSuccess,
  } = usePostMutation(`${firstLvl}`, {
    onSuccess: () => {
      queryClient.refetchQueries({
        predicate: (query) => (query.queryKey[0] as string).startsWith("/ideas?"),
        exact: false,
      });
    },
  });

  return {
    addIdea,
    isPending,
    error,
    isError,
    isSuccess,
  };
};
const EditIdeaMutation = ({ id }: { id: string }) => {
  const { usePatchMutation } = useApi();
  const {
    mutateAsync: editIdea,
    isPending,
    error,
    isError,
    isSuccess,
  } = usePatchMutation(`${firstLvl}/${id}`, {
    onSuccess: (newData: IdeaClub) => {
      queryClient.setQueryData([`${firstLvl}/${newData?.id}`, null], newData);

      queryClient.refetchQueries({
        predicate: (query) => (query.queryKey[0] as string).startsWith("/ideas?"),
        exact: false,
      });
    },
  });

  return {
    editIdea,
    isPending,
    error,
    isError,
    isSuccess,
  };
};
const DeleteIdeaMutation = ({ id }: { id: string }) => {
  const { useDeleteMutation } = useApi();
  const {
    mutateAsync: deleteIdea,
    isPending,
    error,
    isError,
    isSuccess,
  } = useDeleteMutation(`${firstLvl}/${id}`, {
    onSuccess: () => {
      queryClient.refetchQueries({
        predicate: (query) => (query.queryKey[0] as string).startsWith("/ideas"),
        exact: false,
      });
      // console.log("cache",queryClient.getQueryCache().getAll());
    },
  });

  return {
    deleteIdea,
    isPending,
    error,
    isError,
    isSuccess,
  };
};

export { GetIdeas, GetIdea, AddIdeaMutation, EditIdeaMutation, DeleteIdeaMutation };
