'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface CommunityEmptyStateProps {
  title?: string
  message?: string
  image?: string | { src: string }
  className?: string
  compact?: boolean
}

/**
 * CommunityEmptyState - Common empty state component for community screens
 * Displays a centered message with an optional image when there's no data
 */
export const CommunityEmptyState = ({
  title = 'No Data Available',
  message = 'There is no content to display at the moment.',
  image,
  className,
  compact = false,
}: CommunityEmptyStateProps) => {
  // Default image path - can be overridden via props
  const defaultImage = '/favicon-32x32.png'
  const imageSrc = image
    ? typeof image === 'string'
      ? image
      : image.src
    : defaultImage

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-8 text-center',
        compact ? 'py-6' : 'py-12',
        className
      )}
    >
      {/* Image */}
      {imageSrc && (
        <div
          className={cn(
            'flex items-center justify-center mb-6 mx-auto',
            compact ? 'w-24 h-24' : 'w-32 h-32'
          )}
        >
          <Image
            src={imageSrc}
            alt={title}
            width={compact ? 96 : 128}
            height={compact ? 96 : 128}
            className="object-contain"
          />
        </div>
      )}

      {/* Title */}
      {title && (
        <h3
          className={cn(
            'font-semibold text-gray-900 mb-2',
            compact ? 'text-16' : 'text-18'
          )}
        >
          {title}
        </h3>
      )}

      {/* Message */}
      {message && (
        <p className={cn('text-gray-500', compact ? 'text-14' : 'text-16')}>
          {message}
        </p>
      )}
    </div>
  )
}
