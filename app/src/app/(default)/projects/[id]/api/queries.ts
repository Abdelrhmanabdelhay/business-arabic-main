import { useApi } from "@/hooks/useApi";
import { Project } from "@/types/project.type";

export const useProjectDetails = (id: string) => {
  const { useGetQuery } = useApi();

  return useGetQuery<Project>(`/feasibility-studies/${id}`, undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
};
