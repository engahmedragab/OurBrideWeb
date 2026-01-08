'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Trash2 } from 'lucide-react'
import type { Service } from '@/types/service'

export interface WishlistServiceCardProps {
  service: Service
  onRemove?: (serviceId: string) => void
  onBookNow?: (serviceId: string) => void
  className?: string
}

export const WishlistServiceCard = React.memo(({
  service,
  onRemove,
  onBookNow,
  className,
}: WishlistServiceCardProps) => {
  const [imageError, setImageError] = React.useState(false)
  const router = useRouter()
  const rating = service.rating.value || 0

  const handleBookNow = () => {
    router.push(`/booking/${service.id}`)
    onBookNow?.(service.id)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove?.(service.id)
  }

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-4 flex gap-4 relative',
        className
      )}
    >
      {/* Left: Service Image with Delete Button */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <Link href={`/services/category/${service.id}`} className="block">
          <div className="relative w-20 h-20 rounded-lg bg-gray-100 overflow-hidden">
            {service.images && service.images.length > 0 && service.images[0] && service.images[0].trim() !== '' && !imageError ? (
              <Image
                src={service.images[0]}
                alt={service.title}
                fill
                sizes="80px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-10 font-medium text-center px-1">
                  No image available
                </span>
              </div>
            )}
          </div>
        </Link>
        {/* Delete Button - Under Image */}
        {onRemove && (
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors"
            aria-label="Remove from wishlist"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        )}
      </div>

      {/* Middle: Service Details */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Title */}
        <Link href={`/services/category/${service.id}`}>
          <h3 className="text-14 font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-brand-500 transition-colors">
            {service.title}
          </h3>
        </Link>

        {/* Provider Name */}
        <div className="flex items-center gap-1.5 mb-1">
          <Link 
            href={`/provider/${service.provider.id}`}
            className="text-12 text-gray-600 hover:text-brand-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {service.provider.name}
          </Link>
        </div>

        {/* Price */}
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-12 text-gray-600 mr-1">Start From</span>
          <span className="text-14 font-semibold text-gray-900">
            {service.price.discounted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {service.price.currency}
          </span>
        </div>

        {/* Bottom: Book Now Button */}
        <div className="mt-auto pt-3 flex justify-end">
          <Button
            variant="brand"
            size="md"
            onClick={handleBookNow}
            className='!text-white'
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  )
})

WishlistServiceCard.displayName = 'WishlistServiceCard'

