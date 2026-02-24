import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  summary: z.string().min(1, "Summary is required").max(500, "Summary must be 500 characters or less"),
  content: z.unknown(),
  image: z.string().url("Invalid image URL").optional(),
}),
});

export const updateBlogSchema = z.object({
  body: z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less").optional(),
  summary: z.string().min(1, "Summary is required").max(500, "Summary must be 500 characters or less").optional(),
  content: z.unknown(),
  image: z.string().url("Invalid image URL").optional(),
}),
});
export const getBlogsQuerySchema = z.object({
    body: z.object({

  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
}),
});
export const CreatePlanSchema = z.object({
  body: z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  ideas: z.array(z.string()),
}),
});