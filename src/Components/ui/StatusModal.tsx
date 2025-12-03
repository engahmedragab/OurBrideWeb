'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import successCheckSvg from '@/Assets/svg/successCheck.svg'

export interface StatusModalProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  onConfirm?: () => void
  onClose?: () => void
  className?: string
  containerClassName?: string
}

/**
 * StatusModal - Reusable success modal component
 * Displays a centered modal with success icon, title, description, and confirm button
 */
export const StatusModal = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onClose,
  className,
  containerClassName,
}: StatusModalProps) => {
  if (!open) return null

  const handleConfirm = () => {
    onConfirm?.()
    if (!onConfirm) {
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
          {/* Success check icon */}
          <div className="flex items-center justify-center mb-4">
            <img
              src={typeof successCheckSvg === 'string' ? successCheckSvg : successCheckSvg.src}
              alt="Success"
              className="h-16 w-16"
            />
          </div>

          {/* Title */}
          <h2 className="text-16 font-semibold text-gray-900 mb-2 text-center">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-14 text-gray-500 mb-6 text-center">
              {description}
            </p>
          )}

          {/* Confirm Button */}
          <Button
            variant="brand"
            size="lg"
            className="w-full text-white"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

