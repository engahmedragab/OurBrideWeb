'use client'

import { Copy } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import saleSvg from '@/assets/svg/sale.svg'

const offerCouponCardVariants = cva(
  'border border-gray-300 rounded-xl p-3 sm:p-4 flex gap-2 items-start bg-white',
  {
    variants: {
      status: {
        active: '',
        expired: 'opacity-60',
        used: 'opacity-60',
      },
    },
    defaultVariants: {
      status: 'active',
    },
  }
)

/**
 * Offer Coupon Card Component Props
 * Used in Available Coupons Section (different from the main CouponCard)
 */
export interface OfferCouponCardProps
  extends VariantProps<typeof offerCouponCardVariants> {
  title: string
  description?: string
  discountLabel?: string
  expiryDateLabel: string
  code: string
  status: 'active' | 'expired' | 'used'
  onCopyCode?: () => void
  className?: string
}

/**
 * Offer Coupon Card Component
 * Displays a coupon card in the Available Coupons section
 */
export const OfferCouponCard = ({
  title,
  description,
  discountLabel,
  expiryDateLabel,
  code,
  status,
  onCopyCode,
  className,
}: OfferCouponCardProps) => {
  return (
    <div className={cn(offerCouponCardVariants({ status }), className)}>
      {/* Sale Icon */}
      <div className="flex items-center justify-center shrink-0">
        <img
          src={typeof saleSvg === 'string' ? saleSvg : saleSvg.src}
          alt="Sale"
          className="h-8 w-8"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 sm:gap-2 items-start min-w-0">
        {/* Title */}
        <p className="text-14 sm:text-16 font-normal text-gray-900 w-full whitespace-pre-wrap leading-5 sm:leading-6">
          {title}
        </p>

        {/* Code and Copy Button Row */}
        <div className="flex md:flex-col md:items-start xl:flex-row  items-center xl:items-center gap-1.5 sm:gap-2 items-start items-center w-full">
          <p className="flex-1 text-14 sm:text-16 font-normal text-gray-900 whitespace-pre-wrap">
            {code}
          </p>
          {onCopyCode && (
            <button
              onClick={onCopyCode}
              className="flex gap-1.5 sm:gap-2 items-center justify-center rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shrink-0 hover:opacity-80 transition-opacity"
            >
              <p className="text-12 font-medium text-brand-500">Copy Code</p>
              <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-500" />
            </button>
          )}
        </div>

        {/* Expiry Date */}
        <div className="flex items-center w-full">
          <p className="text-12 font-normal text-gray-500 leading-4">
            {expiryDateLabel}
          </p>
        </div>
      </div>
    </div>
  )
}

