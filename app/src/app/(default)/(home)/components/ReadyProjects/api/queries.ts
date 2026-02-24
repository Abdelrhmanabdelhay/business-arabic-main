import { useApi } from "@/hooks/useApi";
import { ProjectsResponse, IdeasResponse } from "../types";

export const useHomeProjects = () => {
  const { useGetQuery } = useApi();

  return useGetQuery<ProjectsResponse>(
    "/feasibility-studies?limit=3&page=1&fields=id,name,description,image,price,category",
    undefined,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      select: (res: any) => ({
        projects: (res.data || []).map((p: any) => ({ ...p, id: p._id })),
        page: 1,
        limit: 3,
        total: res.results ?? res.data?.length ?? 0,
      }),
    }
  );
};

// export const useHomeIdeas = () => {
//   const { useGetQuery } = useApi();
  
//   return useGetQuery<IdeasResponse>(
//     "/ideas?limit=3&page=1&fields=id,name,description,category,content,createdAt,updatedAt",
//     undefined,
//     {
//       staleTime: 1000 * 60 * 5, // 5 minutes
//     }
//   );
// };
