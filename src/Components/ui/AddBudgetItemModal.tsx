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
    <div className="space-y-4 sm:space-y-5 w-full max-w-full">
      {/* Item Type */}
      <div>
        <label className="block text-14 font-medium text-gray-700 mb-2">
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
      <div>
        <label className="block text-14 font-medium text-gray-700 mb-2">
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

      {/* Estimated Cost */}
      <div>
        <label className="block text-14 font-medium text-gray-700 mb-2">
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
      <div>
        <label className="block text-14 font-medium text-gray-700 mb-2">
          Paid Amount{' '}
          <span className="text-gray-400">(Optional)</span>
        </label>
        <Input
          type="number"
          value={paidAmount}
          onChange={e => setPaidAmount(e.target.value)}
          placeholder="0.00"
          size="lg"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-14 font-medium text-gray-700 mb-2">
          Notes{' '}
          <span className="text-gray-400">(Optional)</span>
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
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button
          variant="gray"
          size="lg"
          onClick={onClose}
          className="flex-1 w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          variant="brand"
          size="lg"
          onClick={handleSave}
          className="flex-1 w-full sm:w-auto"
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
        contentClassName="px-4 sm:px-6"
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
      contentClassName="px-4 sm:px-6"
    >
      <ModalContent />
    </Modal>
  )
}

