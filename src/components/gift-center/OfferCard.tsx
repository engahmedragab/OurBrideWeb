'use client'

import { Copy } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import couponLightImage from '@/assets/images/Coupon-Light.png'
import saleSvg from '@/assets/svg/sale.svg'

const offerCardVariants = cva('relative rounded-xl border overflow-hidden', {
  variants: {
    status: {
      active: 'bg-white border-gray-300',
      expired: 'bg-gray-50 border-gray-300 opacity-60',
      used: 'bg-gray-50 border-gray-300 opacity-60',
      empty: 'bg-white border-gray-300',
    },
  },
  defaultVariants: {
    status: 'active',
  },
})

/**
 * Offer Card Component Props
 */
export interface OfferCardProps extends VariantProps<typeof offerCardVariants> {
  discountLabel?: string
  code?: string
  validUntilLabel?: string
  status: 'active' | 'expired' | 'used' | 'empty'
  onCopyCode?: () => void
  className?: string
}

/**
 * Offer Card Component
 * Displays a weekly offer card with discount and code
 */
export const OfferCard = ({
  discountLabel,
  code,
  validUntilLabel,
  status,
  onCopyCode,
  className,
}: OfferCardProps) => {
  const isEmpty = status === 'empty'

  if (isEmpty) {
    return (
      <div
        className={cn(
          offerCardVariants({ status }),
          'h-[300px] w-3/4 mx-auto lg:mx-0 lg:h-[280px] lg:w-[200px] flex items-center justify-center',
          className
        )}
        style={{
          backgroundImage: `url(${typeof couponLightImage === 'string' ? couponLightImage : couponLightImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
    )
  }

  return (
    <div
      className={cn(
        offerCardVariants({ status }),
        'h-[300px]  w-3/4 mx-auto lg:mx-0 lg:h-[280px] lg:w-[200px] flex flex-col relative',
        className
      )}
    >
      {/* Sale Icon */}
      <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-10">
        <img
          src={typeof saleSvg === 'string' ? saleSvg : saleSvg.src}
          alt="Sale"
          className="size-14"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 sm:gap-2 items-start lg:pt-20 pt-32 px-4 sm:px-5 flex-1 relative z-10">
        {/* Discount Label */}
        {discountLabel && (
          <div className="text-center w-full">
            <p className="text-14 sm:text-16 font-medium text-gray-900 leading-5 sm:leading-6 whitespace-pre-wrap">
              {discountLabel}
            </p>
          </div>
        )}

        {/* Valid Until */}
        {validUntilLabel && (
          <p className="text-12 sm:text-14 font-normal text-gray-500 leading-4 sm:leading-5 w-full text-center">
            {validUntilLabel}
          </p>
        )}
      </div>

      {/* Code Section */}
      {code && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 relative z-10">
          <div className="bg-green-100 border border-dashed border-green-500 rounded-sm h-10 sm:h-12 flex items-center justify-center relative">
            <p className="text-16 sm:text-18 font-normal text-green-500">
              {code}
            </p>
            {onCopyCode && (
              <button
                onClick={onCopyCode}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
                aria-label="Copy code"
              >
                <Copy className="h-3 w-3 text-green-500" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

