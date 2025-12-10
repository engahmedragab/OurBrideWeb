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
          'flex flex-col gap-4',
          alignmentClasses[alignment],
          className
        )}
      >
        {topText && highlightText && (
          <div
            className={cn(
              'flex gap-3.5 md:gap-[14px] items-center leading-[72px] text-[64px] text-gray-900',
              alignmentClasses[alignment]
            )}
          >
            <h2 className="font-normal">{topText}</h2>
            <h2 className="font-semibold">{highlightText}</h2>
          </div>
        )}
        {bottomText && (
          <div
            className={cn(
              'flex gap-3 md:gap-[12px] items-center justify-center leading-[72px] text-[64px] text-gray-900 w-full',
              alignmentClasses[alignment]
            )}
          >
            <h2 className="font-semibold">{bottomText}</h2>
          </div>
        )}
        {rightContent && <div className="mt-4">{rightContent}</div>}
      </div>
    )
  }

  // Original single-line format
  return (
    <div
      className={cn(
        'flex items-center justify-between mb-8',
        className || ''
      )}
    >
      <div>
        <h2 className="text-32 font-semibold text-gray-900">{title}</h2>
        {count !== undefined && suffix && (
          <p className="text-16 text-gray-600 mt-2">
            {count} {suffix}
          </p>
        )}
      </div>
      {rightContent && <div>{rightContent}</div>}
      {count !== undefined && !suffix && !rightContent && (
        <p className="text-16 text-gray-600">{count}</p>
      )}
    </div>
  )
}
