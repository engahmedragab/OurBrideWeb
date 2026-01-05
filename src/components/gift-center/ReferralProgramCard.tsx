'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import referralWelcomeSvg from '@/assets/svg/refferal-welcome.svg'
import diamondSvg from '@/assets/svg/Diamond.svg'

/**
 * Referral Program Card Component Props
 */
export interface ReferralProgramCardProps {
  title?: string
  earnedPointsOrDiamonds?: number
  invitedFriendsCount?: number
  onViewDetails?: () => void
  description?: string
}

/**
 * Referral Program Card Component
 * Displays referral program information and stats
 */
export const ReferralProgramCard = ({
  title = 'Referral Program',
  earnedPointsOrDiamonds = 500,
  invitedFriendsCount = 1,
  onViewDetails,
  description,
}: ReferralProgramCardProps) => {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm flex flex-col gap-3 sm:gap-4">
      {/* Illustration */}
      <div className="flex justify-center">
        <Image
          src={
            typeof referralWelcomeSvg === 'string'
              ? referralWelcomeSvg
              : referralWelcomeSvg.src
          }
          alt="Referral Program"
          width={128}
          height={128}
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 w-full">
        {/* Header with Title and View Details */}
        <div className="flex items-center justify-between w-full">
          <h3 className="text-12 sm:text-14 font-normal text-gray-900">
            {title}
          </h3>
          {onViewDetails ? (
            <button
              onClick={onViewDetails}
              className="flex gap-1 items-center shrink-0 hover:opacity-80 transition-opacity"
            >
              <p className="text-12 sm:text-14 font-medium text-brand-500">
                View Details
              </p>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-brand-500" />
            </button>
          ) : (
            <a
              href="#"
              className="text-12 sm:text-14 font-medium text-brand-500 flex gap-1 items-center hover:opacity-80 transition-opacity"
            >
              View Details <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
          )}
        </div>

        {/* You have earned */}
        <div className="flex items-center justify-between w-full">
          <p className="text-12 sm:text-14 font-normal text-gray-500">
            You have earned
          </p>
          <div className="flex gap-1 items-center shrink-0">
            <p className="text-16 sm:text-18 font-semibold text-gray-900">
              {earnedPointsOrDiamonds}
            </p>
            <Image
              src={typeof diamondSvg === 'string' ? diamondSvg : diamondSvg.src}
              alt="Diamond"
              width={24}
              height={24}
              className="h-5 w-5 sm:h-6 sm:w-6 shrink-0"
            />
          </div>
        </div>

        {/* Invited */}
        <div className="flex items-center justify-between w-full">
          <p className="text-12 sm:text-14 font-normal text-gray-500">
            Invited
          </p>
          <p className="text-16 sm:text-18 font-semibold text-gray-900 shrink-0">
            {invitedFriendsCount} Freinds
          </p>
        </div>
      </div>
    </div>
  )
}
