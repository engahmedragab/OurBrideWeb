import { cn } from '@/lib/utils'
import { formatCurrencyCompact, type CurrencyCode } from '@/utils/currency'

export interface PriceDisplayProps {
  original?: number
  discounted: number
  currency: CurrencyCode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showOriginal?: boolean
  variant?: 'default' | 'compact' | 'inline'
  className?: string
  discountedClassName?: string
  originalClassName?: string
}

export const PriceDisplay = ({
  original,
  discounted,
  currency,
  size = 'md',
  showOriginal = true,
  variant = 'default',
  className,
  discountedClassName,
  originalClassName,
}: PriceDisplayProps) => {
  const hasDiscount = original && original > discounted

  const sizeClasses = {
    xs: {
      discounted: 'text-10',
      original: 'text-8',
    },
    sm: {
      discounted: 'text-14',
      original: 'text-10',
    },
    md: {
      discounted: 'text-16',
      original: 'text-10',
    },
    lg: {
      discounted: 'text-18',
      original: 'text-12',
    },
    xl: {
      discounted: 'text-20',
      original: 'text-14',
    },
  }

  const gapClass =
    variant === 'compact' ? 'gap-0.5' : variant === 'inline' ? 'gap-1' : 'gap-1'

  return (
    <div className={cn('flex items-baseline', gapClass, className)}>
      <span
        className={cn(
          'font-normal text-gray-900',
          sizeClasses[size].discounted,
          discountedClassName
        )}
      >
        {formatCurrencyCompact(discounted, currency)}
      </span>
      {hasDiscount && showOriginal && (
        <span
          className={cn(
            'font-normal text-gray-400 line-through',
            sizeClasses[size].original,
            originalClassName
          )}
        >
          {formatCurrencyCompact(original!, currency)}
        </span>
      )}
    </div>
  )
}
