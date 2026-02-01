import { z } from 'zod'

export const addGuestFormSchema = z.discriminatedUnion('categoryMode', [
  z.object({
    categoryMode: z.literal('existing'),
    lineCategoryId: z.string().min(1, 'categoryRequired'),
    nickName: z.string().min(2, 'guestNameMin').trim(),
    status: z.enum(['none', 'confirmed']).default('none'),
    peopleCount: z.coerce
      .number()
      .min(1, 'peopleMin')
      .max(20, 'peopleMax')
      .default(1),
  }),

  z.object({
    categoryMode: z.literal('new'),
    categoryName: z.string().min(2, 'categoryNameMin').trim(),
    categorySlug: z.string().optional(),
    categoryDescription: z.string().optional(),
    nickName: z.string().min(2, 'guestNameMin').trim(),
    status: z.enum(['none', 'confirmed']).default('none'),
    peopleCount: z.coerce
      .number()
      .min(1, 'peopleMin')
      .max(20, 'peopleMax')
      .default(1),
  }),
])

export type AddGuestFormData = z.infer<typeof addGuestFormSchema>
