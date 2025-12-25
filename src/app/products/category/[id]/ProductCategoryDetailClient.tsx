'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, ArrowRight, ThumbsUp, Send } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import {
  Badge,
  ProductImageGallery,
  Card,
  ProviderCard,
  PriceDisplay,
  RatingDisplay,
  RatingInput,
  OrderSummaryCard,
  OfferBanner,
  BackButton,
  LoadingSpinner,
  useToast,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import productImage from '@/assets/svg/product-1.svg'
import {
  useProductDetails,
  useRelatedProducts,
  useProductCardHandlers,
  useAddProductToCart,
  useProductReviews,
  useSubmitProductReview,
} from '@/hooks/products'
import { useProviderCardHandlers } from '@/hooks/providers'
import { handleApiResponseForToast } from '@/utils/api-response.utils'


interface ProductCategoryDetailClientProps {
  productId: string
}

// Wrapper component for provider card with handlers
const ProviderCardWithHandlers = ({
  provider,
}: {
  provider: {
    id: string
    name: string
    image?: string
    verified?: boolean
    rating?: number
    profession?: string
  }
}) => {
  const handlers = useProviderCardHandlers(parseInt(provider.id, 10))
  return (
    <ProviderCard
      provider={provider}
      onFollowToggle={handlers.handleFollowToggle}
      onFavoriteToggle={handlers.handleFavoriteToggle}
      isLoadingFollow={handlers.isLoadingFollow}
      isLoadingFavorite={handlers.isLoadingFavorite}
    />
  )
}

