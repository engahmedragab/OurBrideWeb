'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { occasionFormSchema, type OccasionFormData } from '@/schema/occasion.schema'
import { OccasionType } from '@/../client/common/api/gen/ourbride-api'
import type { OccasionLineResponse } from '@/types/responses'

interface OccasionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: OccasionFormData) => void
  editingOccasion?: OccasionLineResponse | null
  isSubmitting?: boolean
}

export function OccasionForm({
  isOpen,
  onClose,
  onSubmit,
  editingOccasion,
  isSubmitting = false,
}: OccasionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<OccasionFormData>({
    resolver: zodResolver(occasionFormSchema),
    mode: 'onChange',
    defaultValues: {
      titleEn: '',
      titleAr: '',
      subTitleEn: '',
      subTitleAr: '',
      caption: '',
      date: (() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      })(),
      subDate: null,
      brideFirstName: '',
      brideLastName: '',
      groomFirstName: '',
      groomLastName: '',
      type: OccasionType.Wedding,
    },
  })

  // Helper function to get today's date in datetime-local format
  const getTodayDateTime = () => {
    const now = new Date()
    // Format: YYYY-MM-DDTHH:mm
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Reset form when editingOccasion changes or form opens/closes
  useEffect(() => {
    if (isOpen && editingOccasion) {
      reset({
        titleEn: editingOccasion.titleEn || '',
        titleAr: editingOccasion.titleAr || '',
        subTitleEn: editingOccasion.subTitleEn || '',
        subTitleAr: editingOccasion.subTitleAr || '',
        caption: editingOccasion.caption || '',
        date: editingOccasion.date ? new Date(editingOccasion.date).toISOString().slice(0, 16) : getTodayDateTime(),
        subDate: editingOccasion.subDate ? new Date(editingOccasion.subDate).toISOString().slice(0, 16) : null,
        brideFirstName: editingOccasion.brideFirstName || '',
        brideLastName: editingOccasion.brideLastName || '',
        groomFirstName: editingOccasion.groomFirstName || '',
        groomLastName: editingOccasion.groomLastName || '',
        type: editingOccasion.type || OccasionType.Wedding,
      })
    } else if (isOpen && !editingOccasion) {
      reset({
        titleEn: '',
        titleAr: '',
        subTitleEn: '',
        subTitleAr: '',
        caption: '',
        date: getTodayDateTime(),
        subDate: null,
        brideFirstName: '',
        brideLastName: '',
        groomFirstName: '',
        groomLastName: '',
        type: OccasionType.Wedding,
      })
    }
  }, [isOpen, editingOccasion, reset])

  const titleEn = watch('titleEn')
  const titleAr = watch('titleAr')

  const onSubmitForm = (data: OccasionFormData) => {
    onSubmit(data)
  }

  if (!isOpen) return null

  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-18 font-semibold text-gray-900">
          {editingOccasion ? 'Edit Occasion' : 'Add New Occasion'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title (English) */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Title (English) {!titleAr && <span className="text-red-500">*</span>}
            </label>
            <Input
              {...register('titleEn')}
              placeholder="Enter title in English"
              className={cn(
                "h-auto px-4 py-3 text-14",
                errors.titleEn && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.titleEn && (
              <p className="text-12 text-red-500 mt-1">{errors.titleEn.message}</p>
            )}
            {errors.titleEn?.type === 'refine' && (
              <p className="text-12 text-red-500 mt-1">Please enter a title in English or Arabic</p>
            )}
          </div>

          {/* Title (Arabic) */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Title (Arabic) {!titleEn && <span className="text-red-500">*</span>}
            </label>
            <Input
              {...register('titleAr')}
              placeholder="Enter title in Arabic"
              className={cn(
                "h-auto px-4 py-3 text-14",
                errors.titleAr && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.titleAr && (
              <p className="text-12 text-red-500 mt-1">{errors.titleAr.message}</p>
            )}
          </div>

          {/* Sub Title (English) */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Sub Title (English)
            </label>
            <Input
              {...register('subTitleEn')}
              placeholder="Enter sub title in English"
              className="h-auto px-4 py-3 text-14"
            />
            {errors.subTitleEn && (
              <p className="text-12 text-red-500 mt-1">{errors.subTitleEn.message}</p>
            )}
          </div>

          {/* Sub Title (Arabic) */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Sub Title (Arabic)
            </label>
            <Input
              {...register('subTitleAr')}
              placeholder="Enter sub title in Arabic"
              className="h-auto px-4 py-3 text-14"
            />
            {errors.subTitleAr && (
              <p className="text-12 text-red-500 mt-1">{errors.subTitleAr.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              {...register('date')}
              className={cn(
                "h-auto px-4 py-3 text-14",
                errors.date && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.date && (
              <p className="text-12 text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Sub Date (Optional) */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Sub Date (Optional)
            </label>
            <Input
              type="datetime-local"
              {...register('subDate')}
              className="h-auto px-4 py-3 text-14"
            />
            {errors.subDate && (
              <p className="text-12 text-red-500 mt-1">{errors.subDate.message}</p>
            )}
          </div>

          {/* Bride First Name */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Bride First Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('brideFirstName')}
              placeholder="Enter bride first name"
              className={cn(
                "h-auto px-4 py-3 text-14",
                errors.brideFirstName && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.brideFirstName && (
              <p className="text-12 text-red-500 mt-1">{errors.brideFirstName.message}</p>
            )}
          </div>

          {/* Bride Last Name */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Bride Last Name
            </label>
            <Input
              {...register('brideLastName')}
              placeholder="Enter bride last name"
              className="h-auto px-4 py-3 text-14"
            />
            {errors.brideLastName && (
              <p className="text-12 text-red-500 mt-1">{errors.brideLastName.message}</p>
            )}
          </div>

          {/* Groom First Name */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Groom First Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('groomFirstName')}
              placeholder="Enter groom first name"
              className={cn(
                "h-auto px-4 py-3 text-14",
                errors.groomFirstName && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.groomFirstName && (
              <p className="text-12 text-red-500 mt-1">{errors.groomFirstName.message}</p>
            )}
          </div>

          {/* Groom Last Name */}
          <div>
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Groom Last Name
            </label>
            <Input
              {...register('groomLastName')}
              placeholder="Enter groom last name"
              className="h-auto px-4 py-3 text-14"
            />
            {errors.groomLastName && (
              <p className="text-12 text-red-500 mt-1">{errors.groomLastName.message}</p>
            )}
          </div>

          {/* Caption */}
          <div className="md:col-span-2">
            <label className="text-14 font-normal text-gray-900 mb-2 block">
              Caption
            </label>
            <Input
              {...register('caption')}
              placeholder="Enter caption"
              className="h-auto px-4 py-3 text-14"
            />
            {errors.caption && (
              <p className="text-12 text-red-500 mt-1">{errors.caption.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="brand"
            disabled={!isValid || isSubmitting}
            className="text-white"
          >
            {isSubmitting
              ? 'Saving...'
              : editingOccasion
              ? 'Update Occasion'
              : 'Create Occasion'}
          </Button>
        </div>
      </form>
    </div>
  )
}

