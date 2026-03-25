'use client'

import { cn } from '@/lib/utils'

export type InvitationSideFilter = 'all' | 'bride' | 'groom'

interface InvitationSideTabsProps {
  active: InvitationSideFilter
  onChange: (side: InvitationSideFilter) => void
}

const tabs: { value: InvitationSideFilter; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '' },
  { value: 'bride', label: "Bride's Side", emoji: '' },
  { value: 'groom', label: "Groom's Side", emoji: '' },
]

export function InvitationSideTabs({ active, onChange }: InvitationSideTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'relative px-5 py-2.5 rounded-full text-13 font-medium transition-all duration-200',
            active === tab.value
              ? 'bg-brand-500 text-white shadow-md shadow-brand-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
