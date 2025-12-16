'use client'

import { cn } from '@/lib/utils'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

export interface CategoryFilter {
  id: string
  name: string
}

export interface CategoryFilterChipsProps {
  categories: CategoryFilter[]
  selectedCategoryId?: string
  onSelectCategory: (categoryId: string) => void
  className?: string
}

export const CategoryFilterChips = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  className,
}: CategoryFilterChipsProps) => {
  return (
    <div className={cn('w-full', className)}>
      <Swiper
       modules={[Navigation, Pagination ]}
        slidesPerView="auto"
        spaceBetween={8}
        className="!pb-2"
      >
        {/* All Category */}
        <SwiperSlide className="!w-auto">
          <button
            onClick={() => onSelectCategory('all')}
            className={cn(
              'px-4 py-2 rounded-full text-14 font-medium transition-all duration-200',
              'whitespace-nowrap',
              selectedCategoryId === 'all' || !selectedCategoryId
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            All
          </button>
        </SwiperSlide>

        {/* Category Chips */}
        {categories.map(category => {
          const isSelected = selectedCategoryId === category.id
          return (
            <SwiperSlide key={category.id} className="!w-auto">
              <button
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-14 font-medium transition-all duration-200',
                  'whitespace-nowrap',
                  isSelected
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {category.name}
              </button>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

