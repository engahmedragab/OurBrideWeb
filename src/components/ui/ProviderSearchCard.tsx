/**
 * Provider Search Card Component
 * Card design for search screen matching the screenshot
 */

import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { RatingDisplay } from './RatingDisplay'
import { PriceDisplay } from './PriceDisplay'
import { cn } from '@/lib/utils'
import type { FeaturedProviderResponse } from '@/types/responses/featured-provider-response'
import { DEFAULT_CURRENCY } from '@/utils/currency'

export interface ProviderSearchCardProps {
    provider: FeaturedProviderResponse
    services?: Array<{
        id: number
        name?: string
        nameEn?: string
        nameAr?: string
        duration?: number
        durationMin?: number
        durationMax?: number
        price?: number
        salePrice?: number
        hasDiscount?: boolean
    }>
    totalServices?: number
    isFeatured?: boolean
    className?: string
    onClick?: () => void
}

export const ProviderSearchCard = ({
    provider,
    services = [],
    totalServices,
    isFeatured = false,
    className,
    onClick
}: ProviderSearchCardProps) => {
    const providerName = provider.nameEn || provider.nameAr || 'Provider'
    const providerNameAr = provider.nameAr
    const providerImage = provider.publicBannerImageUrl || provider.publicLogoImageUrl
    const rating = provider.rate || 0
    const reviewCount = provider.totalReviews || 0
    const address = provider.shortAddress || ''
    const providerId = provider.id.toString()
    // publicProfileSlug may already include /provider/ prefix, so check for it
    const profileUrl = provider.publicProfileSlug
        ? (provider.publicProfileSlug.startsWith('/provider/') 
            ? provider.publicProfileSlug 
            : `/provider/${provider.publicProfileSlug}`)
        : provider.uniqueCode
            ? `/provider/${provider.uniqueCode}`
            : `/provider/${providerId}`

    // Get first 3 services
    const displayServices = services.slice(0, 3)
    const hasMoreServices = (totalServices || services.length) > 3

    return (
        <div
            className={cn(
                'bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm',
                'hover:shadow-md transition-shadow duration-200',
                className
            )}
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="relative w-full h-[200px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {providerImage ? (
                    <Image
                        src={providerImage}
                        alt={providerName}
                        fill
                        sizes="100%"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200">
                        <span className="text-40 font-bold text-brand-600">
                            {providerName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Featured Badge */}
                {isFeatured && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-white border border-gray-900 text-gray-900 px-3 py-1 rounded-full text-12 font-medium">
                            Featured
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <Link href={profileUrl} onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-18 font-semibold text-gray-900 hover:text-brand-600 transition-colors">
                        {providerName}
                        {providerNameAr && providerName !== providerNameAr && (
                            <span className="text-gray-600"> | {providerNameAr}</span>
                        )}
                    </h3>
                </Link>

                {/* Rating */}
                {rating > 0 && (
                    <RatingDisplay
                        rating={rating}
                        count={reviewCount}
                        showCount={true}
                        showValue={true}
                        size="md"
                        variant="default"
                        starColor="yellow"
                    />
                )}

                {/* Address */}
                {address && (
                    <p className="text-14 text-gray-600 line-clamp-2">
                        {address}
                    </p>
                )}

                {/* Services List */}
                {displayServices.length > 0 && (
                    <div className="space-y-2 pt-2">
                        {displayServices.map((service, index) => {
                            // Handle service name - check nameEn, nameAr, or name field
                            const serviceAny = service as any
                            const serviceName = service.nameEn || service.nameAr || serviceAny.name || 'Service'
                            const serviceNameAr = service.nameAr && service.nameEn !== service.nameAr ? service.nameAr : null
                            const duration = service.duration || service.durationMin
                            const durationMax = service.durationMax
                            const price = service.salePrice || service.price || 0
                            const originalPrice = service.hasDiscount && service.price ? service.price : undefined

                            return (
                                <div
                                    key={service.id || index}
                                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                                >
                                    <div className="flex-1 min-w-0">
                                        {/* Service Name */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-14 font-medium text-gray-900 truncate">
                                                {serviceName}
                                                {serviceNameAr && (
                                                    <span className="text-gray-600"> | {serviceNameAr}</span>
                                                )}
                                            </span>
                                        </div>
                                        {/* Duration */}
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                                            <span className="text-12 text-gray-600">
                                                {duration}
                                                {durationMax && durationMax !== duration ? ` - ${durationMax}` : ''} min
                                            </span>
                                        </div>
                                    </div>
                                    {/* Price */}
                                    <div className="flex-shrink-0 ml-4">
                                        <PriceDisplay
                                            original={originalPrice}
                                            discounted={price}
                                            currency={DEFAULT_CURRENCY}
                                            size="sm"
                                            variant="compact"
                                            showOriginal={service.hasDiscount}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* See All Services Link */}
                {hasMoreServices && (
                    <Link
                        href={profileUrl}
                        onClick={(e) => {
                            e.stopPropagation()
                            // Link component will handle navigation to provider details page
                        }}
                        className="block text-14 text-brand-600 hover:text-brand-700 font-medium pt-2"
                    >
                        See all {totalServices || services.length} services
                    </Link>
                )}
            </div>
        </div>
    )
}

