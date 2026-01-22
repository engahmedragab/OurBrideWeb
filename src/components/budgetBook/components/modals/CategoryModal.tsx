'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { Checkbox } from '@/components/ui/Checkbox'

import { IconPickerModal } from './IconPickerModal'
import { CategoryIcon } from '../CategoryIcon'
import { COLOR_OPTIONS } from '../ColorPicker'

import {
  categoryFormSchema,
  categoryWithLineFormSchema,
  type CategoryFormData,
  type CategoryWithLineFormData,
} from '@/schema/budgetSchema/category.schema'
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
    descriptionAr: string
    descriptionEn: string
    estimated: number
    iconName: string | null
    colorName: string | null
    lineData?: {
      expense: string
      expenseAr: string
      expenseEn: string
      estimated: number
      paid: number
      final: number | null
      dueDate: string | null
      count: number | null
      payer: string | null
      note: string | null
      iconName: string | null
      colorName: string | null
      isDone: boolean
      isFavorite: boolean
    }
  }) => void
  editingCategory?: BudgetLineCategoryResponse | null
}

type FormValues = Partial<CategoryWithLineFormData> & CategoryFormData

const sanitizeNumberInput = (raw: string) => raw.replace(/[^0-9,]/g, '')

const toNumberOrNull = (raw: string, allowNull: boolean) => {
  const cleaned = raw.replace(/,/g, '').trim()
  if (!cleaned) return allowNull ? null : 0
  const num = Number(cleaned)
  if (Number.isNaN(num)) return allowNull ? null : 0
  return num
}

// date input returns YYYY-MM-DD => convert to ISO (midnight Z) for API friendliness
const dateToIsoOrNull = (raw: string) => {
  if (!raw) return null
  // keep it stable as UTC midnight
  return new Date(`${raw}T00:00:00.000Z`).toISOString()
}