export function ProductCategoryDetailClient({
  productId,
}: ProductCategoryDetailClientProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [userRating, setUserRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  // Fetch product using hook
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProductDetails(productId)

  const parsedProductId = productId ? parseInt(productId, 10) : null

  // Fetch product reviews
  const { data: reviews = [] } = useProductReviews(parsedProductId)

  // Submit review mutation
  const submitReviewMutation = useSubmitProductReview()

  // Add to cart hook - MUST be called before any conditional returns
  const { handleAddToCart: addToCart, isLoading: isLoadingAddToCart } = useAddProductToCart()

  // Fetch related products
  const { data: relatedProducts = [] } = useRelatedProducts(
    parsedProductId,
    4
  )

  // Calculate rating distribution from actual reviews
  const ratingDistribution = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return [
        { stars: 5, count: 0, percentage: 0 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ]
    }

    const distribution = [5, 4, 3, 2, 1].map(stars => {
      const count = reviews.filter(r => Math.round(r.rating) === stars).length
      const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
      return { stars, count, percentage }
    })

    return distribution
  }, [reviews])

  // Show loading state
  if (productLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <LoadingSpinner
            size="lg"
            text="Loading product..."
            fullScreen={true}
          />
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

  const handleAddToCart = async () => {
    if (!product) return
    try {
      const response = await addToCart(product, quantity)
      const { message, type } = handleApiResponseForToast(
        response,
        'Product added to cart successfully!',
        'Failed to add product to cart'
      )
      addToast(message, type)
    } catch (error) {
      console.error('Failed to add product to cart:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product to cart. Please try again.'
      addToast(errorMessage, 'error')
    }
  }

  const handleBuyNow = () => {
    // Navigate to checkout page with product data
    // TODO: Pass product data via query params or state management
    router.push('/checkout')
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev =>
      Math.max(1, Math.min(prev + delta, product.stockQuantity || 99))
    )
  }

  const getRatingLabel = (stars: number) => {
    const labels: Record<number, string> = {
      5: 'Excellent',
      4: 'Good',
      3: 'Average',
      2: 'Below Average',
      1: 'Poor',
    }
    return labels[stars] || ''
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom max-w-[1600px] py-6 md:py-8">
          {/* Back Button */}
          <BackButton
            href="/products"
            label="Back to Products"
            className="mb-6"
          />

          {/* Main Product Section - 3 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-12">
            {/* Left: Image Gallery (4 columns) */}
            <div className="lg:col-span-4">
              <ProductImageGallery
                images={product.images}
                productName={product.title}
              />
            </div>

            {/* Middle: Product Information (5 columns) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Product Header */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {product.showTopOfferBadge && (
                    <Badge
                      variant="default"
                      className="bg-green-500 !text-white border-0 px-3 py-1 text-12 font-normal rounded"
                    >
                      Special Offer
                    </Badge>
                  )}
                </div>
                <h1 className="text-32 md:text-40 font-normal text-gray-900 mb-3">
                  {product.title}
                </h1>
                <RatingDisplay
                  rating={product.rating.value}
                  count={product.rating.count}
                  format="rated-by"
                />
              </div>

              {/* Pricing */}
              <PriceDisplay
                original={product.price.original}
                discounted={product.price.discounted}
                currency={product.price.currency}
                size="lg"
              />

              {/* Description */}
              <div className="space-y-2">
                <p className="text-16 text-gray-500 leading-[1.6]">
                  {product.longDescription || product.description}
                </p>
              </div>

              {/* Delivery Date */}
              <div className="text-14 text-brand-500 font-normal">
                Buy now and get by <span className="text-gray-900">25 AUG 2025</span>
              </div>
            </div>

            {/* Right: Provider & Purchase Card (3 columns) */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <ProviderCardWithHandlers
                  provider={{
                    ...product.provider,
                    rating: product.rating.value,
                    profession: 'Makeup Artist',
                  }}
                />
                <OrderSummaryCard
                  totalPrice={product.price.discounted * quantity}
                  currency={product.price.currency}
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  deliveryLocation="Giza, 6 Of O..."
                  fullAddress="Giza, 6 Of October City, Building 15, Apartment 42"
                  maxQuantity={product.stockQuantity || 99}
                  disabled={!product.inStock || isLoadingAddToCart}
                />
              </div>
            </div>
          </div>

          {/* Reviews and Rating Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-12">
            {/* Left: Reviews */}
            <div className="lg:col-span-9">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-24 md:text-30 font-semibold text-gray-900">
                  Reviews
                </h2>
                <span className="text-14 text-gray-600">
                  {product.rating.count} reviews
                </span>
              </div>

              <div className="space-y-4">
                {/* Use API reviews if available, otherwise show empty state */}
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div
                      key={review.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                          {review.userImage ? (
                            <div className="relative w-12 h-12">
                              <Image
                                src={review.userImage}
                                alt={review.userName}
                                fill
                                sizes="48px"
                                className="rounded-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-16 font-semibold text-gray-600">
                                {review.userName?.charAt(0) || 'U'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Review Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-16 font-semibold text-gray-900">
                                  {review.userName || 'Anonymous'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-12 text-gray-500">
                                  {review.date ? new Date(review.date).toLocaleDateString() : 'Recently'}
                                </span>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                      key={star}
                                      className={cn(
                                        'h-4 w-4',
                                        star <= review.rating
                                          ? 'fill-brand-500 text-brand-500'
                                          : 'fill-gray-200 text-gray-200'
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            {review.helpful !== undefined && review.helpful > 0 && (
                              <button className="flex items-center gap-1 text-12 text-gray-500 hover:text-gray-700">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{review.helpful}</span>
                              </button>
                            )}
                          </div>
                          <p className="text-14 text-gray-600 leading-relaxed">
                            {review.comment || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <button className="text-16 font-semibold text-brand-400 hover:text-brand-500 transition-colors">
                  See more reviews
                </button>
              </div>

              {/* Write Your Review Section */}
              <div className="mt-8 p-6">
                <h3 className="text-18 font-semibold text-gray-900 mb-4">
                  Write Your Review
                </h3>

                {/* Star Rating - Centered */}
                <div className="flex justify-center mb-4">
                  <RatingInput
                    rating={userRating}
                    onRatingChange={setUserRating}
                    size="md"
                    color="default"
                  />
                </div>

                {/* Comment Input Area */}
                <div className="relative bg-white border border-gray-300 rounded-lg min-h-[120px] p-4">
                  {/* User Avatar inside input */}
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-12 font-semibold text-gray-600">
                        U
                      </span>
                    </div>
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Share your Comments"
                    className="w-full min-h-[100px] pl-12 pr-14 py-2 border-0 focus:outline-none text-14 text-gray-900 placeholder:text-gray-400 resize-none bg-transparent"
                    rows={4}
                  />

                  {/* Send Button */}
                  <button
                    onClick={async () => {
                      if (reviewComment.trim() && userRating > 0 && parsedProductId) {
                        try {
                          const response = await submitReviewMutation.mutateAsync({
                            productId: parsedProductId,
                            rating: userRating,
                            review: reviewComment.trim(),
                          })
                          
                          const { message, type } = handleApiResponseForToast(
                            response,
                            'Review submitted successfully!',
                            'Failed to submit review'
                          )
                          
                          if (type === 'success') {
                            setReviewComment('')
                            setUserRating(0)
                          }
                          addToast(message, type)
                        } catch (error) {
                          console.error('Error submitting review:', error)
                          const errorMessage = error instanceof Error ? error.message : 'Failed to submit review. Please try again.'
                          addToast(errorMessage, 'error')
                        }
                      }
                    }}
                    disabled={!reviewComment.trim() || userRating === 0 || submitReviewMutation.isPending || !parsedProductId}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    aria-label="Send review"
                  >
                    {submitReviewMutation.isPending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5 text-white flex-shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Rating Summary Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {/* Overall Rating Display */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-48 font-semibold text-gray-900 mb-2">
                    {product.rating.value}
                  </div>
                  <div className="mb-2 flex justify-center">
                    <RatingDisplay
                      rating={product.rating.value}
                      showCount={false}
                      size="lg"
                    />
                  </div>
                  <p className="text-14 text-gray-600">
                    Based on {product.rating.count} reviews
                  </p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3 mt-6">
                  {ratingDistribution.map(item => (
                    <div key={item.stars} className="space-y-1">
                      <div className="flex items-center justify-between text-12">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {item.stars}
                          </span>
                          <Star className="h-4 w-4 fill-brand-500 text-brand-500" />
                          <span className="text-gray-600">
                            {getRatingLabel(item.stars)}
                          </span>
                        </div>
                        <span className="text-gray-600">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-brand-400 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter/Offer Banner Section */}
          <OfferBanner
            offers={[{
              heading: "24% Offer On our product!",
              description: "Subscribe to our newsletter and get exclusive offers on premium wedding products.",
              variant: "default",
              productImage: productImage,
            }]}
            className="mb-12"
          />

          {/* Suggested for You Section */}
          {relatedProducts.length > 0 && (
            <section className="mb-12 max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-30 md:text-32 font-normal text-gray-900">
                  Suggested for You
                </h2>
                <Link
                  href="/products"
                  className="flex items-center gap-2 text-16 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(product => {
                  // Inline component to use hooks properly
                  const ProductCardItem = () => {
                    const handlers = useProductCardHandlers(parseInt(product.id, 10))
                    const { handleAddToCart, isLoading: isLoadingAddToCart } = useAddProductToCart()

                    const handleAddToCartClick = (e: React.MouseEvent) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleAddToCart(product, 1)
                    }

                    return (
                      <Card
                        cardData={{
                          type: 'product',
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
                        }}
                      />
                    )
                  }
                  return <ProductCardItem key={product.id} />
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
