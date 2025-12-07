'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RewardTierCard, ReceivedRewardCard } from '@/components/gift-center'
import type { RankType } from '@/components/gift-center'

/**
 * Mock data for reward tiers
 */
const rewardTiers: Array<{
  rankId: RankType
  title: string
  rewardPoints: number
  rewardLabel: string
  description: string
  isActive: boolean
}> = [
  {
    rankId: 'bronze',
    title: 'Bronze',
    rewardPoints: 200,
    rewardLabel: 'Rewards',
    description: '20% On Any Product For 24 hours',
    isActive: true,
  },
  {
    rankId: 'silver',
    title: 'Silver',
    rewardPoints: 200,
    rewardLabel: 'Rewards',
    description: '20% On Any Product For 24 hours',
    isActive: false,
  },
  {
    rankId: 'gold',
    title: 'Gold',
    rewardPoints: 200,
    rewardLabel: 'Rewards',
    description: '20% On Any Product For 24 hours',
    isActive: false,
  },
  {
    rankId: 'blue',
    title: 'Blue',
    rewardPoints: 200,
    rewardLabel: 'Rewards',
    description: '20% On Any Product For 24 hours',
    isActive: false,
  },
  {
    rankId: 'pink',
    title: 'Pink',
    rewardPoints: 200,
    rewardLabel: 'Rewards',
    description: '20% On Any Product For 24 hours',
    isActive: false,
  },
  {
    rankId: 'red',
    title: 'Red',
    rewardPoints: 200,
    rewardLabel: 'Rewards',
    description: '20% On Any Product For 24 hours',
    isActive: false,
  },
]

/**
 * Mock data for received rewards
 */
const receivedRewards: Array<{
  title: string
  points: number
  descriptionLines: string[]
  discountCode?: string
  expiryDate?: string
}> = [
  {
    title: 'Bronze Rank ! ( New Member )',
    points: 200,
    descriptionLines: [
      'Rewards :',
      '200 Diamonds Points',
    ],
    discountCode: '4478EEF',
    expiryDate: '19/9/2025',
  },
]

/**
 * Rewards Page Component
 * Displays all reward tiers and received rewards
 */
export default function RewardsPage() {
  const router = useRouter()

  return (
    <div className="w-full">
      {/* Header with Back Button */}
      <div className="flex gap-1 items-center mb-4 sm:mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center relative rounded-full shrink-0 size-10"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5 text-brand-500" />
        </button>
        <h1 className="text-20 font-normal text-black">Rewards</h1>
      </div>

      {/* Rewards Grid Section */}
      <div className="flex flex-col gap-4 items-start mb-6 sm:mb-8">
        
       
        {/* Bottom Row - Reward Details (Same cards but showing reward details) */}
        <div className="flex gap-6 w-full overflow-auto py-2">
          {rewardTiers.map((tier, index) => (
            <RewardTierCard
              key={`detail-${index}`}
              rankId={tier.rankId}
              title={tier.title}
              rewardPoints={tier.rewardPoints}
              rewardLabel={tier.rewardLabel}
              description={tier.description}
              isActive={tier.isActive}
              className='w-1/3 lg:w-1/6'
            />
          ))}
        </div>
      </div>

      {/* Received Rewards Section */}
      <div className="flex flex-col gap-4 items-start w-full ">
        {/* Section Header */}
        <div className="flex gap-2 items-center w-full">
          <h2 className="flex-[1_0_0] text-20 font-normal text-gray-900 whitespace-pre-wrap">
            Received Rewards
          </h2>
        </div>

        {/* Received Rewards List */}
        <div className="flex flex-col gap-4 w-full ">
          {receivedRewards.map((reward, index) => (
            <ReceivedRewardCard
              key={index}
              title={reward.title}
              points={reward.points}
              descriptionLines={reward.descriptionLines}
              discountCode={reward.discountCode}
              expiryDate={reward.expiryDate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

