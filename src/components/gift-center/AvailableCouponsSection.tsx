'use client'

import { OfferCouponCard, type OfferCouponCardProps } from './OfferCouponCard'

/**
 * Available Coupons Section Component Props
 */
export interface AvailableCouponsSectionProps {
  title?: string
  coupons: OfferCouponCardProps[]
}

/**
 * Available Coupons Section Component
 * Displays list of available coupons
 */
export const AvailableCouponsSection = ({
  title = 'Available Coupons',
  coupons,
}: AvailableCouponsSectionProps) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 items-start w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between w-full mb-2 sm:mb-3">
        <p className="text-14 sm:text-16 font-normal text-gray-900 leading-4 sm:leading-5">
          {title}
        </p>
      </div>

      {/* Coupons List */}
      <div className="flex flex-col gap-2 sm:gap-2.5 items-start w-full">
        {coupons.map((coupon, index) => (
          <OfferCouponCard key={index} {...coupon} className="w-full" />
        ))}
      </div>
    </div>
  )
}
