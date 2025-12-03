import { ReactNode, isValidElement } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ServiceSelectCardProps {
  icon: LucideIcon | ReactNode
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

/**
 * ServiceSelectCard - Reusable card component for service selection
 * Displays icon and label, with default, hover/focus, and selected states
 * Matches Planning Preferences design exactly
 */
export const ServiceSelectCard = ({
  icon,
  label,
  selected = false,
  onClick,
  className,
}: ServiceSelectCardProps) => {
  // Render icon - support both LucideIcon components and ReactNode
  const renderIcon = () => {
    // If it's a valid React element (already rendered)
    if (isValidElement(icon)) {
      return icon
    }

    // If it's a LucideIcon component (function)
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon
      return <IconComponent className="h-6 w-6 sm:h-7 sm:w-7" />
    }

    // Fallback
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // Base styles - square/rectangular card
        'flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200',
        'aspect-square min-h-[80px] sm:min-h-[90px]',
        'focus-visible:outline-none focus-visible:ring-0',
        'active:scale-[0.98]',
        // Selected state - coral-orange border and tinted background
        selected
          ? 'border-brand-500 '
          : // Default state - light gray border and light gray/white background
            'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center transition-colors text-brand-500'
        )}
      >
        {renderIcon()}
      </div>

      {/* Label */}
      <span
        className={cn(
          'text-10 sm:text-12 text-center leading-tight text-gray-400 font-regular',
         
        )}
      >
        {label}
      </span>
    </button>
  )
}

