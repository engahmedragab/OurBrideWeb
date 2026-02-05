'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Trash2 } from 'lucide-react'
import type { Service } from '@/types/service'
import { useI18nTranslations } from '@/i18n'

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
  const t = useI18nTranslations('wishlist.cards')

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
        'bg-white border border-gray-100 rounded-2xl p-5 flex gap-5 relative shadow-sm',
        className
      )}
    >
      {/* Left: Service Image with Delete Button */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <Link href={`/services/category/${service.id}`} className="block">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
            {service.images && service.images.length > 0 && service.images[0] && service.images[0].trim() !== '' && !imageError ? (
              <Image
                src={service.images[0]}
                alt={service.title}
                fill
                sizes="112px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-10 font-medium text-center px-1">
                  {t('noImageAvailable')}
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
            className="absolute top-4 ltr:right-4 rtl:left-4 w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-brand-400 hover:text-brand-600 transition-colors"
            aria-label={t('removeFromWishlist')}
          >
            <Trash2 className="h-4 w-4 mx-auto" />
          </button>
        )}
      </div>

      {/* Middle: Service Details */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Title */}
        <Link href={`/services/category/${service.id}`}>
          <h3 className="text-12 md:text-16 font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-brand-500 transition-colors">
            {service.title}
          </h3>
        </Link>

        {/* Provider Name */}
        <div className="flex items-center gap-1.5 mb-2">
          <Link 
            href={`/provider/${service.provider.id}`}
            className="text-13 text-gray-500 hover:text-brand-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {service.provider.name}
          </Link>
        </div>

        {/* Price */}
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-12 text-gray-500 mr-1">{t('startFrom')}</span>
          <span className="text-12 md:text-16 font-semibold text-gray-900">
            {service.price.discounted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {service.price.currency}
          </span>
        </div>

        {/* Bottom: Book Now Button */}
        <div className="mt-auto pt-2 flex justify-end">
          <Button
            variant="brand"
            size="md"
            onClick={handleBookNow}
            className="!text-white rounded-full  px-4 h-9"
          >
            {t('bookNow')}
          </Button>
        </div>
      </div>
    </div>
    )
  }
)

WishlistServiceCard.displayName = 'WishlistServiceCard'
