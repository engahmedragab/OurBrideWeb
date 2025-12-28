'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { CheckCircle2, Star, X } from 'lucide-react'
import type { FeaturedProviderResponse } from '@/types/responses/featured-provider-response'

export interface WishlistProviderCardProps {
  provider: FeaturedProviderResponse
  onRemove?: (providerId: number) => void
  onViewProfile?: (providerId: number) => void
  className?: string
}

export const WishlistProviderCard = React.memo(({
  provider,
  onRemove,
  onViewProfile,
  className,
}: WishlistProviderCardProps) => {
  const router = useRouter()
  const rating = provider.rate || 0
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const providerName = provider.nameEn || provider.nameAr || `Provider #${provider.id}`
  const providerImage = provider.publicLogoImageUrl || provider.publicBannerImageUrl || ''

  const handleViewProfile = () => {
    const profileUrl = provider.publicProfileSlug || `/providers/${provider.id}`
    router.push(profileUrl)
    onViewProfile?.(provider.id)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove?.(provider.id)
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
        <Link href={provider.publicProfileSlug || `/providers/${provider.id}`} className="block flex-shrink-0">
          <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden bg-gray-100 rounded-lg">
            {providerImage && providerImage.trim() !== '' ? (
              <Image
                src={providerImage}
                alt={providerName}
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <span className="text-2xl font-semibold text-white">
                  {providerName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Details Section (Right) */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            {/* Title */}
            <Link href={provider.publicProfileSlug || `/providers/${provider.id}`}>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 hover:text-brand-500 transition-colors">
                {providerName}
              </h3>
            </Link>

            {/* Verified Badge */}
            <div className="flex items-center gap-1.5">
              {provider.isVerified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
              {provider.shortAddress && (
                <span className="text-sm text-gray-600">{provider.shortAddress}</span>
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
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {provider.totalServices !== undefined && (
                <span>{provider.totalServices} Services</span>
              )}
              {provider.totalProducts !== undefined && (
                <span>{provider.totalProducts} Products</span>
              )}
              {provider.totalReviews !== undefined && provider.totalReviews > 0 && (
                <span>{provider.totalReviews} Reviews</span>
              )}
            </div>
          </div>

          {/* View Profile Button */}
          <div className="mt-3 flex justify-end">
            <Button
              variant="default"
              className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-md text-sm font-medium"
              onClick={handleViewProfile}
            >
              View Profile
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

WishlistProviderCard.displayName = 'WishlistProviderCard'

