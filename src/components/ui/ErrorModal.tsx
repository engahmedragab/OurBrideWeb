'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import somethingWrongSvg from '@/assets/svg/something-wrong.svg'
import { useI18nTranslations } from '@/i18n'

export interface ErrorModalProps {
  open: boolean
  title?: string
  message?: string
  retryLabel?: string
  closeLabel?: string
  onRetry?: () => void
  onClose?: () => void
  className?: string
  containerClassName?: string
  showRetry?: boolean
}

/**
 * ErrorModal - Reusable error modal component
 * Displays a centered modal with error icon, title, message, and action buttons
 */
export const ErrorModal = ({
  open,
  title = 'Failed to Load',
  message = 'Something went wrong. Please try again later.',
  retryLabel = 'Retry',
  closeLabel = 'Close',
  onRetry,
  onClose,
  className,
  containerClassName,
  showRetry = true,
}: ErrorModalProps) => {
 
  if (!open) return null

  const handleRetry = () => {
    onRetry?.()
    if (!onRetry) {
      onClose?.()
    }
  }

  const handleOverlayClick = () => {
    onClose?.()
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        className
      )}
      onClick={handleOverlayClick}
    >
      {/* Dark blurred overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal Container */}
      <div
        className={cn(
          'relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl',
          'transform transition-all duration-300',
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          containerClassName
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center p-6 pt-8">
          {/* Error icon */}
          <div className="flex items-center justify-center mb-4">
            <Image
              src={
                typeof somethingWrongSvg === 'string'
                  ? somethingWrongSvg
                  : somethingWrongSvg.src
              }
              alt="Error"
              width={64}
              height={64}
              className="h-16 w-16"
            />
          </div>

          {/* Title */}
          <h2 className="text-16 font-semibold text-gray-900 mb-2 text-center">
            {title}
          </h2>

          {/* Message */}
          {message && (
            <p className="text-14 text-gray-500 mb-6 text-center">
              {message}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            {showRetry && (
              <Button
                variant="brand"
                size="lg"
                className="flex-1 text-white"
                onClick={handleRetry}
              >
                {retryLabel}
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className={showRetry ? 'flex-1' : 'w-full'}
              onClick={onClose}
            >
              {closeLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}



