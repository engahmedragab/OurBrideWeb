'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Info, ChevronRight } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import diamondSvg from '@/assets/svg/Diamond.svg'
import { HowPointsWorkModal } from './HowPointsWorkModal'

const diamondsCardVariants = cva(
  'bg-white rounded-xl p-2.5 sm:p-3 border border-gray-100 shadow-sm flex flex-col gap-2',
  {
    variants: {
      variant: {
        default: '',
        disabled: 'opacity-60',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/**
 * Diamonds Summary Card Component Props
 */
export interface DiamondsSummaryCardProps
  extends VariantProps<typeof diamondsCardVariants> {
  title?: string
  diamondsCount: number
  actionLabel?: string
  onActionPress?: () => void
  helperText?: string
  className?: string
}

/**
 * Diamonds Summary Card Component
 * Displays user's diamonds balance with redeem action
 */
export const DiamondsSummaryCard = ({
  title = 'Diamonds you have',
  diamondsCount,
  actionLabel = 'Redeem',
  onActionPress,
  helperText,
  variant,
  className,
}: DiamondsSummaryCardProps) => {
  const [isHowPointsWorkOpen, setIsHowPointsWorkOpen] = useState(false)

  return (
    <>
      <div className={cn(diamondsCardVariants({ variant }), className)}>
        {/* Header Row */}
        <div className="flex  md:flex-col xl:flex-row gap-2 sm:gap-3 xl:items-center justify-between w-full">
          {/* Title with Info Icon */}
          <div className="flex gap-1 sm:gap-1.5 items-center justify-start shrink-0">
            <p className="text-10 sm:text-12 font-normal text-gray-500 text-center whitespace-nowrap">
              {title}
            </p>
            <button
              onClick={() => setIsHowPointsWorkOpen(true)}
              className="shrink-0 hover:opacity-80 transition-opacity"
              aria-label="How points work"
            >
              <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
            </button>
          </div>

        {/* Diamonds Count */}
        <div className="flex gap-1 sm:gap-1.5 items-center shrink-0">
          <p className="text-14 sm:text-16 font-medium text-gray-900 leading-4 sm:leading-5">{diamondsCount}</p>
          <Image
            src={typeof diamondSvg === 'string' ? diamondSvg : diamondSvg.src}
            alt="Diamond"
            width={20}
            height={20}
            className="h-4 w-4 sm:h-5 sm:w-5 shrink-0"
          />
        </div>
      </div>

      {/* Action Button */}
      {onActionPress && (
        <button
          onClick={onActionPress}
          className="flex gap-1 sm:gap-1.5 items-center justify-start rounded-lg shrink-0 hover:opacity-80 transition-opacity"
        >
          <p className="text-12 sm:text-14 font-medium text-brand-500">{actionLabel}</p>
          <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-500" />
        </button>
      )}

      {/* Helper Text */}
      {helperText && (
        <p className="text-12 text-gray-500 text-center">{helperText}</p>
      )}
      </div>

      {/* How Points Work Modal */}
      <HowPointsWorkModal
        isOpen={isHowPointsWorkOpen}
        onClose={() => setIsHowPointsWorkOpen(false)}
      />
    </>
  )
}

