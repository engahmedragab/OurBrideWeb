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
 * Schema for Category form validation
 */
export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  description: z.string().default(''),
  estimated: z.preprocess(parseAmount, z.number().min(0, 'Estimated must be 0 or greater')),
  iconName: z.string().nullable().default(null),
  colorName: z.string().nullable().default(null),
})

export type CategoryFormData = z.infer<typeof categoryFormSchema>

