import { ProductCard } from './ProductCard'
import type { Product } from '@/types/product'

export interface ProductGridProps {
  products: Product[]
  onWishlistToggle?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  columns?: 2 | 3 | 4
  className?: string
}

export const ProductGrid = ({
  products,
  onWishlistToggle,
  onAddToCart,
  columns = 4,
  className,
}: ProductGridProps) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
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
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onWishlistToggle={onWishlistToggle}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
