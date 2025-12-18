'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'

export interface EventSummaryCardProps {
  eventName: string
  eventDate: Date
  imageSrc: string | any
  viewDetailsHref?: string
}

export const EventSummaryCard = ({
  eventName,
  eventDate,
  imageSrc,
  viewDetailsHref = '/events/planning/calender',
}: EventSummaryCardProps) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const difference = eventDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

        setTimeRemaining({ days, hours, minutes })
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0 })
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 60000)

    return () => clearInterval(interval)
  }, [eventDate])

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 h-40 md:h-auto relative overflow-hidden">
          <Image
            src={imageSrc}
            alt="Event Hero"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Event Details */}
        <div className="md:w-2/3 p-4 md:p-6 relative">
          {/* Action Buttons */}
          <div className="absolute top-3 right-3">
            <Link href={viewDetailsHref} className="text-brand-500 hover:text-brand-600 text-12 font-medium">
              View Details
            </Link>
          </div>

          <div className="mt-6 md:mt-0">
            <h1 className="text-22 sm:text-24 font-semibold text-gray-900 mb-2">{eventName}</h1>
            <div className="flex items-center gap-2 text-14 text-gray-600 mb-4">
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>{format(eventDate, 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-24 sm:text-28 font-bold text-brand-500 leading-none">
                  {timeRemaining.days}
                </p>
                <p className="text-12 text-gray-600 mt-1">Days</p>
              </div>
              <div className="text-center">
                <p className="text-24 sm:text-28 font-bold text-brand-500 leading-none">
                  {timeRemaining.hours}
                </p>
                <p className="text-12 text-gray-600 mt-1">Hours</p>
              </div>
              <div className="text-center">
                <p className="text-24 sm:text-28 font-bold text-brand-500 leading-none">
                  {timeRemaining.minutes}
                </p>
                <p className="text-12 text-gray-600 mt-1">Min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

