import { z } from 'zod'

/**
 * Helper to parse amount string to number
 */
const parseAmount = (val: unknown): number => {
  if (typeof val === 'string') {
    const cleaned = val
      .replace(/,/g, '')
      .replace(/\s*EGP\s*/gi, '')
      .trim()
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
    const cleaned = val
      .replace(/,/g, '')
      .replace(/\s*EGP\s*/gi, '')
      .trim()
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
 * Schema for Budget Line form validation
 * Includes all fields required by API
 */
export const budgetLineFormSchema = z.object({
  expense: z.string().min(1, 'Service name is required').trim(),
  expenseAr: z.string().default(''),
  expenseEn: z.string().default(''),
  lineCategoryId: z.number().nullable().default(null),
  estimated: z.preprocess(
    parseAmount,
    z.number().min(0, 'Total price must be 0 or greater')
  ),
  paid: z
    .preprocess(parseAmount, z.number().min(0, 'Paid must be 0 or greater'))
    .default(0),
  final: z
    .preprocess(parseNullableAmount, z.number().min(0).nullable())
    .default(null),
  dueDate: z.string().nullable().default(null),
  count: z.preprocess(parseCount, z.number().min(0).nullable()).default(null),
  payer: z.string().nullable().default(null),
  note: z.string().nullable().default(null),
  iconName: z.string().nullable().default(null),
  colorName: z.string().nullable().default(null),
  isDone: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
})

export type BudgetLineFormData = z.infer<typeof budgetLineFormSchema>
