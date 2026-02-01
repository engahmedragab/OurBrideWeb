import { z } from 'zod'

/**
 * Schema for creating a new event
 * Validates title, start time, and duration fields
 */
export const newEventSchema = z.object({
  title: z
    .string()
    .min(1, 'titleRequired')
    .trim(),
  time: z
    .string()
    .min(1, 'startTimeRequired')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)'),
  duration: z
    .string()
    .min(1, 'durationRequired')
    .refine(
      (val) => {
        const num = parseInt(val, 10)
        return !isNaN(num) && num > 0
      },
      { message: 'durationPositive' }
    ),
})

/**
 * Inferred TypeScript type from the schema
 */
export type NewEventFormValues = z.infer<typeof newEventSchema>

 