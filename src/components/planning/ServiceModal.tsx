'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import type { PreparationService, ServiceType } from '@/types/planning'
import { NumberStepper } from './NumberStepper'
import { planningTypography } from './typography'
import { WeddingDressIcon } from '@/assets/icons/WeddingDressIcon'
import { WeddingHallIcon } from '@/assets/icons/WeddingHallIcon'
import { PhotographyIcon } from '@/assets/icons/PhotographyIcon'
import { BridalBeautyIcon } from '@/assets/icons/BridalBeautyIcon'
import { WeddingCakeIcon } from '@/assets/icons/WeddingCakeIcon'
import { BouquetIcon } from '@/assets/icons/BouquetIcon'
import { WeddingSuitIcon } from '@/assets/icons/WeddingSuitIcon'
import { AccessoriesIcon } from '@/assets/icons/AccessoriesIcon'
import { cn } from '@/lib/utils'

// Icon mapping for asset icons
const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  weddingDress: WeddingDressIcon,
  weddingHall: WeddingHallIcon,
  photography: PhotographyIcon,
  bridalBeauty: BridalBeautyIcon,
  weddingCake: WeddingCakeIcon,
  bouquet: BouquetIcon,
  weddingSuit: WeddingSuitIcon,
  accessories: AccessoriesIcon,
}

export interface ServiceModalProps {
  open: boolean
  mode: 'add' | 'edit'
  initialValue?: PreparationService
  serviceTypeOptions: ServiceType[]
  onClose: () => void
  onSave: (value: Omit<PreparationService, 'id'>) => void
}

