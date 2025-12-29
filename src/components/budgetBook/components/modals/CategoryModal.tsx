'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { IconPickerModal } from './IconPickerModal'
import { CategoryIcon } from '../CategoryIcon'
import { COLOR_OPTIONS } from '../ColorPicker'
import { categoryFormSchema, type CategoryFormData } from '@/app/events/planning/budget/schemas/category.schema'
import type { BudgetLineCategoryResponse } from '@/types/responses'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    id?: number
    name: string
    nameAr: string
    nameEn: string
    description: string
    estimated: number
    iconName: string | null
    colorName: string | null
  }) => void
  editingCategory?: BudgetLineCategoryResponse | null
}

export const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}: CategoryModalProps) => {
  const [iconName, setIconName] = useState<string | null>(null)
  const [colorName, setColorName] = useState<string | null>(null)
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)
  const [estimatedInput, setEstimatedInput] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(categoryFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      estimated: 0,
      iconName: null,
      colorName: null,
    },
  })

  const estimatedValue = watch('estimated')

  // Reset form when modal opens/closes or editingCategory changes
  useEffect(() => {
    if (isOpen && editingCategory) {
      const estimated = editingCategory.estimated || 0
      reset({
        name: editingCategory.name || '',
        description: editingCategory.description || '',
        estimated: estimated,
        iconName: editingCategory.iconName || null,
        colorName: editingCategory.colorName || null,
      })
      setIconName(editingCategory.iconName || null)
      setColorName(editingCategory.colorName || null)
      setEstimatedInput(estimated > 0 ? estimated.toLocaleString('en-US') : '')
    } else if (!isOpen) {
      reset({
        name: '',
        description: '',
        estimated: 0,
        iconName: null,
        colorName: null,
      })
      setIconName(null)
      setColorName(null)
      setEstimatedInput('')
    }
  }, [isOpen, editingCategory, reset])

  // Color options for SelectMenu
  const colorOptions = useMemo(() => {
    return [
      { label: 'Select color', value: '' },
      ...COLOR_OPTIONS.map(color => ({
        label: color.label,
        value: color.argb,
      })),
    ]
  }, [])

  const handleAmountChange = useCallback(
    (value: string) => {
      // Only allow numbers and commas
      const cleaned = value.replace(/[^0-9,]/g, '')
      
      // Update the input display (only numbers and commas)
      setEstimatedInput(cleaned)
      
      // Parse the numeric value (remove commas for parsing)
      const numValue = cleaned.replace(/,/g, '') ? parseFloat(cleaned.replace(/,/g, '')) : 0
      
      // Update form value
      setValue('estimated', numValue, { shouldValidate: true })
    },
    [setValue]
  )

  const onSubmit = useCallback(
    (data: CategoryFormData) => {
      onSave({
        id: editingCategory?.id,
        name: data.name,
        nameAr: data.name, // Use name for both
        nameEn: data.name, // Use name for both
        description: data.description || '',
        estimated: data.estimated,
        iconName: data.iconName || null,
        colorName: data.colorName || null,
      })
      onClose()
    },
    [onSave, editingCategory?.id, onClose]
  )

  const handleSaveToLocal = useCallback(() => {
    handleSubmit((data) => onSubmit(data as CategoryFormData))()
  }, [handleSubmit, onSubmit])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? 'Edit Category' : 'Add Category'}
      maxWidth="md"
    >
      <div className="flex flex-col max-h-[80vh]">
        <div className="flex-1 space-y-6 pb-6 overflow-y-auto min-h-0">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register('name')}
            placeholder="Enter category name"
            size="lg"
            errorMessage={errors.name?.message}
          />
        </div>

        {/* Description - Full Width */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Description
          </label>
          <Textarea
            {...register('description')}
            placeholder="Enter category description"
            size="lg"
            rows={3}
            errorMessage={errors.description?.message}
          />
        </div>

        {/* Estimated and Icon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Estimated */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">
              Estimated
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                value={estimatedInput}
                onChange={e => handleAmountChange(e.target.value)}
                placeholder="0"
                size="lg"
                className="pr-20"
                errorMessage={errors.estimated?.message}
              />
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">
              Icon
            </label>
            <button
              type="button"
              onClick={() => setIsIconPickerOpen(true)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center justify-start gap-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
            >
              {iconName ? (
                <>
                  <CategoryIcon
                    iconName={iconName}
                    colorName={colorName || '0xff8e8e8e'}
                    size="sm"
                  />
                  <span className="text-14 text-gray-700 font-medium">Icon selected</span>
                </>
              ) : (
                <span className="text-14 text-gray-400 font-normal">Select an icon</span>
              )}
            </button>
          </div>
        </div>

        {/* Color Select */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">Color</label>
          <SelectMenu
            value={colorName || ''}
            onChange={(value) => {
              const newColor = value || null
              setColorName(newColor)
              setValue('colorName', newColor, { shouldValidate: true })
            }}
            options={colorOptions}
            placeholder="Select color"
            size="lg"
          />
        </div>
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 pt-4 border-t border-gray-100 -mx-6 px-6 bg-white rounded-b-2xl">
          <div className="flex flex-row gap-3">
            <Button
              variant="gray"
              size="md"
              onClick={onClose}
              className="flex-1 h-[44px] !rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              size="md"
              onClick={handleSubmit((data) => onSubmit(data as CategoryFormData))}
              disabled={!isValid}
              className="flex-1 h-[44px] !rounded-full text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={(selectedIcon) => {
          setIconName(selectedIcon)
          setValue('iconName', selectedIcon, { shouldValidate: true })
        }}
        selectedIconKey={iconName}
      />
    </Modal>
  )
}
