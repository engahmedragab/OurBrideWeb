'use client'

import React, { useState } from 'react'
import NextImage from 'next/image'
import { useParams } from 'next/navigation'
import { ProviderPageLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { Star, CheckCircle2 } from 'lucide-react'

interface Review {
  id: string
  user: {
    name: string
    image: string
  }
  date: string
  rating: number
  content: string
}

interface Service {
  id: string
  title: string
  image: string
  rating: number
  price: number
  currency: string
}

/**
 * Provider Profile Page
 * Displays provider information, reviews, and services offered
 */
export default function ProviderProfilePage() {
  const params = useParams()
  const providerId = params?.id as string

  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('reviews')
  const [userReviewRating, setUserReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  // Mock provider data
  const provider = {
    id: providerId,
    name: 'Aya Mohamad',
    role: 'Makeup Artist',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    verified: true,
    rating: 4.5,
    followers: 520,
    followings: 150,
    isFollowing: false,
  }

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      user: {
        name: 'Aya Mohamed',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      date: '15 Aug 2025, 12:48 PM',
      rating: 4.5,
      content:
        'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie sit cras at sed lectus porta scelerisque. Tempus odio vitae nulla feugiat ornare non tempor sed maximus semper aliquet facilisis lacum elementum sagittis enim aliquet nullam nibh tempus turpis erat. Sit id molestie boncus id.',
    },
    {
      id: '2',
      user: {
        name: 'Aya Mohamed',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      date: '15 Aug 2025, 12:48 PM',
      rating: 4.5,
      content:
        'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie sit cras at sed lectus porta scelerisque. Tempus odio vitae nulla feugiat ornare non tempor sed maximus semper aliquet facilisis lacum elementum sagittis enim aliquet nullam nibh tempus turpis erat. Sit id molestie boncus id.',
    },
    {
      id: '3',
      user: {
        name: 'Aya Mohamed',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      date: '15 Aug 2025, 12:48 PM',
      rating: 4.5,
      content:
        'Lorem ipsum dolor sit amet consectetur. Bibendum vitae vel urna nullam ac. Eget tortor molestie sit cras at sed lectus porta scelerisque. Tempus odio vitae nulla feugiat ornare non tempor sed maximus semper aliquet facilisis lacum elementum sagittis enim aliquet nullam nibh tempus turpis erat. Sit id molestie boncus id.',
    },
  ]

  // Mock services data
  const services: Service[] = [
    {
      id: '1',
      title: 'Product Title',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200',
      rating: 4.5,
      price: 4500,
      currency: 'EGP',
    },
    {
      id: '2',
      title: 'Product Title',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200',
      rating: 4.5,
      price: 4500,
      currency: 'EGP',
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
    setUserReviewRating(0)
    setReviewText('')
  }

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => {
          const filled = star <= Math.floor(rating)
          const half = star === Math.ceil(rating) && rating % 1 !== 0

          return (
            <button
              key={star}
              onClick={() => interactive && onRatingChange?.(star)}
              disabled={!interactive}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            >
              <Star
                className={`h-5 w-5 ${
                  filled || half
                    ? 'fill-brand-500 text-brand-500'
                    : interactive
                    ? 'text-gray-300'
                    : 'text-gray-300'
                }`}
              />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <ProviderPageLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content - Reviews/Posts */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Tabs */}
          <div className="flex items-center gap-4 sm:gap-6 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-3 text-14 sm:text-16 font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'posts'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Posts
              <span className="ml-2 text-gray-500">15</span>
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-14 sm:text-16 font-medium transition-colors relative whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews
              <span className="ml-2 text-gray-500">120</span>
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
              )}
            </button>
          </div>

          {/* Reviews List */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.map(review => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <NextImage
                          src={review.user.image}
                          alt={review.user.name}
                          fill
                          sizes="48px"
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-16 font-semibold text-gray-900">
                          {review.user.name}
                        </h3>
                        <p className="text-12 text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-brand-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-14 font-medium">{review.rating}</span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-14 text-gray-700 leading-relaxed">
                    {review.content}
                  </p>
                </div>
              ))}

              {/* Write Review Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <NextImage
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                      alt="Your profile"
                      fill
                      sizes="48px"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    {/* Star Rating */}
                    <div className="mb-4">
                      {renderStars(userReviewRating, true, setUserReviewRating)}
                    </div>

                    {/* Review Text Input */}
                    <textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder="Write Your Review"
                      className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-xl text-14 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 resize-none"
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end mt-3">
                      <Button
                        variant="ghost"
                        className="text-14 font-medium text-gray-500 hover:text-gray-700"
                        onClick={handleSubmitReview}
                        disabled={userReviewRating === 0 || !reviewText.trim()}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Posts - Placeholder */}
          {activeTab === 'posts' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
              <p className="text-14 sm:text-16 text-gray-500">No posts yet</p>
            </div>
          )}
        </div>

        {/* Sidebar - Provider Info */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
          {/* Provider Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            {/* Profile Image */}
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <NextImage
                  src={provider.image}
                  alt={provider.name}
                  fill
                  sizes="96px"
                  className="rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            </div>

            {/* Provider Name */}
            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-18 font-semibold text-gray-900">
                  {provider.name}
                </h2>
                {provider.verified && (
                  <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-14 text-gray-600">{provider.role}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-1 mb-4">
              <span className="text-16 font-semibold text-gray-900">{provider.rating}</span>
              {renderStars(provider.rating)}
            </div>

            {/* Followers/Following */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-16 font-semibold text-gray-900">{provider.followers}</p>
                <p className="text-12 text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-16 font-semibold text-gray-900">{provider.followings}</p>
                <p className="text-12 text-gray-600">Followings</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="brand"
                className="w-full text-white"
                onClick={handleFollow}
              >
                Follow
              </Button>
              <Button
                variant="outline"
                className="w-full border-brand-500 text-brand-500 hover:bg-brand-50"
                onClick={handleMessage}
              >
                Message
              </Button>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-14 sm:text-16 font-semibold text-gray-900">Services</h3>
              <span className="text-12 sm:text-14 text-gray-500">{services.length}</span>
            </div>

            <div className="space-y-3">
              {services.map(service => (
                <div
                  key={service.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all cursor-pointer"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <NextImage
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="64px"
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-14 font-medium text-gray-900 mb-1 truncate">
                      {service.title}
                    </h4>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3 w-3 fill-brand-500 text-brand-500" />
                      <span className="text-12 text-gray-600">{service.rating}</span>
                    </div>
                    <p className="text-12 text-gray-500">
                      Starting from{' '}
                      <span className="font-semibold text-gray-900">
                        {service.price} {service.currency}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </ProviderPageLayout>
  )
}

