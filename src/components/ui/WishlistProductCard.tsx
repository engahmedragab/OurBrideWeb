'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Trash2 } from 'lucide-react'
import type { Product } from '@/types/product'
import { useI18nTranslations } from '@/i18n'

export interface WishlistProductCardProps {
  product: Product
  onRemove?: (productId: string) => void
  onBuyNow?: (productId: string) => void
  className?: string
}

export const WishlistProductCard = React.memo(
  ({ product, onRemove, onBuyNow, className }: WishlistProductCardProps) => {
    const [imageError, setImageError] = React.useState(false)
    const router = useRouter()
    const t = useI18nTranslations('wishlist.cards')
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

    const discountPercentage = hasDiscount
      ? Math.round(((product.price.original - product.price.discounted) / product.price.original) * 100)
      : undefined

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-4 flex gap-4 relative',
        className
      )}
    >
      {/* Left: Product Image with Delete Button */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <Link href={`/products/category/${product.id}`} className="block">
          <div className="relative w-20 h-20 rounded-lg bg-gray-100 overflow-hidden">
            {product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '' && !imageError ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="80px"
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
            className="p-2 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors"
            aria-label={t('removeFromWishlist')}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        )}
      </div>

      {/* Middle: Product Details */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Discount Badge - Top Right */}
        {discountPercentage && (
          <span className="absolute top-0 right-0 text-12 font-medium text-green-500">
            {t('discountOff', { percent: discountPercentage })}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/category/${product.id}`}>
          <h3 className="text-14 font-semibold text-gray-900 line-clamp-2 mb-2 pr-16 hover:text-brand-500 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Provider Name */}
        <div className="flex items-center gap-1.5 mb-1">
          <Link 
            href={`/provider/${product.provider.id}`}
            className="text-12 text-gray-600 hover:text-brand-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {product.provider.name}
          </Link>
        </div>

        {/* Price */}
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-14 font-semibold text-gray-900">
            {product.price.discounted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {product.price.currency}
          </span>
          {hasDiscount && (
            <span className="text-14 font-normal text-gray-400 line-through">
              {product.price.original.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {product.price.currency}
            </span>
          )}
        </div>

        {/* Bottom: Buy Now Button */}
        <div className="mt-auto pt-3 flex justify-end">
          <Button
            variant="success"
            size="md"
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className='!text-white'
          >
            {t('buyNow')}
          </Button>
        </div>
      </div>
    </div>
    )
  }
)

WishlistProductCard.displayName = 'WishlistProductCard'
