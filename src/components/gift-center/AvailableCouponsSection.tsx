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
    <div className="flex flex-col gap-3 sm:gap-4 items-start w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between w-full">
        <p className="text-18 sm:text-20 font-normal text-gray-900 leading-6 sm:leading-8">{title}</p>
      </div>

      {/* Coupons List */}
      <div className="flex flex-col gap-3 sm:gap-4 items-start w-full">
        {coupons.map((coupon, index) => (
          <OfferCouponCard key={index} {...coupon} className='w-full'/>
        ))}
      </div>
    </div>
  )
}

