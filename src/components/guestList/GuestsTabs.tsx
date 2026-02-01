'use client'

import type { KeyboardEvent } from 'react'
import type { GuestSide } from './mockGuests'
import { cn } from '@/lib/utils'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'

interface GuestsTabsProps {
  activeSide: GuestSide
  onSideChange: (side: GuestSide) => void
}

export const GuestsTabs = ({ activeSide, onSideChange }: GuestsTabsProps) => {
  const t = useI18nTranslations('eventsPlanning.guestList')
  const isRTL = useIsRTL()

  const isBride = activeSide === 'bride'

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      onSideChange(isBride ? 'groom' : 'bride')
    }
  }


  const sliderTransform =
    isBride
      ? 'translate-x-0'
      : isRTL
        ? '-translate-x-full'
        : 'translate-x-full'

  return (
    <div className="mb-6 flex justify-center">
      <div
        role="tablist"
        aria-label="Guest side tabs"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex items-center gap-1.5 rounded-full p-1.5',
          'min-w-[320px] sm:min-w-[360px]',
          'border border-gray-200 bg-gray-50 shadow-sm',
          'focus:outline-none focus:ring-4 focus:ring-brand-500/15'
        )}
      >
  
        <span
          aria-hidden
          className={cn(
            'absolute inset-y-1.5 rounded-full shadow-md',
            'w-[calc(50%-0.375rem)]',
           
            isRTL ? 'right-1.5' : 'left-1.5',
            'bg-brand-500',
            'transition-transform duration-300 ease-out',
            sliderTransform
          )}
        />

        <button
          role="tab"
          aria-selected={isBride}
          type="button"
          onClick={() => onSideChange('bride')}
          className={cn(
            'relative z-10 flex-1 rounded-full px-6 py-3',
            'text-[18px] font-semibold leading-none',
            'transition-all duration-200 active:scale-[0.98]',
          
            isBride ? '!text-white' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {t('tabs.bride')}
        </button>

        <button
          role="tab"
          aria-selected={!isBride}
          type="button"
          onClick={() => onSideChange('groom')}
          className={cn(
            'relative z-10 flex-1 rounded-full px-6 py-3',
            'text-[18px] font-semibold leading-none',
            'transition-all duration-200 active:scale-[0.98]',
            
            !isBride ? '!text-white' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {t('tabs.groom')}
        </button>
      </div>
    </div>
  )
}
