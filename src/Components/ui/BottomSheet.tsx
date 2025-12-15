'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
  containerClassName?: string
  headerClassName?: string
  contentClassName?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  disabled?: boolean
}

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  containerClassName,
  headerClassName,
  contentClassName,
  showCloseButton = true,
  closeOnOverlayClick = true,
  disabled = false,
}: BottomSheetProps) => {
  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = () => {
    if (closeOnOverlayClick && !disabled) {
      onClose()
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-end justify-center',
        className
      )}
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Bottom Sheet Container */}
      <div
        className={cn(
          'relative w-full max-w-full bg-white rounded-t-3xl shadow-2xl',
          'transform transition-all duration-300 ease-out',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0',
          containerClassName
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Bottom Sheet Header */}
        {(title || showCloseButton) && (
          <div
            className={cn(
              'flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200',
              headerClassName
            )}
          >
            {title && (
              <h2 className="text-18 sm:text-20 font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                disabled={disabled}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Bottom Sheet Content */}
        <div
          className={cn(
            'p-4 sm:p-6 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto',
            'pb-6 sm:pb-8',
            contentClassName
          )}
          style={{
            maxHeight: 'calc(100vh - 120px)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

