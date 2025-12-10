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
}: ProductOffersSectionProps) => {
  return (
    <section
      className={cn('py-12 md:py-20', className)}
    >
      {/* Section Header with Timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-24 md:text-30 font-medium text-gray-900 leading-[40px]">
          Today's Best Product Offers
        </h2>
        {timerText && (
          <p className="text-16 md:text-24 font-normal text-gray-500 leading-[32px]">
            {timerText}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-[20px]">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onWishlistToggle={onWishlistToggle}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  )
}


