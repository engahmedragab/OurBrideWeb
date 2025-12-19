import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Badge } from './Badge'
import { RatingDisplay } from './RatingDisplay'
import { Heart, ShoppingCart, CheckCircle2 } from 'lucide-react'
import type { Product } from '@/types/product'

export interface ProductListProps {
  products: Product[]
  onWishlistToggle?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  className?: string
}

export const ProductList = ({
  products,
  onWishlistToggle,
  onAddToCart,
  className,
}: ProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-16 text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {products.map(product => {
        const hasDiscount = product.price.discounted < product.price.original
        const discountPercentage = hasDiscount
          ? Math.round(
              ((product.price.original - product.price.discounted) /
                product.price.original) *
                100
            )
          : 0

        return (
          <div
            key={product.id}
            className="group bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-4 p-4">
              {/* Image */}
              <Link
                href={`/products/${product.id}`}
                className="block flex-shrink-0 w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-100"
              >
                {product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '' ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-14">
                    No image
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-18 font-semibold text-gray-900 line-clamp-2 hover:text-brand-500 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-14 text-gray-600">
                          {product.provider.name}
                        </span>
                        {product.provider.verified && (
                          <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onWishlistToggle?.(product.id)}
                      className={cn(
                        'flex-shrink-0 w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center transition-all duration-200',
                        product.isWishlisted
                          ? 'border-brand-500 bg-brand-50'
                          : 'hover:border-brand-500 hover:bg-gray-50'
                      )}
                      aria-label={
                        product.isWishlisted
                          ? 'Remove from wishlist'
                          : 'Add to wishlist'
                      }
                    >
                      <Heart
                        className={cn(
                          'h-5 w-5 transition-colors',
                          product.isWishlisted
                            ? 'fill-brand-500 text-brand-500'
                            : 'text-gray-400'
                        )}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-14 text-gray-600 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating and Tags */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <RatingDisplay
                      rating={product.rating.value}
                      count={product.rating.count}
                      size="sm"
                      className="gap-1.5"
                    />
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-10 px-2 py-0.5 border-gray-200 text-gray-600"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-0.5">
                    {hasDiscount && (
                      <span className="text-10 font-normal text-gray-400 line-through">
                        {product.price.original.toLocaleString()}{' '}
                        {product.price.currency}
                      </span>
                    )}
                    <span className="text-18 font-normal text-gray-900">
                      {product.price.discounted.toLocaleString()}{' '}
                      {product.price.currency}
                    </span>
                    {hasDiscount && (
                      <Badge
                        variant="default"
                        className="bg-red-500 !text-white border-0 px-2 py-0.5 text-12 font-semibold"
                      >
                        -{discountPercentage}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full border-gray-300 bg-white hover:border-brand-500 hover:bg-white"
                      onClick={() => onAddToCart?.(product.id)}
                      disabled={!product.inStock}
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-5 w-5 text-brand-500" />
                    </Button>
                    <Button
                      variant="default"
                      className="h-10 px-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white"
                      onClick={() => onAddToCart?.(product.id)}
                      disabled={!product.inStock}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
