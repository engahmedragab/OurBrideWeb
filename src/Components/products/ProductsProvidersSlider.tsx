'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { RatingDisplay } from '@/components/ui/RatingDisplay'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

/**
 * Provider interface for products
 */
export interface Provider {
  id: string
  name: string
  profession: string
  verified: boolean
  rating: number
  image?: string
}

/**
 * Provider card style variants using cva
 */
const providerCardVariants = cva(
  'bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center gap-4 transition-all duration-200',
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

export interface ProductsProvidersSliderProps {
  providers: Provider[]
  className?: string
}

/**
 * ProductsProvidersSlider Component
 * 
 * Displays a slider of provider cards with Swiper.
 * Shows 3 cards per row on desktop, 2 on tablet, 1 on mobile.
 * Navigation buttons are vertically centered.
 */
export const ProductsProvidersSlider = ({
  providers,
  className,
}: ProductsProvidersSliderProps) => {
  const swiperRef = useRef<any>(null)

  if (providers.length === 0) {
    return null
  }

  return (
    <div className={cn('relative mb-12 md:mb-16', className)}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={providers.length > 3}
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
          nextEl: '.swiper-button-next-providers',
          prevEl: '.swiper-button-prev-providers',
        }}
        className="!pb-12"
      >
        {providers.map(provider => (
          <SwiperSlide key={provider.id}>
            <div className={providerCardVariants({ hover: true })}>
              {/* Provider Image */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-brand-50 bg-brand-100 p-2">
                <div className="relative w-full h-full rounded-full border-4 border-white overflow-hidden">
                  {provider.image ? (
                    <Image
                      src={provider.image}
                      alt={provider.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 128px, 160px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
              </div>

              {/* Provider Info */}
              <div className="flex flex-col gap-2 items-center text-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-18 md:text-20 font-medium text-gray-900">
                    {provider.name}
                  </h3>
                  {provider.verified && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-14 md:text-16 font-normal text-gray-600">
                  {provider.profession}
                </p>
                <RatingDisplay
                  rating={provider.rating}
                  size="sm"
                  showCount={false}
                  className="gap-1"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Vertically Centered */}
      {providers.length > 3 && (
        <>
          <button
            className="swiper-button-prev-providers absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Previous providers"
            onClick={() => swiperRef.current?.swiper?.slidePrev()}
          >
            <ChevronRight className="h-4 w-4 text-gray-700 rotate-180" />
          </button>
          <button
            className="swiper-button-next-providers absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-brand-50 hover:border-brand-500 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Next providers"
            onClick={() => swiperRef.current?.swiper?.slideNext()}
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
        </>
      )}
    </div>
  )
}
