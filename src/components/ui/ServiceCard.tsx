'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { Heart, CheckCircle2, UserPlus } from 'lucide-react'
import { RatingDisplay } from './RatingDisplay'
import { PriceDisplay } from './PriceDisplay'
import { useWishlistItems, useFollowItems } from '@/hooks'
import type { Service } from '@/types/service'

export interface ServiceCardProps {
  service: Service
  onWishlistToggle?: (e: React.MouseEvent) => void
  onFavoriteToggle?: (e: React.MouseEvent) => void
  onFollowToggle?: (e: React.MouseEvent) => void
  onBookNow?: (serviceId: string) => void
  isLoadingWishlist?: boolean
  isLoadingFavorite?: boolean
  isLoadingFollow?: boolean
  className?: string
}

export const ServiceCard = React.memo(({
  service,
  onWishlistToggle,
  onFavoriteToggle,
  onFollowToggle,
  onBookNow,
  isLoadingWishlist = false,
  isLoadingFavorite = false,
  isLoadingFollow = false,
  className,
}: ServiceCardProps) => {
  const [imageError, setImageError] = React.useState(false)
  const router = useRouter()
  const { isServiceInWishlist } = useWishlistItems()
  const { isServiceFollowed } = useFollowItems()
  const serviceId = parseInt(service.id, 10)
  const isInWishlist = isServiceInWishlist(serviceId)
  const isFollowed = isServiceFollowed(serviceId)
  const hasDiscount = service.price.discounted < service.price.original

  const handleProviderClick = (e: React.MouseEvent, providerId: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/provider/${providerId}`)
  }
  const discountPercentage = hasDiscount
    ? Math.round(
      ((service.price.original - service.price.discounted) /
        service.price.original) *
      100
    )
    : 0

  return (
    <div
      className={cn(
        'group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {/* Image Container */}
      <Link href={`/services/category/${service.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {service.images && service.images.length > 0 && service.images[0] && service.images[0].trim() !== '' && !imageError ? (
            <Image
              src={service.images[0]}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-12 font-medium">
                No image available
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant="default"
                className="bg-brand-100 text-brand-500 border-0 px-2 py-1 text-12 font-normal rounded-full"
              >
                {discountPercentage}% OFF
              </Badge>
            </div>
          )}

          {/* Top Offers Badge */}
          {service.showTopOfferBadge && (
            <div
              className={cn(
                'absolute top-3 z-10',
                hasDiscount ? 'left-[84px]' : 'left-3'
              )}
            >
              <Badge
                variant="default"
                className="bg-brand-100 text-brand-500 border-0 px-3 py-1 text-12 font-normal rounded"
              >
                Top Offers
              </Badge>
            </div>
          )}

          {/* Availability Badge */}
          {!service.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <Badge
                variant="default"
                className="bg-gray-800 !text-white border-0 px-4 py-2 text-14 font-semibold"
              >
                Not Available
              </Badge>
            </div>
          )}

          {/* Action Icons */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            {/* Wishlist Icon */}
            {onWishlistToggle && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isLoadingWishlist) return
                  onWishlistToggle(e)
                }}
                disabled={isLoadingWishlist}
                className={cn(
                  'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-lg',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isInWishlist || service.isWishlisted
                    ? 'border-brand-500 bg-brand-500'
                    : 'border-gray-300 bg-white hover:border-brand-500 hover:bg-brand-50'
                )}
                aria-label={
                  isInWishlist || service.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                }
              >
                <Heart
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isLoadingWishlist && 'animate-pulse',
                    isInWishlist || service.isWishlisted
                      ? 'fill-white text-white'
                      : 'fill-gray-300 text-gray-400'
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link href={`/services/category/${service.id}`}>
          <h3 className="text-16 font-semibold text-gray-900 line-clamp-2 hover:text-brand-500 transition-colors">
            {service.title}
          </h3>
        </Link>

        {/* Provider Name */}
        <div className="flex items-center gap-1.5 relative z-50">
          <button
            type="button"
            onClick={(e) => handleProviderClick(e, service.provider.id)}
            className="text-14 text-gray-600 hover:text-brand-500 transition-colors text-left pointer-events-auto cursor-pointer bg-transparent border-0 p-0"
          >
            {service.provider.name}
          </button>
          {service.provider.verified && (
            <button
              type="button"
              onClick={(e) => handleProviderClick(e, service.provider.id)}
              className="flex-shrink-0 relative z-50 pointer-events-auto cursor-pointer bg-transparent border-0 p-0"
              aria-label="Verified provider"
            >
              <CheckCircle2 className="h-4 w-4 text-blue-500 hover:text-blue-600 transition-colors" />
            </button>
          )}
        </div>

        {/* Rating and Pricing Row */}
        <div className="flex items-center justify-between">
          <RatingDisplay
            rating={service.rating.value}
            showValue={true}
            size="sm"
            format="default"
            variant="compact"
            className="gap-1"
          />
          <PriceDisplay
            original={service.price.original}
            discounted={service.price.discounted}
            currency={service.price.currency}
            size="md"
            variant="compact"
            showOriginal={hasDiscount}
          />
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Button
            variant="default"
            className="w-full h-10 rounded-full bg-brand-500 hover:bg-brand-600 text-white"
            onClick={() => {
              router.push(`/booking/${service.id}`)
              onBookNow?.(service.id)
            }}
          >
            Book Now
          </Button>
        </div>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {service.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-10 px-2 py-0.5 border-gray-200 text-gray-600"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

ServiceCard.displayName = 'ServiceCard'
