'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { Heart, CheckCircle2, Star } from 'lucide-react'
import type { Service } from '@/types/service'

export interface ServiceCardProps {
  service: Service
  onWishlistToggle?: (serviceId: string) => void
  onBookNow?: (serviceId: string) => void
  className?: string
}

export const ServiceCard = ({
  service,
  onWishlistToggle,
  onBookNow,
  className,
}: ServiceCardProps) => {
  const router = useRouter()
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
      className={cn(
        'group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {/* Image Container */}
      <Link href={`/services/${service.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={service.images[0]}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

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
                hasDiscount ? 'left-[76px]' : 'left-3'
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

          {/* Wishlist Icon */}
          <button
            onClick={e => {
              e.preventDefault()
              onWishlistToggle?.(service.id)
            }}
            className={cn(
              'absolute top-3 right-3 z-10 w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center transition-all duration-200',
              service.isWishlisted
                ? 'border-brand-500 bg-brand-50'
                : 'hover:border-brand-500 hover:bg-gray-50'
            )}
            aria-label={
              service.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
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
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link href={`/services/${service.id}`}>
          <h3 className="text-16 font-semibold text-gray-900 line-clamp-2 hover:text-brand-500 transition-colors">
            {service.title}
          </h3>
        </Link>

        {/* Provider Name */}
        <div className="flex items-center gap-1.5">
          <span className="text-14 text-gray-600">{service.provider.name}</span>
          {service.provider.verified && (
            <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
          )}
        </div>

        {/* Rating and Pricing Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
            <span className="text-14 font-normal text-gray-900">
              {service.rating.value}
            </span>
          </div>
          <div className="flex items-baseline gap-0.5">
            {hasDiscount && (
              <span className="text-10 font-normal text-gray-400 line-through">
                {service.price.original.toLocaleString()}{' '}
                {service.price.currency}
              </span>
            )}
            <span className="text-16 font-normal text-gray-900">
              {service.price.discounted.toLocaleString()}{' '}
              {service.price.currency}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Button
            variant="default"
            className="w-full h-10 rounded-full bg-brand-500 hover:bg-brand-600 text-white"
            onClick={() => {
              router.push(`/services/${service.id}`)
              onBookNow?.(service.id)
            }}
            disabled={!service.available}
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
}
