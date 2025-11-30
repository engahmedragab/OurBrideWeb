import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import {
  Heart,
  ShoppingCart,
  Star,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
} from 'lucide-react'

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
  verified?: boolean
  rating: number
  originalPrice: number
  discountedPrice: number
  tags?: string[]
  showTopOfferBadge?: boolean
  isWishlisted?: boolean
  onWishlistToggle?: () => void
}

// Service Card Props (same as Product)
export type ServiceCardData = ProductCardData

// Testimonial Card Props
export interface TestimonialCardData {
  quote: string
  rating: number
  authorName: string
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
  const hasDiscount = data.discountedPrice < data.originalPrice

  return (
    <div className="group relative bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Offers Badge */}
        {data.showTopOfferBadge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant="default"
              className="bg-brand-400 !text-white border-0 px-3 py-1 text-12 font-normal rounded-full"
            >
              Top Offers
            </Badge>
          </div>
        )}

        {/* Wishlist Icon */}
        <button
          onClick={data.onWishlistToggle}
          className={cn(
            'absolute top-3 right-3 z-10 w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center transition-colors',
            data.isWishlisted
              ? 'border-brand-500 bg-brand-50'
              : 'hover:border-brand-300 hover:bg-gray-50'
          )}
          aria-label={
            data.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
          }
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              data.isWishlisted
                ? 'fill-brand-500 text-brand-500'
                : 'text-gray-400'
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-16 font-semibold text-gray-900 line-clamp-2">
          {data.title}
        </h3>

        {/* Provider Name */}
        <div className="flex items-center gap-1.5">
          <span className="text-14 text-gray-600">{data.providerName}</span>
          {data.verified && (
            <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
          <span className="text-14 font-medium text-gray-900">
            {data.rating}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          {hasDiscount && (
            <span className="text-14 font-normal text-gray-400 line-through">
              {data.originalPrice.toLocaleString()} egp
            </span>
          )}
          <span className="text-18 font-normal text-gray-900">
            {data.discountedPrice.toLocaleString()} egp
          </span>
        </div>

        {/* Action Buttons */}
        {cardType === 'product' ? (
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-gray-300 bg-white hover:border-brand-500 hover:bg-white"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4 text-brand-500" />
            </Button>
            <Button
              variant="brand"
              size="default"
              className="flex-1 rounded-full text-14 font-normal text-white"
              asChild
            >
              <Link href={`/products/${data.id}`}>Buy Now</Link>
            </Button>
          </div>
        ) : (
          <Button
            variant="brand"
            size="default"
            className="w-full rounded-full text-14 font-normal text-white"
            asChild
          >
            <Link href={`/services/${data.id}`}>Book Now</Link>
          </Button>
        )}

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-md bg-gray-100 text-12 font-medium text-gray-700"
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
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 h-full flex flex-col border border-gray-100 shadow-md">
      {/* Quote */}
      <p className="text-16 text-gray-900 mb-6 flex-1 leading-relaxed">
        &quot;{data.quote}&quot;
      </p>

      {/* Stars - All red for 5-star rating */}
      <div className="flex items-center gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-5 w-5 fill-red-500 text-red-500" />
        ))}
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <img
          src={data.authorImage}
          alt={data.authorName}
          className="w-12 h-12 rounded-full object-cover grayscale"
        />
        <div>
          <p className="text-16 font-semibold text-gray-900">
            {data.authorName}
          </p>
          <p className="text-14 text-gray-500">{data.timeAgo}</p>
        </div>
      </div>
    </div>
  )
}

// Provider Card Component
const ProviderCard = ({ data }: { data: ProviderCardData }) => {
  return (
    <div className="bg-gray-100 rounded-xl p-6 md:p-8 text-center flex flex-col items-center">
      {/* Profile Image */}
      <img
        src={data.image}
        alt={data.name}
        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mb-4"
      />

      {/* Name with Verification */}
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <h3 className="text-18 font-semibold text-gray-900">{data.name}</h3>
        {data.verified && (
          <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
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
        <ArrowRight className="h-4 w-4" />
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
  const mainImage = data.productImages[0]
  const thumbnailImages = data.productImages.slice(1, 3)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={data.authorImage}
          alt={data.authorName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="text-16 font-semibold text-gray-900">
            {data.authorName}
          </h4>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-14 md:text-16 text-gray-700 mb-4 line-clamp-3">
        {data.reviewText}
      </p>

      {/* Product Images */}
      <div className="mb-4">
        {data.productImages.length === 1 ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={mainImage}
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={mainImage}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            {thumbnailImages.length > 0 && (
              <div className="flex flex-col gap-2">
                {thumbnailImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date */}
      <p className="text-12 text-gray-500 mb-3">{data.date}</p>

      {/* Engagement Metrics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-gray-400" />
          <span className="text-14 text-gray-600">{data.likes}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-gray-400" />
          <span className="text-14 text-gray-600">{data.comments}</span>
        </div>
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
