import { z } from 'zod'
import { OccasionType } from '@/../client/common/api/gen/ourbride-api'

/**
 * Schema for Occasion form validation
 */
export const occasionFormSchema = z.object({
  titleEn: z.string().optional(),
  titleAr: z.string().optional(),
  subTitleEn: z.string().optional(),
  subTitleAr: z.string().optional(),
  caption: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  subDate: z.string().optional().nullable(),
  brideFirstName: z
    .string()
    .min(2, 'brideFirstNameMin')
    .max(15, 'brideFirstNameMax')
    .trim(),
  brideLastName: z.string().optional(),
  groomFirstName: z
    .string()
    .min(2, 'groomFirstNameMin')
    .max(15, 'groomFirstNameMax')
    .trim(),
  groomLastName: z.string().optional(),
  type: z.nativeEnum(OccasionType),
}).refine(
  (data) => data.titleEn || data.titleAr,
  {
    message: 'titleRequired',
    path: ['titleEn'],
  }
)

export type OccasionFormData = z.infer<typeof occasionFormSchema>

