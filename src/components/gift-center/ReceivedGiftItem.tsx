'use client'

import { Gift } from 'lucide-react'
import { cn } from '@/lib'
import { useI18nTranslations } from '@/i18n/hooks'

/**
 * Received Gift Item Component Props
 */
export interface ReceivedGiftItemProps {
  senderName: string
  amount: number
  date: string
  time: string
}

/**
 * Get gift icon color based on coupon amount
 * @param amount - The coupon amount in EGP
 * @returns Tailwind color class for the gift icon
 */
const getGiftIconColor = (amount: number): string => {
  // 500 EGP - Blue
  if (amount === 500) {
    return 'text-blue-500'
  }
  // 1K EGP - Green
  if (amount === 1000) {
    return 'text-green-500'
  }
  // 2K EGP - Red
  if (amount === 2000) {
    return 'text-red-500'
  }
  // 5K EGP - Purple/Lavender
  if (amount === 5000) {
    return 'text-purple-500'
  }
  // 10K EGP - Orange
  if (amount === 10000) {
    return 'text-orange-500'
  }
  // Default - Blue for other amounts
  return 'text-blue-500'
}

/**
 * Received Gift Item Component
 * Displays a single received gift with sender info and amount
 */
export const ReceivedGiftItem = ({
  senderName,
  amount,
  date,
  time,
}: ReceivedGiftItemProps) => {
  const t = useI18nTranslations('coupons')
  const iconColor = getGiftIconColor(amount)

  return (
    <div className="border border-gray-300 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 bg-white shadow-sm">
      {/* Left Section - Icon and Content */}
      <div className="flex flex-1 gap-2 items-center min-w-0">
        {/* Gift Icon with dynamic color */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Gift className={cn('h-7 w-7 sm:h-8 sm:w-8', iconColor)} />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
          <p className="text-12 sm:text-14 font-normal text-gray-900 leading-4 sm:leading-5">
            {t('receivedGifts.sentYouGift', { senderName })}
          </p>
          <div className="flex items-center gap-2 text-10 sm:text-12 text-gray-500">
            <p>{date}</p>
            <p>{time}</p>
          </div>
        </div>
      </div>

      {/* Right Section - Amount */}
      <div className="flex items-center flex-shrink-0">
        <p className="text-12 sm:text-14 font-normal text-green-500 leading-4 sm:leading-5">
          +{amount} EGP
        </p>
      </div>
    </div>
  )
}

