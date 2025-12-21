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
} from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Service } from '@/types/service'
import productImage from '@/assets/svg/product-1.svg'

interface ServiceDetailClientProps {
  serviceId: string
}

// Mock data - Replace with API call
const mockService: Service = {
  id: '1',
  title: 'Wedding Makeup Service',
  description:
    'Professional bridal makeup for your special day. Perfect for creating a flawless look.',
  longDescription:
    'Our professional wedding makeup service is designed to make you look absolutely stunning on your special day. Our experienced makeup artists use only premium, long-lasting products that are perfect for photography and will keep you looking beautiful throughout your entire celebration. We specialize in creating natural, radiant looks that enhance your features while maintaining your personal style. Our team will work with you to create the perfect look that matches your wedding theme and dress. We offer a trial session before your wedding day to ensure you are completely satisfied with your look. Our makeup artists are trained in various techniques including airbrush makeup, HD makeup, and traditional application methods.',
  images: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1560066984-10d1eeb6b2a5?w=800',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
  ],
  provider: {
    id: '1',
    name: 'Beauty Studio Pro',
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  price: {
    original: 5000,
    discounted: 4500,
    currency: 'egp',
  },
  rating: {
    value: 4.0,
    count: 250,
  },
  category: {
    id: '1',
    name: 'Makeup',
    slug: 'makeup',
  },
  tags: ['Makeup', 'Bridal', 'Professional'],
  available: true,
  availabilityDays: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  },
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
    userName: 'aymanhany',
    userAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    date: '2 months ago',
    rating: 5,
    text: 'Amazing service! The makeup artist was professional and created the perfect look for my wedding day. Highly recommend!',
    helpful: 24,
  },
  {
    id: '2',
    userName: 'sarah_johnson',
    userAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    date: '3 months ago',
    rating: 4,
    text: 'Great experience! The makeup lasted all day and looked beautiful in photos. Very satisfied with the service.',
    helpful: 18,
  },
  {
    id: '3',
    userName: 'emily_chen',
    date: '1 month ago',
    rating: 5,
    text: 'Perfect makeup for my special day! The artist was skilled and made me feel comfortable throughout the process.',
    helpful: 12,
  },
  {
    id: '4',
    userName: 'maria_garcia',
    userAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    date: '2 weeks ago',
    rating: 4,
    text: 'Excellent service! The makeup was flawless and stayed perfect throughout the entire wedding celebration.',
    helpful: 31,
  },
]

// Mock rating distribution
const ratingDistribution = [
  { stars: 5, count: 125, percentage: 50 },
  { stars: 4, count: 75, percentage: 30 },
  { stars: 3, count: 30, percentage: 12 },
  { stars: 2, count: 15, percentage: 6 },
  { stars: 1, count: 5, percentage: 2 },
]

