import { z } from 'zod'

/**
 * Schema for creating a service category
 * Validates name and description fields
 */
export const createServiceCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').trim(),
  description: z
    .string()
    .trim()
    .optional()
    .transform(val => val || undefined),
})

/**
 * Inferred TypeScript type from the schema
 */
export type CreateServiceCategoryFormValues = z.infer<
  typeof createServiceCategorySchema
>
