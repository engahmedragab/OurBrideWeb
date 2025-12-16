'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GuestRow } from './GuestRow'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Guest, GuestGroup } from './mockGuests'

interface GuestGroupCardProps {
  group: GuestGroup
  guests: Guest[]
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleSelect: (id: string) => void
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
  onAddGuest: (groupId: string, isGroupLevel?: boolean) => void
  scrollIntoView?: boolean
}

export const GuestGroupCard = ({
  group,
  guests,
  isExpanded,
  onToggleExpand,
  onToggleSelect,
  onToggleStatus,
  onDelete,
  onAddGuest,
  scrollIntoView = false,
}: GuestGroupCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const groupGuests = guests.filter(g => g.groupId === group.id)
  const count = groupGuests.length

  // Scroll into view when requested
  useEffect(() => {
    if (scrollIntoView && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }, [scrollIntoView])

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-2 h-2 rounded-full bg-brand-500" />
          <div>
            <h3 className="text-16 font-semibold text-gray-900">{group.title}</h3>
            <p className="text-14 text-gray-600">{count} Guests</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {groupGuests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-14 text-gray-500 mb-4">No guests yet</p>
              <Button
                variant="brand"
                size="sm"
                onClick={() => onAddGuest(group.id, true)}
                className="!text-white "
              >
                <Plus className="h-4 w-4 mr-2 text-white" />
                Add Guest
              </Button>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {groupGuests.map(guest => (
                  <GuestRow
                    key={guest.id}
                    guest={guest}
                    onToggleSelect={onToggleSelect}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Delete all selected guests in this group
                    groupGuests
                      .filter(g => g.selected)
                      .forEach(g => onDelete(g.id))
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  disabled={!groupGuests.some(g => g.selected)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => onAddGuest(group.id, true)}
                  className="!text-white "
                >
                  <Plus className="h-4 w-4 mr-2 text-white" />
                  Add Guest
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

