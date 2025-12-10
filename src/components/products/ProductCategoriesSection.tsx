'use client'

import { CategoryCard } from '@/components/ui/CategoryCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'

export interface ProductCategory {
  id: string
  title: string
  description: string
  href: string
  icon?: string
}

export interface ProductCategoriesSectionProps {
  categories: ProductCategory[]
  className?: string
}

/**
 * ProductCategoriesSection Component
 * Displays a grid of product category cards
 */
export const ProductCategoriesSection = ({
  categories,
  className,
}: ProductCategoriesSectionProps) => {
  return (
    <section
      className={cn('container-custom py-12 md:py-20', className)}
    >
      {/* Section Header */}
      <div className="flex flex-col gap-4 items-center mb-12 md:mb-20">
        <div className="flex gap-3.5 md:gap-[14px] items-center leading-[72px] text-[64px] text-gray-900">
          <h2 className="font-normal">Choose</h2>
          <h2 className="font-semibold">From</h2>
        </div>
        <div className="flex gap-3 md:gap-[12px] items-center justify-center leading-[72px] text-[64px] text-gray-900 w-full">
          <h2 className="font-semibold">Our Product</h2>
          <h2 className="font-normal">Categories</h2>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-[20px]">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            id={category.id}
            title={category.title}
            description={category.description}
            href={category.href}
            icon={category.icon}
          />
        ))}
      </div>
    </section>
  )
}

