'use client'

import { useState, useEffect, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { NumberStepper } from './NumberStepper'
import { ServiceSelect, SERVICE_OPTIONS } from './ServiceSelect'
import { SelectField } from './SelectField'
import { PriceSummary } from './PriceSummary'
import { planningTypography } from './typography'
import { cn } from '@/lib/utils'

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
  const [formData, setFormData] = useState<ServiceModalFormData>({
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

  // Derived values for calculations
  const totalCost = useMemo(
    () => formData.cost * formData.quantity,
    [formData.cost, formData.quantity]
  )

  const remaining = useMemo(
    () => Math.max(totalCost - formData.advancePayment, 0),
    [totalCost, formData.advancePayment]
  )

  // Get selected service for icon display
  const selectedService = useMemo(
    () => SERVICE_OPTIONS.find(s => s.serviceKey === formData.serviceKey),
    [formData.serviceKey]
  )

  // Initialize form data
  useEffect(() => {
    if (open) {
      if (initialValue && mode === 'edit') {
        // Edit mode: pre-fill all fields
        // Validate purchase date - ensure it's not invalid
        let purchaseDate = initialValue.purchaseDate || ''
        if (
          purchaseDate &&
          (purchaseDate === '0001-01-01' || isNaN(Date.parse(purchaseDate)))
        ) {
          purchaseDate = ''
        }

        // Get the service label for the title
        const serviceKey = initialValue.serviceKey || ''
        const service = serviceKey
          ? SERVICE_OPTIONS.find(s => s.serviceKey === serviceKey)
          : null
        const title = service ? service.label : ''

        setFormData({
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
      } else {
        // Add mode: clean defaults
        setFormData({
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
      }
    }
  }, [open, initialValue, mode])

  // Sync title and header with selected service (works in both Add and Edit modes)
  useEffect(() => {
    if (formData.serviceKey) {
      const service = SERVICE_OPTIONS.find(s => s.serviceKey === formData.serviceKey)
      if (service) {
        // Always update title to match selected service name
        setFormData(prev => ({ ...prev, title: service.label }))
      }
    } else {
      // If no service selected, clear the title
      setFormData(prev => ({ ...prev, title: '' }))
    }
  }, [formData.serviceKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.serviceKey) {
      alert('Please select a service')
      return
    }
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }
    if (formData.quantity < 1) {
      alert('Quantity must be at least 1')
      return
    }
    if (formData.cost < 0) {
      alert('Cost cannot be negative')
      return
    }
    if (formData.advancePayment < 0) {
      alert('Advance payment cannot be negative')
      return
    }

    onSave(formData)
    onClose()
  }

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
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Top Section: Icon + Title */}
        <div className="flex flex-col items-center space-y-4">
          {/* Icon in soft circle */}
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {selectedService ? (
              <selectedService.Icon className="w-8 h-8 text-primary" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300/50 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gray-300" />
              </div>
            )}
          </div>

          {/* Big Title */}
          <h2 className={cn(planningTypography.pageTitle, 'text-center')}>
            {displayTitle}
          </h2>
        </div>

        {/* Service Selection - At the top */}
        <div>
          <ServiceSelect
            value={formData.serviceKey}
            onChange={serviceKey =>
              setFormData(prev => ({ ...prev, serviceKey }))
            }
            required
          />
        </div>

        {/* Header Row: Completed + Service Type */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.completed}
              onChange={checked =>
                setFormData(prev => ({ ...prev, completed: checked }))
              }
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
              value={formData.serviceType}
              onChange={value =>
                setFormData(prev => ({
                  ...prev,
                  serviceType: value as 'rent' | 'buy',
                }))
              }
              options={SERVICE_TYPE_OPTIONS}
              required
              showLabel={false}
            />
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-6 space-y-6">
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
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter service title"
              required
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
              value={formData.quantity}
              onChange={value =>
                setFormData(prev => ({ ...prev, quantity: value }))
              }
              min={1}
            />
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
                  value={formData.cost || ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      cost: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
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
                  value={formData.advancePayment || ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      advancePayment: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
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
              value={formData.providerUserName}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  providerUserName: e.target.value,
                }))
              }
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
              value={
                formData.purchaseDate &&
                formData.purchaseDate !== '0001-01-01' &&
                !isNaN(Date.parse(formData.purchaseDate))
                  ? formData.purchaseDate
                  : ''
              }
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  purchaseDate: e.target.value || '',
                }))
              }
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="brand" className="text-white">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  )
}
