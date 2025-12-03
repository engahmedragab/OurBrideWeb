'use client'

import { cn } from '@/lib/utils'
import { ReelPlayer } from './ReelPlayer'

export interface ReelsFeedProps {
  className?: string
}

export const ReelsFeed = ({ className }: ReelsFeedProps) => {
  return (
    <div className={cn('flex-1 flex justify-center items-center min-h-0', className)}>
      <ReelPlayer id="1" />
    </div>
  )
}

