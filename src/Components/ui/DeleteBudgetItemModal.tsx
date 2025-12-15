'use client'

import { Modal } from './Modal'
import { Button } from './Button'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DeleteBudgetItemModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName?: string
}

export const DeleteBudgetItemModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = 'this item',
}: DeleteBudgetItemModalProps) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Item"
      maxWidth="sm"
      containerClassName="mx-4 sm:mx-auto"
      contentClassName="px-4 sm:px-6"
    >
      <div className="flex flex-col items-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-red-100 blur-sm"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-lg bg-red-50 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-red-100">
                <Trash2 className="h-10 w-10 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <p className="mb-6 text-center text-16 font-medium text-gray-900">
          Are you sure you want to delete "{itemName}"?
        </p>

        <div className="flex w-full flex-col gap-3">
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={handleConfirm}
          >
            Delete
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