export const CategoryModal = ({ isOpen, onClose, onSave, editingCategory }: CategoryModalProps) => {
  const isEditing = !!editingCategory
  const schema = isEditing ? categoryFormSchema : categoryWithLineFormSchema

  // UI states
  const [categoryEstimatedInput, setCategoryEstimatedInput] = useState('')
  const [lineEstimatedInput, setLineEstimatedInput] = useState('')
  const [linePaidInput, setLinePaidInput] = useState('')
  const [lineFinalInput, setLineFinalInput] = useState('')
  const [lineCountInput, setLineCountInput] = useState('')

  const [iconName, setIconName] = useState<string | null>(null)
  const [colorName, setColorName] = useState<string | null>(null)
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm<FormValues>({
    // schema dynamic حسب edit/create
    resolver: zodResolver(schema) as never,
    mode: 'onChange',
    defaultValues: {
      name: '',
      nameAr: '',
      nameEn: '',
      description: '',
      descriptionAr: '',
      descriptionEn: '',
      estimated: 0,
      iconName: null,
      colorName: null,

      // line fields for create mode (schema بيطلبها)
      expense: '',
      expenseAr: '',
      expenseEn: '',
      paid: 0,
      final: null,
      dueDate: null,
      count: null,
      payer: null,
      note: null,
      lineIconName: null,
      lineColorName: null,
      isDone: false,
      isFavorite: false,
    },
  })

  // Reset on open
  useEffect(() => {
    if (!isOpen) return

    if (isEditing && editingCategory) {
      const est = editingCategory.estimated || 0

      reset({
        name: editingCategory.name || '',
        nameAr: editingCategory.nameAr || editingCategory.name || '',
        nameEn: editingCategory.nameEn || editingCategory.name || '',
        description: editingCategory.description || '',
        descriptionAr: editingCategory.descriptionAr || editingCategory.description || '',
        descriptionEn: editingCategory.descriptionEn || editingCategory.description || '',
        estimated: est,
        iconName: editingCategory.iconName || null,
        colorName: editingCategory.colorName || null,
      })

      setIconName(editingCategory.iconName || null)
      setColorName(editingCategory.colorName || null)
      setCategoryEstimatedInput(est > 0 ? est.toLocaleString('en-US') : '')

      // clear create-only inputs
      setLineEstimatedInput('')
      setLinePaidInput('')
      setLineFinalInput('')
      setLineCountInput('')
    } else {
      // Create mode
      reset({
        name: '',
        nameAr: '',
        nameEn: '',
        description: '',
        descriptionAr: '',
        descriptionEn: '',
        estimated: 0,
        iconName: null,
        colorName: null,

        expense: '',
        expenseAr: '',
        expenseEn: '',
        paid: 0,
        final: null,
        dueDate: null,
        count: null,
        payer: null,
        note: null,
        lineIconName: null,
        lineColorName: null,
        isDone: false,
        isFavorite: false,
      })

      setIconName(null)
      setColorName(null)
      setCategoryEstimatedInput('')

      setLineEstimatedInput('')
      setLinePaidInput('')
      setLineFinalInput('')
      setLineCountInput('')
    }
  }, [isOpen, isEditing, editingCategory, reset])

  const colorOptions = useMemo(
    () => [
      { label: 'Select color', value: '' },
      ...COLOR_OPTIONS.map(c => ({ label: c.label, value: c.argb })),
    ],
    []
  )

  // Category estimated (edit only)
  const onCategoryEstimatedChange = useCallback(
    (raw: string) => {
      const cleaned = sanitizeNumberInput(raw)
      setCategoryEstimatedInput(cleaned)
      const num = toNumberOrNull(cleaned, false) as number
      setValue('estimated', num, { shouldValidate: true })
    },
    [setValue]
  )

  // Line money fields (create)
  const onLineMoneyChange = useCallback(
    (field: 'estimated' | 'paid' | 'final', raw: string) => {
      const cleaned = sanitizeNumberInput(raw)

      if (field === 'estimated') setLineEstimatedInput(cleaned)
      if (field === 'paid') setLinePaidInput(cleaned)
      if (field === 'final') setLineFinalInput(cleaned)

      const allowNull = field === 'final'
      const num = toNumberOrNull(cleaned, allowNull)
      setValue(field, num as number | null, { shouldValidate: true })
    },
    [setValue]
  )

  const onLineCountChange = useCallback(
    (raw: string) => {
      const cleaned = sanitizeNumberInput(raw)
      setLineCountInput(cleaned)
      const num = toNumberOrNull(cleaned, true)
      setValue('count', num as number | null, { shouldValidate: true })
    },
    [setValue]
  )

  const onSubmit = useCallback(
    (data: FormValues) => {
      if (isEditing) {
        const d = data as CategoryFormData
        onSave({
          id: editingCategory?.id,
          name: d.name,
          nameAr: d.nameAr || d.name,
          nameEn: d.nameEn || d.name,
          description: d.description || '',
          descriptionAr: d.descriptionAr || d.description || '',
          descriptionEn: d.descriptionEn || d.description || '',
          estimated: d.estimated,
          iconName: d.iconName ?? null,
          colorName: d.colorName ?? null,
        })
        onClose()
        return
      }

      const d = data as CategoryWithLineFormData

      const categoryIcon = d.iconName ?? null
      const categoryColor = d.colorName ?? null

      onSave({
        name: d.name,
        nameAr: d.nameAr || d.name,
        nameEn: d.nameEn || d.name,
        description: d.description || '',
        descriptionAr: d.descriptionAr || d.description || '',
        descriptionEn: d.descriptionEn || d.description || '',

        // ✅ خليه نفس line estimated (أكتر أمان من 0)
        estimated: d.estimated,

        iconName: categoryIcon,
        colorName: categoryColor,

        lineData: {
          expense: d.expense,
          expenseAr: d.expenseAr || d.expense,
          expenseEn: d.expenseEn || d.expense,

          estimated: d.estimated,
          paid: d.paid || 0,
          final: d.final ?? null,
          dueDate: d.dueDate || null,
          count: d.count ?? null,
          payer: d.payer || null,
          note: d.note || null,

          // ✅ لو مفيش UI للـ line icon/color خليه default زي category
          iconName: d.lineIconName ?? categoryIcon,
          colorName: d.lineColorName ?? categoryColor,

          isDone: d.isDone || false,
          isFavorite: d.isFavorite || false,
        },
      })

      onClose()
    },
    [isEditing, editingCategory?.id, onSave, onClose]
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'Add Category (with first line)'}
      maxWidth="md"
    >
      <div className="flex flex-col max-h-[80vh]">
        <div className="flex-1 overflow-y-auto min-h-0 space-y-5 pb-6">
          {/* ===== Category Section ===== */}
          <div className="rounded-2xl border   p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-14 font-semibold text-gray-900">Category</h3>
              <span className="text-12 text-gray-500">
                {isEditing ? 'Update category details' : 'Create a new category'}
              </span>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-13 font-semibold text-gray-900">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                {...register('name')}
                placeholder="e.g. Family"
                size="lg"
                errorMessage={errors.name?.message}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-13 font-semibold text-gray-900">Description</label>
              <Textarea
                {...register('description')}
                placeholder="Optional…"
                size="lg"
                rows={3}
                errorMessage={errors.description?.message}
              />
            </div>

            {/* Icon + Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-13 font-semibold text-gray-900">Icon</label>
                <button
                  type="button"
                  onClick={() => setIsIconPickerOpen(true)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition flex items-center gap-3"
                >
                  {iconName ? (
                    <>
                      <CategoryIcon
                        iconName={iconName}
                        colorName={colorName || '0xff8e8e8e'}
                        size="sm"
                      />
                      <span className="text-14 text-gray-800 font-medium">Change icon</span>
                    </>
                  ) : (
                    <span className="text-14 text-gray-500">Select an icon</span>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-13 font-semibold text-gray-900">Color</label>
                <SelectMenu
                  value={colorName || ''}
                  onChange={value => {
                    const newColor = value || null
                    setColorName(newColor)
                    setValue('colorName', newColor as string | null, { shouldValidate: true })
                  }}
                  options={colorOptions}
                  placeholder="Select color"
                  size="lg"
                />
              </div>
            </div>

            {/* Estimated (edit only) */}
            {isEditing && (
              <div className="space-y-2">
                <label className="block text-13 font-semibold text-gray-900">Estimated</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={categoryEstimatedInput}
                  onChange={e => onCategoryEstimatedChange(e.target.value)}
                  placeholder="0"
                  size="lg"
                  errorMessage={errors.estimated?.message}
                />
              </div>
            )}
          </div>

          {/* ===== Line Section (create only) ===== */}
          {!isEditing && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-14 font-semibold text-gray-900">First budget line</h3>
                <span className="text-12 text-gray-500">Required to sync category properly</span>
              </div>

              {/* Service */}
              <div className="space-y-2">
                <label className="block text-13 font-semibold text-gray-900">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  {...register('expense')}
                  placeholder="e.g. Family invitation"
                  size="lg"
                  errorMessage={errors.expense?.message}
                />
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-13 font-semibold text-gray-900">
                    Total Price <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={lineEstimatedInput}
                    onChange={e => onLineMoneyChange('estimated', e.target.value)}
                    placeholder="0"
                    size="lg"
                    errorMessage={errors.estimated?.message}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-13 font-semibold text-gray-900">Paid</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={linePaidInput}
                    onChange={e => onLineMoneyChange('paid', e.target.value)}
                    placeholder="0"
                    size="lg"
                    errorMessage={errors.paid?.message}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-13 font-semibold text-gray-900">Final</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={lineFinalInput}
                    onChange={e => onLineMoneyChange('final', e.target.value)}
                    placeholder="0"
                    size="lg"
                    errorMessage={errors.final?.message}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-13 font-semibold text-gray-900">Count</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={lineCountInput}
                    onChange={e => onLineCountChange(e.target.value)}
                    placeholder="0"
                    size="lg"
                    errorMessage={errors.count?.message}
                  />
                </div>
              </div>

              {/* Due date + payer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-13 font-semibold text-gray-900">Due Date</label>
                  <Input
                    type="date"
                    size="lg"
                    onChange={e => {
                      const iso = dateToIsoOrNull(e.target.value)
                      setValue('dueDate', iso as string | null, { shouldValidate: true })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-13 font-semibold text-gray-900">Payer</label>
                  <Input
                    type="text"
                    {...register('payer')}
                    placeholder="Bride / Groom / ..."
                    size="lg"
                    errorMessage={errors.payer?.message}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="block text-13 font-semibold text-gray-900">Note</label>
                <Textarea
                  {...register('note')}
                  placeholder="Optional…"
                  size="lg"
                  rows={3}
                  errorMessage={errors.note?.message}
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl border  ">
                  <Controller
                    name="isDone"
                    control={control}
                    render={({ field }) => (
                      <Checkbox checked={!!field.value} onChange={field.onChange} size="md" variant="brand" />
                    )}
                  />
                  <div>
                    <div className="text-13 font-semibold text-gray-900">Done</div>
                    <div className="text-12 text-gray-500">Mark as completed</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                  <Controller
                    name="isFavorite"
                    control={control}
                    render={({ field }) => (
                      <Checkbox checked={!!field.value} onChange={field.onChange} size="md" variant="brand" />
                    )}
                  />
                  <div>
                    <div className="text-13 font-semibold text-gray-900">Favorite</div>
                    <div className="text-12 text-gray-500">Pin it on top</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-4">
          <div className="flex gap-3">
            <Button
              variant="gray"
              size="md"
              onClick={onClose}
              type="button"
              className="flex-1 h-[44px] !rounded-full"
            >
              Cancel
            </Button>

            <Button
              variant="brand"
              size="md"
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || isSubmitting}
              className="flex-1 h-[44px] !rounded-full text-white"
            >
              {isEditing ? 'Save' : 'Add Category & Line'}
            </Button>
          </div>
        </div>
      </div>

      {/* Icon Picker */}
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={selectedIcon => {
          setIconName(selectedIcon)
          setValue('iconName', selectedIcon as string | null, { shouldValidate: true })
        }}
        selectedIconKey={iconName}
      />
    </Modal>
  )
}
