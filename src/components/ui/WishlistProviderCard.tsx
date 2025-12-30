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
        'group relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 mb-4',
        'hover:shadow-xl hover:border-brand-300 hover:-translate-y-1',
        className
      )}
    >
      <div className="flex flex-col">
        {/* Image Section (Top) */}
        <Link href={provider.publicProfileSlug || `/providers/${provider.id}`} className="block relative">
          <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {providerImage && providerImage.trim() !== '' ? (
              <Image
                src={providerImage}
                alt={providerName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200">
                <span className="text-4xl font-bold text-brand-600">
                  {providerName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Verified Badge Overlay */}
            {provider.isVerified && (
              <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-12 font-semibold">Verified</span>
              </div>
            )}

            {/* Rating Badge Overlay */}
            {rating > 0 && (
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
                <span className="text-14 font-bold text-gray-900">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Details Section (Bottom) */}
        <div className="p-4 flex flex-col flex-1">
          <div className="space-y-3 flex-1">
            {/* Title */}
            <Link href={provider.publicProfileSlug || `/providers/${provider.id}`}>
              <h3 className="text-18 font-bold text-gray-900 line-clamp-2 hover:text-brand-600 transition-colors leading-tight">
                {providerName}
              </h3>
            </Link>

            {/* Description/Profession */}
            {(provider.descriptionEn || provider.descriptionAr) && (
              <p className="text-14 text-gray-600 line-clamp-2">
                {provider.descriptionEn || provider.descriptionAr}
              </p>
            )}

            {/* Address */}
            {provider.shortAddress && (
              <div className="flex items-start gap-2">
                <svg className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-13 text-gray-600 line-clamp-1">{provider.shortAddress}</span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-13 text-gray-600 pt-2 border-t border-gray-100">
              {provider.totalServices !== undefined && provider.totalServices > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{provider.totalServices}</span>
                  <span>Services</span>
                </div>
              )}
              {provider.totalReviews !== undefined && provider.totalReviews > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <span className="font-medium">{provider.totalReviews}</span>
                  <span>Reviews</span>
                </div>
              )}
            </div>
          </div>

          {/* View Profile Button */}
          <div className="mt-4">
            <Button
              variant="default"
              className="w-full bg-brand-600 hover:bg-brand-700 !text-white font-medium text-14 h-10 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 hover:bg-white border border-gray-200 flex items-center justify-center transition-all duration-200 z-10 shadow-lg hover:shadow-xl hover:scale-110"
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

