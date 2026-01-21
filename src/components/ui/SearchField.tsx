'use client'

import { useState, useRef, useEffect, cloneElement, isValidElement } from 'react'
import { cn } from '@/lib/utils'

export interface SearchFieldProps {
  label: string
  value: string
  placeholder?: string
  children: React.ReactElement
  className?: string
  isFocused?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

/**
 * SearchField Component
 * A search field wrapper with label above, value below, and expand animation on focus
 */
export const SearchField = ({
  label,
  value,
  placeholder,
  children,
  className,
  isFocused: externalFocused,
  onFocus,
  onBlur,
}: SearchFieldProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const focused = externalFocused !== undefined ? externalFocused : isFocused

  useEffect(() => {
    if (focused) {
      setIsExpanded(true)
    } else {
      // Delay collapse to allow smooth transition
      const timer = setTimeout(() => setIsExpanded(false), 200)
      return () => clearTimeout(timer)
    }
  }, [focused])

  const handleFocus = (e: React.FocusEvent) => {
    setIsFocused(true)
    setIsExpanded(true)
    onFocus?.()
    // Also trigger focus on the child input if it exists
    if (isValidElement(children)) {
      const childrenProps = children.props as unknown as { children?: React.ReactNode; onFocus?: (e: React.FocusEvent) => void }
      const nestedChildren = childrenProps?.children
      const input = (isValidElement(nestedChildren) && ((nestedChildren.props as unknown as { children?: React.ReactNode })?.children)) || children
      if (isValidElement(input)) {
        const inputProps = input.props as unknown as { onFocus?: (e: React.FocusEvent) => void }
        if (inputProps?.onFocus) {
          inputProps.onFocus(e)
        }
      }
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    setIsFocused(false)
    onBlur?.()
    // Also trigger blur on the child input if it exists
    if (isValidElement(children)) {
      const childrenProps = children.props as unknown as { children?: React.ReactNode; onBlur?: (e: React.FocusEvent) => void }
      const nestedChildren = childrenProps?.children
      const input = (isValidElement(nestedChildren) && ((nestedChildren.props as unknown as { children?: React.ReactNode })?.children)) || children
      if (isValidElement(input)) {
        const inputProps = input.props as unknown as { onBlur?: (e: React.FocusEvent) => void }
        if (inputProps?.onBlur) {
          inputProps.onBlur(e)
        }
      }
    }
  }

  // Clone children to add focus/blur handlers
  const childrenWithHandlers = isValidElement(children)
    ? cloneElement(children, {
      onFocus: handleFocus,
      onBlur: handleBlur,
    } as Record<string, unknown>)
    : children

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex-1 min-w-0 relative transition-all duration-300 ease-in-out',
        isExpanded && 'flex-[1.5] z-10',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col transition-all duration-300 ease-in-out',
          'bg-gray-50 rounded-xl p-3 border border-gray-200',
          'hover:bg-gray-100',
          focused && 'bg-white border-brand-500 shadow-lg ring-2 ring-brand-500/20 scale-[1.02]',
          !focused && isExpanded && 'scale-[1.01]'
        )}
      >
        {/* Label */}
        <label
          className={cn(
            'text-12 font-medium text-gray-700 mb-1 transition-all duration-300',
            focused && 'text-brand-600 font-semibold'
          )}
        >
          {label}
        </label>

        {/* Input Container */}
        <div className="relative">
          {childrenWithHandlers}
        </div>

        {/* Value Display */}
        <div
          className={cn(
            'text-14 text-gray-500 mt-1 transition-all duration-300 min-h-[20px]',
            value && 'text-gray-700 font-medium',
            focused && value && 'text-brand-600'
          )}
        >
          {value || placeholder}
        </div>
      </div>
    </div>
  )
}

