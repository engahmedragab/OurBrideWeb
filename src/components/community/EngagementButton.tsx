'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EngagementButtonProps {
  icon: ReactNode
  count: number
  label: string
  onClick?: () => void
  className?: string
  isActive?: boolean
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * EngagementButton Component
 * Reusable button for likes, comments, and shares with consistent styling
 */
export const EngagementButton = ({
  icon,
  count,
  label,
  onClick,
  className,
  isActive = false,
  disabled = false,
  size = 'md',
}: EngagementButtonProps) => {
  // Responsive sizing: xs on mobile, specified size on desktop
  const responsiveSizeClasses = {
    xs: 'px-1.5 py-0.5 gap-1 text-11 md:px-1.5 md:py-0.5 md:gap-1 md:text-11 rounded-md',
    sm: 'px-1.5 py-0.5 gap-1 text-11 md:px-2 md:py-1 md:gap-1 md:text-12 rounded-md',
    md: 'px-2 py-1 gap-1 text-12 md:px-2 md:py-1.5 md:gap-1 md:text-13 rounded-lg',
    lg: 'px-2 py-1 gap-1 text-12 md:px-4 md:py-2 md:gap-2 md:text-14 rounded-lg',
    xl: 'px-3 py-1.5 gap-1.5 text-13 md:px-5 md:py-2.5 md:gap-2.5 md:text-16 rounded-lg',
  }

  const responsiveIconSizeClasses = {
    xs: 'h-3.5 w-3.5 md:h-3.5 md:w-3.5',
    sm: 'h-3.5 w-3.5 md:h-4 md:w-4',
    md: 'h-4 w-4 md:h-4 md:w-4',
    lg: 'h-4 w-4 md:h-5 md:w-5',
    xl: 'h-4.5 w-4.5 md:h-6 md:w-6',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center ',
        'bg-white border',
        'font-normal',
        'transition-colors',
        responsiveSizeClasses[size],
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : isActive
            ? 'text-brand-500 border-brand-500'
            : 'text-gray-900 border-gray-200 hover:text-brand-500 hover:border-brand-500',
        className
      )}
    >
      <span
        className={cn(
          'transition-colors',
          responsiveIconSizeClasses[size],
          isActive ? 'text-brand-500' : 'text-gray-900'
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          'transition-colors',
          
          isActive ? 'text-brand-500' : 'text-gray-900'
        )}
      >
        <span>{count}</span>
        <span className="hidden md:inline md:mx-0.5">{label}</span>
      </span>
    </button>
  )
}

