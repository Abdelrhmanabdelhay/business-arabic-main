import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios"; // reuse your existing axios instance
import { BlogResponseDto, BlogListResponseDto, CreateBlogDto, UpdateBlogDto } from "@/types/blog.type";

// ─── Query Keys ──────────────────────────────────────────────────────────────

const BLOGS_KEY = "blog";
const BLOG_KEY = "blog";

// ─── GET /blogs ───────────────────────────────────────────────────────────────

interface GetBlogsParams {
  search?: string;
  limit?: number;
  page?: number;
}

export function GetBlogs({ search = "", limit = 10, page = 1 }: GetBlogsParams) {
  const query = useQuery<BlogListResponseDto>({
    queryKey: [BLOGS_KEY, { search, limit, page }],
    queryFn: async () => {
      const { data } = await axios.get("/blog", {
        params: { search, limit, page },
      });
      return data;
    },
  });

  return { data: query.data, isPending: query.isPending, error: query.error };
}

// ─── GET /blogs/:id ───────────────────────────────────────────────────────────

interface GetBlogParams {
  id: string;
}

export function GetBlog({ id }: GetBlogParams) {
  const query = useQuery<BlogResponseDto>({
    queryKey: [BLOG_KEY, id],
    queryFn: async () => {
      const { data } = await axios.get(`/blog/${id}`);
      return data;
    },
    enabled: !!id,
  });

  return { data: query.data, isPending: query.isPending, error: query.error };
}

// ─── POST /blogs ──────────────────────────────────────────────────────────────

export function CreateBlogMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateBlogDto) => {
      const { data } = await axios.post("/blog", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_KEY] });
    },
  });

  return {
    createBlog: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

// ─── PATCH /blogs/:id ─────────────────────────────────────────────────────────

interface UpdateBlogMutationParams {
  id: string;
  page?: number;
}

export function UpdateBlogMutation({ id, page = 1 }: UpdateBlogMutationParams) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UpdateBlogDto) => {
      const { data } = await axios.patch(`/blog/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BLOG_KEY, id] });
    },
  });

  return {
    updateBlog: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

// ─── DELETE /blogs/:id ────────────────────────────────────────────────────────

interface DeleteBlogMutationParams {
  id: string;
  page?: number;
}

export function DeleteBlogMutation({ id, page = 1 }: DeleteBlogMutationParams) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/blog/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOGS_KEY] });
    },
  });

  return {
    deleteBlog: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}