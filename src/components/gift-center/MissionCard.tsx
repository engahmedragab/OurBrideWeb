'use client'

import { ChevronRight, Check } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import diamondSvg from '@/assets/svg/Diamond.svg'

const missionCardVariants = cva(
  'border border-gray-300 rounded-xl p-3 sm:p-4 flex flex-col gap-2 bg-white',
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-0">
        {/* Title and Status Badge */}
        <div className="flex flex-1 gap-2 sm:gap-3 items-center min-w-0 w-full sm:w-auto">
          <p className="text-14 sm:text-16 font-normal text-gray-900 whitespace-pre-wrap">
            {title}
          </p>
          {isCompleted && (
            <div className="bg-green-100 border border-green-500 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 flex items-center justify-center shrink-0">
              <p className="text-12 sm:text-14 font-normal text-green-500">Done</p>
            </div>
          )}
        </div>

        {/* Reward Section */}
        <div className="flex gap-2 sm:gap-3 items-center shrink-0">
          {isCompleted && (
            <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 shrink-0" />
          )}
          <p className="text-18 sm:text-20 font-normal text-gray-900">{rewardAmount}</p>
          <img
            src={typeof diamondSvg === 'string' ? diamondSvg : diamondSvg.src}
            alt="Diamond"
            className="h-5 w-5 sm:h-6 sm:w-6 shrink-0"
          />
        </div>
      </div>

      {/* Progress Row */}
      <div className="flex flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-0">
        <p
          className={cn(
            'flex-1 text-14 sm:text-16 font-normal whitespace-pre-wrap',
            isCompleted ? 'text-gray-500' : 'text-gray-500'
          )}
        >
          {progressText}
        </p>
        {onViewProducts && (
          <button
            onClick={onViewProducts}
            className="flex gap-1.5 sm:gap-2 items-center justify-center rounded-lg shrink-0 hover:opacity-80 transition-opacity"
          >
            <p className="text-14 sm:text-16 font-medium text-brand-500">view Products</p>
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-500 shrink-0" />
          </button>
        )}
      </div>
    </div>
  )
}

