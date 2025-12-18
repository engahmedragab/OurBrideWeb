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
      <div className="space-y-3 sm:space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-lg border border-gray-200 flex items-stretch sm:items-start gap-0 relative">
            {/* Image Thumbnail */}
            <div className="w-24 sm:w-32 md:w-36 h-full sm:h-auto self-stretch sm:self-start rounded-l-lg rounded-r-none bg-gray-200 flex-shrink-0 overflow-hidden">
              <Image
                src={booking.imageSrc || imageSrc}
                alt={booking.title}
                width={144}
                height={144}
                className="w-full h-full sm:h-auto sm:max-h-36 object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 py-2 sm:py-2 pl-3 sm:pl-4 pr-3 relative">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {/* Mobile Layout: Badge first, then title below */}
                {/* Badge - Show on mobile only, above title */}
                <div className="sm:hidden flex flex-col gap-2">
                  {booking.status === 'pending' && (
                    <Badge variant="pending" className="text-10 flex items-center gap-1 w-fit">
                      <Sun className="w-2.5 h-2.5" />
                      <span>Booking Pending</span>
                    </Badge>
                  )}
                  {booking.status === 'confirmed' && (
                    <Badge variant="confirmed" className="text-10 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Booking Confirmed</span>
                    </Badge>
                  )}
                  {booking.status === 'canceled' && (
                    <Badge variant="outline" className="text-10 flex items-center gap-1 w-fit border-red-500 text-red-500 bg-red-50">
                      <X className="w-2.5 h-2.5" />
                      <span>Booking Canceled</span>
                    </Badge>
                  )}
                  <p className="text-14 font-semibold text-gray-900">{booking.title}</p>
                </div>
                {/* Desktop Layout: Title and badge inline */}
                <div className="hidden sm:flex sm:items-start sm:justify-between sm:gap-2">
                  <p className="text-16 font-semibold text-gray-900 flex-1">{booking.title}</p>
                  {booking.status === 'pending' && (
                    <Badge variant="pending" className="text-12 flex items-center gap-1 flex-shrink-0">
                      <Sun className="w-4 h-4" />
                      <span>Booking Pending</span>
                    </Badge>
                  )}
                  {booking.status === 'confirmed' && (
                    <Badge variant="confirmed" className="text-12 flex items-center gap-1 flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Booking Confirmed</span>
                    </Badge>
                  )}
                  {booking.status === 'canceled' && (
                    <Badge variant="outline" className="text-12 flex items-center gap-1 flex-shrink-0 border-red-500 text-red-500 bg-red-50">
                      <X className="w-4 h-4" />
                      <span>Booking Canceled</span>
                    </Badge>
                  )}
                </div>
                <p className="text-12 sm:text-14 text-gray-600">Provider : {booking.providerUserName}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <p className="text-12 sm:text-14 text-gray-600">{booking.location}</p>
                  <p className="text-12 sm:text-14 text-gray-600">
                    {format(new Date(booking.date), 'dd/MM/yyyy')} {booking.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

