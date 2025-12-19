'use client'

import Image from 'next/image'
import { ChevronRight, Check } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import diamondSvg from '@/assets/svg/Diamond.svg'

const missionCardVariants = cva(
  'border border-gray-300 rounded-xl p-2.5 sm:p-3 flex flex-col gap-2 bg-white',
  {
    variants: {
      status: {
        pending: 'bg-white',
        completed: 'bg-white',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  }
)

/**
 * Mission Card Component Props
 */
export interface MissionCardProps extends VariantProps<typeof missionCardVariants> {
  title: string
  currentProgress: number
  targetProgress: number
  rewardAmount: number
  rewardUnit?: string
  status: 'pending' | 'completed'
  onViewProducts?: () => void
  description?: string
  className?: string
}

/**
 * Mission Card Component
 * Displays a mission with progress and reward information
 */
export const MissionCard = ({
  title,
  currentProgress,
  targetProgress,
  rewardAmount,
  rewardUnit = 'EGP',
  status,
  onViewProducts,
  description: _description,
  className,
}: MissionCardProps) => {
  const isCompleted = status === 'completed'
  const progressText = `${currentProgress}/${targetProgress} ${rewardUnit}`

  return (
    <div className={cn(missionCardVariants({ status }), className)}>
      {/* Header Row */}
      <div className="flex flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-0">
        {/* Title and Status Badge */}
        <div className="flex flex-1 gap-2 sm:gap-3 items-center min-w-0 w-full sm:w-auto">
          <p className="text-12 sm:text-14 font-normal text-gray-900 whitespace-pre-wrap leading-4 sm:leading-5">
            {title}
          </p>
          {isCompleted && (
            <div className="bg-green-100 border border-green-500 rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center justify-center shrink-0">
              <p className="text-10 sm:text-12 font-normal text-green-500">Done</p>
            </div>
          )}
        </div>

        {/* Reward Section */}
        <div className="flex gap-1.5 sm:gap-2 items-center shrink-0">
          {isCompleted && (
            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0" />
          )}
          <p className="text-12 sm:text-14 font-normal text-gray-900 leading-4 sm:leading-5">{rewardAmount}</p>
          <Image
            src={typeof diamondSvg === 'string' ? diamondSvg : diamondSvg.src}
            alt="Diamond"
            width={20}
            height={20}
            className="h-4 w-4 sm:h-5 sm:w-5 shrink-0"
          />
        </div>
      </div>

      {/* Progress Row */}
      <div className="flex flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-0">
        <p
          className={cn(
            'flex-1 !text-12 font-normal whitespace-pre-wrap leading-4 sm:leading-5',
            isCompleted ? 'text-gray-500' : 'text-gray-500'
          )}
        >
          {progressText}
        </p>
        {onViewProducts && (
          <button
            onClick={onViewProducts}
            className="flex gap-1 sm:gap-1.5 items-center justify-center rounded-lg shrink-0 hover:opacity-80 transition-opacity"
          >
            <p className="text-12 sm:text-14 font-medium text-brand-500">view Products</p>
            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-500 shrink-0" />
          </button>
        )}
      </div>
    </div>
  )
}

