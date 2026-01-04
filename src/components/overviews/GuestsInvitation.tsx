'use client'

import Image from 'next/image'
import type { ImageProps } from 'next/image'
import type { MouseEvent } from 'react'
import type { MainGuestBookResponse } from '@/types/responses'

export interface GuestsInvitationProps {
  book: MainGuestBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
  imageSrc: ImageProps['src']
}

export const GuestsInvitation = ({
  book,
  onInit,
  onNavigate,
  eventId,
  imageSrc,
}: GuestsInvitationProps) => {
  const needsInit = !book.isBookInit

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (needsInit && onInit) await onInit()
    onNavigate?.()
  }

  const guestCount = Number(book.count ?? 0)
  const description =
    book.description?.trim() || 'Manage your guest list and invitations in one place.'

  const guestLabel = guestCount === 1 ? 'Guest' : 'Guests'

  const clamp2LinesStyle: React.CSSProperties = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold text-gray-900">
            Guests &amp; Invitation
          </h2>
          <p className="mt-0.5 text-[12px] text-gray-500">
            Track invited guests and details
          </p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
          aria-label="View guest invitation details"
        >
          View details
        </button>
      </div>

      {/* Image */}
      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-xl border border-gray-100">
          <div className="relative h-40 w-full">
            <Image
              src={imageSrc}
              alt="Event Image"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 400px"
              priority={false}
            />
            {/* Overlay gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

            {/* Badge */}
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[12px] font-medium text-gray-900 shadow-sm backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
              {guestCount} {guestLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 px-4 pb-4 pt-4">
        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
          <span className="text-[12px] text-gray-600">Invited Guests</span>
          <span className="text-[14px] font-semibold text-gray-900">
            {guestCount} {guestLabel}
          </span>
        </div>

        <p className="text-[13px] leading-relaxed text-gray-600" style={clamp2LinesStyle}>
          {description}
        </p>
      </div>

      {/* Subtle bottom accent */}
     
    </div>
  )
}
