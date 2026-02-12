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

type EditTodoFormValues = {
  title: string
  isDone?: boolean
}

export interface EditTodoModalProps {
  open: boolean
  onClose: () => void
  isLoading?: boolean
  initialValues: { title: string; isDone?: boolean } | null
  onSubmit: (data: { title: string; isDone?: boolean }) => Promise<void> | void
}

export const EditTodoModal = ({
  open,
  onClose,
  initialValues,
  onSubmit,
  isLoading = false,
}: EditTodoModalProps) => {
  const t = useI18nTranslations('eventsPlanning.todo')
  const editTodoSchema = z.object({
    title: z.string().min(1, t('modals.edit.todoRequired')),
    isDone: z.boolean().optional(),
  })
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EditTodoFormValues>({
    resolver: zodResolver(editTodoSchema),
    defaultValues: { title: '', isDone: false },
    mode: 'onChange',
  })

  const titleValue = watch('title')

  useEffect(() => {
    if (open && initialValues) {
      reset({
        title: initialValues.title ?? '',
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

  const handleFormSubmit = async (data: EditTodoFormValues) => {
    try {
      await onSubmit({ title: data.title, isDone: Boolean(data.isDone) })
      reset()
    } catch (e) {
      console.error('Failed to update todo:', e)
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
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-20 font-semibold text-gray-900">{t('modals.edit.title')}</h2>
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
            <label htmlFor="todo-title-edit" className="block text-14 font-medium text-gray-700">
              {t('modals.edit.todoLabel')} <span className="text-red-500">*</span>
            </label>
            <Input
              id="todo-title-edit"
              type="text"
              placeholder={t('modals.edit.todoPlaceholder')}
              {...register('title')}
              variant={errors.title ? 'error' : titleValue ? 'fill' : 'default'}
              errorMessage={errors.title?.message}
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>

          <Controller
            control={control}
            name="isDone"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={!!field.value}
                  onChange={(val) => field.onChange(val === true)}
                  disabled={isSubmitting || isLoading}
                />
                <span className="text-sm text-gray-700">{t('modals.edit.markAsCompleted')}</span>
              </div>
            )}
          />
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 px-6 pb-6 flex-shrink-0">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting || isLoading}>
            {t('modals.edit.cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            className="text-white"
            disabled={isSubmitting || isLoading || !isValid}
          >
            {isSubmitting || isLoading ? t('modals.edit.saving') : t('modals.edit.saveChanges')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
