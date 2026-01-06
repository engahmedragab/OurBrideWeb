'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { CheckCircle2, X } from 'lucide-react'
import { RatingDisplay } from './RatingDisplay'
import { PriceDisplay } from './PriceDisplay'
import type { Product } from '@/types/product'

export interface WishlistProductCardProps {
  product: Product
  onRemove?: (productId: string) => void
  onBuyNow?: (productId: string) => void
  className?: string
}

export const WishlistProductCard = React.memo(
  ({ product, onRemove, onBuyNow, className }: WishlistProductCardProps) => {
    const router = useRouter()
    const rating = product.rating.value || 0
    const hasDiscount = product.price.discounted < product.price.original

    const handleBuyNow = () => {
      router.push(`/products/category/${product.id}`)
      onBuyNow?.(product.id)
    }

    const handleRemove = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onRemove?.(product.id)
    }

    return (
      <div
        className={cn(
          'relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow mb-4',
          className
        )}
      >
        {/* X button */}
        {onRemove && (
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 md:top-4 md:right-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 border border-gray-200 hover:bg-gray-50 transition-colors z-10"
            aria-label="Remove from wishlist"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        )}

        {/* Layout wrapper */}
        <div className="flex gap-3 p-3 md:p-0 md:gap-0">
          {/* Image */}
          <Link href={`/products/category/${product.id}`} className="block shrink-0">
            <div
              className={cn(
                'relative overflow-hidden bg-gray-100',
                // ✅ Mobile: small square image
                'w-16 h-full sm:w-20  rounded-xl',
                // ✅ md/lg: big image, flush left with rounded left corners only
                'md:w-56  md:rounded-l-2xl md:rounded-r-none'
              )}
            >
              {product.images?.[0]?.trim() ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 80px, 224px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <span className="text-xl font-semibold text-white">
                    {product.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0 md:p-5">
            {/* Title */}
            <Link href={`/products/category/${product.id}`} className="block pr-10">
              <h3 className="text-[14px] md:text-[18px] font-semibold text-gray-900 line-clamp-1 hover:text-brand-500 transition-colors">
                {product.title}
              </h3>
            </Link>

            {/* Provider */}
            <div className="mt-1 flex items-center gap-1.5 min-w-0">
              <span className="text-[12px] text-gray-500 shrink-0">Provider :</span>
              <Link
                href={`/provider/${product.provider.id}`}
                className="text-[12px] text-gray-700 hover:text-brand-500 transition-colors truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {product.provider.name}
              </Link>

              {product.provider.verified && (
                <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
              )}
            </div>

            {/* Rating row */}
            <div className="mt-1 flex items-center justify-between">
              <RatingDisplay
                rating={rating}
                size="sm"
                format="stars-only"
                variant="compact"
                showHalfStars={true}
                starColor="red"
              />
              <span className="text-[12px] text-gray-600">{rating.toFixed(1)}</span>
            </div>

            {/* Tags (same look on mobile + md/lg) */}
            {product.tags?.length ? (
              <div className="mt-2 grid grid-cols-4 gap-2 md:gap-3">
                {product.tags.slice(0, 4).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="w-full justify-center text-[11px] md:text-[12px] px-2 py-1 border-gray-200 text-gray-600 bg-gray-50 rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            {/* Bottom row: Start From + Price + CTA (responsive like screenshots) */}
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center justify-between md:justify-start md:gap-2">
                <p className="text-[12px] text-gray-500">Start From</p>
                <PriceDisplay
                  original={product.price.original}
                  discounted={product.price.discounted}
                  currency={product.price.currency}
                  size="lg"
                  variant="compact"
                  showOriginal={hasDiscount}
                  discountedClassName="text-[14px] md:text-[16px] font-semibold text-gray-900"
                />
              </div>

              <Button
                variant="default"
                className="w-full md:w-auto md:min-w-[140px] bg-brand-500 hover:bg-brand-600 px-6 py-2.5 rounded-full text-sm font-medium"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

WishlistProductCard.displayName = 'WishlistProductCard'
