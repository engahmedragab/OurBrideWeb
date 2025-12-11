'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// Import fallback image
import fallbackImage from '@/assets/images/productintro.png'

/**
 * Navigation button variants using cva
 * Uses existing brand-500 primary color from theme
 * Background is primary color with white icons
 */
const navigationButtonVariants = cva(
  'absolute top-1/2 -translate-y-1/2 z-10 rounded-full bg-brand-500 shadow-md flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      intent: {
        primary: 'text-white hover:bg-brand-600 hover:scale-110',
        secondary: 'text-white hover:bg-brand-600 hover:scale-110',
      },
      size: {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
)

export interface ProductsHeroSliderProps {
  /**
   * Optional array of image URLs for the slider
   * If not provided or empty, uses fallback image
   */
  images?: string[]
  /**
   * Additional className for the container
   */
  className?: string
}

/**
 * ProductsHeroSlider Component
 * 
 * A responsive image slider banner for the Products page.
 * Uses Swiper for smooth horizontal looping slider functionality.
 * 
 * Features:
 * - Responsive: 1 slide on mobile, 2 on tablet, 3 on desktop
 * - Looping slider with smooth transitions
 * - Custom navigation buttons with cva styling
 * - Fallback image support when no images provided
 * - Maintains aspect ratio without distortion
 */
export const ProductsHeroSlider = ({
  images,
  className,
}: ProductsHeroSliderProps) => {
  const swiperRef = useRef<{ swiper: SwiperType } | null>(null)

  // Use provided images or fallback to single image repeated
  // Handle both string URLs and imported image objects (StaticImageData)
  const getFallbackImageUrl = (): string => {
    // Next.js imported images are StaticImageData objects with a 'src' property
    if (typeof fallbackImage === 'object' && 'src' in fallbackImage) {
      return fallbackImage.src
    }
    // Fallback to string if it's already a string
    return typeof fallbackImage === 'string' ? fallbackImage : ''
  }

  // Use provided images or fallback to single image repeated multiple times for slider effect
  const fallbackUrl = getFallbackImageUrl()
  const sliderImages =
    images && images.length > 0
      ? images
      : [fallbackUrl, fallbackUrl, fallbackUrl] // Repeat fallback for slider effect

  // Ensure we have at least one image
  const finalImages =
    sliderImages.length > 0 && sliderImages[0] ? sliderImages : [fallbackUrl]

  return (
    <section
      className={cn(
        'relative w-full  mb-1',
        className
      )}
    >
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[360px] lg:h-[440px]  overflow-hidden">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          loop={finalImages.length > 1}
          className="h-full w-full"
          style={{ width: '100%' }}
        >
            {finalImages.map((imageUrl, index) => (
              <SwiperSlide key={index} className="!h-full !flex-shrink-0">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`Product banner ${index + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>

        {/* Navigation Buttons */}
        {finalImages.length > 1 && (
          <>
            <button
              onClick={() => swiperRef.current?.swiper?.slidePrev()}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 z-10 rounded-full bg-brand-500 shadow-md flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                'text-white hover:bg-brand-600 hover:scale-110',
                'w-4 h-4 sm:w-10 sm:h-10',
                'left-2 sm:left-4'
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-2 w-2 sm:h-5 sm:w-5 text-white" />
            </button>
            <button
              onClick={() => swiperRef.current?.swiper?.slideNext()}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 z-10 rounded-full bg-brand-500 shadow-md flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                'text-white hover:bg-brand-600 hover:scale-110',
                'w-4 h-4 sm:w-10 sm:h-10',
                'right-2 sm:right-4'
              )}
              aria-label="Next slide"
            >
              <ChevronRight className="h-2 w-2 sm:h-5 sm:w-5 text-white" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}

