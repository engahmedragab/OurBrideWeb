'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { SwiperRef } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { ChevronRight } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { useIsRTL } from '@/i18n'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

/**
 * Product interface
 */
export interface Product {
  id: string
  title: string
  image: string
  rating: number
  price: number
  currency: string
  href: string
  ctaText?: string
}

/**
 * Product card style variants using cva
 * Compact design with image on left (1/4 width) and content on right
 */
const productCardVariants = cva(
  'bg-white border border-gray-100 rounded-lg overflow-hidden flex transition-all duration-200 h-24 md:h-28',
  {
    variants: {
      hover: {
        true: 'hover:shadow-lg hover:border-brand-200',
        false: '',
      },
    },
    defaultVariants: {
      hover: true,
    },
  }
)

/**
 * CTA text style variants using cva
 */
const ctaTextVariants = cva(
  'text-12 md:text-14 font-normal transition-colors',
  {
    variants: {
      intent: {
        primary: 'text-brand-500 hover:text-brand-600',
        secondary: 'text-gray-600 hover:text-gray-900',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
)

export interface ServicesProductsSliderProps {
  products: Product[]
  className?: string
}

/**
 * ServicesProductsSlider Component
 * 
 * Displays a slider of compact product cards with Swiper.
 * Shows 3 cards per row on desktop, 2 on tablet, 1 on mobile.
 * Each card has image on left (1/4 width) and content on right.
 * Navigation buttons are vertically centered.
 */
// Component to handle image errors per product
const ProductCard = ({ product }: { product: Product }) => {
  const [imageError, setImageError] = React.useState(false)
  
  return (
    <Link href={product.href} className={productCardVariants({ hover: true })}>
      {/* Product Image - Left side, ~1/4 width, full height */}
      <div className="relative w-1/4 flex-shrink-0 h-full">
        {product.image && !imageError ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover rounded-l-lg"
            sizes="(max-width: 640px) 25vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-10 font-medium">
              No image available
            </span>
          </div>
        )}
      </div>

      {/* Product Info - Right side, compact layout */}
      <div className="flex-1 p-3 md:p-4 flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-13 md:text-15 font-medium text-gray-900 leading-tight line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-between gap-2">
            {/* Rating and Price on same line */}
            <RatingDisplay
              rating={product.rating}
              size="sm"
              format="value-only"
              variant="compact"
              showValue={true}
              className="gap-1"
            />
            <PriceDisplay
              discounted={product.price}
              currency={product.currency}
              size="md"
              variant="inline"
              showOriginal={false}
              discountedClassName="text-14 md:text-16 font-semibold"
            />
          </div>
        </div>
        <div className={ctaTextVariants({ intent: 'primary' })}>
          {product.ctaText || 'Explore Now'}
        </div>
      </div>
    </Link>
  )
}

export const ServicesProductsSlider = ({
  products,
  className,
}: ServicesProductsSliderProps) => {
  const swiperRef = useRef<SwiperRef | null>(null)
  const isRTL = useIsRTL()

  if (products.length === 0) {
    return null
  }

  return (
    <div className={cn('relative', className)}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={products.length > 3}
        dir={isRTL ? 'rtl' : 'ltr'}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        navigation={{
          nextEl: '.swiper-button-next-products',
          prevEl: '.swiper-button-prev-products',
        }}
        className="!pb-12"
      >
        {products.map(product => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Vertically Centered */}
      {products.length > 3 && (
        <>
          <button
            className={cn(
              "swiper-button-prev-products absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110",
              isRTL ? "right-0" : "left-0"
            )}
            aria-label={isRTL ? "Next products" : "Previous products"}
            onClick={() => swiperRef.current?.swiper?.[isRTL ? 'slideNext' : 'slidePrev']()}
          >
            <ChevronRight className={cn("h-5 w-5 text-gray-700", isRTL ? "rotate-0" : "rotate-180")} />
          </button>
          <button
            className={cn(
              "swiper-button-next-products absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110",
              isRTL ? "left-0" : "right-0"
            )}
            aria-label={isRTL ? "Previous products" : "Next products"}
            onClick={() => swiperRef.current?.swiper?.[isRTL ? 'slidePrev' : 'slideNext']()}
          >
            <ChevronRight className={cn("h-5 w-5 text-gray-700", isRTL && "rotate-180")} />
          </button>
        </>
      )}
    </div>
  )
}

