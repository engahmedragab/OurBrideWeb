'use client'

import Image from 'next/image'
import { MainGuestBookResponse } from '@/types/responses'
// import { Facebook, Instagram, MessageCircle, Link as LinkIcon } from 'lucide-react'

export interface GuestsInvitationProps {
  book: MainGuestBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
  imageSrc: string | any
}

export const GuestsInvitation = ({
  book,
  onInit,
  onNavigate,
  eventId,
  imageSrc,
}: GuestsInvitationProps) => {
  const needsInit = !book.isBookInit

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (needsInit && onInit) {
      await onInit()
    }
    if (onNavigate) {
      onNavigate()
    }
  }

  // Get count from book
  const guestCount = book.count || 0
  // Get description from book, or use fallback text
  const description = book.description?.trim() || 'No description available'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Guests & Invitation</h2>
        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
        >
          View Details
        </button>
      </div>

      <div className="space-y-3">
        {/* Event Image - Top */}
        <div className="relative w-full h-52  rounded-lg overflow-hidden">
          <Image
            src={imageSrc}
            alt="Event Image"
            fill
            className="object-cover "
          />
        </div>

        {/* Description and Guest Count - Bottom */}
        <div className="space-y-2">
          
          <div className="flex items-center justify-between">
            <span className="text-13 text-gray-600">Invited Guests</span>
            <span className="text-14 font-semibold text-gray-900">{guestCount} Guest</span>
          </div>
          <p className="text-14 text-gray-600">{description}</p>
        </div>

        {/* Social Share Buttons - Commented out temporarily */}
        {/* <div className="flex gap-2">
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
        </div> */}
      </div>
    </div>
  )
}

