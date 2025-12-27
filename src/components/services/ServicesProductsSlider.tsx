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
export const ServicesProductsSlider = ({
  products,
  className,
}: ServicesProductsSliderProps) => {
  const swiperRef = useRef<SwiperRef | null>(null)

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
            <Link href={product.href}>
              <div className={productCardVariants({ hover: true })}>
                {/* Product Image - Left side, ~1/4 width, full height */}
                <div className="relative w-1/4 flex-shrink-0 h-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover rounded-l-lg"
                    sizes="(max-width: 640px) 25vw, 25vw"
                  />
                </div>

                {/* Product Info - Right side, compact layout */}
                <div className="flex-1 p-3 md:p-4 flex flex-col justify-between gap-2">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-13 md:text-15 font-medium text-gray-900 leading-tight line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      {/* Rating and Price on same line */}
                      <div className="flex items-center gap-1.5">
                        <RatingDisplay
                          rating={product.rating}
                          size="sm"
                          showCount={false}
                          className="gap-0.5"
                        />
                        <span className="text-11 font-normal text-gray-500">
                          {product.rating}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-14 md:text-16 font-semibold text-gray-900">
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-11 font-normal text-gray-900">
                          {product.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={ctaTextVariants({ intent: 'primary' })}>
                    {product.ctaText || 'Explore Now'}
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Vertically Centered */}
      {products.length > 3 && (
        <>
          <button
            className="swiper-button-prev-products absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Previous products"
            onClick={() => swiperRef.current?.swiper?.slidePrev()}
          >
            <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
          </button>
          <button
            className="swiper-button-next-products absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Next products"
            onClick={() => swiperRef.current?.swiper?.slideNext()}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </>
      )}
    </div>
  )
}

