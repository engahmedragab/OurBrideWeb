'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { addCategoryFormSchema, type AddCategoryFormData } from '@/schema/category.schema'
import { useI18nTranslations } from '@/i18n/hooks'

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; slug?: string; description?: string }) => void
  isSubmitting?: boolean
}

export const AddCategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AddCategoryModalProps) => {
  const t = useI18nTranslations('eventsPlanning.guestList')
  const tValidation = useI18nTranslations('eventsPlanning.guestList.dialog.validation')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategoryFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({ name: '', slug: '', description: '' })
    }
  }, [isOpen, reset])

  const onSubmitForm = (data: AddCategoryFormData) => {
    const finalSlug = data.slug?.trim() || slugify(data.name)

    onSubmit({
      name: data.name,
      slug: finalSlug || undefined,
      description: data.description || undefined,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('common.addNewCategory')}
      maxWidth="md"
      containerClassName="w-[calc(100vw-32px)] sm:w-full max-w-[560px]"
      contentClassName="p-4 sm:p-6 max-h-[75vh] overflow-y-auto md:max-h-none md:overflow-visible"
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="space-y-4">
          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">
              {t('common.categoryName')} <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder={t('common.categoryNamePlaceholder')}
              variant={errors.name ? 'error' : 'default'}
              errorMessage={errors.name?.message && tValidation('categoryNameMin')}
              size="md"
            />
          </div>

          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">{t('common.slug')} (Optional)</label>
            <Input
              {...register('slug')}
              placeholder={t('common.slugPlaceholder')}
              variant={errors.slug ? 'error' : 'default'}
              errorMessage={errors.slug?.message}
              size="md"
            />
          </div>

          <div>
            <label className="block text-14 font-medium text-gray-700 mb-2">{t('common.description')} (Optional)</label>
            <Input
              {...register('description')}
              placeholder={t('common.descriptionPlaceholder')}
              variant={errors.description ? 'error' : 'default'}
              errorMessage={errors.description?.message}
              size="md"
            />
          </div>

          <div className="flex flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} size="md" className="w-full sm:w-auto">
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="md"
              className="w-full sm:w-auto text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('actions.saving') : t('actions.addCategory')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
