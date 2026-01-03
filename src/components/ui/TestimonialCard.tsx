'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { RatingDisplay } from './RatingDisplay'

export interface TestimonialCardProps {
  rating: number
  title: string
  comment: string
  reviewerName: string
  reviewerLocation: string
  reviewerImage?: string | null
  className?: string
}

/**
 * TestimonialCard Component
 * Reusable card for displaying customer testimonials/reviews
 */
export const TestimonialCard = ({
  rating,
  title,
  comment,
  reviewerName,
  reviewerLocation,
  reviewerImage,
  className,
}: TestimonialCardProps) => {
  return (
    <div
      className={cn(
        'bg-gray-50 rounded-xl p-6 flex flex-col gap-4 min-w-[280px] sm:min-w-[300px]',
        className
      )}
    >
      {/* Rating */}
      <div>
        <RatingDisplay rating={rating} size="sm" showValue={false} />
      </div>

      {/* Title */}
      <h3 className="text-16 font-bold text-gray-900 leading-tight">{title}</h3>

      {/* Comment */}
      <p className="text-14 text-gray-700 leading-relaxed flex-1">{comment}</p>

      {/* Reviewer Information */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
        {/* Profile Picture */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
          {reviewerImage ? (
            <Image
              src={reviewerImage}
              alt={reviewerName}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-white text-18 font-semibold">
              {reviewerName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name and Location */}
        <div className="flex-1 min-w-0">
          <p className="text-14 font-bold text-gray-900 truncate">{reviewerName}</p>
          <p className="text-12 text-gray-600 truncate">{reviewerLocation}</p>
        </div>
      </div>
    </div>
  )
}



