import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  IdeaClub,
  IdeasResponse,
  CreateIdeaClubDto,
  UpdateIdeaClubDto,
} from "@/types/ideas.types";
import { Block } from "@blocknote/core";

// ─── GET LIST ────────────────────────────────────────────────────

interface GetIdeaClubsParams {
  search?: string;
  limit?: number;
  page?: number;
}

export function GetIdeaClubs({ search = "", limit = 10, page = 1 }: GetIdeaClubsParams) {
  const query = useQuery<IdeasResponse>({
    queryKey: ["ideas", { search, limit, page }],
    queryFn: async () => {
      const { data } = await axios.get("/ideas", {
        params: { search, limit, page },
      });
      return data;
    },
  });
  return { data: query.data, isPending: query.isPending };
}

// ─── GET SINGLE ──────────────────────────────────────────────────

export function GetIdeaClub({ id }: { id: string }) {
  const query = useQuery<IdeaClub>({
    queryKey: ["idea-club", id],
    queryFn: async () => {
      const { data } = await axios.get(`/ideas/${id}`);
      return data;
    },
    enabled: !!id,
  });
  return { data: query.data, isPending: query.isPending };
}

// ─── CREATE ──────────────────────────────────────────────────────

export function CreateIdeaClubMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateIdeaClubDto) => {
      // image is uploaded as multipart/form-data if it's a base64/file
      const formData = buildFormData(payload);
      const { data } = await axios.post("/ideas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data as IdeaClub;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });

  return {
    createIdeaClub: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}

// ─── UPDATE ──────────────────────────────────────────────────────

export function UpdateIdeaClubMutation({ id, page }: { id: string; page: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UpdateIdeaClubDto) => {
      const formData = buildFormData(payload);
      const { data } = await axios.patch(`/ideas/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data as IdeaClub;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["ideas", id] });
    },
  });

  return {
    updateIdeaClub: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}

// ─── DELETE ──────────────────────────────────────────────────────

export function DeleteIdeaClubMutation({ id, page }: { id: string; page: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/ideas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });

  return {
    deleteIdeaClub: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}

// ─── HELPER ──────────────────────────────────────────────────────

/**
 * Builds a FormData object from the payload.
 * - `imageUrl`: if base64 → convert to Blob and append as file
 *               if a URL string → append as plain text
 *               if absent → skip
 * - `content`:  Block[] → JSON stringified
 * - All other fields appended as strings
 */
function buildFormData(payload: CreateIdeaClubDto | UpdateIdeaClubDto): FormData {
  const fd = new FormData();

  const { imageUrl, content, ...rest } = payload;

  // Append all simple string fields
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined) fd.append(key, String(value));
  });

  // Append content as serialized JSON
  if (content !== undefined) {
    fd.append("content", JSON.stringify(content));
  }

  // Handle image
  if (imageUrl) {
    if (imageUrl.startsWith("data:")) {
      const [meta, base64] = imageUrl.split(",");
      const mime = meta.match(/:(.*?);/)?.[1] ?? "image/jpeg";
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      fd.append("image", new Blob([bytes], { type: mime }), "image.jpg");
    } else {
      fd.append("imageUrl", imageUrl);
    }
  }

  return fd;
}