/**
 * Provider Home Card Component
 * Card design matching the screenshot for provider home sections
 */

import Link from 'next/link'
import Image from 'next/image'
import { RatingDisplay } from './RatingDisplay'
import { cn } from '@/lib/utils'
import type { ProviderHomeFeaturedProviderResponse } from '@/types/responses/provider-home-featured-provider-response'
import type { FeaturedProviderResponse } from '@/types/responses/featured-provider-response'

export interface ProviderHomeCardProps {
  provider: ProviderHomeFeaturedProviderResponse | FeaturedProviderResponse
  category?: string
  className?: string
}

export const ProviderHomeCard = ({
  provider,
  category,
  className,
}: ProviderHomeCardProps) => {
  const providerName = provider.nameEn || provider.nameAr || 'Provider'
  const providerImage =
    provider.publicBannerImageUrl || provider.publicLogoImageUrl
  const rating = provider.rate || 0
  const reviewCount = provider.totalReviews || 0
  const location = provider.shortAddress || ''
  const providerId = provider.id.toString()
  // publicProfileSlug may already include /provider/ prefix, so check for it
  const profileUrl = provider.publicProfileSlug
    ? provider.publicProfileSlug.startsWith('/provider/')
      ? provider.publicProfileSlug
      : `/provider/${provider.publicProfileSlug}`
    : provider.uniqueCode
      ? `/provider/${provider.uniqueCode}`
      : `/provider/${providerId}`

  // Determine category from topRatedService or use provided category
  const displayCategory =
    category || (provider.topRatedService?.name ? 'Service' : 'Provider')

  return (
    <Link
      href={profileUrl}
      className={cn(
        'group relative flex-shrink-0 w-[280px] sm:w-[300px] bg-white rounded-xl overflow-hidden',
        'border border-gray-200 hover:border-brand-300 hover:shadow-lg transition-all duration-300',
        'flex flex-col',
        className
      )}
    >
      {/* Image Section - Full width, larger height */}
      <div className="relative w-full h-[200px] sm:h-[220px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {providerImage ? (
          <Image
            src={providerImage}
            alt={providerName}
            fill
            sizes="(max-width: 640px) 280px, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200">
            <span className="text-40 font-bold text-brand-600">
              {providerName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col">
        {/* Provider Name and Rating on same line */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-18 font-bold text-gray-900 line-clamp-2 flex-1 group-hover:text-brand-600 transition-colors">
            {providerName}
          </h3>
          {rating > 0 && (
            <div className="flex-shrink-0">
              <RatingDisplay
                rating={rating}
                count={reviewCount}
                showCount={true}
                showValue={true}
                size="sm"
                format="default"
                variant="compact"
                starColor="yellow"
                valueClassName="text-14 font-semibold text-gray-900"
              />
            </div>
          )}
        </div>

        {/* Location */}
        {location && (
          <p className="text-14 text-gray-600 mb-1.5 line-clamp-1">
            {location}
          </p>
        )}

        {/* Category */}
        {displayCategory && (
          <p className="text-14 text-gray-500">{displayCategory}</p>
        )}
      </div>
    </Link>
  )
}
