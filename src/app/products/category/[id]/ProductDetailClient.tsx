'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  QuantitySelector,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import productImage from '@/assets/svg/product-1.svg'
import type { ProductCardData } from '@/components/ui/Card'
import type { Product } from '@/types/product'
import { useProductCardHandlers, useAddProductToCart } from '@/hooks/products'
import { useProviderCardHandlers } from '@/hooks/providers'

import {
  useProductDetails,
  useRelatedProducts,
  useProductReviews,
  useSubmitProductReview,
} from '@/hooks/products'
import { ProductPageLayout } from '../../components/ProductPageLayout'
import { ProductErrorState } from '../../components/ProductErrorState'
import { parseProductId } from '../../utils'
import { RELATED_PRODUCTS_LIMIT } from '../../constants'

interface ProductDetailClientProps {
  productId: string
}

// Wrapper component for provider card with handlers
const ProviderCardWithHandlers = ({
  provider,
  onViewProfile,
}: {
  provider: {
    id: string
    name: string
    image?: string
    verified?: boolean
    rating?: number
    profession?: string
  }
  onViewProfile?: () => void
}) => {
  const handlers = useProviderCardHandlers(parseInt(provider.id, 10))
  return (
    <ProviderCard
      provider={provider}
      onFollowToggle={handlers.handleFollowToggle}
      onFavoriteToggle={handlers.handleFavoriteToggle}
      isLoadingFollow={handlers.isLoadingFollow}
      isLoadingFavorite={handlers.isLoadingFavorite}
      onViewProfile={onViewProfile}
    />
  )
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
  const parsedProductId = parseProductId(productId)
  const { data: relatedProducts = [] } = useRelatedProducts(
    parsedProductId,
    RELATED_PRODUCTS_LIMIT
  )

  // Fetch product reviews
  const { data: reviews = [] } = useProductReviews(parsedProductId)

  // TODO: Use variations and attributes when implementing product variant selection
  // const { data: variations = [] } = useProductVariations(parsedProductId)
  // const { data: attributes = [] } = useProductAttributes(parsedProductId)

  // TODO: Use related category products when implementing category-based recommendations
  // const { data: relatedCategoryProducts = [] } = useRelatedCategoryProducts(
  //   parsedProductId,
  //   product?.category?.id ? String(product.category.id) : null
  // )

  // Submit review mutation
  const submitReviewMutation = useSubmitProductReview()

  // Show loading state
  if (productLoading) {
    return (
      <ProductPageLayout isLoading={true} loadingText="Loading product..." />
    )
  }

  // Show error state
  if (productError || !product) {
    return (
      <ProductPageLayout>
        <ProductErrorState
          message="Product not found"
          backHref="/products"
          backLabel="Back to Products"
        />
      </ProductPageLayout>
    )
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev =>
      Math.max(1, Math.min(prev + delta, product.stockQuantity || 99))
    )
  }

  const { handleAddToCart: addToCart, isLoading: isLoadingAddToCart } = useAddProductToCart()

  const handleAddToCart = async () => {
    if (!product) return
    try {
      await addToCart(product, quantity)
      // Optionally navigate to cart or show success message
      // router.push('/cart')
    } catch (error) {
      console.error('Failed to add product to cart:', error)
    }
  }

  const handleBuyNow = () => {
    // Navigate to checkout page with product data
    // TODO: Pass product data via query params or state management
    router.push('/checkout')
  }

  const handleSubmitReview = async () => {
    if (!productId || !userRating || !reviewComment.trim()) return

    try {
      if (!parsedProductId) return

      await submitReviewMutation.mutateAsync({
        productId: parsedProductId,
        rating: userRating,
        review: reviewComment,
      })
      setUserRating(0)
      setReviewComment('')
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  return (
    <ProductPageLayout>
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
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                min={1}
                max={product.stockQuantity || 99}
                variant="default"
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="brand"
                size="lg"
                onClick={handleAddToCart}
                disabled={isLoadingAddToCart || !product.inStock}
                className="flex-1"
              >
                {isLoadingAddToCart ? 'Adding...' : 'Add to Cart'}
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

            <ProviderCardWithHandlers
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
            Reviews ({reviews.length || product.rating.count})
          </h2>

          {/* Display Reviews */}
          {reviews.length > 0 && (
            <div className="space-y-4 mb-6">
              {reviews.map(review => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-14 font-semibold text-gray-600">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-14 font-semibold text-gray-900">
                          {review.userName}
                        </span>
                        {review.verified && (
                          <Badge variant="success" size="sm">
                            Verified
                          </Badge>
                        )}
                        <span className="text-12 text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <RatingDisplay
                        rating={review.rating}
                        size="sm"
                        showCount={false}
                      />
                      <p className="text-14 text-gray-700 mt-2">
                        {review.comment}
                      </p>
                      {review.helpful > 0 && (
                        <div className="mt-2 text-12 text-gray-500">
                          {review.helpful} people found this helpful
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Write Review Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
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
                disabled={
                  !userRating ||
                  !reviewComment.trim() ||
                  submitReviewMutation.isPending
                }
              >
                {submitReviewMutation.isPending
                  ? 'Submitting...'
                  : 'Submit Review'}
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
              {relatedProducts.map(relatedProduct => {
                // Inline component to use hooks properly
                const ProductCardItem = () => {
                  const handlers = useProductCardHandlers(parseInt(relatedProduct.id, 10))
                  return (
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
                        onWishlistToggle: handlers.handleWishlistToggle,
                        onFavoriteToggle: handlers.handleFavoriteToggle,
                        isLoadingWishlist: handlers.isLoadingWishlist,
                        isLoadingFavorite: handlers.isLoadingFavorite,
                      }}
                      onClick={() =>
                        router.push(`/products/${relatedProduct.id}`)
                      }
                      className="cursor-pointer"
                    />
                  )
                }
                return <ProductCardItem key={relatedProduct.id} />
              })}
            </div>
          </div>
        )}
      </div>
    </ProductPageLayout>
  )
}
