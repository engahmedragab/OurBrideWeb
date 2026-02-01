'use client'

import { Modal } from './Modal'
import { Button } from './Button'
import { Trash2 } from 'lucide-react'
import { useI18nTranslations } from '@/i18n/hooks'

export interface DeleteCartItemModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  productTitle?: string
}

/**
 * DeleteCartItemModal - Confirmation modal for removing a product from cart
 */
export const DeleteCartItemModal = ({
  isOpen,
  onClose,
  onConfirm,
  productTitle,
}: DeleteCartItemModalProps) => {
  const t = useI18nTranslations('cart.modals.deleteItem')

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('title')}
      maxWidth="sm"
      containerClassName="p-0"
      headerClassName="px-6 py-4"
      contentClassName="px-6 pb-6"
    >
      <div className="flex flex-col items-center">
        {/* Icon */}
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

        {/* Question */}
        <p className="mb-6 text-center text-16 font-medium text-gray-900">
          {t('question', { item: productTitle || t('defaultItem') })}
        </p>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3">
          <Button
            variant="brand"
            size="lg"
            className="w-full text-white"
            onClick={handleConfirm}
          >
            {t('confirm')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            onClick={onClose}
          >
            {t('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

