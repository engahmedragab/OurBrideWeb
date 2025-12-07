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
    <div className="border border-gray-300 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 bg-white">
      {/* Left Section - Icon and Content */}
      <div className="flex flex-1 gap-2 items-center min-w-0">
        {/* Gift Icon */}
        <div className="flex items-center justify-center flex-shrink-0">
        <Gift className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
          <p className="text-12 sm:text-14 font-normal text-gray-900 leading-4 sm:leading-5">
            {senderName} Sent You A Gift
          </p>
          <div className="flex items-center gap-2 text-10 sm:text-12 text-gray-500">
            <p>{date}</p>
            <p className="flex-1">{time}</p>
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

