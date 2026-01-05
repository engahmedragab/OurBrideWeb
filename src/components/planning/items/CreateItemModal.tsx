'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { X } from 'lucide-react'

const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  quantity: z
    .preprocess(
      v => (v === '' || v === null || v === undefined ? undefined : Number(v)),
      z.number().optional()
    )
    .refine(
      v => v === undefined || (!Number.isNaN(v) && v >= 0),
      'Quantity must be a valid number'
    ),
  totalPrice: z
    .preprocess(
      v => (v === '' || v === null || v === undefined ? undefined : Number(v)),
      z.number().optional()
    )
    .refine(
      v => v === undefined || (!Number.isNaN(v) && v >= 0),
      'Total price must be a valid number'
    ),
  providerName: z.string().optional(),
  buyDate: z.string().optional(), // input type="date" بيطلع string YYYY-MM-DD
  isDone: z.boolean().optional(),
})

export type CreateItemFormValues = z.infer<typeof createItemSchema>

export interface CreateItemModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    description?: string
    quantity?: number
    totalPrice?: number
    providerName?: string
    buyDate?: string
    isDone?: boolean
  }) => Promise<void> | void
  isLoading?: boolean
}

export const CreateItemModal = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateItemModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemSchema),
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
  const isDoneValue = watch('isDone')

  // Reset when modal closes
  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleFormSubmit = async (data: CreateItemFormValues) => {
    try {
      await onSubmit({
        name: data.name,
        description: data.description || undefined,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        providerName: data.providerName || undefined,
        buyDate: data.buyDate || undefined,
        isDone: data.isDone,
      })
      reset()
    } catch (e) {
      console.error('Failed to create item:', e)
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
          <h2 className="text-20 font-semibold text-gray-900">Add New Item</h2>

          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
            disabled={isSubmitting || isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Name (required) */}
          <div className="space-y-1.5">
            <label
              htmlFor="item-name"
              className="block text-14 font-medium text-gray-700"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="item-name"
              type="text"
              placeholder="Enter item name"
              {...register('name')}
              variant={errors.name ? 'error' : nameValue ? 'fill' : 'default'}
              errorMessage={errors.name?.message}
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="item-description"
              className="block text-14 font-medium text-gray-700"
            >
              Description
            </label>
            <Input
              id="item-description"
              type="text"
              placeholder="Enter description"
              {...register('description')}
              variant="default"
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>

          {/* Quantity + Total Price */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="item-quantity"
                className="block text-14 font-medium text-gray-700"
              >
                Quantity
              </label>
              <Input
                id="item-quantity"
                type="number"
                placeholder="0"
                {...register('quantity')}
                variant={errors.quantity ? 'error' : 'default'}
                errorMessage={errors.quantity?.message}
                size="lg"
                disabled={isSubmitting || isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="item-totalPrice"
                className="block text-14 font-medium text-gray-700"
              >
                Total price
              </label>
              <Input
                id="item-totalPrice"
                type="number"
                placeholder="0"
                {...register('totalPrice')}
                variant={errors.totalPrice ? 'error' : 'default'}
                errorMessage={errors.totalPrice?.message}
                size="lg"
                disabled={isSubmitting || isLoading}
              />
            </div>
          </div>

          {/* Provider Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="item-providerName"
              className="block text-14 font-medium text-gray-700"
            >
              Provider name
            </label>
            <Input
              id="item-providerName"
              type="text"
              placeholder="Enter provider name"
              {...register('providerName')}
              variant="default"
              size="lg"
              disabled={isSubmitting || isLoading}
            />
          </div>

          {/* Buy Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="item-buyDate"
              className="block text-14 font-medium text-gray-700"
            >
              Buy date
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

          {/* Completed checkbox (optional) */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={!!isDoneValue}
              onChange={val =>
                setValue('isDone', Boolean(val), { shouldDirty: true })
              }
              disabled={isSubmitting || isLoading}
            />
            <span className="text-sm text-gray-700">Mark as completed</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
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
            {isSubmitting || isLoading ? 'Saving...' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
