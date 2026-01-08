import { z } from 'zod'

/**
 * Schema for creating/updating a preparation line
 * Validates all fields used in the ServiceModal form
 */
export const preparationLineSchema = z.object({
  serviceKey: z
    .string()
    .min(1, 'Service selection is required'),
  title: z
    .string()
    .min(1, 'Title is required')
    .trim(),
  serviceType: z.enum(['rent', 'buy'], {
    required_error: 'Service type is required',
  }),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  cost: z
    .number()
    .min(0, 'Cost cannot be negative'),
  advancePayment: z
    .number()
    .min(0, 'Advance payment cannot be negative'),
  providerUserName: z
    .string()
    .trim()
    .default(''),
  purchaseDate: z
    .string()
    .default(''),
  completed: z
    .boolean()
    .default(false),
})

/**
 * Inferred TypeScript type from the schema
 */
export type PreparationLineFormValues = z.infer<typeof preparationLineSchema>

