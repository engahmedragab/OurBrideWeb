'use client'

import { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { TestimonialCard } from './TestimonialCard'
import { Button } from './Button'
import { cn } from '@/lib/utils'
import type { TestimonialCardProps } from './TestimonialCard'

export interface TestimonialsSectionProps {
  title?: string
  testimonials: TestimonialCardProps[]
  className?: string
  showNavigation?: boolean
}

/**
 * TestimonialsSection Component
 * Horizontal scrolling section for displaying customer testimonials
 */
export const TestimonialsSection = ({
  title = 'Reviews',
  testimonials,
  className,
  showNavigation = true,
}: TestimonialsSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className={cn('py-12 sm:py-16 md:py-20 bg-white', className)}>
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-32 sm:text-40 md:text-48 font-bold text-gray-900">
            {title}
          </h2>

          {/* Navigation Buttons */}
          {showNavigation && testimonials.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronRight className="h-5 w-5 text-gray-700 rotate-180" />
              </button>
              <button
                onClick={scrollRight}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          )}
        </div>

        {/* Testimonials Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`testimonial-${testimonial.reviewerName}-${testimonial.title}-${index}`}
              {...testimonial}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
