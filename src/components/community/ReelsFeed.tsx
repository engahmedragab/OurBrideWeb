'use client'

import { cn } from '@/lib/utils'
import { ReelPlayer } from './ReelPlayer'

export interface ReelsFeedProps {
  className?: string
}

export const ReelsFeed = ({ className }: ReelsFeedProps) => {
  return (
    <div
      className={cn(
        'flex-1 flex justify-center items-center min-h-0 w-full',
        'md:min-h-[calc(100vh-200px)]',
        className
      )}
    >
      <ReelPlayer id="1" />
    </div>
  )
}
