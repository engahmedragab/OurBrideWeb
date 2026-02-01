import { z } from 'zod'

/**
 * Schema for Add Category form validation
 */
export const addCategoryFormSchema = z.object({
  name: z.string().min(2, 'categoryNameMin').trim(),
  slug: z.string().optional(),
  description: z.string().optional(),
})

export type AddCategoryFormData = z.infer<typeof addCategoryFormSchema>

