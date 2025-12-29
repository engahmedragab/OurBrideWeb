'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { X } from 'lucide-react'
import { createServiceCategorySchema, type CreateServiceCategoryFormValues } from '@/schema/serviceCategory.schema'

export interface CreateCategoryModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string }) => Promise<void>
  isLoading?: boolean
}

export const CreateCategoryModal = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateCategoryModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm<CreateServiceCategoryFormValues>({
    resolver: zodResolver(createServiceCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onChange',
  })

  const nameValue = watch('name')

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleFormSubmit = async (data: CreateServiceCategoryFormValues) => {
    try {
      await onSubmit({
        name: data.name,
        description: data.description,
      })
      reset()
    } catch (error) {
      // Error handling is done by parent component
      console.error('Failed to create category:', error)
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-20 font-semibold text-gray-900">Create New Category</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting || isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="category-name" className="text-14 font-medium text-gray-700 block">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="category-name"
              type="text"
              placeholder="Enter category name"
              {...register('name')}
              variant={errors.name ? 'error' : nameValue ? 'fill' : 'default'}
              errorMessage={errors.name?.message}
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="category-description" className="text-14 font-medium text-gray-700 block">
              Description (Optional)
            </label>
            <Input
              id="category-description"
              type="text"
              placeholder="Enter category description"
              {...register('description')}
              variant="default"
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="brand"
            className="text-white"
            disabled={isSubmitting || isLoading || !isValid}
          >
            {isSubmitting || isLoading ? 'Creating...' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
