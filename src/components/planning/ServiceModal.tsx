'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { NumberStepper } from './NumberStepper'
import { ServiceSelect } from './ServiceSelect'
import { SelectField } from './SelectField'
import { PriceSummary } from './PriceSummary'
import { planningTypography } from './typography'
import { cn } from '@/lib/utils'
import { usePreparations } from '@/hooks/planning/usePreparations'
import { getServiceIcon, getServiceIconByClass } from '@/utils/serviceIconMapper'
import type { PreparationLineFormValues } from '@/schema/preparations.schema'
import { z } from 'zod'
import { Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useIsRTL, useI18nTranslations, useI18nLocale } from '@/i18n/hooks'

export interface ServiceModalFormData {
  completed: boolean
  serviceKey: string
  title: string
  serviceType: 'rent' | 'buy'
  quantity: number
  cost: number
  advancePayment: number
  providerUserName: string
  purchaseDate: string
}

export interface ServiceModalProps {
  open: boolean
  mode: 'add' | 'edit' | 'view'
  initialValue?: {
    id: string
    serviceKey?: string
    serviceClass?: number
    title: string
    serviceType: string
    quantity: number
    cost: number
    advancePayment: number
    providerUserName: string
    purchaseDate: string
    completed: boolean
  }
  onClose: () => void
  onSave: (value: ServiceModalFormData) => void
}

