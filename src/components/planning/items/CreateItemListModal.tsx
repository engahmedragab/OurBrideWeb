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

const COLOR_OPTIONS = [
  { value: 'gray', label: 'Gray' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
] as const

export type ColorKey = (typeof COLOR_OPTIONS)[number]['value']

const createItemListSchema = z.object({
  name: z.string().min(1, 'List name is required'),
  color: z.enum(['gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple']),
})

type CreateItemListFormValues = z.infer<typeof createItemListSchema>

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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateItemListFormValues>({
    resolver: zodResolver(createItemListSchema),
    defaultValues: { name: '', color: 'gray' },
    mode: 'onChange',
  })

  const nameValue = watch('name')
  const selectedColor = watch('color')

  const selectOptions: SelectMenuOption[] = useMemo(() => {
    return COLOR_OPTIONS.map((c) => ({ label: c.label, value: c.value }))
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
      console.error('Failed to create list:', e)
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
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-20 font-semibold text-gray-900">Create New List</h2>
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
            List name <span className="text-red-500">*</span>
          </label>
          <Input
            id="list-name"
            type="text"
            placeholder="Enter list name"
            {...register('name')}
            variant={errors.name ? 'error' : nameValue ? 'fill' : 'default'}
            errorMessage={errors.name?.message}
            size="lg"
            disabled={isSubmitting || isLoading}
          />
        </div>

        {/* Color (SelectMenu) */}
        <div className="space-y-1.5">
          <label className="block text-14 font-medium text-gray-700">List color</label>

          <SelectMenu
            value={selectedColor}
            onChange={(val) => setValue('color', val as ColorKey, { shouldDirty: true, shouldValidate: true })}
            options={selectOptions}
            placeholder="Select color..."
            size="lg"
            className="focus:!border-none focus:!ring-0 focus:!ring-offset-0"
            variant={errors.color ? 'error' : 'default'}
            disabled={isSubmitting || isLoading}
          />

          {errors.color ? <div className="text-xs text-red-500">{errors.color.message}</div> : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting || isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="brand"
            className="text-white"
            disabled={isSubmitting || isLoading || !isValid}
          >
            {isSubmitting || isLoading ? 'Creating...' : 'Create List'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
