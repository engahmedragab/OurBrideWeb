'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

/**
 * Received Reward Card Variants
 */
const receivedRewardCardVariants = cva(
  'bg-white flex gap-1.5 sm:gap-2 items-center px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl shadow-[0px_0px_9px_0px_rgba(0,0,0,0.1)]',
  {
    variants: {
      status: {
        active: 'bg-white',
        expired: 'bg-gray-50 opacity-60',
        used: 'bg-gray-50 opacity-60',
      },
    },
    defaultVariants: {
      status: 'active',
    },
  }
)

/**
 * Received Reward Card Component Props
 */
export interface ReceivedRewardCardProps extends VariantProps<
  typeof receivedRewardCardVariants
> {
  title: string
  statusLabel?: string
  rank?: string
  points: number
  descriptionLines: string[]
  discountCode?: string
  expiryDate?: string
  icon?: React.ReactNode
  iconSrc?: string
  className?: string
}

/**
 * Received Reward Card Component
 * Displays a reward that the user has already received
 */
export const ReceivedRewardCard = ({
  title,
  statusLabel,
  rank,
  points,
  descriptionLines,
  discountCode,
  expiryDate,
  icon,
  iconSrc,
  status = 'active',
  className,
}: ReceivedRewardCardProps) => {
  return (
    <div className={cn(receivedRewardCardVariants({ status }), className)}>
      {/* Check Icon */}
      <div className="relative shrink-0 size-6 sm:size-8">
        {icon || (
          <CheckCircle2 className="w-6 h-6  text-green-500 fill-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-[1_0_0] flex-col gap-0.5 items-start">
        {/* Title */}
        <div className="flex flex-col justify-center relative shrink-0 text-16 sm:text-18 text-gray-900 w-full">
          <p className="leading-5 sm:leading-6 whitespace-pre-wrap">{title}</p>
        </div>

        {/* Description Lines */}
        <div className="flex flex-col justify-center relative shrink-0 text-14 sm:text-16 text-gray-500 w-full">
          <p className="leading-5 sm:leading-6 whitespace-pre-wrap">
            {descriptionLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < descriptionLines.length - 1 && <br />}
              </span>
            ))}
            {discountCode && (
              <>
                <br />
                Discount Code : {discountCode}
              </>
            )}
            {expiryDate && <> Due {expiryDate}</>}
          </p>
        </div>
      </div>
    </div>
  )
}
