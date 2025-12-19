'use client'

import { useState, useEffect } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Modal } from './Modal'
import { BottomSheet } from './BottomSheet'
import { cn } from '@/lib/utils'

export interface AddBudgetItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    itemType: string
    itemName: string
    estimatedCost: number
    paidAmount: number
    notes?: string
  }) => void
  editingItem?: {
    id: string
    itemType: string
    itemName: string
    estimatedCost: number
    paidAmount: number
    notes?: string
  } | null
}

export const AddBudgetItemModal = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}: AddBudgetItemModalProps) => {
  const [isMobile, setIsMobile] = useState(false)
  const [itemType, setItemType] = useState('')
  const [itemName, setItemName] = useState('')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [notes, setNotes] = useState('')

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load editing item data or reset form
  useEffect(() => {
    if (isOpen && editingItem) {
      setItemType(editingItem.itemType || '')
      setItemName(editingItem.itemName || '')
      setEstimatedCost(editingItem.estimatedCost?.toString() || '')
      setPaidAmount(editingItem.paidAmount?.toString() || '')
      setNotes(editingItem.notes || '')
    } else if (!isOpen) {
      setItemType('')
      setItemName('')
      setEstimatedCost('')
      setPaidAmount('')
      setNotes('')
    }
  }, [isOpen, editingItem])

  const handleSave = () => {
    onSave({
      itemType,
      itemName,
      estimatedCost: parseFloat(estimatedCost) || 0,
      paidAmount: parseFloat(paidAmount) || 0,
      notes: notes || undefined,
    })
    onClose()
  }

  const isEditMode = !!editingItem

  const ModalContent = () => (
    <div className="space-y-5 sm:space-y-6 w-full">
      {/* Item Type */}
      <div className="space-y-2">
        <label className="block text-14 font-semibold text-gray-900">
          Type
        </label>
        <Input
          type="text"
          value={itemType}
          onChange={e => setItemType(e.target.value)}
          placeholder="Enter type"
          size="lg"
        />
      </div>

      {/* Item Name */}
      <div className="space-y-2">
        <label className="block text-14 font-semibold text-gray-900">
          Item Name
        </label>
        <Input
          type="text"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          placeholder="Enter item name"
          size="lg"
        />
      </div>

      {/* Cost Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Estimated Cost */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Estimated Cost
          </label>
          <Input
            type="number"
            value={estimatedCost}
            onChange={e => setEstimatedCost(e.target.value)}
            placeholder="0.00"
            size="lg"
          />
        </div>

        {/* Paid Amount */}
        <div className="space-y-2">
          <label className="block text-14 font-semibold text-gray-900">
            Paid Amount
            <span className="text-12 font-normal text-gray-400 ml-1">
              (Optional)
            </span>
          </label>
          <Input
            type="number"
            value={paidAmount}
            onChange={e => setPaidAmount(e.target.value)}
            placeholder="0.00"
            size="lg"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-14 font-semibold text-gray-900">
          Notes
          <span className="text-12 font-normal text-gray-400 ml-1">
            (Optional)
          </span>
        </label>
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add any additional notes..."
          size="lg"
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="gray"
          size="lg"
          onClick={onClose}
          className="flex-1 w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          variant="brand"
          size="lg"
          onClick={handleSave}
          className="flex-1 w-full sm:w-auto order-1 sm:order-2 text-white"
          disabled={!itemType || !itemName || !estimatedCost}
        >
          {isEditMode ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  )

  // Use BottomSheet on mobile, Modal on desktop/tablet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={isEditMode ? 'Edit Budget Item' : 'Add New Budget Item'}
        headerClassName="px-5 py-4"
        contentClassName="px-5 py-5"
      >
        <ModalContent />
      </BottomSheet>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Budget Item' : 'Add New Budget Item'}
      maxWidth="md"
      containerClassName="mx-4 sm:mx-auto"
      headerClassName="px-6 py-5 border-b border-gray-200"
      contentClassName="px-6 py-6"
    >
      <ModalContent />
    </Modal>
  )
}

