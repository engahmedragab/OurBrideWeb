'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import referralWelcomeSvg from '@/assets/svg/refferal-welcome.svg'
import diamondSvg from '@/assets/svg/Diamond.svg'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'
import { cn } from '@/lib/utils'

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
  title,
  earnedPointsOrDiamonds = 500,
  invitedFriendsCount = 1,
  onViewDetails,
  description,
}: ReferralProgramCardProps) => {
  const t = useI18nTranslations('coupons')
  const isRTL = useIsRTL()
  const defaultTitle = title || t('referral.title')
  
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
          alt={defaultTitle}
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
            {defaultTitle}
          </h3>
          {onViewDetails ? (
            <button
              onClick={onViewDetails}
              className="flex gap-1 items-center shrink-0 hover:opacity-80 transition-opacity"
            >
              <p className="text-12 sm:text-14 font-medium text-brand-500">{t('referral.viewDetails')}</p>
              <ArrowRight className={cn("h-3 w-3 sm:h-4 sm:w-4 text-brand-500", isRTL && "scale-x-[-1]")} />
            </button>
          ) : (
            <a
              href="#"
              className="text-12 sm:text-14 font-medium text-brand-500 flex gap-1 items-center hover:opacity-80 transition-opacity"
            >
              {t('referral.viewDetails')} <ArrowRight className={cn("h-3 w-3 sm:h-4 sm:w-4", isRTL && "scale-x-[-1]")} />
            </a>
          )}
        </div>

        {/* You have earned */}
        <div className="flex items-center justify-between w-full">
          <p className="text-12 sm:text-14 font-normal text-gray-500">
            {t('referral.youHaveEarned')}
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
            {t('referral.invited')}
          </p>
          <p className="text-16 sm:text-18 font-semibold text-gray-900 shrink-0">
            {invitedFriendsCount} {t('referral.friends')}
          </p>
        </div>
      </div>
    </div>
  )
}

