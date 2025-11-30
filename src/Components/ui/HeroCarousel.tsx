import { useState, useEffect } from 'react'
import Link from 'next/link'
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
}

export const HeroCarousel = ({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

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
          className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] bg-gradient-to-br from-brand-100 to-brand-200"
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
          <div className="container-custom h-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px] py-8 md:py-12">
              {/* Left Column - Content (40%) */}
              <div className="lg:col-span-2 flex flex-col justify-center space-y-6 text-center lg:text-left">
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
                      size="lg"
                      className="h-12 md:h-14 px-8 md:px-10 rounded-full !text-white text-16 md:text-18 font-semibold transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      {currentSlide.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column - Visual (60%) */}
              <div className="lg:col-span-3 relative flex items-center justify-end h-full min-h-[300px] md:min-h-[400px] pr-4 md:pr-8">
                {/* Discount Text Background */}
                {currentSlide.discountText && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-0">
                    <span className="text-[120px] md:text-[180px] lg:text-[240px] font-black text-brand-200 leading-none opacity-60 select-none">
                      {currentSlide.discountText}
                    </span>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative z-10 transform rotate-[-8deg] md:rotate-[-6deg] hover:rotate-[-4deg] transition-transform duration-300">
                  <img
                    src={currentSlide.productImage}
                    alt={currentSlide.title}
                    className="w-full max-w-[200px] md:max-w-[280px] lg:max-w-[350px] h-auto object-contain drop-shadow-2xl"
                  />
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

