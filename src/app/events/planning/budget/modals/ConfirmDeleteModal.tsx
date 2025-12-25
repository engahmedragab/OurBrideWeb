'use client'

import { useCallback } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  itemName?: string
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName,
}: ConfirmDeleteModalProps) => {
  const handleConfirm = useCallback(() => {
    onConfirm()
    onClose()
  }, [onConfirm, onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
    >
      <div className="flex flex-col">
        <div className="space-y-6 pb-6">
        {/* Warning Icon */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          {itemName && (
            <p className="text-16 font-medium text-gray-900">
              <span className="font-semibold">&quot;{itemName}&quot;</span>
            </p>
          )}
          <p className="text-14 text-gray-600">{message}</p>
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
              variant="destructive"
              size="md"
              onClick={handleConfirm}
              className="flex-1 h-[44px] !rounded-full text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
