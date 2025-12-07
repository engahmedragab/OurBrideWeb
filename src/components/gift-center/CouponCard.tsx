'use client'

import { Gift, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'

/**
 * Coupon Card Component Props
 */
export interface CouponCardProps {
  amount: number
  description: string
  onSendClick: () => void
}

/**
 * Coupon Card Component
 * Displays a coupon with amount, description, and send button
 */
export const CouponCard = ({ amount, description, onSendClick }: CouponCardProps) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3">
      {/* Left Section - Icon and Content */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
        {/* Gift Icon */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Gift className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
          <p className="text-12 sm:text-14 font-medium text-gray-900 leading-4 sm:leading-5">
            {amount} egp Coupon
          </p>
          <p className="text-10 sm:text-12 font-normal text-gray-500 leading-3 sm:leading-4">
            {description}
          </p>
        </div>
      </div>

      {/* Right Section - Send Button */}
      <Button
        variant="brand"
        onClick={onSendClick}
        className="flex items-center gap-1.5 rounded-full px-3 sm:px-5 py-1 sm:py-1.5 flex-shrink-0 w-full sm:w-auto text-white"
        size="sm"
      >
        <span className="text-10 sm:text-12 font-medium">Send Now</span>
        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </Button>
    </div>
  )
}

