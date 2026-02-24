import { useApi } from "@/hooks/useApi";
import { Project } from "@/types/project.type";

export const useFeasibilityDetails = (id: string) => {
  const { useGetQuery } = useApi();

  return useGetQuery<Project>(`/feasibility-studies/${id}`, undefined, {
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
    select: (res: any) => ({ ...res.data, id: res.data?._id }),
  });
};
