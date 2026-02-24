import { z } from "zod";

export const createLaunchedProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be 200 characters or less"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, 'Category is required'),
  // image: z.string().url("Invalid image URL").optional(),
  price: z.string().min(1, "Price is required"),
});

export const updateLaunchedProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name must be 200 characters or less").optional(),
  description: z.string().min(1, "Description is required").optional(),
  category: z.string().min(1, 'Category is required').optional(),
  image: z.string().url("Invalid image URL").optional(),
  price: z.string().min(1, "Price is required").optional(),
});

export const getLaunchedProjectsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
