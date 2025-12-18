'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Sun, CheckCircle2, X } from 'lucide-react'
import { format } from 'date-fns'

export interface Booking {
  id: string | number
  title: string
  providerUserName: string
  location: string
  date: string | Date
  time: string
  status: 'pending' | 'confirmed' | 'canceled'
  providerImage?: string | any
  imageSrc?: string | any
}

export interface UpcomingBookingsProps {
  bookings: Booking[]
  imageSrc: string | any
  viewAllHref?: string
}

export const UpcomingBookings = ({ bookings, imageSrc, viewAllHref = '/events/planning/bookings' }: UpcomingBookingsProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Upcoming Bookings</h2>
        <Link
          href={viewAllHref}
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
        >
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-lg border border-gray-200 flex items-stretch gap-3 relative">
            {/* Image Thumbnail */}
            <div className="w-20 self-stretch rounded-l-lg rounded-r-none bg-gray-200 flex-shrink-0 overflow-hidden">
              <Image
                src={booking.imageSrc || imageSrc}
                alt={booking.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 py-3 pr-3">
              <p className="text-14 font-semibold text-gray-900 mb-1">{booking.title}</p>
              <p className="text-12 text-gray-600 mb-1">Provider : {booking.providerUserName}</p>
              <p className="text-12 text-gray-600 mb-1">{booking.location}</p>
              <p className="text-12 text-gray-600">
                {format(new Date(booking.date), 'dd/MM/yyyy')} {booking.time}
              </p>
            </div>
            
            {/* Status Badge - Top Right */}
            <div className="absolute top-3 right-3">
              {booking.status === 'pending' && (
                <Badge variant="pending" className="text-11 flex items-center gap-1 flex-shrink-0">
                  <Sun className="w-3 h-3" />
                  <span>Booking Pending</span>
                </Badge>
              )}
              {booking.status === 'confirmed' && (
                <Badge variant="confirmed" className="text-11 flex items-center gap-1 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Booking Confirmed</span>
                </Badge>
              )}
              {booking.status === 'canceled' && (
                <Badge variant="outline" className="text-11 flex items-center gap-1 flex-shrink-0 border-red-500 text-red-500 bg-red-50">
                  <X className="w-3 h-3" />
                  <span>Booking Canceled</span>
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

