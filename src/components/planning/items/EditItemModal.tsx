'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { X } from 'lucide-react'
import { useI18nTranslations } from '@/i18n'

// Helper to convert string/number/empty to number | undefined
const numberOrUndefined = z
  .union([z.string(), z.number(), z.undefined()])
  .transform((v): number | undefined => {
    if (v === '' || v === null || v === undefined) return undefined
    if (typeof v === 'number') return v
    if (typeof v === 'string') {
      const num = Number(v)
      return Number.isNaN(num) ? undefined : num
    }
    return undefined
  })
  .pipe(z.number().optional())

const itemSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t('itemForm.validation.nameRequired')),
  description: z.string().optional(),
  quantity: numberOrUndefined.refine(
    (v) => v === undefined || (!Number.isNaN(v) && v >= 0),
    t('itemForm.validation.quantityInvalid')
  ),
  totalPrice: numberOrUndefined.refine(
    (v) => v === undefined || (!Number.isNaN(v) && v >= 0),
    t('itemForm.validation.totalPriceInvalid')
  ),
  providerName: z.string().optional(),
  buyDate: z.string().optional(),
  isDone: z.boolean().default(false),
})

export type EditItemFormValues = z.infer<ReturnType<typeof itemSchema>>

export interface EditItemModalProps {
  open: boolean
  onClose: () => void
  isLoading?: boolean
  initialValues: {
    name: string
    description?: string
    quantity?: number
    totalPrice?: number
    providerName?: string
    buyDate?: string
    isDone?: boolean
  } | null
  onSubmit: (data: {
    name: string
    description?: string
    quantity?: number
    totalPrice?: number
    providerName?: string
    buyDate?: string
    isDone?: boolean
  }) => Promise<void> | void
}

export const EditItemModal = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
}: EditItemModalProps) => {
  const t = useI18nTranslations('items')
  const schema = itemSchema(t)
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EditItemFormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: '',
      description: '',
      quantity: undefined,
      totalPrice: undefined,
      providerName: '',
      buyDate: '',
      isDone: false,
    },
    mode: 'onChange',
  })

  const nameValue = watch('name')

  useEffect(() => {
    if (open && initialValues) {
      reset({
        name: initialValues.name ?? '',
        description: initialValues.description ?? '',
        quantity: initialValues.quantity,
        totalPrice: initialValues.totalPrice,
        providerName: initialValues.providerName ?? '',
        buyDate: initialValues.buyDate ?? '',
        isDone: Boolean(initialValues.isDone),
      })
      return
    }

    if (!open) reset()
  }, [open, initialValues, reset])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleFormSubmit = async (data: EditItemFormValues) => {
    try {
      await onSubmit({
        name: data.name,
        description: data.description || undefined,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        providerName: data.providerName || undefined,
        buyDate: data.buyDate || undefined,
        isDone: Boolean(data.isDone),
      })
      reset()
    } catch (e) {
      console.error('Failed to update item:', e)
    }
  }

  const handleClose = () => {
    if (!isSubmitting && !isLoading) {
      reset()
      onClose()
    }
  }

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      maxWidth="md"
      closeOnOverlayClick={!isSubmitting && !isLoading}
      backdropClassName="backdrop-blur-sm"
      headerClassName="hidden"
      contentClassName="p-0"
      disabled={isSubmitting || isLoading}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-20 font-semibold text-gray-900">{t('itemForm.titles.edit')}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
            disabled={isSubmitting || isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="item-name" className="block text-14 font-medium text-gray-700">
              {t('itemForm.fields.name')} <span className="text-red-500">*</span>
            </label>
            <Input
              id="item-name"
              type="text"
              placeholder={t('itemForm.placeholders.name')}
              {...register('name')}
              variant={errors.name ? 'error' : nameValue ? 'fill' : 'default'}
              errorMessage={errors.name?.message}
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="item-description" className="block text-14 font-medium text-gray-700">
              {t('itemForm.fields.description')}
            </label>
            <Input
              id="item-description"
              type="text"
              placeholder={t('itemForm.placeholders.description')}
              {...register('description')}
              variant="default"
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="item-quantity" className="block text-14 font-medium text-gray-700">
                {t('itemForm.fields.quantity')}
              </label>
              <Input
                id="item-quantity"
                type="number"
                placeholder={t('itemForm.placeholders.quantity')}
                {...register('quantity')}
                variant={errors.quantity ? 'error' : 'default'}
                errorMessage={errors.quantity?.message}
                size="lg"
                disabled={isSubmitting || isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="item-totalPrice" className="block text-14 font-medium text-gray-700">
                {t('itemForm.fields.totalPrice')}
              </label>
              <Input
                id="item-totalPrice"
                type="number"
                placeholder={t('itemForm.placeholders.totalPrice')}
                {...register('totalPrice')}
                variant={errors.totalPrice ? 'error' : 'default'}
                errorMessage={errors.totalPrice?.message}
                size="lg"
                disabled={isSubmitting || isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="item-providerName" className="block text-14 font-medium text-gray-700">
              {t('itemForm.fields.providerName')}
            </label>
            <Input
              id="item-providerName"
              type="text"
              placeholder={t('itemForm.placeholders.providerName')}
              {...register('providerName')}
              variant="default"
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="item-buyDate" className="block text-14 font-medium text-gray-700">
              {t('itemForm.fields.buyDate')}
            </label>
            <Input
              id="item-buyDate"
              type="date"
              {...register('buyDate')}
              variant="default"
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>

          {/*  Checkbox  */}
          <Controller
            control={control}
            name="isDone"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={Boolean(field.value)}
                  onChange={(val) => field.onChange(val === true)}
                  disabled={isSubmitting || isLoading}
                />
                <span className="text-sm text-gray-700">{t('itemForm.checkbox.completed')}</span>
              </div>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting || isLoading}>
            {t('itemForm.actions.cancel')}
          </Button>
          <Button type="submit" variant="brand" className="text-white" disabled={isSubmitting || isLoading || !isValid}>
            {isSubmitting || isLoading ? t('itemForm.titles.saving') : t('itemForm.actions.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
