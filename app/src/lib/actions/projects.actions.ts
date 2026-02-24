// "use client";
import { keepPreviousData } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

import { queryClient } from "../react-query";
import { Project } from "@/types/project.type";

interface ProjectsResponse {
  projects: Project[];
  page: number;
  limit: number;
  total: number;
}

const firstLvl = "/feasibility-studies";

const GetProjects = ({ limit, page, keyword, filter }: { limit: number; page: number; keyword?: string; filter?: string }) => {
  const { useGetQuery } = useApi();

  let url = `${firstLvl}?limit=${limit}&page=${page}${
    filter ? `&fields=${filter}` : ""
  }${keyword ? `&keyword=${keyword}` : ""}`;

  const { data, isPending, isError, error, isSuccess, refetch } = useGetQuery<any>(url, undefined, {
    placeholderData: keepPreviousData,
  });

  // Transform API wrapper { status, results, data: [...] } into ProjectsResponse
  const transformed: ProjectsResponse | undefined = data
    ? {
        projects: (data.data || []).map((p: any) => ({ ...p, id: p._id })),
        page: data.page ?? page,
        limit: data.limit ?? limit,
        total: data.results ?? data.total ?? (data.data?.length ?? 0),
      }
    : undefined;

  return { data: transformed, isPending, isError, error, isSuccess, refetch };
};

const GetProject = ({ id }: { enabled?: boolean; id: string }) => {
  const { useGetQuery } = useApi();
  const { data, isPending, isError, error, isSuccess } = useGetQuery<any>(`${firstLvl}/${id}`, undefined, {
    select: (res: any) => ({ ...res.data, id: res.data?._id }),
  });

  return { data, isPending, isError, error, isSuccess };
};

const AddProjectMutation = () => {
  const { usePostMutation } = useApi();

  return usePostMutation(firstLvl, {
    onSuccess: () => {
      queryClient.refetchQueries({
        predicate: (query) =>
          (query.queryKey[0] as string).startsWith(firstLvl),
      });
    },
  });
};

const EditProjectMutation = ({ id }: { id: string }) => {
  const { usePutMutation } = useApi(); 

  const {
    mutateAsync: editProject,
    isPending,
    error,
    isError,
    isSuccess,
  } = usePutMutation(`${firstLvl}/${id}`, {
    onSuccess: (res: { data: Project }) => {
      // تحديث الكاش بتاع المشروع
      queryClient.setQueryData(
        [`${firstLvl}/${res.data.id}`],
        res.data
      );

      // إعادة جلب قائمة الدراسات
      queryClient.refetchQueries({
        predicate: (query) =>
          (query.queryKey[0] as string).startsWith(firstLvl),
      });
    },
  });

  return {
    editProject,
    isPending,
    error,
    isError,
    isSuccess,
  };
};

const useDeleteProjectMutation = (id: string) => {
  const { useDeleteMutation } = useApi();

  return useDeleteMutation(`${firstLvl}/${id}`, {
    onSuccess: () => {
      queryClient.refetchQueries({
        predicate: (query) =>
          (query.queryKey[0] as string).startsWith(firstLvl),
      });
    },
  });
};



export { GetProjects, GetProject, AddProjectMutation, EditProjectMutation, useDeleteProjectMutation };
