import { z } from 'zod'

export const addGuestFormSchema = z.discriminatedUnion('categoryMode', [
  z.object({
    categoryMode: z.literal('existing'),
    lineCategoryId: z.string().min(1, 'Category is required'),
    nickName: z
      .string()
      .min(2, 'Guest name must be at least 2 characters')
      .trim(),
    status: z.enum(['none', 'confirmed']).default('none'),
    peopleCount: z.coerce.number().min(1).max(20).default(1),
  }),

  z.object({
    categoryMode: z.literal('new'),
    categoryName: z
      .string()
      .min(2, 'Category name must be at least 2 characters')
      .trim(),
    categorySlug: z.string().optional(),
    categoryDescription: z.string().optional(),
    nickName: z
      .string()
      .min(2, 'Guest name must be at least 2 characters')
      .trim(),
    status: z.enum(['none', 'confirmed']).default('none'),
    peopleCount: z.coerce.number().min(1).max(20).default(1),
  }),
])

export type AddGuestFormData = z.infer<typeof addGuestFormSchema>
