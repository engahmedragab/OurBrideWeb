'use client'

import { useState, useEffect, use } from 'react'
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
} from '@/components/ui'
import { cn } from '@/lib/utils'
import productImage from '@/assets/svg/product-1.svg'
import type { OrderItem } from '@/components/ui/OrderCheckoutModal'
import type { ProductCardData } from '@/components/ui/Card'
import type { Product } from '@/types/product'

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
    value: 4.8,
    count: 8264,
  },
  category: {
    id: '1',
    name: 'Makeup',
    slug: 'makeup',
  },
  tags: ['Makeup', 'Body Care', 'Wedding', 'Premium'],
  inStock: true,
  stockQuantity: 50,
  sku: '50-42-7010',
  specifications: [
    { label: 'Brand', value: 'YUNJAC' },
    { label: 'Size', value: '100ml' },
    { label: 'Type', value: 'Cream' },
    { label: 'Skin Type', value: 'All Types' },
  ],
  isWishlisted: false,
  showTopOfferBadge: true,
}

// Mock reviews
interface Review {
  id: string
  userName: string
  userAvatar?: string
  date: string
  rating: number
  text: string
  helpful: number
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    date: '2 months ago',
    rating: 5,
    text: 'Amazing product! My skin looks radiant and feels so smooth. Highly recommend for brides-to-be! The cream is lightweight and absorbs quickly without leaving any greasy residue.',
    helpful: 24,
  },
  {
    id: '2',
    userName: 'Emily Chen',
    userAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    date: '3 months ago',
    rating: 5,
    text: 'Great quality and fast shipping. The cream is very hydrating and perfect for my skin type. I use it daily and my skin has never looked better!',
    helpful: 18,
  },
  {
    id: '3',
    userName: 'Maria Garcia',
    date: '1 month ago',
    rating: 4,
    text: 'Love this product! Will definitely order again. The packaging is beautiful and the product itself is excellent quality.',
    helpful: 12,
  },
  {
    id: '4',
    userName: 'Jessica Williams',
    userAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    date: '2 weeks ago',
    rating: 5,
    text: 'Perfect for my wedding day! My makeup went on flawlessly and stayed all day. Highly recommend!',
    helpful: 31,
  },
]

// Mock rating distribution
const ratingDistribution = [
  { stars: 5, count: 5786, percentage: 70 },
  { stars: 4, count: 1653, percentage: 20 },
  { stars: 3, count: 495, percentage: 6 },
  { stars: 2, count: 165, percentage: 2 },
  { stars: 1, count: 165, percentage: 2 },
]

// Mock suggested products
const mockSuggestedProducts: ProductCardData[] = [
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    title: 'Bridal Makeup Kit',
    providerName: 'Beauty Pro',
    verified: true,
    rating: 4.5,
    originalPrice: 5000,
    discountedPrice: 4500,
    tags: ['Makeup', 'Kit'],
    showTopOfferBadge: true,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1583241801824-9055b66b9d29?w=400',
    title: 'Hair Care Essentials',
    providerName: 'Hair Studio',
    verified: true,
    rating: 4.5,
    originalPrice: 5500,
    discountedPrice: 4500,
    tags: ['Hair', 'Care'],
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    title: 'Skin Care Bundle',
    providerName: 'Skincare Co',
    verified: true,
    rating: 4.5,
    originalPrice: 6000,
    discountedPrice: 4500,
    tags: ['Skin', 'Care'],
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    title: 'Premium Face Cream',
    providerName: 'YUNJAC',
    verified: true,
    rating: 4.7,
    originalPrice: 7000,
    discountedPrice: 5500,
    tags: ['Face', 'Cream'],
    showTopOfferBadge: true,
  },
]

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(mockProduct)
  const [userRating, setUserRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  // Fetch product based on id - Replace with API call
  useEffect(() => {
    if (id) {
      // TODO: Replace with actual API call
      // const fetchProduct = async () => {
      //   const data = await getProductById(id)
      //   setProduct(data)
      // }
      // fetchProduct()
      setProduct(mockProduct)
    }
  }, [id])

  const handleAddToCart = () => {
    // TODO: Implement add to cart
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

  // Convert product to OrderItem format for the modal
  const getOrderItems = (): OrderItem[] => {
    const discountPercentage =
      product.price.original > product.price.discounted
        ? Math.round(
            ((product.price.original - product.price.discounted) /
              product.price.original) *
              100
          )
        : 0

    return [
      {
        id: product.id,
        title: product.title,
        image: product.images[0] || '',
        originalPrice: product.price.original,
        discountedPrice: product.price.discounted,
        currency: product.price.currency,
        quantity: quantity,
        discountPercentage:
          discountPercentage > 0 ? discountPercentage : undefined,
        deliveryDate: '29/8/2025', // You can calculate this dynamically
        maxQuantity: product.stockQuantity || 99,
      },
    ]
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
                <ProviderCard
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
                  disabled={!product.inStock}
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
                {mockReviews.map(review => (
                  <div
                    key={review.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        {review.userAvatar ? (
                          <div className="relative w-12 h-12">
                            <Image
                              src={review.userAvatar}
                              alt={review.userName}
                              fill
                              sizes="48px"
                              className="rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-16 font-semibold text-gray-600">
                              {review.userName.charAt(0)}
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
                                {review.userName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-12 text-gray-500">
                                {review.date}
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
                          <button className="flex items-center gap-1 text-12 text-gray-500 hover:text-gray-700">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{review.helpful}</span>
                          </button>
                        </div>
                        <p className="text-14 text-gray-600 leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
                    onClick={() => {
                      if (reviewComment.trim()) {
                        // TODO: Implement review submission
                        setReviewComment('')
                        setUserRating(0)
                      }
                    }}
                    disabled={!reviewComment.trim()}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    aria-label="Send review"
                  >
                    <Send className="h-5 w-5 text-white flex-shrink-0" />
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
            heading="24% Offer On our product!"
            description="Subscribe to our newsletter and get exclusive offers on premium wedding products."
            variant="default"
            productImage={productImage}
            className="mb-12"
          />

          {/* Suggested for You Section */}
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
              {mockSuggestedProducts.map(product => (
                <Card
                  key={product.id}
                  cardData={{ type: 'product', ...product }}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />

    </div>
  )
}
