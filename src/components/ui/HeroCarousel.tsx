'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
                onClick={goToPrevious}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
              </button>
            </>
          )}

          {/* Content Container */}
          <div className="w-full h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[280px] md:min-h-[350px] lg:min-h-[420px] py-0 lg:py-0 w-full h-full">
              {/* Left Column - Content (50%) */}
              <div className="container-custom flex flex-col justify-center space-y-6 text-center lg:text-left h-full w-full py-6 md:py-8 pl-16 md:pl-20 lg:pl-24">
                {/* New Arrival Label */}
                <div>
                  <span className="inline-block text-12 md:text-14 font-semibold uppercase tracking-wider text-brand-500">
                    {currentSlide.label}
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-32 md:text-40 lg:text-48 xl:text-56 font-semibold text-gray-900 leading-tight">
                  {currentSlide.title}
                </h1>

                {/* Description */}
                <p className="text-14 md:text-16 lg:text-18 text-gray-500 leading-relaxed max-w-xl">
                  {currentSlide.description}
                </p>

                {/* CTA Button */}
                <div className="pt-2">
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

              {/* Right Column - Visual (50%) */}
              <div className="relative flex items-center justify-center h-full w-full overflow-hidden">
                {/* Discount Text Background */}
                

                {/* Product Image - Full Height, 50% Width */}
                <div className="relative z-10 w-full h-full">
                  {currentSlide.productImage && !imageErrors.has(currentIndex) ? (
                    typeof currentSlide.productImage === 'string' && currentSlide.productImage.endsWith('.svg') ? (
                      // Render SVG directly using img tag for better compatibility
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
                        className="object-contain w-full h-full"
                        priority={currentIndex === 0}
                        onError={() => setImageErrors(prev => new Set(prev).add(currentIndex))}
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400 text-14 font-medium">
                        No image available
                      </span>
                    </div>
                  )}
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
