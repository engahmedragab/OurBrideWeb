'use client'

import { OfferCard, type OfferCardProps } from './OfferCard'

/**
 * Weekly Offer Section Component Props
 */
export interface WeeklyOfferSectionProps {
  title?: string
  resetLabel?: string
  resetCountdown: string
  activeOffer?: OfferCardProps | null
  placeholderCards?: number
}

/**
 * Weekly Offer Section Component
 * Displays weekly offer with countdown timer
 */
export const WeeklyOfferSection = ({
  title = 'Weekly Offer',
  resetLabel = 'Restore in',
  resetCountdown,
  activeOffer,
  placeholderCards = 2,
}: WeeklyOfferSectionProps) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 items-center w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-0">
        <p className="text-18 sm:text-20 font-normal text-gray-900 leading-6 sm:leading-8">{title}</p>
        <p className="text-14 sm:text-16 font-normal text-gray-500 leading-5 sm:leading-6">
          {resetLabel} : {resetCountdown}
        </p>
      </div>

      {/* Offers Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 w-full">
        {/* Active Offer Card */}
        {activeOffer ? (
          <OfferCard {...activeOffer} />
        ) : (
          <OfferCard status="empty" />
        )}

        {/* Placeholder Cards */}
        {Array.from({ length: placeholderCards }).map((_, index) => (
          <OfferCard key={index} status="empty" />
        ))}
      </div>
    </div>
  )
}

