'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n'

export interface HeroSlide {
  id: string
  label: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
  productImage: string
  discountText?: string
}

export interface HeroCarouselProps {
  slides: HeroSlide[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
  showBackground?: boolean
}

export const HeroCarousel = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
  showBackground = true,
}: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  const tC = useI18nTranslations('common')
  const isRTL= useIsRTL()
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, slides.length])

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (slides.length === 0) return null

  const currentSlide = slides[currentIndex]

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <div className="relative">
        {/* Carousel Slide */}
        <div
          className={cn(
            'relative min-h-[280px] md:min-h-[350px] lg:min-h-[420px]',
            showBackground && 'bg-gradient-to-br from-brand-100 to-brand-200'
          )}
        >
          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={isRTL ? goToNext : goToPrevious}
                className={cn(
                  "absolute top-3/4 -translate-y-1/2 md:top-1/2 md:-translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg",
                  isRTL ? "right-4 md:right-6" : "left-4 md:left-6"
                )}
                aria-label={isRTL ? "Next slide" : "Previous slide"}
              >
                <ChevronLeft className={cn("h-6 w-6 md:h-7 md:w-7", isRTL && "rotate-180")} />
              </button>
              <button
                onClick={isRTL ? goToPrevious : goToNext}
                className={cn(
                  "absolute top-3/4 -translate-y-1/2 md:top-1/2 md:-translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg",
                  isRTL ? "left-4 md:left-6" : "right-4 md:right-6"
                )}
                aria-label={isRTL ? "Previous slide" : "Next slide"}
              >
                <ChevronRight className={cn("h-6 w-6 md:h-7 md:w-7", isRTL && "rotate-180")} />
              </button>
            </>
          )}

          {/* Content Container */}
          <div className="w-full h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[280px] md:min-h-[350px] lg:min-h-[420px] py-0 lg:py-0 w-full h-full pb-16 md:pb-0">

    
    {/* Right Column - Visual (50%) */}
    <div className="relative flex items-center justify-center h-full w-full overflow-hidden order-1 md:order-2">
      {/* Product Image - Full Width and Height for 50% column */}
      <div className="relative w-full h-full min-h-[220px] sm:min-h-[260px] md:min-h-[350px] lg:min-h-[420px] overflow-hidden">

        {currentSlide.productImage && !imageErrors.has(currentIndex) ? (
          typeof currentSlide.productImage === 'string' && currentSlide.productImage.endsWith('.svg') ? (
            <img
              src={currentSlide.productImage}
              alt={currentSlide.title}
              className="w-full h-full object-contain"
              onError={() => setImageErrors(prev => new Set(prev).add(currentIndex))}
            />
          ) : (
            <Image
              src={currentSlide.productImage}
              alt={currentSlide.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority={currentIndex === 0}
              onError={() => setImageErrors(prev => new Set(prev).add(currentIndex))}
            />
          )
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-14 font-medium">
              {tC('noImageAvailable')}
            </span>
          </div>
        )}
      </div>
    </div>

    {/* Left Column - Content (50%) */}
    <div
      className={cn(
        "container-custom flex flex-col justify-center space-y-6 h-full w-full py-6 md:py-8 order-2 md:order-1",
        // Mobile: centered text + remove big left padding
        "text-center lg:text-left px-6 md:px-0 md:pl-20 lg:pl-24",
        // RTL paddings from md+
        isRTL && "md:pl-0 md:pr-20 lg:pr-24"
      )}
    >
      {/* New Arrival Label */}
      <div className={cn(isRTL ? "md:text-right" : "md:text-left")}>
        <span className="inline-block text-12 md:text-14 font-semibold uppercase tracking-wider text-brand-500">
          {currentSlide.label}
        </span>
      </div>

      {/* Main Heading */}
      <h1 className={cn(
        "text-32 md:text-40 lg:text-48 xl:text-56 font-semibold text-gray-900 leading-tight",
        isRTL ? "md:text-right" : "md:text-left"
      )}>
        {currentSlide.title}
      </h1>

      {/* Description */}
      <p className={cn(
        "text-14 md:text-16 lg:text-18 text-gray-500 leading-relaxed max-w-xl mx-auto md:mx-0",
        isRTL ? "md:text-right" : "md:text-left"
      )}>
        {currentSlide.description}
      </p>

      {/* CTA Button */}
      <div className={cn(
        "pt-2 flex justify-center md:justify-start",
        isRTL ? "md:text-right " : "md:text-left "
      )}>
        <Link href={currentSlide.ctaLink}>
          <Button
            variant="default"
            size="md"
            className="h-10 md:h-11 px-6 md:px-8 rounded-full !text-white text-14 md:text-16 font-semibold transition-all duration-200 hover:scale-105 shadow-md"
          >
            {currentSlide.ctaText}
          </Button>
        </Link>
      </div>
    </div>

  </div>
</div>

        </div>

        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  index === currentIndex
                    ? 'bg-brand-500 w-8'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
