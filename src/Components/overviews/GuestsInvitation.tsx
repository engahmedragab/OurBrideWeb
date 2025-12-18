'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, MessageCircle, Link as LinkIcon } from 'lucide-react'

export interface GuestsInvitationProps {
  invitedGuests: number
  remainingSeats: number
  imageSrc: string | any
  viewDetailsHref?: string
}

export const GuestsInvitation = ({
  invitedGuests,
  remainingSeats,
  imageSrc,
  viewDetailsHref = '/events/planning/calender',
}: GuestsInvitationProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Guests & Invitation</h2>
        <Link
          href={viewDetailsHref}
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
        >
          View Details
        </Link>
      </div>
      
      <div className="space-y-3">
        {/* Guest Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-13 text-gray-600">Invited Guests</span>
            <span className="text-14 font-semibold text-gray-900">{invitedGuests} Guest</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-13 text-gray-600">Remaining Seats</span>
            <span className="text-14 font-semibold text-gray-900">{remainingSeats} Seat</span>
          </div>
        </div>

        {/* Event Image */}
        <div className="relative w-full h-40 rounded-t-lg overflow-hidden mt-3">
          <Image
            src={imageSrc}
            alt="Event Image"
            fill
            className="object-cover"
          />
        </div>

        {/* Social Share Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/50 transition-all duration-300 group">
            <Facebook className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" />
          </button>
          <button className="flex-1 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/50 transition-all duration-300 group">
            <Instagram className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" />
          </button>
          <button className="flex-1 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/50 transition-all duration-300 group">
            <MessageCircle className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" />
          </button>
          <button className="flex-1 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/50 transition-all duration-300 group">
            <LinkIcon className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
}

