import { useApi } from "@/hooks/useApi";
import { IdeaClub } from "@/types/ideas.types";

export const useIdeaDetails = (id: string) => {
  const { useGetQuery } = useApi();

  return useGetQuery<IdeaClub>(`/ideas/${id}`, undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
};
