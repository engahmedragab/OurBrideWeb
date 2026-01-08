import { z } from 'zod'

export const noteFormSchema = z.object({
  title: z.string().trim().min(1, 'List name is required'),
  note: z.string().trim().min(1, 'Note is required'),
})

export type NoteFormData = z.infer<typeof noteFormSchema>
