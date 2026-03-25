'use client'

import { cn } from '@/lib/utils'
import { InvitationStatus } from '@/types/responses/invitation-book-response'

export type StatusFilter = 'all' | InvitationStatus

interface InvitationStatusFilterProps {
  active: StatusFilter
  onChange: (status: StatusFilter) => void
}

const filters: { value: StatusFilter; label: string; dot: string }[] = [
  { value: 'all', label: 'All', dot: 'bg-gray-400' },
  { value: InvitationStatus.Draft, label: 'Draft', dot: 'bg-gray-400' },
  { value: InvitationStatus.Sent, label: 'Sent', dot: 'bg-blue-500' },
  { value: InvitationStatus.Confirmed, label: 'Confirmed', dot: 'bg-green-500' },
  { value: InvitationStatus.Declined, label: 'Declined', dot: 'bg-red-500' },
  { value: InvitationStatus.CheckedIn, label: 'Checked In', dot: 'bg-purple-500' },
]

export function InvitationStatusFilter({ active, onChange }: InvitationStatusFilterProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-4">
      {filters.map((f) => (
        <button
          key={String(f.value)}
          type="button"
          onClick={() => onChange(f.value)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-12 font-medium transition-all border',
            active === f.value
              ? 'border-brand-300 bg-brand-50 text-brand-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          )}
        >
          <span className={cn('h-2 w-2 rounded-full', f.dot)} />
          {f.label}
        </button>
      ))}
    </div>
  )
}
