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
import { getServiceIcon } from '@/utils/serviceIconMapper'
import {
  preparationLineSchema,
  type PreparationLineFormValues,
} from '@/schema/preparations.schema'
import { Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
  mode: 'add' | 'edit'
  initialValue?: {
    id: string
    serviceKey?: string
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

const SERVICE_TYPE_OPTIONS = [
  { value: 'rent', label: 'Rent' },
  { value: 'buy', label: 'Buy' },
]

export const ServiceModal = ({
  open,
  mode,
  initialValue,
  onClose,
  onSave,
}: ServiceModalProps) => {
  // Fetch services from API
  const { data: services = [], isLoading: isLoadingServices } = usePreparations(
    {
      enabled: open, // Only fetch when modal is open
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm<PreparationLineFormValues>({
    resolver: zodResolver(preparationLineSchema),
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
  const title = watch('title')
  const cost = watch('cost') || 0
  const quantity = watch('quantity') || 1
  const advancePayment = watch('advancePayment') || 0

  // Track if form has been initialized to prevent infinite loops
  const isInitializedRef = useRef(false)
  const lastOpenStateRef = useRef(false)

  // Derived values for calculations
  const totalCost = useMemo(() => cost * quantity, [cost, quantity])

  const remaining = useMemo(
    () => Math.max(totalCost - advancePayment, 0),
    [totalCost, advancePayment]
  )

  // Get selected service for icon display
  const selectedService = useMemo(() => {
    if (!serviceKey || !services.length) {
      // Default to Sparkles icon when no service selected
      return {
        label: 'Add New Preparation',
        Icon: Sparkles,
        imageUrl: undefined,
      }
    }

    const service = services.find(s => String(s.id) === serviceKey)
    if (!service) {
      return {
        label: 'Add New Preparation',
        Icon: Sparkles,
        imageUrl: undefined,
      }
    }

    // Use icon from API if available, otherwise use getServiceIcon fallback
    const Icon = getServiceIcon(service.name) as LucideIcon

    return {
      label: service.nameEn || service.nameAr || service.name || 'Unknown',
      Icon,
      imageUrl: service.imageUrl,
    }
  }, [serviceKey, services])

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
      const service =
        serviceKey && services.length
          ? services.find(s => String(s.id) === serviceKey)
          : null
      const title = service
        ? service.nameEn || service.nameAr || service.name || ''
        : initialValue.title || ''

      reset({
        completed: initialValue.completed,
        serviceKey,
        title,
        serviceType:
          initialValue.serviceType === 'rent' ||
          initialValue.serviceType === 'buy'
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
        const serviceName =
          service.nameEn || service.nameAr || service.name || ''
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

  // Header title: always show selected service name, or placeholder if none selected
  const displayTitle = selectedService
    ? selectedService.label
    : 'Add New Preparation'

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      maxWidth="xl"
      closeOnOverlayClick={true}
      containerClassName="max-h-[90vh] overflow-y-auto"
      className="backdrop-blur-sm"
      headerClassName="hidden"
      contentClassName="p-0"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {/* Top Section: Icon + Title */}
        <div className="flex flex-col items-center space-y-2">
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

          {/* Big Title */}
          <h2 className={cn(planningTypography.pageTitle, 'text-center')}>
            {displayTitle}
          </h2>
        </div>

        {/* Service Selection - At the top */}
        <div>
          {isLoadingServices ? (
            <div className="py-4 text-center text-gray-500">
              Loading services...
            </div>
          ) : (
            <ServiceSelect
              value={serviceKey}
              onChange={value =>
                setValue('serviceKey', value, { shouldValidate: true })
              }
              required
              services={services}
            />
          )}
          {errors.serviceKey && (
            <p className="mt-1 text-sm text-red-500">
              {errors.serviceKey.message}
            </p>
          )}
        </div>

        {/* Header Row: Completed + Service Type */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
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
              Completed
            </label>
          </div>

          <div className="flex-1 max-w-[200px]">
            <SelectField
              label="Service Type"
              value={watchedValues.serviceType}
              onChange={value =>
                setValue('serviceType', value as 'rent' | 'buy', {
                  shouldValidate: true,
                })
              }
              options={SERVICE_TYPE_OPTIONS}
              required
              showLabel={false}
            />
            {errors.serviceType && (
              <p className="mt-1 text-sm text-red-500">
                {errors.serviceType.message}
              </p>
            )}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-6 space-y-3">
          {/* Title Input */}
          <div>
            <label
              className={cn(
                'block',
                planningTypography.secondary,
                'font-medium text-gray-700 mb-2'
              )}
            >
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('title')}
              placeholder="Enter service title"
              required
              errorMessage={errors.title?.message}
            />
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
              Quantity
            </label>
            <NumberStepper
              value={watchedValues.quantity || 1}
              onChange={value =>
                setValue('quantity', value, { shouldValidate: true })
              }
              min={1}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Cost Section: Left Inputs + Right Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Cost (Unit)
                </label>
                <Input
                  type="number"
                  {...register('cost', { valueAsNumber: true })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  errorMessage={errors.cost?.message}
                />
              </div>

              <div>
                <label
                  className={cn(
                    'block',
                    planningTypography.secondary,
                    'font-medium text-gray-700 mb-2'
                  )}
                >
                  Advance Payment
                </label>
                <Input
                  type="number"
                  {...register('advancePayment', { valueAsNumber: true })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  errorMessage={errors.advancePayment?.message}
                />
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="space-y-4">
              <PriceSummary totalCost={totalCost} remaining={remaining} />
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
              Provider User Name
            </label>
            <Input
              {...register('providerUserName')}
              placeholder="Enter provider name"
            />
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
              Purchase Date
            </label>
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
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
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
            className="text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
