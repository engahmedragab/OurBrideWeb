import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RatingDisplayProps {
  rating: number
  count?: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  format?: 'default' | 'rated-by'
  className?: string
}

export const RatingDisplay = ({
  rating,
  count,
  showCount = true,
  size = 'md',
  format = 'default',
  className,
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const textSizeClasses = {
    sm: 'text-12',
    md: 'text-14',
    lg: 'text-16',
  }

  const formatText = () => {
    if (!showCount || count === undefined) return null

    if (format === 'rated-by') {
      return (
        <span
          className={cn('!text-gray-500 font-normal', textSizeClasses[size])}
        >
          {rating}{' '}
          <span className="text-brand-500">Rated By ({count}) Users</span>
        </span>
      )
    }

    return (
      <span className={cn('text-gray-500', textSizeClasses[size])}>
        ({count} reviews)
      </span>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= Math.round(rating)
                ? 'fill-brand-500 text-brand-500'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>
      {formatText()}
    </div>
  )
}
