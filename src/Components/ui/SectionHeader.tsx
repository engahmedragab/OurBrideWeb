'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  title?: string
  count?: number
  suffix?: string
  rightContent?: ReactNode
  className?: string
  // New props for multi-line format
  topText?: string
  highlightText?: string
  bottomText?: string
  bottomHighlightText?: string
  alignment?: 'left' | 'center' | 'right'
}

/**
 * SectionHeader Component
 * Reusable section header with support for both single-line and multi-line formats
 */
export const SectionHeader = ({
  title,
  count,
  suffix,
  rightContent,
  className,
  topText,
  highlightText,
  bottomText,
  bottomHighlightText,
  alignment = 'center',
}: SectionHeaderProps) => {
  const alignmentClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  }

  // Multi-line format (for "Choose From Our Product Categories" style)
  if (topText || highlightText || bottomText) {
    return (
      <div
        className={cn(
          'flex flex-col gap-2 sm:gap-3 md:gap-4',
          alignmentClasses[alignment],
          className
        )}
      >
        {topText && highlightText && (
          <div
            className={cn(
              'flex gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 items-center leading-[1.2] sm:leading-[1.3] text-18 sm:text-20 md:text-24 lg:text-30 xl:text-36 text-gray-900',
              alignmentClasses[alignment]
            )}
          >
            <h2 className="font-normal">{topText}</h2>
            <h2 className="font-semibold">{highlightText}</h2>
          </div>
        )}
        {(bottomText || bottomHighlightText) && (
          <div
            className={cn(
              'flex gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 items-center justify-center leading-[1.2] sm:leading-[1.3] text-18 sm:text-20 md:text-24 lg:text-30 xl:text-36 text-gray-900 w-full',
              alignmentClasses[alignment]
            )}
          >
            {bottomText && <h2 className="font-semibold">{bottomText}</h2>}
            {bottomHighlightText && (
              <h2 className="font-normal">{bottomHighlightText}</h2>
            )}
          </div>
        )}
        {rightContent && <div className="mt-2 sm:mt-3 md:mt-4">{rightContent}</div>}
      </div>
    )
  }

  // Original single-line format
  return (
    <div
      className={cn(
        'flex items-center justify-between mb-4 sm:mb-6 md:mb-8',
        className || ''
      )}
    >
      <div>
        <h2 className="text-20 sm:text-22 md:text-26 lg:text-30 xl:text-36 font-semibold text-gray-900 leading-tight sm:leading-snug">
          {title}
        </h2>
        {count !== undefined && suffix && (
          <p className="text-13 sm:text-14 md:text-15 lg:text-17 text-gray-600 mt-1 sm:mt-1.5 md:mt-2">
            {count} {suffix}
          </p>
        )}
      </div>
      {rightContent && <div>{rightContent}</div>}
      {count !== undefined && !suffix && !rightContent && (
        <p className="text-13 sm:text-14 md:text-15 lg:text-17 text-gray-600">{count}</p>
      )}
    </div>
  )
}