export const ServiceModal = ({
  open,
  mode,
  initialValue,
  serviceTypeOptions,
  onClose,
  onSave,
}: ServiceModalProps) => {
  const [formData, setFormData] = useState<{
    title: string
    icon: { kind: 'asset' | 'uploaded'; value: string }
    serviceType: string
    quantity: number
    cost: number
    advancePayment: number
    providerUserName: string
    purchaseDate: string
    completed: boolean
  }>({
    title: '',
    icon: { kind: 'asset', value: 'weddingDress' },
    serviceType: 'rent',
    quantity: 1,
    cost: 0,
    advancePayment: 0,
    providerUserName: '',
    purchaseDate: '',
    completed: false,
  })

  const [iconPreview, setIconPreview] = useState<string | null>(null)

  useEffect(() => {
    if (initialValue) {
      setFormData({
        title: initialValue.title,
        icon: initialValue.icon,
        serviceType: initialValue.serviceType,
        quantity: initialValue.quantity,
        cost: initialValue.cost,
        advancePayment: initialValue.advancePayment,
        providerUserName: initialValue.providerUserName,
        purchaseDate: initialValue.purchaseDate,
        completed: initialValue.completed,
      })
      if (initialValue.icon.kind === 'uploaded') {
        setIconPreview(initialValue.icon.value)
      }
    } else {
      setFormData({
        title: '',
        icon: { kind: 'asset', value: 'weddingDress' },
        serviceType: 'rent',
        quantity: 1,
        cost: 0,
        advancePayment: 0,
        providerUserName: '',
        purchaseDate: '',
        completed: false,
      })
      setIconPreview(null)
    }
  }, [initialValue, open])

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/svg+xml', 'image/png']
      if (!validTypes.includes(file.type)) {
        alert('Please upload only SVG or PNG files')
        return
      }
      // Validate file size (1MB max)
      if (file.size > 1024 * 1024) {
        alert('File size must be less than 1MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result as string
        setIconPreview(dataUrl)
        setFormData(prev => ({
          ...prev,
          icon: { kind: 'uploaded', value: dataUrl },
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const totalCost = formData.cost * formData.quantity
  const remaining = Math.max(totalCost - formData.advancePayment, 0)

  // Handle ESC key
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

  const renderIcon = () => {
    if (iconPreview) {
      return (
        <img
          src={iconPreview}
          alt="Icon preview"
          className="w-8 h-8 object-contain"
        />
      )
    } else if (formData.icon.kind === 'asset') {
      const IconComponent = ICON_MAP[formData.icon.value]
      if (IconComponent) {
        return <IconComponent className="w-8 h-8 text-primary" />
      }
    }
    // Default icon
    const DefaultIcon = ICON_MAP['weddingDress']
    return DefaultIcon ? <DefaultIcon className="w-8 h-8 text-primary" /> : null
  }

  const displayTitle = mode === 'edit' && formData.title ? formData.title : 'Add New Preparation'

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
            {renderIcon()}
          </div>
          
          {/* Big Title */}
          <h2 className={cn(planningTypography.pageTitle, 'text-center')}>
            {displayTitle}
          </h2>
        </div>

        {/* Header Row: Completed + Service Type */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={formData.completed}
              onChange={checked => setFormData(prev => ({ ...prev, completed: checked }))}
              variant="brand"
            />
            <label className={cn(planningTypography.body, 'text-gray-900 cursor-pointer')}>
              Completed
            </label>
          </div>
          
          <div className="flex-1 max-w-[200px]">
            <select
              value={formData.serviceType}
              onChange={e => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
              className="flex w-full h-11 items-center rounded-xl border border-gray-300 bg-white px-4 text-16 font-normal leading-6 transition-colors focus:outline-none focus:ring-0 focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {serviceTypeOptions.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className={cn('block', planningTypography.secondary, 'font-medium text-gray-700 mb-2')}>
              Title
            </label>
            <Input
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter service title"
              required
            />
          </div>

          {/* Icon Upload */}
          <div>
            <label className={cn('block', planningTypography.secondary, 'font-medium text-gray-700 mb-2')}>
              Upload icon (SVG/PNG)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                {iconPreview ? (
                  <img
                    src={iconPreview}
                    alt="Icon preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-xs text-center px-2">
                    Icon
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept=".svg,.png,image/svg+xml,image/png"
                  onChange={handleIconUpload}
                  className={cn(
                    'w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer',
                    planningTypography.secondary
                  )}
                />
                <p className={cn(planningTypography.muted, 'mt-1')}>
                  SVG or PNG only, max 1MB
                </p>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className={cn('block', planningTypography.secondary, 'font-medium text-gray-700 mb-2')}>
              Quantity
            </label>
            <NumberStepper
              value={formData.quantity}
              onChange={value => setFormData(prev => ({ ...prev, quantity: value }))}
            />
          </div>

          {/* Cost Section: Left Inputs + Right Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Cost & Advance */}
            <div className="space-y-4">
              <div>
                <label className={cn('block', planningTypography.secondary, 'font-medium text-gray-700 mb-2')}>
                  Cost
                </label>
                <Input
                  type="number"
                  value={formData.cost || ''}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className={cn('block', planningTypography.secondary, 'font-medium text-gray-700 mb-2')}>
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
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className={cn(planningTypography.secondary, 'text-gray-600')}>
                    Total Cost
                  </span>
                  <span className={cn(planningTypography.bodyMedium, 'text-primary font-semibold')}>
                    {totalCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn(planningTypography.secondary, 'text-gray-600')}>
                    Remaining
                  </span>
                  <span className={cn(planningTypography.bodyMedium, 'text-gray-900 font-semibold')}>
                    {remaining.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Provider User Name */}
          <div>
            <label className={cn('block', planningTypography.secondary, 'font-medium text-gray-700 mb-2')}>
              Provider User Name
            </label>
            <Input
              value={formData.providerUserName}
              onChange={e =>
                setFormData(prev => ({ ...prev, providerUserName: e.target.value }))
              }
              placeholder="Enter provider name"
              required
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className={cn('block', planningTypography.secondary, 'font-medium text-gray-700 mb-2')}>
              Purchase Date
            </label>
            <Input
              type="date"
              value={formData.purchaseDate}
              onChange={e =>
                setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))
              }
              required
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
