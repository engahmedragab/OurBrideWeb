'use client'

import React from 'react'
import { CategoryCard } from '@/components/ui/CategoryCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export interface ProductCategory {
  id: string
  title: string
  description: string
  href: string
  icon?: string | React.ReactNode
}

export interface ProductCategoriesSectionProps {
  categories: ProductCategory[]
  className?: string
  // Header props
  topText?: string
  highlightText?: string
  bottomText?: string
  bottomHighlightText?: string
  headerAlignment?: 'left' | 'center' | 'right'
}

/**
 * ProductCategoriesSection Component
 * Displays a slider of product category cards
 */
export const ProductCategoriesSection = ({
  categories,
  className,
  topText = 'Choose',
  highlightText = 'From',
  bottomText = 'Our Product',
  bottomHighlightText = 'Categories',
  headerAlignment = 'center',
}: ProductCategoriesSectionProps) => {
  return (
    <section className={cn('py-12 md:py-20', className)}>
      {/* Section Header */}
      <div className="mb-12 md:mb-20">
        <SectionHeader
          topText={topText}
          highlightText={highlightText}
          bottomText={bottomText}
          bottomHighlightText={bottomHighlightText}
          alignment={headerAlignment}
        />
      </div>

      {/* Categories Slider */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          navigation={{
            nextEl: '.swiper-button-next-categories',
            prevEl: '.swiper-button-prev-categories',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-categories',
          }}
          className="!pb-12"
        >
          {categories.map(category => (
            <SwiperSlide key={category.id}>
              <CategoryCard
                id={category.id}
                title={category.title}
                description={category.description}
                href={category.href}
                icon={category.icon}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {/* <button
          className="swiper-button-prev-categories absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Previous categories"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
        <button
          className="swiper-button-next-categories absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Next categories"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button> */}

        {/* Custom Pagination */}
        {/* <div className="swiper-pagination-categories flex justify-center items-center gap-2 mt-8" /> */}
      </div>
    </section>
  )
}
