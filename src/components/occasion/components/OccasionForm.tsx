'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components/ui'
import { X, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image, { StaticImageData } from 'next/image'
import occasionImage from '@/assets/images/occasion.png'
import brideNameSvg from '@/assets/svg/bridename.svg'
import groomNameSvg from '@/assets/svg/groomname.svg'
import heartSvg from '@/assets/svg/heart.svg'
import {
  occasionFormSchema,
  type OccasionFormData,
} from '@/schema/occasion.schema'
import { OccasionType } from '@/../client/common/api/gen/ourbride-api'
import type { OccasionLineResponse } from '@/types/responses'
import { useI18nTranslations, useIsRTL } from '@/i18n'

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
  const t = useI18nTranslations('eventsPlanning.occasions')
  const tvalid = useI18nTranslations('eventsPlanning.occasions.form.validation')
  const isRtl = useIsRTL()

  // Convert Date -> datetime-local value (YYYY-MM-DDTHH:mm)
  const toDateTimeLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const getTodayDateTime = () => toDateTimeLocal(new Date())

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
      date: getTodayDateTime(),
      subDate: null,
      brideFirstName: '',
      brideLastName: '',
      groomFirstName: '',
      groomLastName: '',
      type: OccasionType.Wedding,
    },
  })

  // Reset form when opening or switching edit mode
  useEffect(() => {
    if (!isOpen) return

    if (editingOccasion) {
      reset({
        titleEn: editingOccasion.titleEn || '',
        titleAr: editingOccasion.titleAr || '',
        subTitleEn: editingOccasion.subTitleEn || '',
        subTitleAr: editingOccasion.subTitleAr || '',
        caption: editingOccasion.caption || '',
        date: editingOccasion.date
          ? toDateTimeLocal(new Date(editingOccasion.date))
          : getTodayDateTime(),
        subDate: editingOccasion.subDate
          ? toDateTimeLocal(new Date(editingOccasion.subDate))
          : null,
        brideFirstName: editingOccasion.brideFirstName || '',
        brideLastName: editingOccasion.brideLastName || '',
        groomFirstName: editingOccasion.groomFirstName || '',
        groomLastName: editingOccasion.groomLastName || '',
        type: editingOccasion.type || OccasionType.Wedding,
      })
    } else {
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

  const groomFullName =
    [groomFirstName, groomLastName].filter(Boolean).join(' ') ||
    t('common.fallbacks.groomName')

  const brideFullName =
    [brideFirstName, brideLastName].filter(Boolean).join(' ') ||
    t('common.fallbacks.brideName')

  const occasionTitle =
    titleEn || titleAr || t('common.fallbacks.occasionName')

  const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return t('common.fallbacks.noDate')
    try {
      const d = new Date(dateString)
      const day = d.getDate()
      const month = d.toLocaleDateString('en-US', { month: 'short' })
      const year = d.getFullYear()
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      return `${day}, ${month} ${year} ${hours}:${minutes}`
    } catch {
      return t('common.fallbacks.invalidDate')
    }
  }

  const svgSrc = (asset: StaticImageData|string) =>
    typeof asset === 'string' ? asset : asset?.src || asset

  const onSubmitForm = (data: OccasionFormData) => onSubmit(data)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 "
      role="dialog"
      aria-modal="true"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Backdrop: div (NOT button) so it doesn't steal scroll */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
  className={cn(
    'relative w-full max-w-[980px]',
    'rounded-2xl bg-white shadow-xl',
    'overflow-y-hidden',
    
    'max-h-[calc(100dvh-24px)] overflow-y-auto'
  )}
  onClick={e => e.stopPropagation()}
>
        {/* Main flex column.
            IMPORTANT: min-h-0 is required for inner overflow-y-auto to work in flex layouts */}
        <div className="flex h-full min-h-0 flex-col ">
          {/* Header / Banner (fixed) */}
          <div className="relative h-28 sm:h-36 md:h-44 w-full flex-shrink-0">
            <Image
              src={occasionImage}
              alt="Occasion Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />

            <button
              onClick={onClose}
              type="button"
              className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-all shadow-md"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body (this is where scroll happens)
              IMPORTANT: min-h-0 + overflow-y-auto */}
          <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 pb-24">
              {/* Names Preview */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="flex flex-col items-center gap-1.5">
                  <Image
                    src={svgSrc(groomNameSvg)}
                    alt={groomFullName}
                    width={223}
                    height={42}
                    className="h-7 sm:h-8 md:h-10 w-auto"
                  />
                  <p className="text-12 sm:text-14 md:text-16 italic text-gray-900 font-semibold">
                    {groomFullName}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <Image
                    src={svgSrc(heartSvg)}
                    alt="Heart"
                    width={188}
                    height={119}
                    className="h-10 sm:h-12 md:h-16 w-auto"
                  />
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <Image
                    src={svgSrc(brideNameSvg)}
                    alt={brideFullName}
                    width={203}
                    height={38}
                    className="h-7 sm:h-8 md:h-10 w-auto"
                  />
                  <p className="text-12 sm:text-14 md:text-16 italic text-gray-900 font-semibold">
                    {brideFullName}
                  </p>
                </div>
              </div>

              {/* Title preview */}
              <div className="text-center py-3 sm:py-4 border-b border-gray-200">
                <p className="text-14 sm:text-16 md:text-20 italic font-semibold text-gray-900">
                  {occasionTitle}
                </p>
              </div>

              {/* Date preview */}
              {date && (
                <div className="flex items-center justify-center gap-2 text-12 sm:text-13 md:text-14 text-gray-700 py-3 sm:py-4 border-b border-gray-200">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-brand-500 flex-shrink-0" />
                  <span>{formatDateTime(date)}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmitForm)} className="mt-4 sm:mt-6  ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 ">
                  {/* Title EN */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.titleEn')}{' '}
                      {!titleAr && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      {...register('titleEn')}
                      placeholder={t('form.placeholders.titleEn')}
                      className={cn(
                        'h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500',
                        errors.titleEn &&
                          'border-red-500 focus:border-red-500 focus:ring-red-500'
                      )}
                    />
                    {errors.titleEn && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.titleEn.message&&tvalid(errors.titleEn.message)}
                      </p>
                    )}
                    {errors.titleEn?.type === 'refine' && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {t('form.helperText.titleRequiredNote')}
                      </p>
                    )}
                  </div>

                  {/* Title AR */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.titleAr')}{' '}
                      {!titleEn && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      {...register('titleAr')}
                      placeholder={t('form.placeholders.titleAr')}
                      className={cn(
                        'h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500',
                        errors.titleAr &&
                          'border-red-500 focus:border-red-500 focus:ring-red-500'
                      )}
                    />
                    {errors.titleAr && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.titleAr.message &&tvalid(errors.titleAr.message) }
                      </p>
                    )}
                  </div>

                  {/* SubTitle EN */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.subTitleEn')}
                    </label>
                    <Input
                      {...register('subTitleEn')}
                      placeholder={t('form.placeholders.subTitleEn')}
                      className="h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                    />
                    {errors.subTitleEn && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.subTitleEn.message}
                      </p>
                    )}
                  </div>

                  {/* SubTitle AR */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.subTitleAr')}
                    </label>
                    <Input
                      {...register('subTitleAr')}
                      placeholder={t('form.placeholders.subTitleAr')}
                      className="h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                    />
                    {errors.subTitleAr && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.subTitleAr.message}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.date')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="datetime-local"
                      {...register('date')}
                      className={cn(
                        'flex h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500',
                        errors.date &&
                          'border-red-500 focus:border-red-500 focus:ring-red-500',
                          isRtl? 'justify-end':'justify-start'
                      )}
                    />
                    {errors.date && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  {/* Sub Date */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.subDate')}
                    </label>
                    <Input
                      type="datetime-local"
                      {...register('subDate')}
                      className={cn("h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500 flex ",
                        isRtl?'justify-end':'justify-start'
                        
                      )}
                    />
                    {errors.subDate && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.subDate.message}
                      </p>
                    )}
                  </div>

                  {/* Bride First */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.brideFirstName')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register('brideFirstName')}
                      placeholder={t('form.placeholders.brideFirstName')}
                      className={cn(
                        'h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500',
                        errors.brideFirstName &&
                          'border-red-500 focus:border-red-500 focus:ring-red-500'
                      )}
                    />
                    {errors.brideFirstName && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.brideFirstName.message&&tvalid(errors.brideFirstName.message)}
                      </p>
                    )}
                  </div>

                  {/* Bride Last */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.brideLastName')}
                    </label>
                    <Input
                      {...register('brideLastName')}
                      placeholder={t('form.placeholders.brideLastName')}
                      className="h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                    />
                    {errors.brideLastName && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.brideLastName.message}
                      </p>
                    )}
                  </div>

                  {/* Groom First */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.groomFirstName')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register('groomFirstName')}
                      placeholder={t('form.placeholders.groomFirstName')}
                      className={cn(
                        'h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500',
                        errors.groomFirstName &&
                          'border-red-500 focus:border-red-500 focus:ring-red-500'
                      )}
                    />
                    {errors.groomFirstName && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.groomFirstName.message&&tvalid(errors.groomFirstName.message) }
                      </p>
                    )}
                  </div>

                  {/* Groom Last */}
                  <div>
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.groomLastName')}
                    </label>
                    <Input
                      {...register('groomLastName')}
                      placeholder={t('form.placeholders.groomLastName')}
                      className="h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                    />
                    {errors.groomLastName && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.groomLastName.message}
                      </p>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="md:col-span-2">
                    <label className="text-13 sm:text-14 font-medium text-gray-700 mb-2 block">
                      {t('form.labels.caption')}
                    </label>
                    <Input
                      {...register('caption')}
                      placeholder={t('form.placeholders.caption')}
                      className="h-10 sm:h-11 px-4 text-14 border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                    />
                    {errors.caption && (
                      <p className="text-12 text-red-500 mt-1.5">
                        {errors.caption.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Important: padding bottom so last inputs don't hide behind sticky footer */}
                <div  />
              </form>
            </div>
          </div>

          {/* Sticky Footer (always visible) */}
          <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 flex items-center justify-start gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 sm:px-6"
              >
                {t('form.buttons.cancel')}
              </Button>

              <Button
                type="button"
                variant="brand"
                onClick={handleSubmit(onSubmitForm)}
                disabled={!isValid || isSubmitting}
                className="px-5 sm:px-6 text-white rounded-xl"
              >
                {isSubmitting
                  ? t('form.buttons.saving')
                  : editingOccasion
                    ? t('form.buttons.update')
                    : t('form.buttons.create')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
