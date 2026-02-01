'use client'

import Image from 'next/image'
import { Gift } from 'lucide-react'
import { cn } from '@/lib'
import giftSentSuccessImage from '@/assets/images/Giftsuccess.png'
import { useI18nTranslations } from '@/i18n/hooks'

/**
 * Sent Gift Item Interface
 */
export interface SentGiftItem {
  id: string
  recipientName: string
  date: string
  time: string
  amount: number
}

/**
 * Sent Gift Item Component Props
 */
interface SentGiftItemProps {
  recipientName: string
  date: string
  time: string
  amount: number
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
 * Sent Gift Item Row Component
 */
const SentGiftItemRow = ({
  recipientName,
  date,
  time,
  amount,
}: SentGiftItemProps) => {
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
            {t('sentGifts.youSentGiftTo', { recipientName })}
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
          {amount} EGP
        </p>
      </div>
    </div>
  )
}

/**
 * Sent Gifts Card Component Props
 */
export interface SentGiftsCardProps {
  gifts?: SentGiftItem[]
  isEmpty?: boolean
}

/**
 * Sent Gifts Card Component
 * Displays list of sent gifts or empty state
 */
export const SentGiftsCard = ({ gifts = [], isEmpty }: SentGiftsCardProps) => {
  const t = useI18nTranslations('coupons')
  const hasGifts = !isEmpty && gifts.length > 0

  return (
    <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-100 shadow-sm">
      <h3 className="text-12 sm:text-14 font-normal text-gray-900 mb-2 sm:mb-3">{t('sentGifts.title')}</h3>

      {hasGifts ? (
        /* Filled State - List of Sent Gifts */
        <div className="space-y-2 sm:space-y-2.5">
          {gifts.map(gift => (
            <SentGiftItemRow
              key={gift.id}
              recipientName={gift.recipientName}
              date={gift.date}
              time={gift.time}
              amount={gift.amount}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-4 sm:py-5">
          {/* Empty State Illustration */}
          <div className="mb-2 sm:mb-3 flex justify-center">
            <Image
              src={
                typeof giftSentSuccessImage === 'string'
                  ? giftSentSuccessImage
                  : giftSentSuccessImage.src
              }
              alt={t('sentGifts.empty.alt')}
              width={112}
              height={112}
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
            />
          </div>
          <p className="text-10 sm:text-12 text-gray-600 text-center max-w-xs">
            {t('sentGifts.empty.title')}
          </p>
        </div>
      )}
    </div>
  )
}

