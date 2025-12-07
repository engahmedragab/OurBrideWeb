'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CardWrapperProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

/**
 * CardWrapper component
 * Reusable wrapper for white cards with consistent styling
 */
export const CardWrapper = ({
  children,
  className,
  padding = 'md',
}: CardWrapperProps) => {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

