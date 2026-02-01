'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { AlertTriangle } from 'lucide-react'
import { useI18nTranslations } from '@/i18n/hooks'

export interface CancelRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason?: string) => void
  requestId?: string
}

/**
 * CancelRequestModal - Confirmation modal for canceling a service request
 */
export const CancelRequestModal = ({
  isOpen,
  onClose,
  onConfirm,
  requestId,
}: CancelRequestModalProps) => {
  const t = useI18nTranslations('cart.modals.cancelRequest')
  const [cancelReason, setCancelReason] = useState('')

  const handleConfirm = () => {
    onConfirm(cancelReason.trim() || undefined)
    setCancelReason('')
  }

  const handleClose = () => {
    setCancelReason('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('title')}
      maxWidth="md"
      containerClassName="p-0"
      headerClassName="px-6 py-4"
      contentClassName="px-6 pb-6"
    >
      <div className="flex flex-col items-center">
        {/* Warning Icon */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-yellow-100 blur-sm"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-lg bg-yellow-50 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-100">
                <AlertTriangle className="h-10 w-10 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <p className="mb-6 text-center text-16 font-medium text-gray-900">
          {t('question')}
        </p>

        {/* Input Field */}
        <div className="mb-6 w-full">
          <textarea
            placeholder={t('placeholder')}
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            className="flex w-full min-h-[100px] resize-none items-center gap-2 rounded-md border border-gray-300 bg-background px-3 py-2 text-16 text-gray-900 ring-offset-background transition-colors placeholder:text-gray-400 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3">
          <Button
            variant="brand"
            size="lg"
            className="w-full text-white"
            onClick={handleClose}
          >
            {t('keep')}
          </Button>

          <Button
            variant="outlineBrand"
            size="lg"
            className="w-full border-brand-500 bg-white !text-brand-500 hover:bg-brand-50"
            onClick={handleConfirm}
          >
            {t('confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

