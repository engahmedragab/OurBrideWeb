import { z } from 'zod'

export const noteFormSchema = z.object({
  title: z.string().trim().min(1, 'Listnameisrequired'),
  note: z.string().trim().min(1, 'Noteisrequired'),
})

export type NoteFormData = z.infer<typeof noteFormSchema>
