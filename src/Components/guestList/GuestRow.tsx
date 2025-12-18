'use client'

import { Trash2, CheckCircle2, XCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/Checkbox'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Guest } from './mockGuests'
import { formatDate } from './mockGuests'

interface GuestRowProps {
  guest: Guest
  onToggleSelect: (id: string) => void
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}

export const GuestRow = ({
  guest,
  onToggleSelect,
  onToggleStatus,
  onDelete,
}: GuestRowProps) => {

  return (
    <div className="flex items-center gap-3 py-3 px-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <Checkbox
        checked={guest.selected}
        onChange={() => onToggleSelect(guest.id)}
        variant="default"
        size="md"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-14 text-gray-600">No.</span>
          <span className="text-14 font-medium text-gray-900">{guest.name}</span>
        </div>
        <p className="text-12 text-gray-500">
          People: {guest.peopleCount} • {formatDate(guest.registeredAt)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleStatus(guest.id)}
          className="flex items-center gap-1.5 cursor-pointer"
          aria-label={`Toggle status for ${guest.name}`}
        >
          {guest.status === 'confirmed' ? (
            <Badge
              variant="confirmed"
              size="sm"
              className="flex items-center gap-1.5 px-2.5 py-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-12">Confirmed</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 px-2.5 py-1 text-gray-500 border-gray-300"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span className="text-12">None</span>
            </Badge>
          )}
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(guest.id)}
          className="text-brand-500 hover:text-brand-600 hover:bg-brand-50"
          aria-label={`Delete ${guest.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