export const ServiceModal = ({
  open,
  mode,
  initialValue,
  onClose,
  onSave,
}: ServiceModalProps) => {
  const isRtl = useIsRTL()
  const t = useI18nTranslations('eventsPlanning.preparations.modal')
  const tPrice = useI18nTranslations('eventsPlanning.preparations.priceSummary')
  const locale = useI18nLocale()
  
  // Create schema with translated messages
  const schema = useMemo(() => {
    return z.object({
      serviceKey: z
        .string()
        .min(1, t('validation.serviceRequired')),
      title: z
        .string()
        .min(1, t('validation.titleRequired'))
        .trim(),
      serviceType: z.enum(['rent', 'buy'], {
        required_error: t('validation.serviceTypeRequired'),
      }),
      quantity: z
        .number()
        .int(t('validation.quantityInt'))
        .min(1, t('validation.quantityMin')),
      cost: z
        .number()
        .min(0, t('validation.costMin')),
      advancePayment: z
        .number()
        .min(0, t('validation.advancePaymentMin')),
      providerUserName: z
        .string()
        .trim()
        .default(''),
      purchaseDate: z
        .string()
        .default(''),
      completed: z
        .boolean()
        .default(false),
    })
  }, [t])
  
  const SERVICE_TYPE_OPTIONS = useMemo(() => [
    { value: 'rent', label: t('options.rent') },
    { value: 'buy', label: t('options.buy') },
  ], [t])
  
  // Fetch services from API
  const { data: services = [], isLoading: isLoadingServices } = usePreparations({
    enabled: open, // Only fetch when modal is open
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm<PreparationLineFormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      completed: false,
      serviceKey: '',
      title: '',
      serviceType: 'rent',
      quantity: 1,
      cost: 0,
      advancePayment: 0,
      providerUserName: '',
      purchaseDate: '',
    },
    mode: 'onChange',
  })

  const watchedValues = watch()
  const serviceKey = watch('serviceKey')
  const cost = watch('cost') || 0
  const quantity = watch('quantity') || 1
  const advancePayment = watch('advancePayment') || 0

  // Track if form has been initialized to prevent infinite loops
  const isInitializedRef = useRef(false)
  const lastOpenStateRef = useRef(false)

  // Derived values for calculations
  const totalCost = useMemo(
    () => cost * quantity,
    [cost, quantity]
  )

  const remaining = useMemo(
    () => Math.max(totalCost - advancePayment, 0),
    [totalCost, advancePayment]
  )

  // Get selected service for icon display
  const selectedService = useMemo(() => {
    if (!serviceKey || !services.length) {
      // Default to Sparkles icon when no service selected
      return {
        label: t('addTitle'),
        Icon: Sparkles,
        imageUrl: undefined,
      }
    }

    const service = services.find(s => String(s.id) === serviceKey)
    if (!service) {
      return {
        label: t('addTitle'),
        Icon: Sparkles,
        imageUrl: undefined,
      }
    }

    // Priority: use serviceClass if available, otherwise use iconName, then fallback to service name
    let Icon: LucideIcon
    if (service.class !== undefined && service.class !== null) {
      Icon = getServiceIconByClass(service.class) as LucideIcon
    } else {
      const iconName = service.iconName || service.name || ''
      Icon = getServiceIcon(iconName) as LucideIcon
    }

    return {
      label: service.nameEn || service.nameAr || service.name || 'Unknown',
      Icon,
      imageUrl: service.imageUrl,
    }
  }, [serviceKey, services, t])

  // Initialize form data - only when modal opens or initialValue/mode changes
  useEffect(() => {
    // Only initialize when modal opens (not when it closes)
    if (!open) {
      isInitializedRef.current = false
      lastOpenStateRef.current = false
      return
    }

    // Prevent re-initialization if modal is already open and initialized
    if (lastOpenStateRef.current && isInitializedRef.current) {
      return
    }

    lastOpenStateRef.current = true

    if (initialValue && mode === 'edit') {
      // Edit mode: pre-fill all fields
      let purchaseDate = initialValue.purchaseDate || ''
      if (
        purchaseDate &&
        (purchaseDate === '0001-01-01' || isNaN(Date.parse(purchaseDate)))
      ) {
        purchaseDate = ''
      }

      // Get the service label for the title
      const serviceKey = initialValue.serviceKey || ''
      const service = serviceKey && services.length
        ? services.find(s => String(s.id) === serviceKey)
        : null
      const title = service
        ? (service.nameEn || service.nameAr || service.name || '')
        : initialValue.title || ''

      reset({
        completed: initialValue.completed,
        serviceKey,
        title,
        serviceType:
          initialValue.serviceType === 'rent' || initialValue.serviceType === 'buy'
            ? initialValue.serviceType
            : 'rent',
        quantity: initialValue.quantity,
        cost: initialValue.cost,
        advancePayment: initialValue.advancePayment,
        providerUserName: initialValue.providerUserName || '',
        purchaseDate,
      })
      isInitializedRef.current = true
    } else {
      // Add mode: clean defaults
      reset({
        completed: false,
        serviceKey: '',
        title: '',
        serviceType: 'rent',
        quantity: 1,
        cost: 0,
        advancePayment: 0,
        providerUserName: '',
        purchaseDate: '',
      })
      isInitializedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValue?.id, mode]) // Only depend on open, initialValue.id, and mode

  // Sync title and header with selected service (works in both Add and Edit modes)
  useEffect(() => {
    if (!open) return // Don't update if modal is closed

    if (serviceKey && services.length) {
      const service = services.find(s => String(s.id) === serviceKey)
      if (service) {
        // Always update title to match selected service name
        const serviceName = service.nameEn || service.nameAr || service.name || ''
        setValue('title', serviceName, { shouldValidate: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceKey, services.length, open]) // Only depend on serviceKey, services.length, and open

  // Handle ESC key and body scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  const onSubmit = (data: PreparationLineFormValues) => {
    // Convert to ServiceModalFormData format
    const formData: ServiceModalFormData = {
      completed: data.completed,
      serviceKey: data.serviceKey,
      title: data.title,
      serviceType: data.serviceType,
      quantity: data.quantity,
      cost: data.cost,
      advancePayment: data.advancePayment,
      providerUserName: data.providerUserName || '',
      purchaseDate: data.purchaseDate || '',
    }
    onSave(formData)
  }

  const modalTitle = mode === 'view' 
    ? t('viewTitle')
    : mode === 'edit'
      ? t('editTitle')
      : t('addTitle')

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={modalTitle}
      maxWidth="xl"
      closeOnOverlayClick={true}
      containerClassName="max-h-[90vh] flex flex-col"
      className="backdrop-blur-sm"
      contentClassName="p-0 flex-1 flex flex-col min-h-0"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col flex-1 min-h-0', isRtl ? 'text-right' : 'text-left')}
      >
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Top Section: Icon */}
        <div className="flex flex-col items-center space-y-2 mb-4">
          {/* Icon in soft circle - Always show Sparkles by default */}
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {selectedService.imageUrl ? (
              <img
                src={selectedService.imageUrl}
                alt={selectedService.label}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <selectedService.Icon className="w-8 h-8 text-primary" />
            )}
          </div>
        </div>

        {/* Service Selection - At the top */}
        {mode !== 'view' && (
          <div>
            {isLoadingServices ? (
              <div className="py-4 text-center text-gray-500">
                {t('loadingServices')}
              </div>
            ) : (
              <ServiceSelect
                value={serviceKey}
                onChange={value => setValue('serviceKey', value, { shouldValidate: true })}
                required
                services={services}
                t={t}
              />
            )}
            {errors.serviceKey && (
              <p className="mt-1 text-sm text-red-500">{errors.serviceKey.message}</p>
            )}
          </div>
        )}

        {/* Header Row: Completed + Service Type */}
        <div className={cn('flex flex-wrap items-center gap-4', isRtl ? 'justify-between' : 'justify-between')}>
          <div className="flex items-center gap-2">
            {mode === 'view' ? (
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center',
                  watchedValues.completed ? 'bg-brand-500 border-brand-500' : 'border-gray-300'
                )}>
                  {watchedValues.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <label className={cn(planningTypography.body, 'text-gray-900')}>
                  {t('fields.completed')}
                </label>
              </div>
            ) : (
              <>
                <Checkbox
                  checked={watchedValues.completed}
                  onChange={checked => setValue('completed', checked)}
                  variant="brand"
                />
                <label
                  className={cn(
                    planningTypography.body,
                    'text-gray-900 cursor-pointer'
                  )}
                >
                  {t('fields.completed')}
                </label>
              </>
            )}
          </div>

          <div className="flex-1 max-w-[200px]">
            {mode === 'view' ? (
              <div>
                <label className={cn(planningTypography.secondary, 'text-gray-500 text-12 mb-1 block')}>
                  {t('fields.serviceType')}
                </label>
                <div className={cn(planningTypography.body, 'text-gray-900')}>
                  {watchedValues.serviceType === 'rent' ? t('options.rent') : t('options.buy')}
                </div>
              </div>
            ) : (
              <SelectField
                label={t('fields.serviceType')}
                value={watchedValues.serviceType}
                onChange={value =>
                  setValue('serviceType', value as 'rent' | 'buy', { shouldValidate: true })
                }
                options={SERVICE_TYPE_OPTIONS}
                required
                showLabel={false}
              />
            )}
            {errors.serviceType && (
              <p className="mt-1 text-sm text-red-500">{errors.serviceType.message}</p>
            )}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-4 sm:p-6 space-y-3">
          {/* Title Input */}
          <div>
            <label
              className={cn(
                'block',
                planningTypography.secondary,
                'font-medium text-gray-700 mb-2'
              )}
            >
              {t('fields.title')} <span className="text-red-500">*</span>
            </label>
            {mode === 'view' ? (
              <div className={cn(planningTypography.body, 'text-gray-900 py-2')}>
                {watchedValues.title || '-'}
              </div>
            ) : (
              <Input
                {...register('title')}
                placeholder={t('placeholders.title')}
                required
                errorMessage={errors.title?.message}
              />
            )}
          </div>

          {/* Quantity */}
          <div>
            <label
              className={cn(
                'block',
                planningTypography.secondary,
                'font-medium text-gray-700 mb-2'
              )}
            >
              {t('fields.quantity')}
            </label>
            {mode === 'view' ? (
              <div className={cn(planningTypography.body, 'text-gray-900 py-2')}>
                {watchedValues.quantity || 1}
              </div>
            ) : (
              <NumberStepper
                value={watchedValues.quantity || 1}
                onChange={value => setValue('quantity', value, { shouldValidate: true })}
                min={1}
              />
            )}
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          {/* Cost Section: Left Inputs + Right Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column: Cost & Advance */}
            <div className="space-y-4">
              <div>
                <label
                  className={cn(
                    'block',
                    planningTypography.secondary,
                    'font-medium text-gray-700 mb-2'
                  )}
                >
                  {t('fields.cost')}
                </label>
                {mode === 'view' ? (
                  <div className={cn(planningTypography.body, 'text-gray-900 py-2')}>
                    {new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
                      style: 'currency',
                      currency: 'EGP',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(watchedValues.cost || 0)}
                  </div>
                ) : (
                  <Input
                    type="number"
                    {...register('cost', { valueAsNumber: true })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    errorMessage={errors.cost?.message}
                  />
                )}
              </div>

              <div>
                <label
                  className={cn(
                    'block',
                    planningTypography.secondary,
                    'font-medium text-gray-700 mb-2'
                  )}
                >
                  {t('fields.advancePayment')}
                </label>
                {mode === 'view' ? (
                  <div className={cn(planningTypography.body, 'text-gray-900 py-2')}>
                    {new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
                      style: 'currency',
                      currency: 'EGP',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(watchedValues.advancePayment || 0)}
                  </div>
                ) : (
                  <Input
                    type="number"
                    {...register('advancePayment', { valueAsNumber: true })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    errorMessage={errors.advancePayment?.message}
                  />
                )}
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="space-y-4">
              <PriceSummary 
                totalCost={totalCost} 
                remaining={remaining} 
                t={tPrice} 
              />
            </div>
          </div>

          {/* Provider User Name */}
          <div>
            <label
              className={cn(
                'block',
                planningTypography.secondary,
                'font-medium text-gray-700 mb-2'
              )}
            >
              {t('fields.providerUserName')}
            </label>
            {mode === 'view' ? (
              <div className={cn(planningTypography.body, 'text-gray-900 py-2')}>
                {watchedValues.providerUserName || '-'}
              </div>
            ) : (
              <Input
                {...register('providerUserName')}
                placeholder={t('placeholders.providerName')}
              />
            )}
          </div>

          {/* Purchase Date */}
          <div>
            <label
              className={cn(
                'block',
                planningTypography.secondary,
                'font-medium text-gray-700 mb-2'
              )}
            >
              {t('fields.purchaseDate')}
            </label>
            {mode === 'view' ? (
              <div className={cn(planningTypography.body, 'text-gray-900 py-2')}>
                {watchedValues.purchaseDate &&
                  watchedValues.purchaseDate !== '0001-01-01' &&
                  !isNaN(Date.parse(watchedValues.purchaseDate))
                  ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }).format(new Date(watchedValues.purchaseDate))
                  : '-'}
              </div>
            ) : (
              <Input
                type="date"
                {...register('purchaseDate')}
                value={
                  watchedValues.purchaseDate &&
                    watchedValues.purchaseDate !== '0001-01-01' &&
                    !isNaN(Date.parse(watchedValues.purchaseDate))
                    ? watchedValues.purchaseDate
                    : ''
                }
              />
            )}
          </div>
        </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div
          className={cn(
            'flex flex-col-reverse gap-3 pt-4 px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 sm:flex-row sm:justify-end flex-shrink-0',
            isRtl && 'sm:flex-row-reverse'
          )}
        >
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
            {t('actions.cancel')}
          </Button>
          <Button type="submit" variant="brand" className="text-white w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? t('actions.saving') : t('actions.save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
