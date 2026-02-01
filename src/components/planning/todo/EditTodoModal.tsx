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

const editTodoSchema = (t: ReturnType<typeof useI18nTranslations>) =>
  z.object({
    title: z.string().min(1, t('validation.todoRequired')),
    isDone: z.boolean().optional(),
  })

type EditTodoFormValues = z.infer<ReturnType<typeof editTodoSchema>>

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
  const t = useI18nTranslations('todo')
  const schema = editTodoSchema(t)

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EditTodoFormValues>({
    resolver: zodResolver(schema) as never,
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
      contentClassName="p-0"
      disabled={isSubmitting || isLoading}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-20 font-semibold text-gray-900">{t('modal.edit.title')}</h2>
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
              {t('modal.edit.fieldLabel')} <span className="text-red-500">*</span>
            </label>
            <Input
              id="todo-title-edit"
              type="text"
              placeholder={t('modal.edit.placeholder')}
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
                <span className="text-sm text-gray-700">{t('modal.edit.markCompleted')}</span>
              </div>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
          >
            {t('modal.edit.cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            className="text-white"
            disabled={isSubmitting || isLoading || !isValid}
          >
            {isSubmitting || isLoading ? t('modal.edit.submitting') : t('modal.edit.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
