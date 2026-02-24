import { z } from "zod";

const ideaSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  category: z.string().min(1, "الوصف مطلوب"),
  content: z.array(z.any()).optional(),
});

type IdeaFormData = z.infer<typeof ideaSchema>;

export { ideaSchema };
export type { IdeaFormData };