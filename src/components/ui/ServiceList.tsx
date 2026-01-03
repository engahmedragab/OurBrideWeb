'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { Heart, CheckCircle2 } from 'lucide-react'
import { RatingDisplay } from './RatingDisplay'
import type { Service } from '@/types/service'

export interface ServiceListProps {
  services: Service[]
  onWishlistToggle?: (serviceId: string) => void
  onBookNow?: (serviceId: string) => void
  className?: string
}

export const ServiceList = ({
  services,
  onWishlistToggle,
  onBookNow,
  className,
}: ServiceListProps) => {
  const router = useRouter()

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-16 text-gray-500">No services found</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {services.map(service => {
        const hasDiscount = service.price.discounted < service.price.original
        const discountPercentage = hasDiscount
          ? Math.round(
              ((service.price.original - service.price.discounted) /
                service.price.original) *
                100
            )
          : 0

        return (
          <div
            key={service.id}
            className="group bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-4 p-4">
              {/* Image */}
              <Link
                href={`/services/category/${service.id}`}
                className="block flex-shrink-0 w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 relative"
              >
                {service.images && service.images.length > 0 && service.images[0] && service.images[0].trim() !== '' ? (
                  <Image
                    src={service.images[0]}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 192px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-14">
                    No image
                  </div>
                )}
                {/* Top Offers Badge */}
                {service.showTopOfferBadge && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge
                      variant="default"
                      className="bg-red-500 !text-white border-0 px-3 py-1 text-12 font-normal rounded"
                    >
                      Top Offers
                    </Badge>
                  </div>
                )}
                {/* Discount Badge */}
                {hasDiscount && (
                  <div
                    className={cn(
                      'absolute top-3 z-10',
                      service.showTopOfferBadge ? 'left-[98px]' : 'left-3'
                    )}
                  >
                    <Badge
                      variant="default"
                      className="bg-red-500 !text-white border-0 px-2 py-1 text-12 font-semibold rounded-full"
                    >
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link href={`/services/category/${service.id}`}>
                        <h3 className="text-18 font-semibold text-gray-900 line-clamp-2 hover:text-brand-500 transition-colors">
                          {service.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Link 
                          href={`/provider/${service.provider.id}`}
                          className="text-14 text-gray-600 hover:text-brand-500 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {service.provider.name}
                        </Link>
                        {service.provider.verified && (
                          <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onWishlistToggle?.(service.id)}
                      className={cn(
                        'flex-shrink-0 w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center transition-all duration-200',
                        service.isWishlisted
                          ? 'border-brand-500 bg-brand-50'
                          : 'hover:border-brand-500 hover:bg-gray-50'
                      )}
                      aria-label={
                        service.isWishlisted
                          ? 'Remove from wishlist'
                          : 'Add to wishlist'
                      }
                    >
                      <Heart
                        className={cn(
                          'h-5 w-5 transition-colors',
                          service.isWishlisted
                            ? 'fill-brand-500 text-brand-500'
                            : 'text-gray-400'
                        )}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-14 text-gray-600 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Rating and Tags */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <RatingDisplay
                      rating={service.rating.value}
                      showValue={true}
                      size="sm"
                      format="value-only"
                      variant="compact"
                    />
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
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

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-0.5">
                    {hasDiscount && (
                      <span className="text-10 font-normal text-gray-400 line-through">
                        {service.price.original.toLocaleString()}{' '}
                        {service.price.currency}
                      </span>
                    )}
                    <span className="text-18 font-normal text-gray-900">
                      {service.price.discounted.toLocaleString()}{' '}
                      {service.price.currency}
                    </span>
                    {hasDiscount && (
                      <Badge
                        variant="default"
                        className="bg-red-500 !text-white border-0 px-2 py-0.5 text-12 font-semibold"
                      >
                        -{discountPercentage}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      className="h-10 px-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white"
                      onClick={() => {
                        router.push(`/booking/${service.id}`)
                        onBookNow?.(service.id)
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
