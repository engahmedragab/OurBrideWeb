'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { CheckCircle2, Star, X } from 'lucide-react'
import type { Product } from '@/types/product'

export interface WishlistProductCardProps {
  product: Product
  onRemove?: (productId: string) => void
  onBuyNow?: (productId: string) => void
  className?: string
}

export const WishlistProductCard = React.memo(({
  product,
  onRemove,
  onBuyNow,
  className,
}: WishlistProductCardProps) => {
  const router = useRouter()
  const rating = product.rating.value || 0
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
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
        'relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow mb-4',
        className
      )}
    >
      <div className="flex">
        {/* Image Section (Left) */}
        <Link href={`/products/category/${product.id}`} className="block flex-shrink-0">
          <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden bg-gray-100 rounded-lg">
            {product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '' ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <span className="text-2xl font-semibold text-white">
                  {product.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Details Section (Right) */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            {/* Title */}
            <Link href={`/products/category/${product.id}`}>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 hover:text-brand-500 transition-colors">
                {product.title}
              </h3>
            </Link>

            {/* Provider Name with Verified Badge */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-600">{product.provider.name}</span>
              {product.provider.verified && (
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
              <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.slice(0, 4).map((tag, index) => (
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
              <span className="text-sm text-gray-500">Price</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {product.price.original.toLocaleString()} {product.price.currency.toUpperCase()}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900">
                {product.price.discounted.toLocaleString()} {product.price.currency.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Buy Now Button */}
          <div className="mt-3 flex justify-end">
            <Button
              variant="default"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md text-sm font-medium"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
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

WishlistProductCard.displayName = 'WishlistProductCard'

