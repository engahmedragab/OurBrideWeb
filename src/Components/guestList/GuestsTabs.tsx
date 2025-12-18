'use client'

import type { GuestSide } from './mockGuests'
import { cn } from '@/lib/utils'

interface GuestsTabsProps {
  activeSide: GuestSide
  onSideChange: (side: GuestSide) => void
}

export const GuestsTabs = ({ activeSide, onSideChange }: GuestsTabsProps) => {
  return (
    <div className="mb-6 flex gap-2">
      <button
        type="button"
        onClick={() => onSideChange('bride')}
        className={cn(
          'flex-1 px-4 py-3 rounded-lg text-16 font-medium transition-all duration-200',
          activeSide === 'bride'
            ? 'bg-gray-100 text-brand-500 shadow-sm border border-gray-200'
            : 'bg-transparent text-brand-500 hover:text-brand-600'
        )}
      >
        Bride
      </button>
      <button
        type="button"
        onClick={() => onSideChange('groom')}
        className={cn(
          'flex-1 px-4 py-3 rounded-lg text-16 font-medium transition-all duration-200',
          activeSide === 'groom'
            ? 'bg-gray-100 text-brand-500 shadow-sm border border-gray-200'
            : 'bg-transparent text-brand-500 hover:text-brand-600'
        )}
      >
        Groom
      </button>
    </div>
  )
}


