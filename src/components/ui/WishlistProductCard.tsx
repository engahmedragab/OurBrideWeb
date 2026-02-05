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
        'bg-white border border-gray-100 rounded-2xl p-5 flex gap-5 relative shadow-sm',
        className
      )}
    >
      {/* Left: Product Image */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <Link href={`/products/category/${product.id}`} className="block">
          <div className="relative w-24 h-24 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex">
            {product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '' && !imageError ? (
              <Image
                src={product.images[0]}
                alt={product.title}
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
      </div>

      {/* Middle: Product Details */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Discount Badge - Top Right */}
        {discountPercentage && (
          <span className="absolute top-0 right-10 text-12 font-medium text-green-500">
            {t('discountOff', { percent: discountPercentage })}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/category/${product.id}`}>
          <h3 className="text-12 md:text-16 font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-brand-500 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Provider Name */}
        <div className="flex items-center gap-1.5 mb-2">
          <Link 
            href={`/provider/${product.provider.id}`}
            className="text-13 text-gray-500 hover:text-brand-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {product.provider.name}
          </Link>
        </div>

        {/* Price */}
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-16 font-semibold text-gray-900">
            {product.price.discounted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {product.price.currency}
          </span>
          {hasDiscount && (
            <span className="text-12 md:text-16 font-normal text-gray-400 line-through">
              {product.price.original.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {product.price.currency}
            </span>
          )}
        </div>

        {/* Bottom: Buy Now Button */}
        <div className="mt-auto pt-2 flex justify-end">
          <Button
            variant="success"
            size="md"
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className="!text-white rounded-full px-4 h-9"
          >
            {t('buyNow')}
          </Button>
        </div>
      </div>

      {/* Right: Remove Button (Top Right) */}
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
    )
  }
)

WishlistProductCard.displayName = 'WishlistProductCard'
