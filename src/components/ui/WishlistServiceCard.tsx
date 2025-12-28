'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { CheckCircle2, Star, X } from 'lucide-react'
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
  const router = useRouter()
  const rating = service.rating.value || 0
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

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
        'relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow mb-4',
        className
      )}
    >
      <div className="flex">
        {/* Image Section (Left) */}
        <Link href={`/services/category/${service.id}`} className="block flex-shrink-0">
          <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden bg-gray-100 rounded-lg">
            {service.images && service.images.length > 0 && service.images[0] && service.images[0].trim() !== '' ? (
              <Image
                src={service.images[0]}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <span className="text-2xl font-semibold text-white">
                  {service.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Details Section (Right) */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            {/* Title */}
            <Link href={`/services/category/${service.id}`}>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 hover:text-brand-500 transition-colors">
                {service.title}
              </h3>
            </Link>

            {/* Provider Name with Verified Badge */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-600">{service.provider.name}</span>
              {service.provider.verified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => {
                if (index < fullStars) {
                  return (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-red-500 text-red-500"
                    />
                  )
                } else if (index === fullStars && hasHalfStar) {
                  return (
                    <div key={index} className="relative h-4 w-4">
                      <Star className="h-4 w-4 fill-gray-300 text-gray-300 absolute" />
                      <div className="absolute overflow-hidden w-1/2 h-full">
                        <Star className="h-4 w-4 fill-red-500 text-red-500" />
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-gray-300 text-gray-300"
                    />
                  )
                }
              })}
            </div>

            {/* Tags */}
            {service.tags && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.tags.slice(0, 4).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-2 py-1 border-gray-200 text-gray-600 bg-gray-50 rounded-md"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">Start From</span>
              <span className="text-lg font-bold text-gray-900">
                {service.price.discounted.toLocaleString()} {service.price.currency.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="mt-3 flex justify-end">
                  <Button
                    variant="default"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-sm font-medium"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>
          </div>
        </div>

        {/* Close Button (Top Right) */}
        {onRemove && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors z-10 shadow-sm"
            aria-label="Remove from wishlist"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  )
})

WishlistServiceCard.displayName = 'WishlistServiceCard'

