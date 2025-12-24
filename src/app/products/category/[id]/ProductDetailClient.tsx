'use client'

import { useState, useEffect } from 'react'
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
  Button,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import productImage from '@/assets/svg/product-1.svg'
import type { ProductCardData } from '@/components/ui/Card'
import type { Product } from '@/types/product'
import { useProductCardHandlers, useAddProductToCart } from '@/Hooks/products'
import { useProviderCardHandlers } from '@/Hooks/providers'

// Mock data - Replace with API call
const mockProduct: Product = {
  id: '1',
  title: 'Product Name : it could be that long so it will be in two Rows',
  description:
    'Premium quality wedding cream for bridal beauty. Perfect for your special day.',
  longDescription:
    'This essential wedding cream is specially formulated for brides who want to look their absolute best on their special day. Made with premium ingredients, it provides long-lasting hydration and a radiant glow. Perfect for all skin types, this cream ensures your skin looks flawless in photos and throughout your wedding celebration. The formula is lightweight yet deeply nourishing, creating a perfect base for makeup application. It contains natural extracts that help reduce inflammation and promote healthy, glowing skin. Regular use will leave your skin feeling soft, smooth, and ready for your special day.',
  images: [
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800',
    'https://images.unsplash.com/photo-1583241801824-9055b66b9d29?w=800',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
  ],
  provider: {
    id: '1',
    name: 'Aroma & Co.',
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  price: {
    original: 6000,
    discounted: 4800,
    currency: 'LE',
  },
  rating: {
    value: 4.5,
    count: 120,
  },
  category: {
    id: '1',
    name: 'Makeup',
    slug: 'makeup',
  },
  tags: ['Face', 'Cream'],
  inStock: true,
  stockQuantity: 50,
  showTopOfferBadge: true,
}

const mockRelatedProducts: ProductCardData[] = [
  {
    id: '2',
    title: 'Related Product 1',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    providerName: 'Beauty Pro',
    verified: true,
    originalPrice: 5000,
    discountedPrice: 4000,
    rating: 4.2,
    tags: ['Face', 'Cream'],
    showTopOfferBadge: false,
  },
  {
    id: '3',
    title: 'Related Product 2',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    providerName: 'Hair Studio',
    verified: true,
    originalPrice: 7000,
    discountedPrice: 5500,
    rating: 4.8,
    tags: ['Face', 'Cream'],
    showTopOfferBadge: true,
  },
]

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
  const [product, setProduct] = useState(mockProduct)
  const [userRating, setUserRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  // Fetch product based on id - Replace with API call
  useEffect(() => {
    if (productId) {
      // In a real app, fetch product data based on productId
      setProduct(mockProduct)
    }
  }, [productId])

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stockQuantity || 99)) {
      setQuantity(newQuantity)
    }
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
    // Buy now logic
    router.push('/checkout')
  }

  const handleSubmitReview = () => {
    // Submit review logic
    setUserRating(0)
    setReviewComment('')
  }

  const discountPercentage =
    product.price.original > product.price.discounted
      ? Math.round(
        ((product.price.original - product.price.discounted) /
          product.price.original) *
        100
      )
      : 0

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
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-1 text-16 font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
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
          <div className="mb-12">
            <h2 className="text-20 font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-14 text-gray-700 leading-relaxed">
              {product.longDescription}
            </p>
          </div>

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
          <div>
            <h2 className="text-20 font-semibold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockRelatedProducts.map(relatedProduct => {
                // Inline component to use hooks properly
                const ProductCardItem = () => {
                  const handlers = useProductCardHandlers(parseInt(relatedProduct.id, 10))
                  return (
                    <Card
                      cardData={{
                        type: 'product',
                        ...relatedProduct,
                        onWishlistToggle: handlers.handleWishlistToggle,
                        onFavoriteToggle: handlers.handleFavoriteToggle,
                        isLoadingWishlist: handlers.isLoadingWishlist,
                        isLoadingFavorite: handlers.isLoadingFavorite,
                      }}
                      onClick={() =>
                        router.push(`/products/category/${relatedProduct.id}`)
                      }
                      className="cursor-pointer"
                    />
                  )
                }
                return <ProductCardItem key={relatedProduct.id} />
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
