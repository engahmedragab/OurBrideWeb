'use client'

import { Gift, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib'

/**
 * Coupon Card Component Props
 */
export interface CouponCardProps {
  amount: number
  description: string
  onSendClick: () => void
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


const formatCouponAmount = (amount: number): string => {
  if (amount >= 1000) {
    const thousands = amount / 1000
    return `${thousands}K egp`
  }
  return `${amount} egp`
}

/**
 * Coupon Card Component
 * Displays a coupon with amount, description, and send button
 * Gift icon color changes based on the coupon amount
 */
export const CouponCard = ({ amount, description, onSendClick }: CouponCardProps) => {
  const iconColor = getGiftIconColor(amount)
  const formattedAmount = formatCouponAmount(amount)

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-2.5 sm:p-3 flex flex-row items-center justify-between gap-2 sm:gap-3">
      {/* Left Section - Icon and Content */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Gift Icon with dynamic color */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Gift className={cn('h-7 w-7 sm:h-8 sm:w-8', iconColor)} />
        </div>
        {/* Content */}
        <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0">
          <p className="text-12 sm:text-14 font-medium text-gray-900 leading-4 sm:leading-5">
            {formattedAmount} Coupon
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
        className="flex items-center gap-1.5 rounded-full px-3 sm:px-5 py-1 sm:py-1.5 flex-shrink-0 text-white"
        size="sm"
      >
        <span className="text-10 sm:text-12 font-medium">Send Now</span>
        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </Button>
    </div>
  )
}
