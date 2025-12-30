import { Card, type ProductCardData } from './Card'
import { useProductCardHandlers, useAddProductToCart } from '@/hooks/products'
import type { Product } from '@/types/product'
import { LoadingSpinner } from './LoadingSpinner'

export interface ProductGridProps {
  products: Product[]
  onWishlistToggle?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  columns?: 2 | 3 | 4
  className?: string
  isLoading?: boolean
}

export const ProductGrid = ({
  products,
  onWishlistToggle,
  onAddToCart,
  columns = 4,
  className,
  isLoading = false,
}: ProductGridProps) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-16 text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className || ''}`}>
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
            inStock: product.inStock,
            onWishlistToggle: handlers.handleWishlistToggle,
            onAddToCart: handleAddToCartClick,
            isLoadingWishlist: handlers.isLoadingWishlist,
            isLoadingAddToCart,
          }
          return <Card cardData={{ type: 'product', ...cardData }} />
        }
        return <ProductCardItem key={product.id} />
      })}
    </div>
  )
}
