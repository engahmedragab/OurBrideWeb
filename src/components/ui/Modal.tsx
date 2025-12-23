'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import * as React from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  containerClassName?: string
  headerClassName?: string
  contentClassName?: string
  bodyClassName?: string
  footerClassName?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  zIndex?: number
  disabled?: boolean
}

const maxWidthClasses = {
  sm: 'max-w-[400px]',
  md: 'max-w-[520px]',
  lg: 'max-w-[720px]',
  xl: 'max-w-[800px]',
  '2xl': 'max-w-[1000px]',
  full: 'max-w-full',
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  containerClassName,
  headerClassName,
  contentClassName,
  bodyClassName,
  footerClassName,
  showCloseButton = true,
  closeOnOverlayClick = true,
  maxWidth = 'md',
  zIndex = 50,
  disabled = false,
}: ModalProps) => {
  if (!isOpen) return null

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle ESC key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !disabled) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, disabled])

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
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        style={{ zIndex: zIndex * 10 - 1 }}
      />

      {/* Modal Container */}
      <div
        className={cn(
          'relative w-full bg-white rounded-[24px] shadow-xl border border-gray-100',
          'transform transition-all duration-300',
          'flex flex-col',
          'max-h-[90vh] sm:max-h-[85vh]',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          maxWidthClasses[maxWidth],
          containerClassName
        )}
        style={{ zIndex: zIndex * 10 + 1 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header - Sticky */}
        {(title || showCloseButton) && (
          <div
            className={cn(
              'sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100 rounded-t-[24px]',
              headerClassName
            )}
          >
            {title && (
              <h2 className="text-18 font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                disabled={disabled}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Body - Scrollable */}
        <div
          className={cn(
            'flex-1 overflow-y-auto px-6 py-6',
            contentClassName,
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* Modal Footer - Sticky */}
        {footer && (
          <div
            className={cn(
              'sticky bottom-0 z-10 px-6 py-5 bg-white border-t border-gray-100 rounded-b-[24px]',
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
