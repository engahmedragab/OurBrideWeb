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

const createTodoSchema = (t: ReturnType<typeof useI18nTranslations>) =>
  z.object({
    title: z.string().min(1, t('validation.todoRequired')),
    isDone: z.boolean().optional(),
  })

type CreateTodoFormValues = z.infer<ReturnType<typeof createTodoSchema>>

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
  const t = useI18nTranslations('todo')
  const schema = createTodoSchema(t)

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateTodoFormValues>({
    resolver: zodResolver(schema) as never,
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
      console.error('Failed to create todo:', e)
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
          <h2 className="text-20 font-semibold text-gray-900">{t('modal.create.title')}</h2>
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
              {t('modal.create.fieldLabel')} <span className="text-red-500">*</span>
            </label>
            <Input
              id="todo-title"
              type="text"
              placeholder={t('modal.create.placeholder')}
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
                <span className="text-sm text-gray-700">{t('modal.create.markCompleted')}</span>
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
            {t('modal.create.cancel')}
          </Button>
          <Button
            type="submit"
            variant="brand"
            className="text-white"
            disabled={isSubmitting || isLoading || !isValid}
          >
            {isSubmitting || isLoading ? t('modal.create.submitting') : t('modal.create.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
