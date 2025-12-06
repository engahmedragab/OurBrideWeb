'use client'

import { Gift } from 'lucide-react'
import referralWelcomeSvg from '@/assets/svg/refferal-welcome.svg'

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
 * Sent Gift Item Row Component
 */
const SentGiftItemRow = ({
  recipientName,
  date,
  time,
  amount,
}: SentGiftItemProps) => {
  return (
    <div className="border border-gray-300 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3 bg-white">
      {/* Left Section - Icon and Content */}
      <div className="flex flex-1 gap-2 sm:gap-3 items-start min-w-0">
        {/* Gift Icon */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
          <p className="text-14 sm:text-16 font-normal text-gray-900 leading-5 sm:leading-6">
            You sent a gift to {recipientName}
          </p>
          <div className="flex items-center gap-2 text-12 sm:text-14 text-gray-500">
            <p>{date}</p>
            <p className="flex-1">{time}</p>
          </div>
        </div>
      </div>

      {/* Right Section - Amount */}
      <div className="flex items-center flex-shrink-0">
        <p className="text-14 sm:text-16 font-normal text-green-500 leading-5 sm:leading-6">
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
  const hasGifts = !isEmpty && gifts.length > 0

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
      <h3 className="text-16 sm:text-18 font-semibold text-gray-900 mb-3 sm:mb-4">Sent Gifts</h3>

      {hasGifts ? (
        /* Filled State - List of Sent Gifts */
        <div className="space-y-3 sm:space-y-4">
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
        <div className="flex flex-col items-center justify-center py-6 sm:py-8">
          {/* Empty State Illustration */}
          <div className="mb-3 sm:mb-4 flex justify-center">
            <img
              src={
                typeof referralWelcomeSvg === 'string'
                  ? referralWelcomeSvg
                  : referralWelcomeSvg.src
              }
              alt="No Sent Gifts"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
            />
          </div>
          <p className="text-12 sm:text-14 text-gray-600 text-center max-w-xs">
            You Don&apos;t Have any sent gifts, express Your Love and send a gift
            now.
          </p>
        </div>
      )}
    </div>
  )
}

