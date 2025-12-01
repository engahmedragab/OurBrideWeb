import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ServiceSelectCardProps {
  icon: LucideIcon
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

/**
 * ServiceSelectCard - Reusable card component for service selection
 * Displays icon and label, with selected/unselected states
 */
export const ServiceSelectCard = ({
  icon: Icon,
  label,
  selected = false,
  onClick,
  className,
}: ServiceSelectCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all',
        'hover:shadow-md active:scale-[0.98]',
        selected
          ? 'border-brand-500 bg-brand-50'
          : 'border-gray-200 bg-gray-50 hover:border-gray-300',
        className
      )}
    >
      <Icon
        className={cn(
          'h-8 w-8 transition-colors',
          selected ? 'text-brand-500' : 'text-gray-400'
        )}
      />
      <span
        className={cn(
          'text-12 font-medium text-center',
          selected ? 'text-brand-700' : 'text-gray-600'
        )}
      >
        {label}
      </span>
    </button>
  )
}

