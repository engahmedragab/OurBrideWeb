import { cn } from '@/lib/utils'

export interface PriceDisplayProps {
  original?: number
  discounted: number
  currency: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showOriginal?: boolean
  className?: string
}

export const PriceDisplay = ({
  original,
  discounted,
  currency,
  size = 'md',
  showOriginal = true,
  className,
}: PriceDisplayProps) => {
  const hasDiscount = original && original > discounted

  const sizeClasses = {
    sm: {
      discounted: 'text-20',
      original: 'text-14',
    },
    md: {
      discounted: 'text-24',
      original: 'text-14',
    },
    lg: {
      discounted: 'text-32 md:text-40',
      original: 'text-16',
    },
    xl: {
      discounted: 'text-40 md:text-48',
      original: 'text-18',
    },
  }

  return (
    <div className={cn('flex items-baseline gap-1', className)}>
      <span
        className={cn(
          'font-normal text-gray-900',
          sizeClasses[size].discounted
        )}
      >
        {discounted.toLocaleString()} {currency}
      </span>
      {hasDiscount && showOriginal && (
        <span
          className={cn(
            'font-normal text-gray-400 line-through',
            sizeClasses[size].original
          )}
        >
          {original!.toLocaleString()} {currency}
        </span>
      )}
    </div>
  )
}
