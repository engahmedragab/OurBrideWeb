'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  BronzeIcon,
  SilverIcon,
  GoldIcon,
  BlueRankIcon,
  PinkRankIcon,
  RedRankIcon,
} from '@/assets/rank/rankingIcons'
import diamondSvg from '@/assets/svg/Diamond.svg'
import type { RankType } from './RankUpModal'

/**
 * Rank badge mapping
 */
const rankBadgeMap: Record<RankType, typeof BronzeIcon> = {
  bronze: BronzeIcon,
  silver: SilverIcon,
  gold: GoldIcon,
  blue: BlueRankIcon,
  pink: PinkRankIcon,
  red: RedRankIcon,
}

/**
 * Top Badge Variants
 * Small tab-like div containing only the rank icon
 */
const topBadgeVariants = cva(
  'flex items-center justify-center rounded-2xl border-2 transition-all bg-white',
  {
    variants: {
      isActive: {
        true: 'border-[#8c4500]',
        false: 'border-gray-300',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
)

/**
 * Info Card Variants
 * Main card body containing all level information
 */
const infoCardVariants = cva(
  'flex flex-col gap-4 items-center justify-center p-5 rounded-2xl border-2 transition-all bg-white',
  {
    variants: {
      isActive: {
        true: 'border-[#8c4500] shadow-md',
        false: 'border-gray-300',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
)

/**
 * Container Variants
 */
const containerVariants = cva('flex flex-col gap-4 sm:gap-6 w-full', {
  variants: {
    isActive: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    isActive: false,
  },
})

/**
 * Reward Tier Card Component Props
 */
export interface RewardTierCardProps extends VariantProps<
  typeof topBadgeVariants
> {
  rankId: RankType
  title: string
  rewardPoints: number
  rewardLabel: string
  description: string
  isActive?: boolean
  onClick?: () => void
  className?: string
}

/**
 * Reward Tier Card Component
 * Displays a reward tier with rank badge, points, and description
 * Structure: TopBadge (icon only) + InfoCard (all information)
 */
export const RewardTierCard = ({
  rankId,
  title,
  rewardPoints,
  rewardLabel,
  description,
  isActive = false,
  onClick,
  className,
}: RewardTierCardProps) => {
  const RankIcon = rankBadgeMap[rankId]

  return (
    <div
      className={cn(containerVariants({ isActive }), className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {/* TopBadge: Small tab with rank icon only */}
      <div className={cn(topBadgeVariants({ isActive }), 'px-9 py-6')}>
        <div className="flex flex-col gap-5 items-center justify-center shrink-0">
          <RankIcon className="w-10 h-10 " />

          <p className="text-16 sm:text-18 font-normal text-gray-900 text-center whitespace-pre-wrap">
            {title}
          </p>
        </div>
      </div>

      {/* InfoCard: Main card body with all information */}
      <div className={cn(infoCardVariants({ isActive }), 'flex-1')}>
        {/* Rewards Section */}
        <div className="flex flex-col gap-3 sm:gap-4 items-center w-full">
          <p className="text-14 sm:text-16 font-normal text-gray-500 text-center whitespace-pre-wrap">
            {rewardLabel}
          </p>

          {/* Reward Points with Diamond Icon */}
          <div className="flex gap-2 items-center justify-center">
            <p className="text-16 sm:text-18 font-normal text-gray-900 text-center">
              {rewardPoints}
            </p>
            <img
              src={typeof diamondSvg === 'string' ? diamondSvg : diamondSvg.src}
              alt="Diamond"
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
          </div>

          {/* Description */}
          <p className="text-12 sm:text-14 font-normal text-gray-500 text-center whitespace-pre-wrap">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
