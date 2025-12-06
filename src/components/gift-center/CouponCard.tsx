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
    <div className="bg-white border border-gray-300 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      {/* Left Section - Icon and Content */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        {/* Gift Icon */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
          <p className="text-16 sm:text-18 font-medium text-gray-900 leading-6 sm:leading-7">
            {amount} egp Coupon
          </p>
          <p className="text-12 sm:text-14 font-normal text-gray-500 leading-5 sm:leading-6">
            {description}
          </p>
        </div>
      </div>

      {/* Right Section - Send Button */}
      <Button
        variant="brand"
        onClick={onSendClick}
        className="flex items-center gap-2 rounded-full px-6 sm:px-8 py-2 sm:py-2.5 flex-shrink-0 w-full sm:w-auto"
        size="sm"
      >
        <span className="text-14 sm:text-16 font-medium">Send Now</span>
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  )
}

