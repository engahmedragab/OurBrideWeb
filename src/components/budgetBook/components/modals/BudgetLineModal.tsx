'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { budgetLineFormSchema, type BudgetLineFormData } from '@/app/events/planning/budget/schemas/budget-line.schema'
import type { BudgetLineResponse, BudgetLineCategoryResponse } from '@/types/responses'

interface BudgetLineModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    id?: number
    expense: string
    expenseAr: string
    expenseEn: string
    lineCategoryId: number | null
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
    isDeleted: boolean
  }) => void
  editingLine?: BudgetLineResponse | null
  categories: BudgetLineCategoryResponse[]
  defaultCategoryId?: number | null
}

export const BudgetLineModal = ({
  isOpen,
  onClose,
  onSave,
  editingLine,
  categories,
  defaultCategoryId,
}: BudgetLineModalProps) => {
  const [estimatedInput, setEstimatedInput] = useState<string>('')
  const [paidInput, setPaidInput] = useState<string>('')
  const [finalInput, setFinalInput] = useState<string>('')
  const [countInput, setCountInput] = useState<string>('')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(budgetLineFormSchema),
    mode: 'onChange',
    defaultValues: {
      expense: '',
      expenseAr: '',
      expenseEn: '',
      lineCategoryId: null,
      estimated: 0,
      paid: 0,
      final: null,
      dueDate: null,
      count: null,
      payer: null,
      note: null,
      iconName: null,
      colorName: null,
      isDone: false,
      isFavorite: false,
    },
  })

  const estimatedValue = watch('estimated')
  const paidValue = watch('paid')
  const finalValue = watch('final')
  const countValue = watch('count')

  // Reset form when modal opens/closes or editingLine changes
  useEffect(() => {
    if (isOpen && editingLine) {
      const estimated = editingLine.estimated || 0
      const paid = editingLine.paid || 0
      const final = editingLine.final ?? null
      const count = editingLine.count ?? null
      
      reset({
        expense: editingLine.expense || '',
        expenseAr: editingLine.expenseAr || editingLine.expense || '',
        expenseEn: editingLine.expenseEn || editingLine.expense || '',
        lineCategoryId: editingLine.lineCategoryId || null,
        estimated: estimated,
        paid: paid,
        final: final,
        dueDate: editingLine.dueDate || null,
        count: count,
        payer: editingLine.payer || null,
        note: editingLine.note || null,
        iconName: editingLine.iconName || null,
        colorName: editingLine.colorName || null,
        isDone: editingLine.isDone || false,
        isFavorite: editingLine.isFavorite || false,
      })
      
      setEstimatedInput(estimated > 0 ? estimated.toLocaleString('en-US') : '')
      setPaidInput(paid > 0 ? paid.toLocaleString('en-US') : '')
      setFinalInput(final && final > 0 ? final.toLocaleString('en-US') : '')
      setCountInput(count ? count.toString() : '')
    } else if (!isOpen) {
      reset({
        expense: '',
        expenseAr: '',
        expenseEn: '',
        lineCategoryId: defaultCategoryId ?? null,
        estimated: 0,
        paid: 0,
        final: null,
        dueDate: null,
        count: null,
        payer: null,
        note: null,
        iconName: null,
        colorName: null,
        isDone: false,
        isFavorite: false,
      })
      
      setEstimatedInput('')
      setPaidInput('')
      setFinalInput('')
      setCountInput('')
    }
  }, [isOpen, editingLine, defaultCategoryId, reset])

  const handleAmountChange = useCallback(
    (value: string, fieldName: 'estimated' | 'paid' | 'final') => {
      // Only allow numbers and commas
      const cleaned = value.replace(/[^0-9,]/g, '')
      
      // Update the input display based on field
      if (fieldName === 'estimated') {
        setEstimatedInput(cleaned)
      } else if (fieldName === 'paid') {
        setPaidInput(cleaned)
      } else if (fieldName === 'final') {
        setFinalInput(cleaned)
      }
      
      // Parse the numeric value (remove commas for parsing)
      const numValue = cleaned.replace(/,/g, '') ? parseFloat(cleaned.replace(/,/g, '')) : (fieldName === 'final' ? null : 0)
      
      // Update form value
      setValue(fieldName, numValue, { shouldValidate: true })
    },
    [setValue]
  )

  const handleNumberChange = useCallback(
    (value: string) => {
      // Only allow numbers and commas
      const cleaned = value.replace(/[^0-9,]/g, '')
      
      // Update the input display
      setCountInput(cleaned)
      
      // Parse the numeric value (remove commas for parsing)
      const numValue = cleaned.replace(/,/g, '') ? parseFloat(cleaned.replace(/,/g, '')) : null
      
      // Update form value
      setValue('count', numValue, { shouldValidate: true })
    },
    [setValue]
  )

  const onSubmit = useCallback(
    (data: BudgetLineFormData) => {
      onSave({
        id: editingLine?.id,
        expense: data.expense,
        expenseAr: data.expenseAr || data.expense,
        expenseEn: data.expenseEn || data.expense,
        lineCategoryId: data.lineCategoryId,
        estimated: data.estimated,
        paid: data.paid || 0,
        final: data.final,
        dueDate: data.dueDate || null,
        count: data.count,
        payer: data.payer || null,
        note: data.note || null,
        iconName: data.iconName || null,
        colorName: data.colorName || null,
        isDone: data.isDone,
        isFavorite: data.isFavorite,
        isDeleted: false,
      })
      onClose()
    },
    [onSave, editingLine?.id, onClose]
  )

  const categoryOptions = useMemo(() => {
    return [
      { label: 'Select category', value: '' },
      ...categories.map(category => ({
        label: category.name || 'Unnamed Category',
        value: category.id.toString(),
      })),
    ]
  }, [categories])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingLine ? 'Edit Budget Line' : 'Add Budget Line'}
      maxWidth="lg"
    >
      <div className="flex flex-col max-h-[80vh]">
        <div className="flex-1 space-y-6 pb-6 overflow-y-auto min-h-0">
        {/* Service Name */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Service Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register('expense')}
            placeholder="Enter service name"
            size="lg"
            errorMessage={errors.expense?.message}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Category
          </label>
          <Controller
            name="lineCategoryId"
            control={control}
            render={({ field }) => (
              <SelectMenu
                value={field.value?.toString() || ''}
                onChange={(value) => field.onChange(value ? Number(value) : null)}
                options={categoryOptions}
                placeholder="Select category"
                size="lg"
              />
            )}
          />
        </div>

        {/* Amount Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Price */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">
              Total Price <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              inputMode="numeric"
              value={estimatedInput}
              onChange={e => handleAmountChange(e.target.value, 'estimated')}
              placeholder="0"
              size="lg"
              errorMessage={errors.estimated?.message}
            />
          </div>

          {/* Paid */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">Paid</label>
            <Input
              type="text"
              inputMode="numeric"
              value={paidInput}
              onChange={e => handleAmountChange(e.target.value, 'paid')}
              placeholder="0"
              size="lg"
              errorMessage={errors.paid?.message}
            />
          </div>
        </div>

        {/* Final and Count Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Final */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">Final</label>
            <Input
              type="text"
              inputMode="numeric"
              value={finalInput}
              onChange={e => handleAmountChange(e.target.value, 'final')}
              placeholder="0"
              size="lg"
              errorMessage={errors.final?.message}
            />
          </div>

          {/* Count */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">Count</label>
            <Input
              type="text"
              inputMode="numeric"
              value={countInput}
              onChange={e => handleNumberChange(e.target.value)}
              placeholder="0"
              size="lg"
              errorMessage={errors.count?.message}
            />
          </div>
        </div>

        {/* Payer */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">Payer</label>
          <Input
            type="text"
            {...register('payer')}
            placeholder="Enter payer name"
            size="lg"
            errorMessage={errors.payer?.message}
          />
        </div>

        {/* Checkboxes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Is Done */}
          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200">
            <Controller
              name="isDone"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  size="md"
                  variant="brand"
                />
              )}
            />
            <div>
              <label
                className="block text-14 font-semibold text-gray-900 mb-1 cursor-pointer"
                onClick={() => setValue('isDone', !watch('isDone'), { shouldValidate: true })}
              >
                Is Done
              </label>
              <p className="text-12 text-gray-500">Mark this line as completed</p>
            </div>
          </div>

          {/* Is Favorite */}
          <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200">
            <Controller
              name="isFavorite"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  size="md"
                  variant="brand"
                />
              )}
            />
            <div>
              <label
                className="block text-14 font-semibold text-gray-900 mb-1 cursor-pointer"
                onClick={() => setValue('isFavorite', !watch('isFavorite'), { shouldValidate: true })}
              >
                Is Favorite
              </label>
              <p className="text-12 text-gray-500">Mark this line as favorite</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">Notes (Optional)</label>
          <Textarea
            {...register('note')}
            placeholder="Add any additional notes..."
            size="lg"
            rows={4}
            errorMessage={errors.note?.message}
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
              onClick={handleSubmit((data) => onSubmit(data as BudgetLineFormData))}
              disabled={!isValid}
              className="flex-1 h-[44px] !rounded-full text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
