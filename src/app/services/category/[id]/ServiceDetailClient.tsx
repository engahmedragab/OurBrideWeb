'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Star,
  ArrowRight,
  ThumbsUp,
  MessageCircle,
  Send,
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import {
  Badge,
  ProductImageGallery,
  PriceDisplay,
  RatingDisplay,
  RatingInput,
  OfferBanner,
  Button,
  ServiceCard,
  BookingConfirmationModal,
  BackButton,
  ProviderCard,
  LoadingSpinner,
  useToast,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Service } from '@/types/service'
import {
  useServiceCardHandlers,
  useServiceDetail,
  useRelatedServicesByPreparation,
  useServiceReviews,
  useSubmitServiceReview,
  useServicePackages,
  type ServiceReview,
} from '@/hooks/services'
import { useProviderCardHandlers } from '@/hooks/providers'
import productImage from '@/assets/svg/product-1.svg'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

// Wrapper component for service card with handlers
const ServiceCardWithHandlers = ({
  service,
  onBookNow,
}: {
  service: Service
  onBookNow?: (serviceId: string) => void
}) => {
  const handlers = useServiceCardHandlers(parseInt(service.id, 10))
  return (
    <ServiceCard
      service={service}
      onWishlistToggle={handlers.handleWishlistToggle}
      onFavoriteToggle={handlers.handleFavoriteToggle}
      isLoadingWishlist={handlers.isLoadingWishlist}
      isLoadingFavorite={handlers.isLoadingFavorite}
      onBookNow={onBookNow}
    />
  )
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

interface ServiceDetailClientProps {
  serviceId: string
}

/**
 * Format date to relative time (e.g., "2 months ago")
 */
const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `${months} ${months === 1 ? 'month' : 'months'} ago`
    }
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} ${years === 1 ? 'year' : 'years'} ago`
  } catch {
    return dateString
  }
}

/**
 * Calculate rating distribution from reviews
 */
const calculateRatingDistribution = (reviews: ServiceReview[]) => {
  const total = reviews.length
  if (total === 0) {
    return [
      { stars: 5, count: 0, percentage: 0 },
      { stars: 4, count: 0, percentage: 0 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ]
  }

  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length
    return {
      stars,
      count,
      percentage: Math.round((count / total) * 100),
    }
  })

  return distribution
}

export function ServiceDetailClient({ serviceId }: ServiceDetailClientProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [userRating, setUserRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [branchesExpanded, setBranchesExpanded] = useState(false)
  const [packagesExpanded, setPackagesExpanded] = useState(false)
  const [isBookingConfirmationModalOpen, setIsBookingConfirmationModalOpen] =
    useState(false)

  // Fetch service detail from API
  const {
    data: serviceDetailData,
    isLoading: serviceLoading,
    error: serviceError,
  } = useServiceDetail(serviceId)

  const service = serviceDetailData?.service

  // Fetch service packages
  const {
    data: packagesData,
    isLoading: packagesLoading,
  } = useServicePackages(serviceId)

  // Fetch service reviews
  const parsedServiceId = parseInt(serviceId, 10)
  const { data: reviews = [] } = useServiceReviews(
    parsedServiceId,
    { page: 1, pageSize: 10 },
    !isNaN(parsedServiceId)
  )

  // Calculate rating distribution from actual reviews
  const ratingDistribution = calculateRatingDistribution(reviews)

  // Fetch related services by preparation
  const preparationId = service?.category?.id
    ? parseInt(service.category.id, 10)
    : null
  const { data: relatedServicesData } = useRelatedServicesByPreparation(
    preparationId,
    !!preparationId
  )

  const relatedServices = relatedServicesData?.services || []

  // Filter out current service from related services
  const suggestedServices = relatedServices.filter(
    s => s.id !== serviceId
  ).slice(0, 4)

  // Submit review mutation
  const submitReviewMutation = useSubmitServiceReview()

  const handleBookNow = () => {
    router.push(`/booking/${serviceId}`)
  }

  // Use API handlers for service cards with toast callbacks
  const serviceHandlers = useServiceCardHandlers(parseInt(serviceId, 10), {
    onFavoriteSuccess: (response) => {
      const defaultMessage = response === true ? 'Added to favorites' : 'Removed from favorites'
      const { message } = handleApiResponseForToast(response, defaultMessage, 'Failed to update favorite')
      addToast(message, 'success')
    },
    onFavoriteError: (error) => {
      addToast(error.message || 'Failed to update favorite. Please try again.', 'error')
    },
    onWishlistSuccess: (response) => {
      const defaultMessage = response === true ? 'Added to wishlist' : 'Removed from wishlist'
      const { message } = handleApiResponseForToast(response, defaultMessage, 'Failed to update wishlist')
      addToast(message, 'success')
    },
    onWishlistError: (error) => {
      addToast(error.message || 'Failed to update wishlist. Please try again.', 'error')
    },
  })

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    serviceHandlers.handleWishlistToggle(e)
  }

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    serviceHandlers.handleFavoriteToggle(e)
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

  // Show loading state
  if (serviceLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner
            size="lg"
            text="Loading service..."
            fullScreen={true}
          />
        </main>
        <Footer />
      </div>
    )
  }

  // Show error state
  if (serviceError || !service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-16 text-red-600 mb-4">
              Service not found. Please try again later.
            </p>
            <Button onClick={() => router.push('/services/category')}>
              Back to Services
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const hasDiscount = service.price.discounted < service.price.original

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom max-w-[1600px] py-6 md:py-8">
          {/* Back Button */}
          <BackButton
            href="/services/category"
            label="Back to Services"
            className="mb-6"
          />

          {/* Main Service Section - 3 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-12">
            {/* Left: Image Gallery (4 columns) */}
            <div className="lg:col-span-4">
              <div className="relative">
                <ProductImageGallery
                  images={service.images}
                  productName={service.title}
                />
                {/* Top Offer Badge */}
                {service.showTopOfferBadge && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge
                      variant="default"
                      className="bg-green-500 !text-white border-0 px-3 py-1 text-12 font-normal rounded"
                    >
                      Top Offer
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Service Information (5 columns) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Service Header */}
              <div>
                <h1 className="text-24 sm:text-28 md:text-32 lg:text-40 font-normal text-gray-900 mb-3 leading-tight">
                  {service.title}
                </h1>
                <RatingDisplay
                  rating={service.rating.value}
                  count={service.rating.count}
                  format="rated-by"
                />
              </div>

              {/* Pricing */}
              <PriceDisplay
                original={hasDiscount ? service.price.original : undefined}
                discounted={service.price.discounted}
                currency={service.price.currency}
                size="lg"
              />

              {/* Description */}
              <div className="space-y-2">
                <p className="text-14 sm:text-15 md:text-16 text-gray-500 leading-[1.6]">
                  {service.longDescription || service.description}
                </p>
              </div>

              {/* Delivery Date */}
              <div className="text-13 sm:text-14 text-brand-500 font-normal">
                Book now and get by <span className="text-gray-900">25 AUG 2025</span>
              </div>
            </div>

            {/* Right: Provider & Booking Card (3 columns) */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Provider Card */}
                <ProviderCardWithHandlers
                  provider={{
                    ...service.provider,
                    rating: service.provider.rating ?? service.rating.value,
                    profession: service.provider.profession,
                  }}
                />

                {/* Booking Details Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">

                  {/* Pricing Section */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-13 sm:text-14 text-gray-600">Start From</span>
                      <span className="text-20 sm:text-22 md:text-24 font-normal text-gray-900">
                        {service.price.discounted.toLocaleString()}
                      </span>
                      <span className="text-13 sm:text-14 text-gray-600">
                        {service.price.currency}
                      </span>
                    </div>

                    {/* Available Branches */}
                    <div className="mb-4">
                      <h4 className="text-13 sm:text-14 font-semibold text-gray-900 mb-2">
                        Available Branches
                      </h4>
                      <div
                        className={cn(
                          'space-y-1',
                          !branchesExpanded && 'line-clamp-2'
                        )}
                      >
                        {branchesExpanded ? (
                          <>
                            <p className="text-14 text-gray-600">
                              Giza, 6 Of October
                            </p>
                            <p className="text-14 text-gray-600">
                              Cairo, Maadi
                            </p>
                            <p className="text-14 text-gray-600">
                              Giza, Elshikh Zayed
                            </p>
                            <p className="text-14 text-gray-600">
                              Mansoura, Glaa&apos; St.
                            </p>
                            <p className="text-14 text-gray-600">Giza, Dokki</p>
                            <p className="text-14 text-gray-600">
                              Cairo, Nasr City
                            </p>
                            <p className="text-14 text-gray-600">
                              Alexandria, Corniche
                            </p>
                            <p className="text-14 text-gray-600">
                              Cairo, Zamalek
                            </p>
                            <p className="text-14 text-gray-600">
                              Giza, Agouza
                            </p>
                            <p className="text-14 text-gray-600">
                              Cairo, Heliopolis
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-14 text-gray-600">
                              Giza, 6 Of October
                            </p>
                            <p className="text-14 text-gray-600">
                              Cairo, Maadi
                            </p>
                            <p className="text-14 text-gray-600">
                              Giza, Elshikh Zayed
                            </p>
                            <p className="text-14 text-gray-600">
                              Mansoura, Glaa&apos; St.
                            </p>
                            <p className="text-14 text-gray-600">Giz...</p>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => setBranchesExpanded(!branchesExpanded)}
                        className="text-13 sm:text-14 text-brand-500 hover:text-brand-600 font-medium mt-1"
                      >
                        {branchesExpanded ? 'See Less' : 'See More'}
                      </button>
                    </div>
                  </div>

                  {/* Packages Details */}
                  {packagesData && packagesData.packages.length > 0 && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h4 className="text-13 sm:text-14 font-semibold text-gray-900 mb-2">
                        Packages Details
                      </h4>
                      {packagesLoading ? (
                        <LoadingSpinner size="sm" text="Loading packages..." />
                      ) : (
                        <>
                          <div
                            className={cn(
                              'space-y-1',
                              !packagesExpanded && 'line-clamp-2'
                            )}
                          >
                            {packagesExpanded
                              ? packagesData.packages.map((pkg) => (
                                  <div key={pkg.id} className="text-14 text-gray-600">
                                    <span className="font-medium">{pkg.name}</span>
                                    {pkg.price > 0 && (
                                      <span className="ml-2">
                                        ({pkg.price.toLocaleString()} {pkg.currency.toUpperCase()})
                                      </span>
                                    )}
                                    {pkg.description && (
                                      <span className="block text-12 text-gray-500 mt-1">
                                        {pkg.description}
                                      </span>
                                    )}
                                  </div>
                                ))
                              : packagesData.packages.slice(0, 2).map((pkg) => (
                                  <div key={pkg.id} className="text-14 text-gray-600">
                                    <span className="font-medium">{pkg.name}</span>
                                    {pkg.price > 0 && (
                                      <span className="ml-2">
                                        ({pkg.price.toLocaleString()} {pkg.currency.toUpperCase()})
                                      </span>
                                    )}
                                  </div>
                                ))}
                          </div>
                          {packagesData.packages.length > 2 && (
                            <button
                              onClick={() => setPackagesExpanded(!packagesExpanded)}
                              className="text-13 sm:text-14 text-brand-500 hover:text-brand-600 font-medium mt-1"
                            >
                              {packagesExpanded ? 'See Less' : 'See More'}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-full border-brand-500 text-brand-500 hover:bg-brand-50"
                      onClick={() => {
                        // TODO: Implement chat functionality
                      }}
                      aria-label="Chat with provider"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 h-12 rounded-full bg-brand-500 hover:bg-brand-600 text-white"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews and Rating Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-12">
            {/* Left: Reviews */}
            <div className="lg:col-span-9">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-20 sm:text-24 md:text-30 font-semibold text-gray-900 leading-tight">
                  Reviews
                </h2>
                <span className="text-13 sm:text-14 text-gray-600">
                  {service.rating.count} reviews
                </span>
              </div>

              <div className="space-y-4">
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
                                {review.userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Review Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-15 sm:text-16 font-semibold text-gray-900">
                                  {review.userName}
                                </span>
                                {review.verified && (
                                  <Badge variant="success" size="sm">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-11 sm:text-12 text-gray-500">
                                  {formatRelativeTime(review.date)}
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
                            {review.helpful > 0 && (
                              <button className="flex items-center gap-1 text-11 sm:text-12 text-gray-500 hover:text-gray-700">
                                <ThumbsUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span>{review.helpful}</span>
                              </button>
                            )}
                          </div>
                          <p className="text-13 sm:text-14 text-gray-600 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-14 text-gray-500">
                      No reviews yet. Be the first to review this service!
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <button className="text-14 sm:text-16 font-semibold text-brand-400 hover:text-brand-500 transition-colors">
                  See more reviews
                </button>
              </div>

              {/* Write Your Review Section */}
              <div className="mt-8 p-4 sm:p-6">
                <h3 className="text-16 sm:text-18 font-semibold text-gray-900 mb-4">
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
                      if (reviewComment.trim() && userRating > 0 && !isNaN(parsedServiceId)) {
                        try {
                          const providerId = service?.provider?.id
                            ? parseInt(service.provider.id, 10)
                            : null

                          const response = await submitReviewMutation.mutateAsync({
                            serviceId: parsedServiceId,
                            rating: userRating,
                            review: reviewComment.trim(),
                            title: '',
                            providerId: providerId || null,
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
                    disabled={
                      !reviewComment.trim() ||
                      userRating === 0 ||
                      submitReviewMutation.isPending ||
                      isNaN(parsedServiceId)
                    }
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    aria-label="Send review"
                  >
                    {submitReviewMutation.isPending ? (
                      <LoadingSpinner size="sm" />
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
                  <div className="text-36 sm:text-40 md:text-48 font-semibold text-gray-900 mb-2">
                    {service.rating.value.toFixed(1)}
                  </div>
                  <div className="mb-2 flex justify-center">
                    <RatingDisplay
                      rating={service.rating.value}
                      showCount={false}
                      size="lg"
                    />
                  </div>
                  <p className="text-13 sm:text-14 text-gray-600">
                    {service.rating.count} Ratings
                  </p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3 mt-6">
                  {ratingDistribution.map(item => (
                    <div key={item.stars} className="space-y-1">
                      <div className="flex items-center justify-between text-11 sm:text-12">
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
          <div className="mb-12">
            <OfferBanner
              offers={[
                {
                  heading: '25% Offer On our products',
                  description:
                    'OurBride is your all-in-one platform for wedding planning and shopping. Find everything you need to create your perfect day.',
                  variant: 'default',
                  productImage: productImage,
                },
              ]}
            />
          </div>

          {/* Suggested for You Section */}
          <section className="mb-12 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-8">
              <h2 className="text-24 sm:text-28 md:text-30 lg:text-32 font-normal text-gray-900 leading-tight">
                Suggested for You
              </h2>
              <Link
                href="/services/category"
                className="flex items-center gap-2 text-14 sm:text-16 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                View All
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedServices.length > 0 ? (
                suggestedServices.map(suggestedService => (
                  <ServiceCardWithHandlers
                    key={suggestedService.id}
                    service={suggestedService}
                    onBookNow={(id) => router.push(`/booking/${id}`)}
                  />
                ))
              ) : (
                <p className="text-14 text-gray-500 col-span-full">
                  No related services found.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={isBookingConfirmationModalOpen}
        onClose={() => setIsBookingConfirmationModalOpen(false)}
      />
    </div>
  )
}
