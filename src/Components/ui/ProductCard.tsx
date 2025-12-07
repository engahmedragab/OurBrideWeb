import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { RatingDisplay } from './RatingDisplay'
import { Heart, ShoppingCart, CheckCircle2 } from 'lucide-react'
import type { Product } from '@/types/product'

export interface ProductCardProps {
  product: Product
  onWishlistToggle?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  className?: string
}

export const ProductCard = React.memo(({
  product,
  onWishlistToggle,
  onAddToCart,
  className,
}: ProductCardProps) => {
  const hasDiscount = product.price.discounted < product.price.original
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price.original - product.price.discounted) /
          product.price.original) *
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
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant="default"
                className="bg-brand-100 text-brand-500 border-0 px-2 py-1 text-12 font-normal rounded"
              >
                -{discountPercentage}%
              </Badge>
            </div>
          )}

          {/* Top Offers Badge */}
          {product.showTopOfferBadge && (
            <div
              className={cn(
                'absolute top-3 z-10',
                hasDiscount ? 'left-[74px]' : 'left-3'
              )}
            >
              <Badge
                variant="default"
                className="bg-brand-100 text-brand-500 border-0 px-3 py-1 text-12 font-normal rounded-full"
              >
                Top Offers
              </Badge>
            </div>
          )}

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <Badge
                variant="default"
                className="bg-gray-800 !text-white border-0 px-4 py-2 text-14 font-semibold"
              >
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Wishlist Icon */}
          <button
            onClick={e => {
              e.preventDefault()
              onWishlistToggle?.(product.id)
            }}
            className={cn(
              'absolute top-3 right-3 z-10 w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center transition-all duration-200',
              product.isWishlisted
                ? 'border-brand-500 bg-brand-50'
                : 'hover:border-brand-500 hover:bg-gray-50'
            )}
            aria-label={
              product.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
            }
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                product.isWishlisted
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
        <Link href={`/products/${product.id}`}>
          <h3 className="text-16 font-semibold text-gray-900 line-clamp-2 hover:text-brand-500 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Provider Name */}
        <div className="flex items-center gap-1.5">
          <span className="text-14 text-gray-600">{product.provider.name}</span>
          {product.provider.verified && (
            <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
          )}
        </div>

        {/* Rating */}
        <RatingDisplay
          rating={product.rating.value}
          count={product.rating.count}
          size="sm"
          className="gap-1.5"
        />

        {/* Pricing */}
        <div className="flex items-baseline gap-0.5">
          {hasDiscount && (
            <span className="text-10 font-normal text-gray-400 line-through">
              {product.price.original.toLocaleString()} {product.price.currency}
            </span>
          )}
          <span className="text-16 font-normal text-gray-900">
            {product.price.discounted.toLocaleString()} {product.price.currency}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-gray-300 bg-white hover:border-brand-500 hover:bg-white flex-shrink-0"
            onClick={() => onAddToCart?.(product.id)}
            disabled={!product.inStock}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5 text-brand-500" />
          </Button>
          <Button
            variant="default"
            className="flex-1 h-10 rounded-full bg-brand-500 hover:bg-brand-600 text-white"
            onClick={() => onAddToCart?.(product.id)}
            disabled={!product.inStock}
          >
            Add to Cart
          </Button>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.tags.slice(0, 3).map((tag, index) => (
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
})

ProductCard.displayName = 'ProductCard'
