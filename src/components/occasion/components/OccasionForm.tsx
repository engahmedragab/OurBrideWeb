'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { X, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import occasionImage from '@/assets/images/occasion.png'
import brideNameSvg from '@/assets/svg/bridename.svg'
import groomNameSvg from '@/assets/svg/groomname.svg'
import heartSvg from '@/assets/svg/heart.svg'
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
  const brideFirstName = watch('brideFirstName')
  const brideLastName = watch('brideLastName')
  const groomFirstName = watch('groomFirstName')
  const groomLastName = watch('groomLastName')
  const date = watch('date')

  const onSubmitForm = (data: OccasionFormData) => {
    onSubmit(data)
  }

  if (!isOpen) return null

  const groomFullName = [groomFirstName, groomLastName].filter(Boolean).join(' ') || 'Groom Name'
  const brideFullName = [brideFirstName, brideLastName].filter(Boolean).join(' ') || 'Bride Name'
  const occasionTitle = titleEn || titleAr || 'Occasion Name'

  // Format date for display
  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No date'
    try {
      const date = new Date(dateString)
      const day = date.getDate()
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${day}, ${month} ${year} ${hours}:${minutes}`
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Banner Image Section */}
      <div className="relative">
        <div className="relative h-48 md:h-56 w-full">
          <Image
            src={occasionImage}
            alt="Occasion Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Close button overlay */}
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 bg-white/95 backdrop-blur-sm rounded-lg text-gray-600 hover:bg-white transition-all shadow-md"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-8 space-y-6">
        {/* Names Section - Visual Preview */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-5 pb-6 border-b border-gray-200">
          {/* Groom Name */}
          <div className="flex flex-col items-center gap-2 order-1 md:order-1">
            <div className="relative">
              <Image
                src={typeof groomNameSvg === 'string' ? groomNameSvg : groomNameSvg.src || groomNameSvg}
                alt={groomFullName}
                width={223}
                height={42}
                className="h-8 md:h-10 w-auto"
              />
            </div>
            <p className="text-12 md:text-16 italic text-gray-900 font-semibold">{groomFullName}</p>
          </div>

          {/* Heart */}
          <div className="flex-shrink-0 order-2 md:order-2">
            <Image
              src={typeof heartSvg === 'string' ? heartSvg : heartSvg.src || heartSvg}
              alt="Heart"
              width={188}
              height={119}
              className="h-12 md:h-16 w-auto"
            />
          </div>

          {/* Bride Name */}
          <div className="flex flex-col items-center gap-2 order-3 md:order-3">
            <div className="relative">
              <Image
                src={typeof brideNameSvg === 'string' ? brideNameSvg : brideNameSvg.src || brideNameSvg}
                alt={brideFullName}
                width={203}
                height={38}
                className="h-8 md:h-10 w-auto"
              />
            </div>
            <p className="text-12 md:text-16 italic text-gray-900 font-semibold">{brideFullName}</p>
          </div>
        </div>

        {/* Invitation Message Preview */}
        {occasionTitle && occasionTitle !== 'Occasion Name' && (
          <div className="text-center pb-4 border-b border-gray-200">
            <p className="text-16 md:text-20 italic font-semibold text-gray-900">
              {occasionTitle}
            </p>
          </div>
        )}

        {/* Date Preview */}
        {date && (
          <div className="flex items-center justify-center gap-2 text-12 md:text-14 text-gray-700 pb-4 border-b border-gray-200">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-brand-500 flex-shrink-0" />
            <span>{formatDateTime(date)}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title (English) */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Title (English) {!titleAr && <span className="text-red-500">*</span>}
              </label>
              <Input
                {...register('titleEn')}
                placeholder="Enter title in English"
                className={cn(
                  "h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500",
                  errors.titleEn && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.titleEn && (
                <p className="text-12 text-red-500 mt-1.5">{errors.titleEn.message}</p>
              )}
              {errors.titleEn?.type === 'refine' && (
                <p className="text-12 text-red-500 mt-1.5">Please enter a title in English or Arabic</p>
              )}
            </div>

            {/* Title (Arabic) */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Title (Arabic) {!titleEn && <span className="text-red-500">*</span>}
              </label>
              <Input
                {...register('titleAr')}
                placeholder="Enter title in Arabic"
                className={cn(
                  "h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500",
                  errors.titleAr && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.titleAr && (
                <p className="text-12 text-red-500 mt-1.5">{errors.titleAr.message}</p>
              )}
            </div>

            {/* Sub Title (English) */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Sub Title (English)
              </label>
              <Input
                {...register('subTitleEn')}
                placeholder="Enter sub title in English"
                className="h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
              />
              {errors.subTitleEn && (
                <p className="text-12 text-red-500 mt-1.5">{errors.subTitleEn.message}</p>
              )}
            </div>

            {/* Sub Title (Arabic) */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Sub Title (Arabic)
              </label>
              <Input
                {...register('subTitleAr')}
                placeholder="Enter sub title in Arabic"
                className="h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
              />
              {errors.subTitleAr && (
                <p className="text-12 text-red-500 mt-1.5">{errors.subTitleAr.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                {...register('date')}
                className={cn(
                  "h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500",
                  errors.date && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.date && (
                <p className="text-12 text-red-500 mt-1.5">{errors.date.message}</p>
              )}
            </div>

            {/* Sub Date (Optional) */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Sub Date (Optional)
              </label>
              <Input
                type="datetime-local"
                {...register('subDate')}
                className="h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
              />
              {errors.subDate && (
                <p className="text-12 text-red-500 mt-1.5">{errors.subDate.message}</p>
              )}
            </div>

            {/* Bride First Name */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Bride First Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('brideFirstName')}
                placeholder="Enter bride first name"
                className={cn(
                  "h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500",
                  errors.brideFirstName && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.brideFirstName && (
                <p className="text-12 text-red-500 mt-1.5">{errors.brideFirstName.message}</p>
              )}
            </div>

            {/* Bride Last Name */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Bride Last Name
              </label>
              <Input
                {...register('brideLastName')}
                placeholder="Enter bride last name"
                className="h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
              />
              {errors.brideLastName && (
                <p className="text-12 text-red-500 mt-1.5">{errors.brideLastName.message}</p>
              )}
            </div>

            {/* Groom First Name */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Groom First Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('groomFirstName')}
                placeholder="Enter groom first name"
                className={cn(
                  "h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500",
                  errors.groomFirstName && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.groomFirstName && (
                <p className="text-12 text-red-500 mt-1.5">{errors.groomFirstName.message}</p>
              )}
            </div>

            {/* Groom Last Name */}
            <div>
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Groom Last Name
              </label>
              <Input
                {...register('groomLastName')}
                placeholder="Enter groom last name"
                className="h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
              />
              {errors.groomLastName && (
                <p className="text-12 text-red-500 mt-1.5">{errors.groomLastName.message}</p>
              )}
            </div>

            {/* Caption */}
            <div className="md:col-span-2">
              <label className="text-14 font-medium text-gray-700 mb-2 block">
                Caption
              </label>
              <Input
                {...register('caption')}
                placeholder="Enter caption"
                className="h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
              />
              {errors.caption && (
                <p className="text-12 text-red-500 mt-1.5">{errors.caption.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={!isValid || isSubmitting}
              className="px-6 text-white rounded-xl"
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
    </div>
  )
}

