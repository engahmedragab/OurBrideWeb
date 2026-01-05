'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface RatingInputProps {
  rating: number
  onRatingChange: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  color?: 'brand' | 'default'
  className?: string
  disabled?: boolean
}

/**
 * RatingInput component
 * Reusable interactive star rating input with hover effect
 */
export const RatingInput = ({
  rating,
  onRatingChange,
  size = 'md',
  color = 'default',
  className,
  disabled = false,
}: RatingInputProps) => {
  const [hoveredRating, setHoveredRating] = useState(0)

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const colorClasses = {
    brand: 'fill-brand-500 text-brand-500',
    default: 'fill-[#FF8B7A] text-[#FF8B7A]',
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && onRatingChange(star)}
          onMouseEnter={() => !disabled && setHoveredRating(star)}
          onMouseLeave={() => !disabled && setHoveredRating(0)}
          disabled={disabled}
          className="focus:outline-none transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              'transition-colors',
              star <= (hoveredRating || rating)
                ? colorClasses[color]
                : 'fill-gray-200 text-gray-200'
            )}
          />
        </button>
      ))}
    </div>
  )
}