// Mock suggested services
const mockSuggestedServices: Service[] = [
  {
    id: '2',
    title: 'Hair Styling Service',
    description: 'Expert hair styling and hairdo for weddings.',
    images: ['https://images.unsplash.com/photo-1560066984-10d1eeb6b2a5?w=400'],
    provider: {
      id: '2',
      name: 'Hair Studio Elite',
      verified: true,
    },
    price: { original: 4000, discounted: 3500, currency: 'egp' },
    rating: { value: 4.0, count: 119 },
    category: { id: '2', name: 'Hair Care', slug: 'hair-care' },
    tags: ['Hair', 'Styling'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    showTopOfferBadge: true,
  },
  {
    id: '3',
    title: 'Bridal Skincare Treatment',
    description: 'Complete skincare routine for glowing bridal skin.',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    ],
    provider: {
      id: '3',
      name: 'Skincare Co',
      verified: true,
    },
    price: { original: 6000, discounted: 5000, currency: 'egp' },
    rating: { value: 4.0, count: 119 },
    category: { id: '3', name: 'Skin Care', slug: 'skin-care' },
    tags: ['Skin', 'Care', 'Treatment'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
  },
  {
    id: '4',
    title: 'Spa & Relaxation Package',
    description: 'Full body spa treatment for pre-wedding relaxation.',
    images: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'],
    provider: {
      id: '4',
      name: 'Luxury Spa',
      verified: true,
    },
    price: { original: 8000, discounted: 6500, currency: 'egp' },
    rating: { value: 4.0, count: 119 },
    category: { id: '4', name: 'Spa & Massage', slug: 'spa-massage' },
    tags: ['Spa', 'Massage', 'Relaxation'],
    available: true,
    availabilityDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    showTopOfferBadge: true,
  },
  {
    id: '5',
    title: 'Wedding Photography',
    description: 'Professional wedding photography services.',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    ],
    provider: {
      id: '5',
      name: 'Photo Studio Pro',
      verified: true,
    },
    price: { original: 15000, discounted: 12000, currency: 'egp' },
    rating: { value: 4.0, count: 119 },
    category: { id: '5', name: 'Photography', slug: 'photography' },
    tags: ['Photography', 'Wedding'],
    available: true,
    availabilityDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
]

export function ServiceDetailClient({ serviceId }: ServiceDetailClientProps) {
  const router = useRouter()
  const [service, setService] = useState(mockService)
  const [userRating, setUserRating] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(
    service.isWishlisted || false
  )
  const [reviewComment, setReviewComment] = useState('')
  const [branchesExpanded, setBranchesExpanded] = useState(false)
  const [packagesExpanded, setPackagesExpanded] = useState(false)
  const [isBookingConfirmationModalOpen, setIsBookingConfirmationModalOpen] =
    useState(false)

  // Fetch service based on id - Replace with API call
  useEffect(() => {
    if (serviceId) {
      // TODO: Replace with actual API call
      setService(mockService)
    }
  }, [serviceId])

  const handleBookNow = () => {
    router.push('/booking')
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    // TODO: Implement wishlist toggle
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
                <ProviderCard
                  provider={{
                    ...service.provider,
                    rating: service.rating.value,
                    profession: 'Makeup Artist',
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
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="text-13 sm:text-14 font-semibold text-gray-900 mb-2">
                      Packages Details
                    </h4>
                    <div
                      className={cn(
                        'space-y-1',
                        !packagesExpanded && 'line-clamp-2'
                      )}
                    >
                      {packagesExpanded ? (
                        <>
                          <p className="text-14 text-gray-600">
                            Package 1 ({' '}
                            {service.price.discounted.toLocaleString()}{' '}
                            {service.price.currency} ) : Type Some Details Here
                          </p>
                          <p className="text-14 text-gray-600">
                            Package 2 ({' '}
                            {service.price.original.toLocaleString()}{' '}
                            {service.price.currency} ) : Type Some Details Here
                            for Package 2. This package includes additional
                            services and premium features.
                          </p>
                          <p className="text-14 text-gray-600">
                            Package 3 ({' '}
                            {(service.price.original * 1.5).toLocaleString()}{' '}
                            {service.price.currency} ) : Premium package with
                            all services included. This is our most
                            comprehensive offering.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-14 text-gray-600">
                            Package 1 ({' '}
                            {service.price.discounted.toLocaleString()}{' '}
                            {service.price.currency} ) : Type Some Details Here
                          </p>
                          <p className="text-14 text-gray-600">
                            Package 2 ({' '}
                            {service.price.original.toLocaleString()}{' '}
                            {service.price.currency} ) : Ty...
                          </p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setPackagesExpanded(!packagesExpanded)}
                      className="text-13 sm:text-14 text-brand-500 hover:text-brand-600 font-medium mt-1"
                    >
                      {packagesExpanded ? 'See Less' : 'See More'}
                    </button>
                  </div>

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
                      disabled={!service.available}
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
                              <span className="text-15 sm:text-16 font-semibold text-gray-900">
                                {review.userName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-11 sm:text-12 text-gray-500">
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
                          <button className="flex items-center gap-1 text-11 sm:text-12 text-gray-500 hover:text-gray-700">
                            <ThumbsUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span>{review.helpful}</span>
                          </button>
                        </div>
                        <p className="text-13 sm:text-14 text-gray-600 leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
              {mockSuggestedServices.map(suggestedService => (
                <ServiceCard
                  key={suggestedService.id}
                  service={suggestedService}
                  onWishlistToggle={handleWishlistToggle}
                  onBookNow={handleBookNow}
                />
              ))}
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
