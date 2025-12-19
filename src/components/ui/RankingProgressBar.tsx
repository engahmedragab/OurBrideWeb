import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface RankingProgressBarProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Total number of steps/ranks
   */
  totalSteps?: number
  /**
   * Current active step (0-indexed)
   */
  currentStep?: number
  /**
   * Custom className for the container
   */
  className?: string
}

/**
 * RankingProgressBar component
 * Displays a horizontal progress bar with steps for ranking system
 * Matches Figma design with red active segment and grey inactive segment
 */
const RankingProgressBar = forwardRef<HTMLDivElement, RankingProgressBarProps>(
  (
    {
      totalSteps = 6,
      currentStep = 0,
      className,
      ...props
    },
    ref
  ) => {
    // Calculate progress percentage
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100

    return (
      <div
        ref={ref}
        className={cn('relative w-full', className)}
        {...props}
      >
        {/* Background line (grey) */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] sm:h-[3px] bg-gray-200 -translate-y-1/2 rounded-full" />

        {/* Active segment (red) */}
        <div
          className="absolute top-1/2 left-0 h-[2px] sm:h-[3px] bg-red-500 -translate-y-1/2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isActive = index <= currentStep

            return (
              <div key={index} className="relative flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={cn(
                    'w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full border-2 transition-colors flex-shrink-0',
                    isActive
                      ? 'bg-red-500 border-white shadow-sm'
                      : 'bg-gray-200 border-gray-200'
                  )}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

RankingProgressBar.displayName = 'RankingProgressBar'

export { RankingProgressBar }

