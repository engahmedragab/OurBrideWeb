'use client'

import { Gift } from 'lucide-react'

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
 * Received Gift Item Component
 * Displays a single received gift with sender info and amount
 */
export const ReceivedGiftItem = ({
  senderName,
  amount,
  date,
  time,
}: ReceivedGiftItemProps) => {
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
            {senderName} Sent You A Gift
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
          +{amount} EGP
        </p>
      </div>
    </div>
  )
}

