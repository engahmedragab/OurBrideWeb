'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { Toggle } from '@/components/ui/Switch'
import type { MockBudgetLine, MockBudgetLineCategory } from '../state/mockBudgetData'

interface BudgetLineModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    id?: number
    expense: string
    lineCategoryId: number | null
    estimated: number
    paid: number
    final: number | null
    dueDate: string | null
    count: number | null
    payer: string | null
    note: string | null
    isDone: boolean
    isFavorite: boolean
    isDeleted: boolean
  }) => void
  editingLine?: MockBudgetLine | null
  categories: MockBudgetLineCategory[]
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
  const [expense, setExpense] = useState('')
  const [lineCategoryId, setLineCategoryId] = useState<number | null>(null)
  const [estimated, setEstimated] = useState('')
  const [paid, setPaid] = useState('')
  const [final, setFinal] = useState('')
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [count, setCount] = useState('')
  const [payer, setPayer] = useState('')
  const [note, setNote] = useState('')
  const [isDone, setIsDone] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  useEffect(() => {
    if (isOpen && editingLine) {
      setExpense(editingLine.expense || '')
      setLineCategoryId(editingLine.lineCategoryId)
      setEstimated(editingLine.estimated.toString())
      setPaid(editingLine.paid.toString())
      setFinal(editingLine.final?.toString() || '')
      setDueDate(editingLine.dueDate ? new Date(editingLine.dueDate) : null)
      setCount(editingLine.count?.toString() || '')
      setPayer(editingLine.payer || '')
      setNote(editingLine.note || '')
      setIsDone(editingLine.isDone)
      setIsFavorite(editingLine.isFavorite)
      setIsDeleted(editingLine.isDeleted)
    } else if (!isOpen) {
      setExpense('')
      setLineCategoryId(defaultCategoryId ?? null)
      setEstimated('')
      setPaid('')
      setFinal('')
      setDueDate(null)
      setCount('')
      setPayer('')
      setNote('')
      setIsDone(false)
      setIsFavorite(false)
      setIsDeleted(false)
    }
  }, [isOpen, editingLine, defaultCategoryId])

  const cleanEstimated = useMemo(
    () => estimated.replace(/\s*EGP\s*/gi, '').trim(),
    [estimated]
  )
  const cleanPaid = useMemo(() => paid.replace(/\s*EGP\s*/gi, '').trim(), [paid])
  const cleanFinal = useMemo(() => final.replace(/\s*EGP\s*/gi, '').trim(), [final])

  const isValid = useMemo(
    () => expense.trim() !== '' && cleanEstimated !== '',
    [expense, cleanEstimated]
  )

  const handleSave = useCallback(() => {
    const numericEstimated = cleanEstimated.replace(/,/g, '')
    const numericPaid = cleanPaid.replace(/,/g, '')
    const numericFinal = cleanFinal.replace(/,/g, '')

    if (!isValid) {
      return
    }

    onSave({
      id: editingLine?.id,
      expense: expense.trim(),
      lineCategoryId,
      estimated: parseFloat(numericEstimated) || 0,
      paid: parseFloat(numericPaid) || 0,
      final: numericFinal ? parseFloat(numericFinal) : null,
      dueDate: dueDate ? dueDate.toISOString() : null,
      count: count ? parseInt(count, 10) : null,
      payer: payer.trim() || null,
      note: note.trim() || null,
      isDone,
      isFavorite,
      isDeleted,
    })

    onClose()
  }, [
    expense,
    cleanEstimated,
    cleanPaid,
    cleanFinal,
    dueDate,
    count,
    payer,
    note,
    isDone,
    isFavorite,
    isDeleted,
    editingLine?.id,
    lineCategoryId,
    isValid,
    onSave,
    onClose,
  ])

  const handleAmountChange = useCallback(
    (
      value: string,
      setter: (value: string) => void
    ) => {
      const cleaned = value.replace(/[^0-9,]/g, '').replace(/\s*EGP\s*/gi, '')
      setter(cleaned)
    },
    []
  )

  const handleDateChange = useCallback((date: Date | string | undefined) => {
    if (!date) {
      setDueDate(null)
      return
    }
    setDueDate(date instanceof Date ? date : new Date(date))
  }, [])

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
      <div className="flex flex-col max-h-[70vh]">
        <div className="flex-1 space-y-6 pb-6 overflow-y-auto min-h-0">
        {/* Expense Name */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Expense/Service Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={expense}
            onChange={e => setExpense(e.target.value)}
            placeholder="Enter expense name"
            size="lg"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Category
          </label>
          <SelectMenu
            value={lineCategoryId?.toString() || ''}
            onChange={value => setLineCategoryId(value ? Number(value) : null)}
            options={categoryOptions}
            placeholder="Select category"
            size="lg"
          />
        </div>

        {/* Amount Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Estimated */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">
              Estimated <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={estimated ? `${estimated} EGP` : ''}
              onChange={e => handleAmountChange(e.target.value, setEstimated)}
              placeholder="0 EGP"
              size="lg"
            />
          </div>

          {/* Paid */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">Paid</label>
            <Input
              type="text"
              value={paid ? `${paid} EGP` : ''}
              onChange={e => handleAmountChange(e.target.value, setPaid)}
              placeholder="0 EGP"
              size="lg"
            />
          </div>

          {/* Final */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">Final</label>
            <Input
              type="text"
              value={final ? `${final} EGP` : ''}
              onChange={e => handleAmountChange(e.target.value, setFinal)}
              placeholder="0 EGP"
              size="lg"
            />
          </div>
        </div>

        {/* Due Date and Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Due Date */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">
              Due Date
            </label>
            <DatePicker
              value={dueDate || undefined}
              onChange={handleDateChange}
              placeholder="Select due date"
              size="lg"
            />
          </div>

          {/* Count */}
          <div className="space-y-2">
            <label className="block text-14 font-semibold text-gray-900">Count</label>
            <Input
              type="number"
              value={count}
              onChange={e => setCount(e.target.value)}
              placeholder="0"
              size="lg"
            />
          </div>
        </div>

        {/* Payer */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">Payer</label>
          <Input
            type="text"
            value={payer}
            onChange={e => setPayer(e.target.value)}
            placeholder="Enter payer name"
            size="lg"
          />
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">Note</label>
          <Textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add any additional notes..."
            size="lg"
            rows={4}
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <label className="text-14 font-semibold text-gray-900">Done</label>
            <Toggle checked={isDone} onChange={setIsDone} />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-14 font-semibold text-gray-900">Favorite</label>
            <Toggle checked={isFavorite} onChange={setIsFavorite} />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-14 font-semibold text-gray-900">Deleted</label>
            <Toggle checked={isDeleted} onChange={setIsDeleted} />
          </div>
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
              onClick={handleSave}
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
