import { z } from 'zod'

/**
 * Schema for Add Guest form validation
 */
export const addGuestFormSchema = z.object({
  lineCategoryId: z.number().min(1, 'Category is required'),
  nickName: z.string().min(2, 'Guest name must be at least 2 characters').trim(),
  status: z.enum(['None', 'Confirmed', 'Pending']).default('None'),
  attended: z.boolean().default(false),
  peopleCount: z.number().min(1, 'People count must be at least 1').max(20, 'People count cannot exceed 20').default(1),
})

export type AddGuestFormData = z.infer<typeof addGuestFormSchema>

