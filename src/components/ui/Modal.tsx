'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface ModalProps {
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
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  zIndex?: number
  disabled?: boolean
  backdropClassName?: string
}

const maxWidthClasses = {
  sm: 'max-w-[400px]',
  md: 'max-w-[520px]',
  lg: 'max-w-[600px]',
  xl: 'max-w-[800px]',
  '2xl': 'max-w-[1000px]',
  full: 'max-w-full',
}

export const Modal = ({
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
  maxWidth = 'md',
  zIndex = 50,
  disabled = false,
  backdropClassName,
}: ModalProps) => {
  if (!isOpen) return null

  const handleOverlayClick = () => {
    if (closeOnOverlayClick && !disabled) {
      onClose()
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4',
        className
      )}
      style={{ zIndex: zIndex * 10 }}
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 transition-opacity duration-300',
          backdropClassName,
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        style={{ zIndex: zIndex * 10 - 1 }}
      />

      {/* Modal Container */}
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl',
          'transform transition-all duration-300',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          maxWidthClasses[maxWidth],
          containerClassName
        )}
        style={{ zIndex: zIndex * 10 + 1 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div
            className={cn(
              'flex items-center justify-between px-4 sm:px-6 py-4 ',
              headerClassName
            )}
          >
            {title && (
              <h2 className="text-16 sm:text-18 font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                disabled={disabled}
                className="p-1 text-gray-300 hover:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className={cn('p-6', contentClassName)}>{children}</div>
      </div>
    </div>
  )
}
