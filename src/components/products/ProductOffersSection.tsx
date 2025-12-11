'use client'

import { ProductCard } from '@/components/ui/ProductCard'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

export interface ProductOffersSectionProps {
  products: Product[]
  timerText?: string
  className?: string
  onWishlistToggle?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  // Header props
  title?: string
}

/**
 * ProductOffersSection Component
 * Displays today's best product offers with a countdown timer
 */
export const ProductOffersSection = ({
  products,
  timerText,
  className,
  onWishlistToggle,
  onAddToCart,
  title = "Today's Best Product Offers",
}: ProductOffersSectionProps) => {
  return (
    <div
      className={cn('w-full', className)}
    >
      {/* Section Header with Timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-24 md:text-30 font-medium text-gray-900 leading-[40px]">
          {title}
        </h2>
        {timerText && (
          <p className="text-16 md:text-24 font-normal text-gray-500 leading-[32px]">
            {timerText}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[20px]">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onWishlistToggle={onWishlistToggle}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  )
}


