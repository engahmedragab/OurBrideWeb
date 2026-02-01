import { z } from 'zod'

/**
 * Helper to parse amount string to number
 */
const parseAmount = (val: unknown): number => {
  if (typeof val === 'string') {
    const cleaned = val.replace(/,/g, '').replace(/\s*EGP\s*/gi, '').trim()
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : Math.max(0, num)
  }
  if (typeof val === 'number') {
    return Math.max(0, val)
  }
  return 0
}

/**
 * Helper to parse nullable amount string to number or null
 */
const parseNullableAmount = (val: unknown): number | null => {
  if (val === null || val === '' || val === undefined) return null
  if (typeof val === 'string') {
    const cleaned = val.replace(/,/g, '').replace(/\s*EGP\s*/gi, '').trim()
    if (!cleaned) return null
    const num = parseFloat(cleaned)
    return isNaN(num) ? null : Math.max(0, num)
  }
  if (typeof val === 'number') {
    return Math.max(0, val)
  }
  return null
}

/**
 * Helper to parse count string to number or null
 */
const parseCount = (val: unknown): number | null => {
  if (val === null || val === '' || val === undefined) return null
  if (typeof val === 'string') {
    const cleaned = val.replace(/,/g, '').trim()
    if (!cleaned) return null
    const num = parseFloat(cleaned)
    return isNaN(num) ? null : Math.max(0, num)
  }
  if (typeof val === 'number') {
    return Math.max(0, val)
  }
  return null
}

/**
 * Schema for Category form validation
 * Includes all fields required by API
 */
export const categoryFormSchema = z.object({
  name: z.string().min(1, 'nameRequired').trim(),
  nameAr: z.string().default(''),
  nameEn: z.string().default(''),
  description: z.string().default(''),
  descriptionAr: z.string().default(''),
  descriptionEn: z.string().default(''),
  estimated: z.preprocess(parseAmount, z.number().min(0, 'estimatedRequired')),
  iconName: z.string().nullable().default(null),
  colorName: z.string().nullable().default(null),
})

/**
 * Schema for Category + Line form (when adding new category, must add a line too)
 */
export const categoryWithLineFormSchema = z.object({
  // Category fields
  name: z.string().min(1, 'nameRequired').trim(),
  nameAr: z.string().default(''),
  nameEn: z.string().default(''),
  description: z.string().default(''),
  descriptionAr: z.string().default(''),
  descriptionEn: z.string().default(''),
  iconName: z.string().nullable().default(null),
  colorName: z.string().nullable().default(null),
  
  // Line fields (required when creating new category)
  expense: z.string().min(1, 'serviceNameRequired').trim(),
  expenseAr: z.string().default(''),
  expenseEn: z.string().default(''),
  estimated: z.preprocess(parseAmount, z.number().min(0, 'totalPriceRequired')),
  paid: z.preprocess(parseAmount, z.number().min(0, 'paidRequired')).default(0),
  final: z.preprocess(parseNullableAmount, z.number().min(0).nullable()).default(null),
  dueDate: z.string().nullable().default(null),
  count: z.preprocess(parseCount, z.number().min(0).nullable()).default(null),
  payer: z.string().nullable().default(null),
  note: z.string().nullable().default(null),
  lineIconName: z.string().nullable().default(null),
  lineColorName: z.string().nullable().default(null),
  isDone: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
})

export type CategoryFormData = z.infer<typeof categoryFormSchema>
export type CategoryWithLineFormData = z.infer<typeof categoryWithLineFormSchema>

