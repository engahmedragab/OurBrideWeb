'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from './Modal'
import { useI18nTranslations } from '@/i18n/hooks'

export interface ProcessingModalProps {
  isOpen: boolean
  title?: string
  message?: string
  onClose?: () => void
  className?: string
  closeOnOverlayClick?: boolean
}

/**
 * ProcessingModal - Modal for showing processing/queued operations
 * Displays a loading spinner with a message
 */
export const ProcessingModal = ({
  isOpen,
  title,
  message,
  onClose,
  className,
  closeOnOverlayClick = false, // Don't allow closing during processing
}: ProcessingModalProps) => {
  const t = useI18nTranslations('processingModal')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose || (() => {})}
      title={title || t('title')}
      maxWidth="sm"
      closeOnOverlayClick={closeOnOverlayClick}
      showCloseButton={closeOnOverlayClick}
      disabled={!closeOnOverlayClick}
      className={className}
    >
      <div className="flex flex-col items-center justify-center py-6">
        {/* Loading Spinner */}
        <div className="mb-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>

        {/* Message */}
        <p className="text-16 text-gray-600 text-center">
          {message || t('message')}
        </p>
      </div>
    </Modal>
  )
}
