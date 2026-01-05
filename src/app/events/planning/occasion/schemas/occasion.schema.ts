import { z } from 'zod'
import { OccasionType } from '@/../client/common/api/gen/ourbride-api'

/**
 * Schema for Occasion form validation
 */
export const occasionFormSchema = z
  .object({
    titleEn: z.string().optional(),
    titleAr: z.string().optional(),
    subTitleEn: z.string().optional(),
    subTitleAr: z.string().optional(),
    caption: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    subDate: z.string().optional().nullable(),
    brideFirstName: z
      .string()
      .min(2, 'Bride first name must be at least 2 characters')
      .max(15, 'Bride first name must not exceed 15 characters')
      .trim(),
    brideLastName: z.string().optional(),
    groomFirstName: z
      .string()
      .min(2, 'Groom first name must be at least 2 characters')
      .max(15, 'Groom first name must not exceed 15 characters')
      .trim(),
    groomLastName: z.string().optional(),
    type: z.nativeEnum(OccasionType),
  })
  .refine(data => data.titleEn || data.titleAr, {
    message: 'Please enter a title in English or Arabic',
    path: ['titleEn'],
  })

export type OccasionFormData = z.infer<typeof occasionFormSchema>
