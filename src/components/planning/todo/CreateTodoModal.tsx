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

type CreateTodoFormValues = {
  title: string
  isDone?: boolean
}

export interface CreateTodoModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { title: string; isDone?: boolean }) => Promise<void> | void
  isLoading?: boolean
}

export const CreateTodoModal = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateTodoModalProps) => {
  const t = useI18nTranslations('eventsPlanning.todo')
  const createTodoSchema = z.object({
    title: z.string().min(1, t('modals.create.todoRequired')),
    isDone: z.boolean().optional(),
  })
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateTodoFormValues>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: '', isDone: false },
    mode: 'onChange',
  })

  const titleValue = watch('title')

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleFormSubmit = async (data: CreateTodoFormValues) => {
    try {
      await onSubmit({ title: data.title, isDone: Boolean(data.isDone) })
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
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-20 font-semibold text-gray-900">{t('modals.create.title')}</h2>
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
            <label htmlFor="todo-title" className="block text-14 font-medium text-gray-700">
              {t('modals.create.todoLabel')} <span className="text-red-500">*</span>
            </label>
            <Input
              id="todo-title"
              type="text"
              placeholder={t('modals.create.todoPlaceholder')}
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
                <span className="text-sm text-gray-700">{t('modals.create.markAsCompleted')}</span>
              </div>
            )}
          />
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 px-6 pb-6 flex-shrink-0">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting || isLoading}>
            {t('modals.create.cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            className="text-white"
            disabled={isSubmitting || isLoading || !isValid}
          >
            {isSubmitting || isLoading ? t('modals.create.creating') : t('modals.create.create')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
