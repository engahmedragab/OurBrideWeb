'use client'

import React, { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { useCartItems, useAddToCart, useWishlistItems, useFollowItems } from '@/hooks'
import {
  Heart,
  ShoppingCart,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Menu,
  Share2,
  UserPlus,
  Check,
  Star,
  User,
} from 'lucide-react'
import { RatingDisplay } from './RatingDisplay'
import { PriceDisplay } from './PriceDisplay'
import { useI18nTranslations, useIsRTL } from '@/i18n'

// Base card variants
const cardVariants = cva(
  'rounded-lg border bg-background shadow-md transition-shadow',
  {
    variants: {
      variant: {
        default: 'border-border',
        outlined: 'border-2 border-border',
        elevated: 'border-border shadow-lg',
        ghost: 'border-transparent shadow-none',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

export interface BaseCardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  className?: string
}

// Product Card Props
export interface ProductCardData {
  id: string
  image: string
  title: string
  providerName: string
  providerId?: string
  verified?: boolean
  rating: number
  originalPrice: number
  discountedPrice: number
  tags?: string[]
  showTopOfferBadge?: boolean
  isWishlisted?: boolean
  isFavorite?: boolean
  inStock?: boolean
  onWishlistToggle?: (e: React.MouseEvent) => void
  onFavoriteToggle?: (e: React.MouseEvent) => void
  onAddToCart?: (e: React.MouseEvent) => void
  isLoadingWishlist?: boolean
  isLoadingFavorite?: boolean
  isLoadingAddToCart?: boolean
}

// Service Card Props (same as Product)
export type ServiceCardData = ProductCardData

// Testimonial Card Props
export interface TestimonialCardData {
  quoteAr: string
  quoteEn: string
  rating: number
  authorNameAr: string
  authorNameEn: string
  authorImage: string
  timeAgo: string
}

// Provider Card Props
export interface ProviderCardData {
  id: string
  name: string
  image: string
  profession: string
  rating: number
  verified?: boolean
  isFollowed?: boolean
  isFavorite?: boolean
  onFollowToggle?: (e: React.MouseEvent) => void
  onFavoriteToggle?: (e: React.MouseEvent) => void
  isLoadingFollow?: boolean
  isLoadingFavorite?: boolean
}

// Member Testimonial Card Props
export interface MemberTestimonialCardData {
  authorName: string
  authorImage: string
  reviewText: string
  productImages: string[]
  date: string
  likes: number
  comments: number
  shares?: number
}

// Trust Card Props
export interface TrustCardData {
  heading: string
  description: string
  rotation?: number
  background?: 'white' | 'gray'
}

// Journey Step Props
export interface JourneyStepData {
  stepNumber: number
  title: string
  description: string
}

// Union type for all card data
export type CardData =
  | ({ type: 'product' } & ProductCardData)
  | ({ type: 'service' } & ServiceCardData)
  | ({ type: 'testimonial' } & TestimonialCardData)
  | ({ type: 'provider' } & ProviderCardData)
  | ({ type: 'member-testimonial' } & MemberTestimonialCardData)
  | ({ type: 'trust' } & TrustCardData)
  | ({ type: 'journey-step' } & JourneyStepData)

export interface CardProps extends BaseCardProps {
  cardData: CardData
}

// Product/Service Card Component
const ProductServiceCard = ({
  data,
  cardType,
}: {
  data: ProductCardData | ServiceCardData
  cardType: 'product' | 'service'
}) => {
  const [imageError, setImageError] = React.useState(false)
  const hasDiscount = data.discountedPrice < data.originalPrice
  const { isProductInCart, isServiceInCart } = useCartItems()
  const { isProductInWishlist, isServiceInWishlist } = useWishlistItems()
  const { isProductFollowed, isServiceFollowed } = useFollowItems()
  const t = useI18nTranslations('common')
  // Check if item is in cart
  const productId = parseInt(data.id, 10)
  const providerId = data.providerId ? parseInt(data.providerId, 10) : undefined
  const isInCart = cardType === 'product'
    ? isProductInCart(productId, providerId)
    : isServiceInCart(productId, providerId)

  // Check if item is in wishlist
  const isInWishlist = cardType === 'product'
    ? isProductInWishlist(productId)
    : isServiceInWishlist(productId)

  // Check if item is being followed
  const isFollowed = cardType === 'product'
    ? isProductFollowed(productId)
    : isServiceFollowed(productId)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Don't allow multiple clicks while loading
    if (data.isLoadingWishlist) return

    // Call the provided handler
    data.onWishlistToggle?.(e)
  }

  const router = useRouter()
  const addToCartMutation = useAddToCart()

  const handleProviderClick = (e: React.MouseEvent, providerId: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/provider/${providerId}`)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Don't allow multiple clicks while loading
    if (data.isLoadingAddToCart || addToCartMutation.isPending) return

    // Call the provided handler
    data.onAddToCart?.(e)
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (data.inStock === false || data.isLoadingAddToCart || addToCartMutation.isPending) return

    // If not in cart, add it first
    if (!isInCart && data.onAddToCart) {
      try {
        const productId = parseInt(data.id, 10)
        const providerId = data.providerId ? parseInt(data.providerId, 10) : undefined

        // Ensure providerId is available
        if (!providerId) {
          return
        }

        await addToCartMutation.mutateAsync({
          productId,
          quantity: 1,
          providerId,
          price: data.discountedPrice,
        })
        // Also call the provided handler if it exists
        data.onAddToCart(e)
      } catch (error) {
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return
    }
    const route = cardType === 'product' ? `/products/${data.id}` : `/services/category/${data.id}`
    router.push(route)
  }

  return (
    <div 
      className="group relative bg-transparent rounded-xl overflow-visible transition-shadow cursor-pointer flex flex-col border border-gray-200/70"
      onClick={handleCardClick}
    >
      {/* Action Icons - Floating above the card */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Wishlist Icon */}
        {data.onWishlistToggle && (
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={data.isLoadingWishlist}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 relative z-30',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'bg-gray-200/80 backdrop-blur-sm'
            )}
            aria-label={
              isInWishlist || data.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
            }
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                data.isLoadingWishlist && 'animate-pulse',
                isInWishlist || data.isWishlisted
                  ? 'text-brand-500'
                  : 'text-white'
              )}
            />
          </button>
        )}
      </div>

      {/* Image Container - 75% of card height */}
      <div className="relative flex-[3] min-h-[220px] sm:min-h-[260px] md:min-h-[280px] overflow-hidden bg-gray-100 custom-shaped-card flex items-center justify-center">
        {data.image && 
         data.image.trim() !== '' && 
         data.image !== '/' &&
         !data.image.includes('placeholder') &&
         data.image !== '/placeholder-product.png' &&
         data.image !== '/placeholder-service.png' &&
         data.image !== '/placeholder-membership.png' &&
         data.image !== '/placeholder-giftcard.png' &&
         data.image !== '/images/placeholder-product.png' &&
         !imageError ? (
          <Image
            src={data.image}
            alt={data.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-12 font-medium text-center">
              {t('noImageAvailable')}
            </span>
          </div>
        )}

        {/* Top Offers Badge */}
        {data.showTopOfferBadge && (
          <div className="absolute top-4 left-4 z-10">
            <Badge
              variant="default"
              className="!text-brand-500 border-0 px-2 py-1.5 text-16 font-normal rounded-full"
              style={{ backgroundColor: '#FCDBD7' }}
            >
              Top Offers
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3 space-y-2 relative bg-transparent rounded-b-xl flex-1">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <h3 className="text-16 sm:text-18 font-medium text-gray-900 line-clamp-2 leading-[22px] sm:leading-[24px]">
            {data.title}
          </h3>

          {/* Provider Name - Always clickable if providerId exists */}
          <div className="flex items-center gap-2 relative z-50">
            {data.providerId ? (
              <button
                type="button"
                onClick={(e) => handleProviderClick(e, data.providerId!)}
                className="text-14 sm:text-16 text-gray-500 hover:text-brand-500 transition-colors text-left pointer-events-auto cursor-pointer bg-transparent border-0 p-0"
              >
                {data.providerName}
              </button>
            ) : (
              <span className="text-14 sm:text-16 text-gray-500">{data.providerName}</span>
            )}
            {data.verified && (
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Rating - Converted to 1-10 scale */}
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-brand-500 text-brand-500" />
            <span className="text-14 sm:text-16 font-normal text-gray-500">
              {(data.rating / 5).toFixed(1)}
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-12 sm:text-14 font-normal text-gray-500 line-through">
                {data.originalPrice.toLocaleString()}
              </span>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-20 sm:text-24 font-semibold text-gray-900 leading-[28px] sm:leading-[32px]">
                {data.discountedPrice.toLocaleString()}
              </span>
              <span className="text-12 sm:text-14 font-normal text-gray-900">
                {t('currency')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {cardType === 'product' ? (
          <div className="flex items-center gap-2 pt-1">
            {data.onAddToCart && (
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-10 w-10 sm:h-12 sm:w-12 rounded-full border-brand-500 bg-white hover:bg-white",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                aria-label={isInCart ? "Item in cart" : "Add to cart"}
                onClick={handleAddToCart}
                disabled={data.isLoadingAddToCart || data.inStock === false}
              >
                {isInCart ? (
                  <Check
                    className={cn(
                      'h-5 w-5 sm:h-6 sm:w-6 text-brand-500',
                      data.isLoadingAddToCart && 'animate-pulse'
                    )}
                  />
                ) : (
                  <ShoppingCart
                    className={cn(
                      'h-5 w-5 sm:h-6 sm:w-6 text-brand-500',
                      data.isLoadingAddToCart && 'animate-pulse'
                    )}
                  />
                )}
              </Button>
            )}
            {isInCart ? (
              <Button
                variant="brand"
                size="default"
                className="flex-1 rounded-full !text-14 sm:text-20 font-normal bg-green-500 hover:bg-green-600 text-white h-10 sm:h-12"
                onClick={handleViewCart}
              >
                View in Cart
              </Button>
            ) : (
              <Button
                variant="brand"
                size="default"
                className="flex-1 rounded-full !text-14 sm:text-20 font-medium bg-brand-500 hover:bg-brand-600 text-white h-10 sm:h-12"
                onClick={handleBuyNow}
                disabled={data.inStock === false || data.isLoadingAddToCart || addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? t('pending') : t('buyNow')}
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant="brand"
            size="default"
            className="w-full rounded-full text-14 font-normal text-white h-12"
            asChild
          >
            <Link href={`/booking/${data.id}`}>{t('bookNow')}</Link>
          </Button>
        )}

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {data.tags.slice(0, 4).map((tag, index) => (
              <span
                key={`tag-${data.id || 'product'}-${tag}-${index}`}
                className="px-2 py-2 rounded-full bg-gray-50 text-14 font-normal text-gray-900"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Testimonial Card Component
const TestimonialCard = ({ data }: { data: TestimonialCardData }) => {
  const [imageError, setImageError] = React.useState(false)
  const isRtl = useIsRTL();
  const t = useI18nTranslations('common')
  console.log({data})
  return (
    <div className="flex flex-col h-full ">
      {/* Card */}
      <div className="bg-white border border-gray300/40 rounded-xl p-6 md:p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow flex-1">
        {/* Quote */}
        <p className="text-16 text-gray-900 mb-6 flex-1 leading-relaxed">
          &quot;{isRtl ? data.quoteAr : data.quoteEn}&quot;
        </p>

        {/* Stars - All red for 5-star rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={`star-${ isRtl ? data.authorNameAr : data.authorNameEn}-${index}`} className="h-5 w-5 fill-red-500 text-red-500" />
          ))}
        </div>
      </div>

      {/* Author Info - Below the card */}
      <div className="flex items-center gap-3 mt-4 ml-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          {data.authorImage && data.authorImage.trim() !== '' && !imageError ? (
            <Image
              src={data.authorImage}
              alt={data.authorNameEn}
              fill
              sizes="48px"
              className="object-cover grayscale"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <p className="text-16 font-semibold text-gray-900">
            { isRtl ? data.authorNameAr :  data.authorNameEn}
          </p>
          <p className="text-14 text-gray-500">{data.timeAgo || t('recently')}</p>
        </div>
      </div>
    </div>
  )
}

// Provider Card Component
const ProviderCard = ({ data }: { data: ProviderCardData }) => {
  const isRTL = useIsRTL()
  const [imageError, setImageError] = React.useState(false)
  const t = useI18nTranslations('common')
  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Don't allow multiple clicks while loading
    if (data.isLoadingFollow) return

    // Call the provided handler
    data.onFollowToggle?.(e)
  }

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Don't allow multiple clicks while loading
    if (data.isLoadingFavorite) return

    // Call the provided handler
    data.onFavoriteToggle?.(e)
  }

  return (
    <div className="group relative bg-white rounded-xl p-6 md:p-8 text-center flex flex-col items-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Action Icons - Floating above the card */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Favorite Icon */}
        {data.onFavoriteToggle && (
          <button
            type="button"
            onClick={handleFavoriteToggle}
            disabled={data.isLoadingFavorite}
            className={cn(
              'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 relative z-30',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              data.isFavorite
                ? 'border-brand-500 bg-brand-500'
                : 'border-gray-300 bg-white hover:border-brand-500 hover:bg-brand-50'
            )}
            aria-label={
              data.isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Star
              className={cn(
                'h-4 w-4 transition-colors',
                data.isLoadingFavorite && 'animate-pulse',
                data.isFavorite
                  ? 'fill-white text-white'
                  : 'fill-gray-300 text-gray-400'
              )}
            />
          </button>
        )}

        {/* Follow Icon */}
        {data.onFollowToggle && (
          <button
            type="button"
            onClick={handleFollowToggle}
            disabled={data.isLoadingFollow}
            className={cn(
              'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 relative z-30',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              data.isFollowed
                ? 'border-brand-500 bg-brand-500'
                : 'border-gray-300 bg-white hover:border-brand-500 hover:bg-brand-50'
            )}
            aria-label={data.isFollowed ? 'Unfollow' : 'Follow'}
          >
            <UserPlus
              className={cn(
                'h-4 w-4 transition-colors',
                data.isLoadingFollow && 'animate-pulse',
                data.isFollowed
                  ? 'fill-white text-white'
                  : 'fill-gray-300 text-gray-400'
              )}
            />
          </button>
        )}
      </div>

      {/* Profile Image - Clickable */}
      <Link
        href={`/provider/${data.id}`}
        className="relative w-20 h-20 md:w-24 md:h-24 mb-4 block hover:opacity-90 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        {data.image && data.image.trim() !== '' && !imageError ? (
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="(max-width: 768px) 80px, 96px"
            className="rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-10 font-medium">
              {t('noImageAvailable')}
            </span>
          </div>
        )}
      </Link>

      {/* Name with Verification - Clickable */}
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Link
          href={`/provider/${data.id}`}
          className="text-18 font-semibold text-gray-900 hover:text-brand-500 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {data.name}
        </Link>
        {data.verified && (
          <Link
            href={`/provider/${data.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0"
            aria-label="Verified provider"
          >
            <CheckCircle2 className="h-5 w-5 text-blue-500 hover:text-blue-600 transition-colors" />
          </Link>
        )}
      </div>

      {/* Profession */}
      <p className="text-14 text-gray-600 mb-4">{data.profession}</p>

      {/* Stars */}
      <div className="flex items-center justify-center gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              'h-4 w-4',
              index < data.rating
                ? 'fill-brand-500 text-brand-500'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>

      {/* Contact Button */}
      <Button
        variant="brand"
        size="default"
        className="w-full mb-3 rounded-full text-16 font-semibold text-white"
      >
        Contact
      </Button>

      {/* View Profile Link */}
      <Link
        href={`/providers/${data.id}`}
        className="text-14 text-brand hover:text-brand-500 transition-colors flex items-center gap-1"
      >
        View Profile
        <ArrowRight className={cn("h-4 w-4", isRTL && "scale-x-[-1]")} />
      </Link>
    </div>
  )
}

// Member Testimonial Card Component
const MemberTestimonialCard = ({
  data,
}: {
  data: MemberTestimonialCardData
}) => {
  const [imageErrors, setImageErrors] = React.useState<Set<number>>(new Set())
  const mainImage = data.productImages[0]
  const thumbnailImages = data.productImages.slice(1, 3)
  const t = useI18nTranslations('common')
  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Author Header */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            {data.authorImage && data.authorImage.trim() !== '' && !imageErrors.has(-1) ? (
              <Image
                src={data.authorImage}
                alt={data.authorName}
                fill
                sizes="48px"
                className="object-cover grayscale"
                onError={() => setImageErrors(prev => new Set(prev).add(-1))}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-16 font-semibold text-gray-900">
              {data.authorName}
            </h4>
            <p className="text-14 text-gray-500">{data.date}</p>
          </div>
        </div>
        <button
          type="button"
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="More options"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Review Text */}
      <p className="text-14 md:text-16 text-gray-700 mb-4 line-clamp-3 flex-shrink-0">
        {data.reviewText}
      </p>

      {/* Product Images */}
      <div className="mb-4 flex-shrink-0">
        {data.productImages.length === 1 ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            {mainImage && mainImage.trim() !== '' && !imageErrors.has(0) ? (
              <Image
                src={mainImage}
                alt="Product"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                onError={() => setImageErrors(prev => new Set(prev).add(0))}
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-12 font-medium text-center px-2">
                  {t('noImageAvailable')}
                </span>
              </div>
            )}
          </div>
        ) : data.productImages.length > 1 ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              {mainImage && mainImage.trim() !== '' && !imageErrors.has(0) ? (
                <Image
                  src={mainImage}
                  alt="Product"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  onError={() => setImageErrors(prev => new Set(prev).add(0))}
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-12 font-medium text-center px-2">
                    {t('noImageAvailable')}
                  </span>
                </div>
              )}
            </div>
            {thumbnailImages.length > 0 && (
              <div className="flex flex-col gap-2">
                {thumbnailImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative flex-1 aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    {image && image.trim() !== '' && !imageErrors.has(index + 1) ? (
                      <Image
                        src={image}
                        alt={`Product ${index + 2}`}
                        fill
                        sizes="(max-width: 768px) 33vw, 25vw"
                        className="object-cover"
                        onError={() => setImageErrors(prev => new Set(prev).add(index + 1))}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-10 font-medium text-center px-1">
                          {t('noImageAvailable')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-12 font-medium text-center px-2">
                {t('noImageAvailable')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Engagement Metrics - Pill-shaped buttons */}
      <div className="flex items-center justify-center gap-4 mt-auto flex-shrink-0">
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <Heart className="h-4 w-4 text-gray-400" />
          <span className="text-14 text-gray-600">{data.likes}</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="h-4 w-4 text-gray-400" />
          <span className="text-14 text-gray-600">{data.comments}</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <Share2 className="h-4 w-4 text-gray-400" />
          <span className="text-14 text-gray-600">{data.shares || 20}</span>
        </button>
      </div>
    </div>
  )
}

// Trust Card Component
const TrustCard = ({ data }: { data: TrustCardData }) => {
  const backgroundColor = data.background === 'gray' ? '#F4F4F6' : 'white'

  return (
    <div
      className="rounded-xl shadow-md p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-[360px] md:h-[400px] flex flex-col items-center justify-center text-center"
      style={{
        transform: `rotate(${data.rotation || 0}deg)`,
        backgroundColor,
      }}
    >
      <h3 className="text-20 md:text-24 font-normal text-gray-900 mb-3">
        {data.heading}
      </h3>
      <p className="text-16 text-gray-600 leading-relaxed">
        {data.description}
      </p>
    </div>
  )
}

// Journey Step Component
const JourneyStep = ({
  data,
  className,
}: {
  data: JourneyStepData
  className?: string
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Step Circle */}
      <div className="relative">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-500 flex items-center justify-center shadow-lg">
          <span className="text-24 md:text-32 font-black text-white">
            {data.stepNumber}
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="text-center max-w-[280px]">
        <h3 className="text-16 md:text-18 font-semibold text-gray-900 mb-2">
          {data.title}
        </h3>
        <p className="text-14 md:text-16 text-gray-600 leading-relaxed">
          {data.description}
        </p>
      </div>
    </div>
  )
}

// Main Card Component
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ cardData, className, ...props }, ref) => {
    const t = useI18nTranslations('common')
    // Guard against undefined cardData
    if (!cardData) {
      console.warn('Card component requires cardData prop')
      return null
    }

    const renderCardContent = () => {
      switch (cardData.type) {
        case 'product':
          return <ProductServiceCard data={cardData} cardType="product" />
        case 'service':
          return <ProductServiceCard data={cardData} cardType="service" />
        case 'testimonial':
          return <TestimonialCard data={cardData} />
        case 'provider':
          return <ProviderCard data={cardData} />
        case 'member-testimonial':
          return <MemberTestimonialCard data={cardData} />
        case 'trust':
          return <TrustCard data={cardData} />
        case 'journey-step':
          return <JourneyStep data={cardData} className={className} />
        default:
          return null
      }
    }

    // Journey steps don't need wrapper, others do
    if (cardData.type === 'journey-step') {
      return renderCardContent()
    }

    return (
      <div ref={ref} className={className} {...props}>
        {renderCardContent()}
      </div>
    )
  }
)
Card.displayName = 'Card'

// Generic Card Components (for backward compatibility and custom use)
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5', className)}
        {...props}
      />
    )
  }
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-foreground-secondary', className)}
      {...props}
    />
  )
})
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('', className)} {...props} />
  }
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center', className)}
        {...props}
      />
    )
  }
)
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
}
