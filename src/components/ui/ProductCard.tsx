import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { RatingDisplay } from './RatingDisplay'
import { PriceDisplay } from './PriceDisplay'
import { useCartItems, useAddToCart, useWishlistItems, useFollowItems } from '@/hooks'
import { Heart, ShoppingCart, CheckCircle2, Check, UserPlus } from 'lucide-react'
import type { Product } from '@/types/product'

export interface ProductCardProps {
  product: Product
  onWishlistToggle?: (e: React.MouseEvent) => void
  onFollowToggle?: (e: React.MouseEvent) => void
  onAddToCart?: (productId: string) => void
  isLoadingWishlist?: boolean
  isLoadingFollow?: boolean
  className?: string
}

export const ProductCard = React.memo(({
  product,
  onWishlistToggle,
  onFollowToggle,
  onAddToCart,
  isLoadingWishlist = false,
  isLoadingFollow = false,
  className,
}: ProductCardProps) => {
  const [imageError, setImageError] = React.useState(false)
  const hasDiscount = product.price.discounted < product.price.original
  const discountPercentage = hasDiscount
    ? Math.round(
      ((product.price.original - product.price.discounted) /
        product.price.original) *
      100
    )
    : 0

  const router = useRouter()
  const { isProductInCart } = useCartItems()
  const { isProductInWishlist } = useWishlistItems()
  const { isProductFollowed } = useFollowItems()
  const addToCartMutation = useAddToCart()
  const productId = parseInt(product.id, 10)
  const providerId = product.provider?.id ? parseInt(product.provider.id, 10) : undefined
  const isInCart = isProductInCart(productId, providerId)
  const isInWishlist = isProductInWishlist(productId)
  const isFollowed = isProductFollowed(productId)

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.inStock) return

    // If not in cart, add it first
    if (!isInCart && onAddToCart) {
      try {
        // Ensure providerId is available
        if (!providerId) {
          return
        }
        await addToCartMutation.mutateAsync({
          productId,
          quantity: 1,
          providerId,
          price: product.price.discounted,
        })
      } catch (error) {
        // Error adding product to cart
        // Still navigate to cart even if add fails
      }
    }

    // Navigate to cart
    router.push('/cart')
  }

  const handleViewCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/cart')
  }

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
          {product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '' && !imageError ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-12 font-medium">
                No image available
              </span>
            </div>
          )}

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

          {/* Action Icons */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            {/* Follow Icon */}
            {onFollowToggle && (
              <button
                onClick={onFollowToggle}
                disabled={isLoadingFollow}
                className={cn(
                  'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-lg',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isFollowed
                    ? 'border-brand-500 bg-brand-500'
                    : 'border-gray-300 bg-white hover:border-brand-500 hover:bg-brand-50'
                )}
                aria-label={
                  isFollowed ? 'Unfollow' : 'Follow'
                }
              >
                <UserPlus
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isLoadingFollow && 'animate-pulse',
                    isFollowed
                      ? 'fill-white text-white'
                      : 'fill-gray-300 text-gray-400'
                  )}
                />
              </button>
            )}

            {/* Wishlist Icon */}
            {onWishlistToggle && (
              <button
                onClick={onWishlistToggle}
                disabled={isLoadingWishlist}
                className={cn(
                  'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-lg',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isInWishlist || product.isWishlisted
                    ? 'border-brand-500 bg-brand-500'
                    : 'border-gray-300 bg-white hover:border-brand-500 hover:bg-brand-50'
                )}
                aria-label={
                  isInWishlist || product.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                }
              >
                <Heart
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isLoadingWishlist && 'animate-pulse',
                    isInWishlist || product.isWishlisted
                      ? 'fill-white text-white'
                      : 'fill-gray-300 text-gray-400'
                  )}
                />
              </button>
            )}
          </div>
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
          <Link 
            href={`/provider/${product.provider.id}`}
            className="text-14 text-gray-600 hover:text-brand-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {product.provider.name}
          </Link>
          {product.provider.verified && (
            <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
          )}
        </div>

        {/* Rating */}
        <RatingDisplay
          rating={product.rating.value}
          count={product.rating.count}
          showCount={true}
          size="sm"
          format="default"
          variant="default"
        />

        {/* Pricing */}
        <PriceDisplay
          original={product.price.original}
          discounted={product.price.discounted}
          currency={product.price.currency}
          size="md"
          variant="compact"
          showOriginal={hasDiscount}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant={isInCart ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full flex-shrink-0",
              isInCart
                ? "border-brand-500 bg-brand-500 hover:bg-brand-600"
                : "border-gray-300 bg-white hover:border-brand-500 hover:bg-white"
            )}
            onClick={() => onAddToCart?.(product.id)}
            disabled={!product.inStock || addToCartMutation.isPending}
            aria-label={isInCart ? "Item in cart" : "Add to cart"}
          >
            {isInCart ? (
              <Check className="h-5 w-5 text-white" />
            ) : (
              <ShoppingCart className="h-5 w-5 text-brand-500" />
            )}
          </Button>
          {isInCart ? (
            <Button
              variant="default"
              className="flex-1 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white"
              onClick={handleViewCart}
            >
              View in Cart
            </Button>
          ) : (
            <Button
              variant="default"
              className="flex-1 h-10 rounded-full bg-brand-500 hover:bg-brand-600 text-white"
              onClick={handleBuyNow}
              disabled={!product.inStock || addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? 'Adding...' : 'Buy Now'}
            </Button>
          )}
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
