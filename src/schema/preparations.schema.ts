import { z } from 'zod'
import { useI18nTranslations } from '@/i18n'

export const preparationLineSchema = (
  t: ReturnType<typeof useI18nTranslations>
) =>
  z.object({
    serviceKey: z.string().min(1, t('validation.serviceRequired')),

    title: z.string().min(1, t('validation.titleRequired')).trim(),

    serviceType: z.enum(['rent', 'buy'], {
      required_error: t('validation.serviceTypeRequired'),
    }),

    quantity: z
      .number()
      .int(t('validation.quantityInteger'))
      .min(1, t('validation.quantityMin')),

    cost: z.number().min(0, t('validation.costNonNegative')),

    advancePayment: z
      .number()
      .min(0, t('validation.advancePaymentNonNegative')),

    providerUserName: z.string().trim().default(''),
    purchaseDate: z.string().default(''),
    completed: z.boolean().default(false),
  })

export type PreparationLineFormValues = z.infer<
  ReturnType<typeof preparationLineSchema>
>
