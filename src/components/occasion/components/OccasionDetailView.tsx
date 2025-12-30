'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, MapPin, Clock } from 'lucide-react'
import type { OccasionLineResponse } from '@/types/responses'
import occasionImage from '@/assets/images/occasion.png'
import brideNameSvg from '@/assets/svg/bridename.svg'
import groomNameSvg from '@/assets/svg/groomname.svg'
import heartSvg from '@/assets/svg/heart.svg'

interface OccasionDetailViewProps {
  occasion: OccasionLineResponse
  onClose: () => void
  onEdit?: () => void
}

/**
 * Format date from ISO string to readable format
 */
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No date'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid date'
  }
}

/**
 * Format date and time from ISO string
 */
const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No date'
  try {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${day}, ${month} ${year} ${hours}:${minutes}`
  } catch {
    return 'Invalid date'
  }
}

/**
 * Calculate time remaining until the occasion
 */
const calculateTimeRemaining = (targetDate: string | null | undefined) => {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, isPast: true }
  }

  const now = new Date()
  const target = new Date(targetDate)
  const diff = target.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, isPast: false }
}

export function OccasionDetailView({ occasion, onClose, onEdit }: OccasionDetailViewProps) {
  // Initialize with null to avoid hydration mismatch, then calculate on client side
  const [timeRemaining, setTimeRemaining] = useState<ReturnType<typeof calculateTimeRemaining> | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Calculate initial time on client side only
    setTimeRemaining(calculateTimeRemaining(occasion.date))
    
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(occasion.date))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [occasion.date])

  const groomFirstName = occasion.groomFirstName || ''
  const groomLastName = occasion.groomLastName || ''
  const brideFirstName = occasion.brideFirstName || ''
  const brideLastName = occasion.brideLastName || ''
  const groomFullName = [groomFirstName, groomLastName].filter(Boolean).join(' ') || 'Groom Name'
  const brideFullName = [brideFirstName, brideLastName].filter(Boolean).join(' ') || 'Bride Name'
  const occasionTitle = occasion.title || occasion.titleEn || occasion.titleAr || 'Occasion Name'
  const location = 'Giza, 6 of October' // This could come from occasion data if available

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full">
        {/* Header */}
        <div className="relative">
          {/* Floral Banner Image */}
          <div className="relative h-48 md:h-56 w-full">
            <Image
              src={occasionImage}
              alt="Occasion Banner"
              fill
              className="object-cover rounded-t-2xl"
              priority
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20 rounded-t-2xl"></div>
            {/* Close button overlay */}
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="p-2  backdrop-blur-sm rounded-lg text-gray-600 hover:bg-white/50 transition-all shadow-sm"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8 space-y-4 md:space-y-6">
          {/* Names Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-5">
            {/* Groom Name */}
            <div className="flex flex-col items-center gap-1 md:gap-1.5 order-1 md:order-1">
              <Image
                src={typeof groomNameSvg === 'string' ? groomNameSvg : groomNameSvg.src || groomNameSvg}
                alt={groomFullName}
                width={223}
                height={42}
                className="h-8 md:h-10 w-auto"
              />
              <p className="text-12 md:text-16 italic text-gray-900 font-semibold">{groomFullName}</p>
            </div>

            {/* Heart */}
            <div className="flex-shrink-0 order-2 md:order-2">
              <Image
                src={typeof heartSvg === 'string' ? heartSvg : heartSvg.src || heartSvg}
                alt="Heart"
                width={188}
                height={119}
                className="h-12 md:h-16 w-auto"
              />
            </div>

            {/* Bride Name */}
            <div className="flex flex-col items-center gap-1 md:gap-1.5 order-3 md:order-3">
              <Image
                src={typeof brideNameSvg === 'string' ? brideNameSvg : brideNameSvg.src || brideNameSvg}
                alt={brideFullName}
                width={203}
                height={38}
                className="h-8 md:h-10 w-auto"
              />
              <p className="text-12 md:text-16 italic text-gray-900 font-semibold">{brideFullName}</p>
            </div>
          </div>

          {/* Countdown */}
          {isMounted && timeRemaining && !timeRemaining.isPast && (
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-24 md:text-32 font-bold text-gray-900 leading-tight italic">{timeRemaining.days}</div>
                  <div className="text-12 md:text-14 text-gray-600 font-medium mt-0.5 italic">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-24 md:text-32 font-bold text-gray-900 leading-tight italic">{timeRemaining.hours}</div>
                  <div className="text-12 md:text-14 text-gray-600 font-medium mt-0.5 italic">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-24 md:text-32 font-bold text-gray-900 leading-tight italic">{timeRemaining.minutes}</div>
                  <div className="text-12 md:text-14 text-gray-600 font-medium mt-0.5 italic">Minutes</div>
                </div>
              </div>
            </div>
          )}

          {/* Invitation Message */}
          <div className="text-center space-y-0.5">
          
            <p className="text-16 md:text-24 italic font-semibold text-gray-900">
              {occasionTitle}
            </p>
          </div>

          {/* Event Details */}
          <div className="flex items-center justify-center gap-8 pt-3 md:pt-4 border-t border-gray-200">
            {/* Date and Time */}
            <div className="flex items-center gap-2 text-12 md:text-14 text-gray-700">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-brand-500 flex-shrink-0" />
              <span>{formatDateTime(occasion.date)}</span>
            </div>
          </div>

          {/* Additional Info */}
          {occasion.caption && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-14 text-gray-600 italic text-center">{occasion.caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

