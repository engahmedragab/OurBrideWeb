'use client'

import { cn } from '@/lib/utils'

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
    <div
      className={cn('flex gap-2 overflow-x-auto pb-2 scrollbar-hide', className)}
    >
      {/* All Category */}
      <button
        onClick={() => onSelectCategory('all')}
        className={cn(
          'flex-shrink-0 px-4 py-2 rounded-full text-14 font-medium transition-all duration-200',
          'whitespace-nowrap',
          selectedCategoryId === 'all' || !selectedCategoryId
            ? 'bg-brand-500 text-white shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        All
      </button>

      {/* Category Chips */}
      {categories.map(category => {
        const isSelected = selectedCategoryId === category.id
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-14 font-medium transition-all duration-200',
              'whitespace-nowrap',
              isSelected
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}

