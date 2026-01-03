import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RatingDisplayProps {
  rating: number
  count?: number
  showCount?: boolean
  showValue?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  format?: 'default' | 'rated-by' | 'value-only' | 'stars-only'
  variant?: 'default' | 'compact' | 'detailed'
  showHalfStars?: boolean
  starColor?: 'brand' | 'red' | 'yellow'
  className?: string
  valueClassName?: string
}

export const RatingDisplay = ({
  rating,
  count,
  showCount = false,
  showValue = false,
  size = 'md',
  format = 'default',
  variant = 'default',
  showHalfStars = false,
  starColor = 'brand',
  className,
  valueClassName,
}: RatingDisplayProps) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const textSizeClasses = {
    xs: 'text-10',
    sm: 'text-12',
    md: 'text-14',
    lg: 'text-16',
  }

  const starColorClasses = {
    brand: 'fill-brand-500 text-brand-500',
    red: 'fill-red-500 text-red-500',
    yellow: 'fill-yellow-500 text-yellow-500',
  }

  const emptyStarColor = 'fill-gray-200 text-gray-200'

  // Calculate full stars and half star
  const fullStars = Math.floor(rating)
  const hasHalfStar = showHalfStars && rating % 1 >= 0.5
  const roundedRating = Math.round(rating)

  const formatText = () => {
    if (format === 'stars-only') return null

    if (format === 'value-only' || showValue) {
      return (
        <span
          className={cn(
            'font-normal text-gray-900',
            textSizeClasses[size],
            valueClassName
          )}
        >
          {rating.toFixed(1)}
        </span>
      )
    }

    if (format === 'rated-by' && showCount && count !== undefined) {
      return (
        <span
          className={cn('!text-gray-500 font-normal', textSizeClasses[size])}
        >
          {rating}{' '}
          <span className="text-brand-500">Rated By ({count}) Users</span>
        </span>
      )
    }

    if (showCount && count !== undefined && format === 'default') {
      return (
        <span className={cn('text-gray-500', textSizeClasses[size])}>
          ({count} reviews)
        </span>
      )
    }

    return null
  }

  const renderStars = () => {
    if (showHalfStars) {
      return [1, 2, 3, 4, 5].map((star, index) => {
        if (index < fullStars) {
          return (
            <Star
              key={star}
              className={cn(sizeClasses[size], starColorClasses[starColor])}
            />
          )
        } else if (index === fullStars && hasHalfStar) {
          return (
            <div key={star} className={cn('relative', sizeClasses[size])}>
              <Star
                className={cn(sizeClasses[size], emptyStarColor, 'absolute')}
              />
              <div className="absolute overflow-hidden" style={{ width: '50%', height: '100%' }}>
                <Star
                  className={cn(sizeClasses[size], starColorClasses[starColor])}
                />
              </div>
            </div>
          )
        } else {
          return (
            <Star
              key={star}
              className={cn(sizeClasses[size], emptyStarColor)}
            />
          )
        }
      })
    } else {
      return [1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= roundedRating
              ? starColorClasses[starColor]
              : emptyStarColor
          )}
        />
      ))
    }
  }

  const gapClass = variant === 'compact' ? 'gap-0.5' : variant === 'detailed' ? 'gap-2' : 'gap-1'

  // If format is value-only, don't render stars, just the value
  if (format === 'value-only') {
    return (
      <div className={cn('flex items-center', gapClass, className)}>
        {formatText()}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center', gapClass, className)}>
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>
      {formatText()}
    </div>
  )
}
