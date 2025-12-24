'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import {
  Badge,
  ProductImageGallery,
  Card,
  ProviderCard,
  PriceDisplay,
  RatingDisplay,
  RatingInput,
  BackButton,
  Button,
} from '@/components/ui'
import { useProductDetails, useRelatedProducts } from '@/hooks/products'
import type { ProductCardData } from '@/components/ui/Card'

interface ProductDetailClientProps {
  productId: string
}

export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [userRating, setUserRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  // Fetch product using hook
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProductDetails(productId)

  // Fetch related products
  const { data: relatedProducts = [] } = useRelatedProducts(
    productId ? parseInt(productId, 10) : null,
    4
  )

  // Show loading state
  if (productLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-18 text-gray-600">Loading product...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (productError || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-18 text-gray-600 mb-4">
              Product not found
            </div>
            <BackButton href="/products" label="Back to Products" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev =>
      Math.max(1, Math.min(prev + delta, product.stockQuantity || 99))
    )
  }

  const handleAddToCart = () => {
    // TODO: Implement add to cart
    router.push('/cart')
  }

  const handleBuyNow = () => {
    // Navigate to checkout page with product data
    // TODO: Pass product data via query params or state management
    router.push('/checkout')
  }

  const handleSubmitReview = () => {
    // TODO: Implement submit review
    setUserRating(0)
    setReviewComment('')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-6 md:py-8">
          <BackButton onClick={() => router.back()} className="mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div>
              <ProductImageGallery
                images={product.images}
                productName={product.title}
              />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {product.showTopOfferBadge && (
                <Badge variant="success" className="inline-block">
                  Top Offer
                </Badge>
              )}

              <h1 className="text-24 md:text-28 font-semibold text-gray-900">
                {product.title}
              </h1>

              <div className="flex items-center gap-4">
                <RatingDisplay rating={product.rating.value} count={product.rating.count} />
                <span className="text-14 text-gray-500">
                  ({product.rating.count} reviews)
                </span>
              </div>

              <PriceDisplay
                original={product.price.original}
                discounted={product.price.discounted}
                currency={product.price.currency}
              />

              <div className="flex items-center gap-4">
                <span className="text-14 text-gray-600">Quantity:</span>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-1 text-16 font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900"
                    disabled={quantity >= (product.stockQuantity || 99)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="brand"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBuyNow}
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>

              <ProviderCard
                provider={product.provider}
                onViewProfile={() => router.push(`/provider/${product.provider.id}`)}
              />
            </div>
          </div>

          {/* Product Description */}
          {(product.longDescription || product.description) && (
            <div className="mb-12">
              <h2 className="text-20 font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-14 text-gray-700 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mb-12">
            <h2 className="text-20 font-semibold text-gray-900 mb-6">
              Reviews ({product.rating.count})
            </h2>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-16 font-semibold text-gray-900 mb-4">
                Write Your Review
              </h3>

              {/* Star Rating - Centered */}
              <div className="flex justify-center mb-4">
                <RatingInput
                  rating={userRating}
                  onRatingChange={setUserRating}
                  size="lg"
                />
              </div>

              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
              />

              <div className="flex justify-end mt-4">
                <Button
                  variant="brand"
                  onClick={handleSubmitReview}
                  disabled={!userRating || !reviewComment.trim()}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-20 font-semibold text-gray-900 mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <Card
                    key={relatedProduct.id}
                    cardData={{
                      type: 'product',
                      id: relatedProduct.id,
                      image: relatedProduct.images?.[0] || '',
                      title: relatedProduct.title,
                      providerName: relatedProduct.provider?.name || '',
                      verified: relatedProduct.provider?.verified || false,
                      originalPrice: relatedProduct.price?.original || 0,
                      discountedPrice: relatedProduct.price?.discounted || 0,
                      rating: relatedProduct.rating?.value || 0,
                      tags: relatedProduct.tags || [],
                      showTopOfferBadge: relatedProduct.showTopOfferBadge || false,
                    }}
                    onClick={() =>
                      router.push(`/products/${relatedProduct.id}`)
                    }
                    className="cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
