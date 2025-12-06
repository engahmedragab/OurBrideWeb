'use client'

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
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col gap-5.5 items-center">
      {/* Illustration */}
      <div className="flex justify-center">
        <img
          src={
            typeof referralWelcomeSvg === 'string'
              ? referralWelcomeSvg
              : referralWelcomeSvg.src
          }
          alt="Referral Program"
          className="w-46 h-46 object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 items-start w-full">
        {/* Header with Title and View Details */}
        <div className="flex items-center justify-between w-full">
          <h3 className="text-16 font-normal text-gray-900 text-center whitespace-nowrap">
            {title}
          </h3>
          {onViewDetails ? (
            <button
              onClick={onViewDetails}
              className="flex gap-2 items-center justify-center rounded-lg shrink-0 hover:opacity-80 transition-opacity"
            >
              <p className="text-16 font-medium text-brand-500">View Details</p>
              <ArrowRight className="h-4 w-4 text-brand-500" />
            </button>
          ) : (
            <a
              href="#"
              className="text-16 font-medium text-brand-500 flex gap-2 items-center hover:opacity-80 transition-opacity"
            >
              View Details <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* You have earned */}
        <div className="flex gap-2 items-center w-full">
          <div className="flex flex-1 items-center min-w-0">
            <p className="text-16 font-normal text-gray-500 text-center whitespace-nowrap">
              You have earned
            </p>
          </div>
          <div className="flex gap-1.5 items-center shrink-0">
            <p className="text-24 font-medium text-gray-900 leading-8">
              {earnedPointsOrDiamonds}
            </p>
            <img
              src={typeof diamondSvg === 'string' ? diamondSvg : diamondSvg.src}
              alt="Diamond"
              className="h-8 w-8 shrink-0"
            />
          </div>
        </div>

        {/* Invited */}
        <div className="flex gap-2 items-center w-full">
          <div className="flex flex-1 items-center min-w-0">
            <p className="text-16 font-normal text-gray-500 text-center whitespace-nowrap">
              Invited
            </p>
          </div>
          <div className="flex items-center shrink-0">
            <p className="text-24 font-medium text-gray-900 leading-8">
              {invitedFriendsCount} Freinds
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

