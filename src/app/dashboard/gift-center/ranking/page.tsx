'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RankUpModal } from '@/components/gift-center'
import { Button } from '@/components/ui/Button'

/**
 * Ranking Page Component
 * Displays ranking information in the Gift Center matching Figma design
 */
export default function RankingPage() {
  const router = useRouter()
  const [isRankUpModalOpen, setIsRankUpModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="text-center py-8 sm:py-12">
          <p className="text-14 sm:text-16 text-gray-500 mb-4">
            Ranking content coming soon
          </p>
        </div>

        {/* Rewards Button */}
        <div className="flex justify-center">
          <Button
            variant="brand"
            size="lg"
            onClick={() => router.push('/dashboard/gift-center/rewards')}
          >
            Rewards
          </Button>
        </div>
      </div>

      {/* Rank Up Modal */}
      <RankUpModal
        isOpen={isRankUpModalOpen}
        onClose={() => setIsRankUpModalOpen(false)}
        previousRank="bronze"
        newRank="silver"
        rewardValue={500}
        couponCode="4478EEF"
        rewardDescription="20% Off : 4478EEF"
      />
    </>
  )
}
