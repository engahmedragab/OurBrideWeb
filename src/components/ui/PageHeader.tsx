'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  subtitle?: string | ReactNode
  rightContent?: ReactNode
  className?: string
  titleClassName?: string
}

/**
 * PageHeader component
 * Reusable page header with title, optional subtitle, and right actions
 */
export const PageHeader = ({
  title,
  subtitle,
  rightContent,
  className,
  titleClassName,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8',
        className
      )}
    >
      <div>
        <h1
          className={cn(
            'text-2xl md:text-32 font-semibold text-gray-900',
            titleClassName
          )}
        >
          {title}
          {subtitle && (
            <span className="text-8 sm:text-10 md:text-12 border border-gray-300 rounded-full md:px-2 md:py-1 px-1 py-0.5  bg-gray-100 font-normal text-gray-600 ml-2">
              {subtitle}
            </span>
          )}
        </h1>
      </div>
      {rightContent && (
        <div className="flex flex-col items-stretch sm:items-end gap-2">
          {rightContent}
        </div>
      )}
    </div>
  )
}

