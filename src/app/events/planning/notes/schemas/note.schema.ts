import { z } from 'zod'

const trim = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export const noteFormSchema = z.object({
  title: z.preprocess(trim, z.string().min(1, 'List name is required')),
  note: z.preprocess(trim, z.string().min(1, 'Note is required')),
})

export type NoteFormData = z.infer<typeof noteFormSchema>
