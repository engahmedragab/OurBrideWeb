'use client'

import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { X } from 'lucide-react'
import { SelectMenu, type SelectMenuOption } from '@/components/ui/SelectMenu'
import { useI18nTranslations } from '@/i18n/hooks'

const COLOR_OPTIONS = [
  { value: 'gray', label: 'listColors.gray'},
  { value: 'red', label: 'listColors.red'},
  { value: 'orange', label: 'listColors.orange'},
  { value: 'yellow', label: 'listColors.yellow'},
  { value: 'green', label:'listColors.green'},
  { value: 'blue', label:'listColors.blue'},
  { value: 'purple', label:'listColors.purple'},
] as const

export type ColorKey = (typeof COLOR_OPTIONS)[number]['value']

const createItemListSchema =(t: (key: string) => string) => z.object({
  name: z.string().min(1, t('itemForm.validation.nameRequired')),
  color: z.enum(['gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple']),
})

type CreateItemListFormValues = z.infer<ReturnType<typeof createItemListSchema>>

export interface CreateItemListModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; color: ColorKey }) => Promise<void> | void
  isLoading?: boolean
}

export const CreateItemListModal = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateItemListModalProps) => {
  const t = useI18nTranslations('items')
  const schema = createItemListSchema(t)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateItemListFormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: { name: '', color: 'gray' },
    mode: 'onChange',
  })

  const nameValue = watch('name')
  const selectedColor = watch('color')

  const selectOptions: SelectMenuOption[] = useMemo(() => {
    return COLOR_OPTIONS.map((c) => ({ label: t(c.label) , value: c.value }))
  }, [])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleFormSubmit = async (data: CreateItemListFormValues) => {
    try {
      await onSubmit({ name: data.name, color: data.color })
      reset()
    } catch (e) {
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
      containerClassName="max-h-[90vh] flex flex-col"
      contentClassName="p-0 flex-1 flex flex-col min-h-0"
      disabled={isSubmitting || isLoading}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 min-h-0">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-20 font-semibold text-gray-900">{t('lists.createNewList')}</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 transition-colors hover:text-gray-700"
              disabled={isSubmitting || isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
          <label htmlFor="list-name" className="block text-14 font-medium text-gray-700">
           {t('createList.title')} <span className="text-red-500">*</span>
          </label>
          <Input
            id="list-name"
            type="text"
            placeholder={t('createList.namePlaceholder')}
            {...register('name')}
            variant={errors.name ? 'error' : nameValue ? 'fill' : 'default'}
            errorMessage={errors.name?.message}
            size="lg"
            disabled={isSubmitting || isLoading}
          />
        </div>

        {/* Color (SelectMenu) */}
        <div className="space-y-1.5">
          <label className="block text-14 font-medium text-gray-700">{t('createList.color')}</label>

          <SelectMenu
            value={selectedColor}
            onChange={(val) => setValue('color', val as ColorKey, { shouldDirty: true, shouldValidate: true })}
            options={selectOptions}
            placeholder={t('createList.selectColor')}
            size="lg"
            className="focus:!border-none focus:!ring-0 focus:!ring-offset-0"
            variant={errors.color ? 'error' : 'default'}
            disabled={isSubmitting || isLoading}
          />

          {errors.color ? <div className="text-xs text-red-500">{errors.color.message}</div> : null}
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 px-6 pb-6 flex-shrink-0">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting || isLoading}>
            {t('actions.cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            className="text-white"
            disabled={isSubmitting || isLoading || !isValid}
          >
            {isSubmitting || isLoading ? t('createList.creating') : t('createList.create')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
