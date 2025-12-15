'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
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
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)

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

  // Reset drag state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setDragY(0)
      setIsDragging(false)
    }
  }, [isOpen])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return
    // Only allow dragging from the top area (header or drag handle)
    const target = e.target as HTMLElement
    const isDraggableArea = target.closest('[data-draggable]') || 
                            target.closest('header') ||
                            target.closest('.drag-handle')
    
    if (isDraggableArea || e.touches[0].clientY < 150) {
      startY.current = e.touches[0].clientY
      setIsDragging(true)
    }
  }, [disabled])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || disabled) return
    
    e.preventDefault()
    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY.current
    
    // Only allow dragging down
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }, [isDragging, disabled])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || disabled) return
    
    // If dragged more than 100px, close the sheet
    if (dragY > 100) {
      onClose()
    }
    
    // Reset drag state
    setDragY(0)
    setIsDragging(false)
  }, [isDragging, dragY, onClose, disabled])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    startY.current = e.clientY
    setIsDragging(true)
  }, [disabled])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return
    
    const deltaY = e.clientY - startY.current
    
    // Only allow dragging down
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }, [isDragging, disabled])

  const handleMouseUp = useCallback(() => {
    if (!isDragging || disabled) return
    
    // If dragged more than 100px, close the sheet
    if (dragY > 100) {
      onClose()
    }
    
    // Reset drag state
    setDragY(0)
    setIsDragging(false)
  }, [isDragging, dragY, onClose, disabled])

  // Mouse drag handlers
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  if (!isOpen) return null

  const handleOverlayClick = () => {
    if (closeOnOverlayClick && !disabled) {
      onClose()
    }
  }

  // Calculate transform based on drag
  const translateY = isDragging ? dragY : 0
  const opacity = isDragging ? Math.max(0.3, 1 - dragY / 300) : 1

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
          'fixed inset-0 bg-black/40',
          !isDragging && 'transition-opacity duration-300'
        )}
        style={{
          opacity: isOpen ? (isDragging ? Math.max(0.1, 0.4 - dragY / 500) : 0.4) : 0,
        }}
      />

      {/* Bottom Sheet Container */}
      <div
        ref={sheetRef}
        className={cn(
          'relative w-full max-w-full bg-white rounded-t-3xl shadow-2xl',
          !isDragging && 'transition-all duration-300 ease-out',
          isOpen && !isDragging
            ? 'translate-y-0 opacity-100'
            : !isOpen
            ? 'translate-y-full opacity-0'
            : '',
          containerClassName
        )}
        style={{
          transform: isOpen ? `translateY(${translateY}px)` : 'translateY(100%)',
          opacity: isOpen ? opacity : 0,
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Drag Handle */}
        <div 
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          data-draggable
          onMouseDown={handleMouseDown}
        >
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Bottom Sheet Header */}
        {(title || showCloseButton) && (
          <div
            className={cn(
              'flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 select-none',
              headerClassName
            )}
            data-draggable
            onMouseDown={handleMouseDown}
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

