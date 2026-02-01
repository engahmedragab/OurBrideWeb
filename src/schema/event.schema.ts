import { z } from 'zod'
import { useI18nTranslations } from '@/i18n'

export const newEventSchema = (t: ReturnType<typeof useI18nTranslations>) =>
  z.object({
    title: z
      .string()
      .min(1, t('validation.titleRequired'))
      .trim(),
    time: z
      .string()
      .min(1, t('validation.timeRequired'))
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('validation.timeInvalid')),
    duration: z
      .string()
      .min(1, t('validation.durationRequired'))
      .refine(
        (val) => {
          const num = parseInt(val, 10)
          return !isNaN(num) && num > 0
        },
        { message: t('validation.durationPositive') }
      ),
  })

export type NewEventFormValues = z.infer<ReturnType<typeof newEventSchema>>
