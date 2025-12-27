'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ReelCard } from './ReelCard'
import { ReelPlayer } from './ReelPlayer'
import type { ReelResponse } from '@/types/responses/community'

export interface ReelsFeedProps {
  className?: string
  reels?: ReelResponse[]
  selectedReelId?: number | null
  onReelSelect?: (reelId: number | null) => void
}

export const ReelsFeed = ({ className, reels = [], selectedReelId: externalSelectedReelId, onReelSelect }: ReelsFeedProps) => {
  const [internalSelectedReelId, setInternalSelectedReelId] = useState<number | null>(null)
  const selectedReelId = externalSelectedReelId !== undefined ? externalSelectedReelId : internalSelectedReelId
  const setSelectedReelId = onReelSelect || setInternalSelectedReelId

  // Update selected reel when reels change
  useEffect(() => {
    if (reels.length > 0 && !selectedReelId) {
      setSelectedReelId(reels[0].id)
    }
  }, [reels, selectedReelId])

  if (reels.length === 0) {
    return (
      <div className={cn(
        'flex-1 flex justify-center items-center min-h-0 w-full',
        'md:min-h-[calc(100vh-200px)]',
        className
      )}>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No reels available yet</p>
        </div>
      </div>
    )
  }

  // If a reel is selected, show the player
  if (selectedReelId) {
    return (
      <div
        className={cn(
          'flex-1 flex justify-center items-center min-h-0 w-full',
          'md:min-h-[calc(100vh-200px)]',
          className
        )}
      >
        <ReelPlayer id={String(selectedReelId)} />
      </div>
    )
  }

  // Otherwise show the feed
  return (
    <div className={cn('flex-1 space-y-6', className)}>
      {reels.map(reel => (
        <ReelCard
          key={reel.id}
          reel={reel}
          onClick={() => setSelectedReelId(reel.id)}
        />
      ))}
    </div>
  )
}
