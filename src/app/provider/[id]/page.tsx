'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {
  Star,
  CheckCircle2,
  MessageSquare,
  Plus,
  ThumbsUp,
  Send,
} from 'lucide-react'
import { ProviderPageLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { PostCard } from '@/components/community'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { RatingDisplay } from '@/components/ui/RatingDisplay'
import { RatingInput } from '@/components/ui/RatingInput'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  userName: string
  userAvatar?: string
  date: string
  rating: number
  text: string
  helpful?: number
}

/**
 * Provider Profile Page
 * Displays provider information, reviews, and services offered
 */
export default function ProviderProfilePage() {
  const params = useParams()
  const providerId = params?.id as string

  const [activeTab, setActiveTab] = useState<'store' | 'posts' | 'reviews'>(
    'posts'
  )
  const [userRating, setUserRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  // Mock provider data
  const provider = {
    id: providerId,
    name: 'Ahmed Ramadan',
    role: 'Makeup Artist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    verified: true,
    rating: 4.5,
    posts: 5,
    followers: 150,
    followings: 150,
    isFollowing: false,
    storeCount: 4,
    postsCount: 15,
    reviewsCount: 120,
  }

  // Mock posts data
  const providerPosts = [
    {
      id: '1',
      author: {
        name: 'Ahmed Ramadan',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      timestamp: '18 Aug 2025 12:45 PM',
      content:
        'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
      images: [],
      likes: 20,
      comments: 20,
      shares: 20,
    },
    {
      id: '2',
      author: {
        name: 'Ahmed Ramadan',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      timestamp: '18 Aug 2025 12:45 PM',
      content:
        'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque.',
      images: [
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
      ],
      likes: 20,
      comments: 20,
      shares: 20,
    },
  ]

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Aya Mohamed',
      userAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: '18 Aug 2025 12:45 PM',
      rating: 4.5,
      text: 'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque. Tempus odio vitae nulla feugiat ornare non tempor.Sed nascetur semper aliquet facilisis. Ipsum elementum sagittis enim aliquet nullam nibh tempus nunc erat. Elit id malesuada blandit id.',
      helpful: 24,
    },
    {
      id: '2',
      userName: 'Aya Mohamed',
      userAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: '18 Aug 2025 12:45 PM',
      rating: 4.5,
      text: 'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie ut cras et sed lectus porta scelerisque. Tempus odio vitae nulla feugiat ornare non tempor.Sed nascetur semper aliquet facilisis. Ipsum elementum sagittis enim aliquet nullam nibh tempus nunc erat. Elit id malesuada blandit id.',
      helpful: 18,
    },
  ]

  // Rating breakdown data
  const ratingDistribution = [
    { stars: 5, count: 80, percentage: 33 },
    { stars: 4, count: 120, percentage: 50 },
    { stars: 3, count: 40, percentage: 17 },
    { stars: 2, count: 8, percentage: 3 },
    { stars: 1, count: 2, percentage: 1 },
  ]

  const overallRating = 4.0

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

  // Mock store products/services
  const storeItems = [
    {
      id: '1',
      title: 'Bridal Makeup Package',
      image:
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
      price: { original: 5000, discounted: 4500, currency: 'EGP' },
      rating: { value: 4.5, count: 24 },
      provider: {
        id: providerId,
        name: 'Ahmed Ramadan',
        verified: true,
        image: provider.image,
      },
      isWishlisted: false,
      showTopOfferBadge: false,
    },
    {
      id: '2',
      title: 'Hair Styling Service',
      image:
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
      price: { original: 3000, discounted: 2500, currency: 'EGP' },
      rating: { value: 4.8, count: 18 },
      provider: {
        id: providerId,
        name: 'Ahmed Ramadan',
        verified: true,
        image: provider.image,
      },
      isWishlisted: false,
      showTopOfferBadge: true,
    },
    {
      id: '3',
      title: 'Complete Beauty Package',
      image:
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
      price: { original: 8000, discounted: 7000, currency: 'EGP' },
      rating: { value: 4.7, count: 32 },
      provider: {
        id: providerId,
        name: 'Ahmed Ramadan',
        verified: true,
        image: provider.image,
      },
      isWishlisted: false,
      showTopOfferBadge: false,
    },
  ]

  const handleFollow = () => {
    // TODO: Implement follow functionality
  }

  const handleMessage = () => {
    // TODO: Implement message functionality
  }

  const handleSubmitReview = () => {
    // TODO: Implement review submission
    if (userRating > 0 && reviewComment.trim()) {
      // Add review logic here
      setUserRating(0)
      setReviewComment('')
    }
  }

  return (
    <ProviderPageLayout>
      <div className="flex flex-col space-y-6">
        {/* Profile Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          {/* Mobile Layout */}
          <div className="flex flex-col items-center md:hidden mb-6">
            {/* Profile Picture */}
            <div className="relative w-20 h-20 mb-4">
              <Image
                src={provider.image}
                alt={provider.name}
                fill
                sizes="80px"
                className="rounded-full object-cover"
              />
            </div>

            {/* Name */}
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-18 font-normal text-gray-900">
                {provider.name}
              </h1>
              {provider.verified && (
                <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4">
              <div className="text-14 font-normal text-gray-600">
                {provider.posts} Posts
              </div>
              <div className="text-14 font-normal text-gray-600">
                {provider.followers} Followers
              </div>
              <div className="text-14 font-normal text-gray-600">
                {provider.followings} Followings
              </div>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <RatingDisplay
                rating={provider.rating}
                showCount={false}
                size="md"
              />
            </div>

            {/* Action Buttons - Stacked */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button
                variant="brand"
                size="default"
                className="w-full text-14 font-normal text-white flex items-center justify-center gap-2"
                onClick={handleFollow}
              >
                <Plus className="h-4 w-4" />
                Follow
              </Button>
              <Button
                variant="outline"
                size="default"
                className="w-full text-14 font-normal border-brand-500 text-brand-500 hover:bg-brand-50 flex items-center justify-center gap-2"
                onClick={handleMessage}
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex flex-row items-start md:items-center gap-4 md:gap-6 mb-6">
            {/* Profile Picture */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={provider.image}
                alt={provider.name}
                fill
                sizes="80px"
                className="rounded-full object-cover"
              />
            </div>

            {/* Name, Stats, and Rating */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-18 md:text-20 font-normal text-gray-900">
                  {provider.name}
                </h1>
                {provider.verified && (
                  <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 md:gap-6 mb-4">
                <div className="text-14 font-normal text-gray-600">
                  {provider.posts} Posts
                </div>
                <div className="text-14 font-normal text-gray-600">
                  {provider.followers} Followers
                </div>
                <div className="text-14 font-normal text-gray-600">
                  {provider.followings} Followings
                </div>
              </div>
            </div>

            {/* Rating and Action Buttons */}
            <div className="flex flex-col items-end gap-3">
              {/* Rating */}
              <RatingDisplay
                rating={provider.rating}
                showCount={false}
                size="md"
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-14 font-normal border-brand-500 text-brand-500 hover:bg-brand-50 flex items-center gap-2"
                  onClick={handleMessage}
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  className="text-14 font-normal text-white flex items-center gap-2"
                  onClick={handleFollow}
                >
                  <Plus className="h-4 w-4" />
                  Follow
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-t border-gray-200 pt-4">
            <button
              onClick={() => setActiveTab('store')}
              className={cn(
                'flex-1 pb-3 text-14 font-normal transition-colors relative text-center',
                activeTab === 'store'
                  ? 'text-brand-500'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <span>Store</span>{' '}
              <span
                className={cn(
                  activeTab === 'store' ? 'text-gray-500' : 'text-gray-500'
                )}
              >
                {provider.storeCount}
              </span>
              {activeTab === 'store' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={cn(
                'flex-1 pb-3 text-14 font-normal transition-colors relative text-center',
                activeTab === 'posts'
                  ? 'text-brand-500'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <span>Posts</span>{' '}
              <span
                className={cn(
                  activeTab === 'posts' ? 'text-gray-500' : 'text-gray-500'
                )}
              >
                {provider.postsCount}
              </span>
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={cn(
                'flex-1 pb-3 text-14 font-normal transition-colors relative text-center',
                activeTab === 'reviews'
                  ? 'text-brand-500'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <span>Reviews</span>{' '}
              <span
                className={cn(
                  activeTab === 'reviews' ? 'text-gray-500' : 'text-gray-500'
                )}
              >
                {provider.reviewsCount}
              </span>
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content - Posts/Reviews/Store */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
              {/* Left: Reviews */}
              <div className="lg:col-span-9 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-24 md:text-30 font-semibold text-gray-900">
                    Reviews
                  </h2>
                  <span className="text-14 text-gray-600">
                    {provider.reviewsCount} reviews
                  </span>
                </div>

                <div className="space-y-4">
                  {reviews.map(review => (
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
                                <RatingDisplay
                                  rating={review.rating}
                                  showCount={false}
                                  size="sm"
                                />
                              </div>
                            </div>
                            {review.helpful !== undefined && (
                              <button className="flex items-center gap-1 text-12 text-gray-500 hover:text-gray-700">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{review.helpful}</span>
                              </button>
                            )}
                          </div>
                          <p className="text-14 text-gray-600 leading-relaxed">
                            {review.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    className="text-16 font-semibold text-brand-400 hover:text-brand-500 transition-colors p-0 h-auto"
                  >
                    See more reviews
                  </Button>
                </div>

                {/* Write Your Review Section */}
                <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg">
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
                      onClick={handleSubmitReview}
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
                      {overallRating}
                    </div>
                    <div className="mb-2 flex justify-center">
                      <RatingDisplay
                        rating={overallRating}
                        showCount={false}
                        size="lg"
                      />
                    </div>
                    <p className="text-14 text-gray-600">
                      Based on {provider.reviewsCount} reviews
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
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {providerPosts.map(post => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={post.author}
                  content={post.content}
                  images={post.images}
                  timestamp={post.timestamp}
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                />
              ))}
            </div>
          )}

          {/* Store Tab */}
          {activeTab === 'store' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {storeItems.map(item => (
                <ServiceCard
                  key={item.id}
                  service={{
                    id: item.id,
                    title: item.title,
                    images: [item.image],
                    price: item.price,
                    rating: item.rating,
                    provider: item.provider,
                    isWishlisted: item.isWishlisted,
                    showTopOfferBadge: item.showTopOfferBadge,
                    available: true,
                    category: { id: '1', name: 'Beauty', slug: 'beauty' },
                    tags: [],
                    description: '',
                    longDescription: '',
                    availabilityDays: {
                      monday: true,
                      tuesday: true,
                      wednesday: true,
                      thursday: true,
                      friday: true,
                      saturday: true,
                      sunday: true,
                    },
                  }}
                  onWishlistToggle={() => { }}
                  onBookNow={() => { }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProviderPageLayout>
  )
}
