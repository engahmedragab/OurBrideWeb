'use client'

import { Card, type ProductCardData } from '@/components/ui'
import { useProductCardHandlers, useAddProductToCart } from '@/Hooks/products'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

export interface ProductOffersSectionProps {
  products: Product[]
  timerText?: string
  className?: string
  onWishlistToggle?: (productId: string) => void
  onFavoriteToggle?: (productId: string) => void
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
  onFavoriteToggle,
  onAddToCart,
  title = "Today's Best Product Offers",
}: ProductOffersSectionProps) => {
  return (
    <section
      className={cn('py-12 md:py-20', className)}
    >
      {/* Section Header with Timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 md:mb-8">
        <h2 className="text-20 sm:text-24 md:text-30 font-medium text-gray-900 leading-tight sm:leading-[32px] md:leading-[40px]">
          {title}
        </h2>
        {timerText && (
          <p className="text-14 sm:text-16 md:text-20 font-normal text-gray-500 leading-normal sm:leading-[24px] md:leading-[32px]">
            {timerText}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => {
          // Inline component to use hooks properly
          const ProductCardItem = () => {
            const handlers = useProductCardHandlers(parseInt(product.id, 10))
            const { handleAddToCart, isLoading: isLoadingAddToCart } = useAddProductToCart()

            const handleAddToCartClick = (e: React.MouseEvent) => {
              e.preventDefault()
              e.stopPropagation()
              handleAddToCart(product, 1)
            }

            const cardData: ProductCardData = {
              id: product.id,
              image: product.images?.[0]?.trim() || '',
              title: product.title,
              providerName: product.provider.name,
              providerId: product.provider.id,
              verified: product.provider.verified,
              rating: product.rating.value,
              originalPrice: product.price.original,
              discountedPrice: product.price.discounted,
              tags: product.tags,
              showTopOfferBadge: product.showTopOfferBadge,
              isWishlisted: product.isWishlisted,
              isFavorite: product.isFavorite,
              inStock: product.inStock,
              onWishlistToggle: handlers.handleWishlistToggle,
              onFavoriteToggle: handlers.handleFavoriteToggle,
              onAddToCart: handleAddToCartClick,
              isLoadingWishlist: handlers.isLoadingWishlist,
              isLoadingFavorite: handlers.isLoadingFavorite,
              isLoadingAddToCart,
            }
            return <Card cardData={{ type: 'product', ...cardData }} />
          }
          return <ProductCardItem key={product.id} />
        })}
      </div>
    </section>
  )
}


