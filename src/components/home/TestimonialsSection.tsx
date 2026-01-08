"use client"

import { useMemo, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import type { Swiper as SwiperType } from "swiper"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, TestimonialCardData } from "../ui/Card"
import { TestimonialCardSkeleton } from "../ui/Skeleton"
import QuoteIcon from "@/assets/home/Quote"

interface TestimonialsHomeSectionProps {
  testimonials: TestimonialCardData[]
  isLoading: boolean
}

export default function TestimonialsHomeSection({
  testimonials,
  isLoading,
}: TestimonialsHomeSectionProps) {
  const swiperRef = useRef<SwiperType | null>(null)

  const [slidesPerView, setSlidesPerView] = useState(3)
  const [activeGroup, setActiveGroup] = useState(0)

  // pages based on real data (no loop)
  const totalPages = useMemo(() => {
    if (!testimonials?.length) return 0
    return Math.ceil(testimonials.length / slidesPerView)
  }, [testimonials?.length, slidesPerView])

  const goPrev = () => swiperRef.current?.slidePrev()
  const goNext = () => swiperRef.current?.slideNext()

  const updateActiveGroup = (swiper: SwiperType) => {
    const spv = Number(swiper.params.slidesPerView) || 1
    setSlidesPerView(spv)
    setActiveGroup(Math.floor(swiper.activeIndex / spv))
  }

  const Controls = ({ className = "" }: { className?: string }) => {
    const filledSteps = totalPages === 0 ? 0 : activeGroup + 1
    const stepsCount = Math.max(totalPages, 1)

    return (
      <div className={`flex items-center gap-3 md:gap-4 ${className}`}>
        <button
          onClick={goPrev}
          aria-label="Previous testimonials"
          disabled={activeGroup === 0}
          className={activeGroup === 0 ? "opacity-40 cursor-not-allowed" : ""}
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* ✅ Segments fill (حتة حتة حسب الصفحات) */}
        <div className="flex-1 flex items-center gap-2">
          {Array.from({ length: stepsCount }).map((_, i) => (
            <span
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i < filledSteps ? "bg-red-500" : "bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          aria-label="Next testimonials"
          disabled={activeGroup >= totalPages - 1}
          className={
            activeGroup >= totalPages - 1 ? "opacity-40 cursor-not-allowed" : ""
          }
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    )
  }

  return (
    <section className="container-custom py-12 md:py-16">
      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 mb-8 md:mb-12">
        {/* Left Side */}
        <div className="w-full lg:w-auto lg:flex-shrink-0 flex justify-center lg:justify-start">
          <div className="w-full lg:max-w-md text-center lg:text-left">
            <div className="mb-4 md:mb-6 flex flex-col items-center lg:items-start">
              <QuoteIcon />
              <p className="text-16 md:text-24 lg:text-4xl pt-5 font-normal text-gray-900 flex gap-1 md:block md:gap-0">
                <span className="block">What Our</span>
                <span className="block font-semibold text-gray-900">
                  Customers
                </span>
                <span className="block">Are Saying</span>
              </p>
            </div>

            {/* ✅ Desktop controls under the left text */}
            <Controls className="hidden lg:flex" />
          </div>
        </div>

        {/* Right Side - Swiper */}
        <div className="flex-1 w-full lg:w-auto min-w-0">
          {isLoading ? (
            <TestimonialCardSkeleton count={1} />
          ) : (
            <>
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper
                  updateActiveGroup(swiper)
                }}
                spaceBetween={24}
                slidesPerView={1}
                slidesPerGroup={1}
                loop={false}
                watchOverflow={true}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                onBreakpoint={(swiper) => {
                  swiper.update()
                  updateActiveGroup(swiper)
                }}
                onSlideChange={(swiper) => {
                  swiper.update()
                  updateActiveGroup(swiper)
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={`t-${index}`} className="h-auto">
                    <Card cardData={{ type: "testimonial", ...testimonial }} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* ✅ Mobile controls under cards */}
              <Controls className="mt-4 w-1/2 mx-auto lg:hidden" />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
