import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  content: z.array(z.any()).min(1, "Content is required"),
  metaDescription: z
    .string()
    .max(160, "Meta description must be 160 characters or less"),
  focusKeyphrase: z
    .string()
    .max(50, "Focus keyphrase must be 50 characters or less"),
  link: z.string().optional(),
});
