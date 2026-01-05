'use client'

import { ArrowRight, Star } from 'lucide-react'
import { Button } from './Button'
import { RatingDisplay } from './RatingDisplay'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export interface ForBusinessSectionProps {
  headline: string
  description: string
  buttonText?: string
  buttonHref?: string
  onButtonClick?: () => void
  rating?: number
  ratingLabel?: string
  reviewCount?: string
  reviewSource?: string
  reviewSourceLogo?: string
  className?: string
}

/**
 * ForBusinessSection Component
 * Promotional section for business/providers with ratings and software preview
 */
export const ForBusinessSection = ({
  headline,
  description,
  buttonText = 'Find out more',
  buttonHref,
  onButtonClick,
  rating = 5,
  ratingLabel = 'Excellent 5/5',
  reviewCount = 'Over 1250 reviews',
  reviewSource = 'Capterra',
  reviewSourceLogo,
  className,
}: ForBusinessSectionProps) => {
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick()
    } else if (buttonHref) {
      window.location.href = buttonHref
    }
  }

  return (
    <section
      className={cn(
        'py-16 sm:py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden',
        className
      )}
    >
      {/* Background Gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-brand-50/50 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Section - Text Content */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Headline */}
            <h2 className="text-32 sm:text-40 md:text-48 lg:text-56 font-bold text-gray-900 leading-tight">
              {headline}
            </h2>

            {/* Description */}
            <p className="text-16 sm:text-18 md:text-20 text-gray-900 leading-relaxed">
              {description}
            </p>

            {/* Call to Action Button */}
            <div>
              <Button
                onClick={handleButtonClick}
                variant="default"
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-16 font-medium flex items-center gap-2 group"
              >
                {buttonText}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Ratings Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-16 font-semibold text-gray-900">
                  {ratingLabel}
                </span>
                <RatingDisplay rating={rating} size="sm" showValue={false} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-14 text-gray-600">
                  {reviewCount} on {reviewSource}
                </span>
                {reviewSourceLogo ? (
                  <Image
                    src={reviewSourceLogo}
                    alt={reviewSource}
                    width={80}
                    height={24}
                    className="h-6"
                  />
                ) : (
                  <div className="w-20 h-6 bg-gray-300 rounded flex items-center justify-center">
                    <span className="text-10 text-gray-600 font-semibold">
                      {reviewSource}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Software Interface Preview */}
          <div className="relative">
            {/* Main Calendar View (Desktop) */}
            <div className="relative z-10 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
              <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] bg-gray-50">
                {/* Calendar Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-brand-500" />
                      <span className="text-14 font-semibold text-gray-900">
                        ourbride
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-gray-100 rounded text-12 text-gray-700">
                        The 7th Heaven Beauty
                      </div>
                      <div className="px-3 py-1.5 bg-gray-100 rounded text-12 text-gray-700">
                        Working Staff
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded" />
                      <span className="text-12 text-gray-700">Today</span>
                      <span className="text-12 text-gray-700">
                        Tuesday 27 Aug, 2023
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-4 h-full overflow-auto">
                  <div className="flex gap-2">
                    {/* Staff Columns */}
                    {[
                      {
                        name: 'Brenda Massey',
                        service: 'Blow Dry',
                        time: '9:00 - 10:00',
                        color: 'bg-blue-200',
                      },
                      {
                        name: 'Zachary Kelley',
                        service: 'Beard Grooming',
                        time: '9:00 - 10:00',
                        color: 'bg-pink-200',
                      },
                      {
                        name: 'Jenny Murtaugh',
                        service: 'Massage',
                        time: '10:00 - 11:00',
                        color: 'bg-teal-200',
                      },
                      {
                        name: 'Diana Cam',
                        service: 'Balinese M',
                        time: '9:45 - 11:00',
                        color: 'bg-orange-200',
                      },
                    ].map((staff, idx) => (
                      <div key={idx} className="flex-1 min-w-[120px]">
                        <div className="flex flex-col items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-200 to-brand-400 mb-2" />
                          <span className="text-10 text-gray-700 text-center">
                            {staff.name.split(' ')[0]}
                          </span>
                        </div>
                        <div className={`${staff.color} rounded-lg p-2 mb-2`}>
                          <div className="text-10 font-medium text-gray-800">
                            {staff.time}
                          </div>
                          <div className="text-10 text-gray-700">
                            {staff.service}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App Preview (Overlapping) */}
            <div className="absolute -bottom-8 -left-8 z-0 w-[200px] sm:w-[240px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transform rotate-[8deg] hover:rotate-[6deg] transition-transform duration-300">
              <div className="w-full h-[320px] sm:h-[400px]">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200">
                  <div className="w-6 h-6 bg-gray-200 rounded" />
                  <div className="flex gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded" />
                    <div className="w-5 h-5 bg-gray-200 rounded" />
                  </div>
                </div>

                {/* Business Image */}
                <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-10 px-2 py-1 rounded">
                    1/6
                  </div>
                </div>

                {/* Business Details */}
                <div className="p-3">
                  <h3 className="text-14 font-bold text-gray-900 mb-1">
                    The 7th Heaven Beauty
                  </h3>
                  <div className="flex items-center gap-1 mb-1">
                    <RatingDisplay rating={5} size="xs" showValue={false} />
                    <span className="text-10 text-gray-600">1,743 reviews</span>
                  </div>
                  <p className="text-10 text-gray-600 mb-1">
                    2.0km • Notting Hill, London
                  </p>
                  <p className="text-10 text-green-600 font-medium mb-2">
                    Open now 10am - 6pm
                  </p>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-400 rounded" />
                    <span className="text-10 text-gray-700">
                      Instant booking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
