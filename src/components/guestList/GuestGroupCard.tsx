'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GuestRow } from './GuestRow'
import type { Guest, GuestGroup } from './mockGuests'

type GuestGroupId = string

type DetailsProps = {
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

type SidebarProps = {
  group: GuestGroup[]
  guests: Guest[]
  activeGroupId?: GuestGroupId | null
  onSelectGroup: (groupId: GuestGroupId) => void
  onAddGroup: () => void
}

type GuestGroupCardProps = DetailsProps | SidebarProps

const getRowKey = (guest: Guest) => {
  const idNum = Number(guest.id)
  if (!Number.isNaN(idNum) && idNum > 0) return `srv-${guest.id}`
  if ((guest as any).clientId) return `tmp-${String((guest as any).clientId)}`
  return `tmp-${guest.id}`
}

const isSidebar = (props: GuestGroupCardProps): props is SidebarProps => Array.isArray(props.group)

export const GuestGroupCard = (props: GuestGroupCardProps) => {
  // =========================
  // Sidebar mode (Right panel)
  // =========================
  if (isSidebar(props)) {
    const { group: groups, guests, activeGroupId, onSelectGroup, onAddGroup } = props

    const statsByGroup = useMemo(() => {
      const map = new Map<string, { total: number; confirmed: number }>()
      for (const g of groups) map.set(g.id, { total: 0, confirmed: 0 })

      for (const guest of guests) {
        const key = String(guest.groupId)
        const cur = map.get(key)
        if (!cur) continue
        cur.total += 1
        if (guest.status === 'confirmed') cur.confirmed += 1
      }

      return map
    }, [groups, guests])

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
     <div className="px-4 py-4 border-b border-gray-100">
  {/* Row 1: Title + Button */}
  <div className="flex items-center justify-between gap-3">
    <p className="text-16 font-semibold text-gray-900 truncate">Categories</p>

    <Button
    variant="outlineBrand"
      size="sm"
      onClick={onAddGroup}
      type="button"
      className="shrink-0  px-0 h-auto text-[14px]  text-brand-500 hover:bg-brand-500 hover:text-white rounded-md px-2 py-1  flex items-center gap-1"
    >
      <Plus className="h-4 w-4" />
      add new
    </Button>
  </div>

  {/* Row 2: Subtitle */}
  <p className="mt-1 text-12 text-gray-500 truncate">Organize your guest list</p>
</div>


        {/* ✅ CTA dashed row (زي Add Guest) */}
        {/* <div className="p-2">
          <button
            type="button"
            onClick={onAddGroup}
            className="w-full text-left"
          >
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/30 px-4 py-4 hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <Plus className="h-5 w-5 text-brand-500" />
              </div>
              <div className="min-w-0">
                <p className="text-14 font-medium text-gray-900">Add new category</p>
                <p className="text-12 text-gray-500 truncate">Create a new category for guests</p>
              </div>
            </div>
          </button>
        </div> */}

        {groups.length === 0 ? (
          <div className="p-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center">
              <p className="text-14 text-gray-600">No categories yet</p>
              <p className="text-12 text-gray-500 mt-1">Create one to start adding guests.</p>
            </div>
          </div>
        ) : (
          <div className="p-2 pt-0">
            <div className="space-y-2">
              {groups.map(g => {
                const stats = statsByGroup.get(g.id) || { total: 0, confirmed: 0 }
                const isActive = String(activeGroupId || '') === String(g.id)

                return (
                  <button
                    key={`grp-${g.id}`}
                    type="button"
                    onClick={() => onSelectGroup(g.id)}
                    className={[
                      'w-full text-left rounded-xl border px-3 py-3 transition-colors',
                      isActive ? 'border-brand-400 ' : 'border-gray-200 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-14 font-medium text-gray-900 truncate">{g.title}</p>
                        <p className="text-12 text-gray-500 truncate">
                          {stats.total} guests • {stats.confirmed} confirmed
                        </p>
                      </div>

                      <div className="shrink-0 text-12 text-gray-500">
                        {stats.total === 0 ? 'Empty' : ''}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // =========================
  // Details mode (Left panel)
  // =========================
  const {
    group,
    guests,
    isExpanded,
    onToggleExpand,
    onToggleSelect,
    onToggleStatus,
    onDelete,
    onAddGuest,
    scrollIntoView = false,
  } = props

  const cardRef = useRef<HTMLDivElement>(null)

  const groupGuests = useMemo(() => guests.filter(g => g.groupId === group.id), [guests, group.id])
  const total = groupGuests.length
  const confirmed = groupGuests.filter(g => g.status === 'confirmed').length
  const remaining = Math.max(total - confirmed, 0)
  const hasSelected = groupGuests.some(g => g.selected)

  useEffect(() => {
    if (scrollIntoView && cardRef.current) {
      const t = setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => clearTimeout(t)
    }
  }, [scrollIntoView])

  return (
    <div ref={cardRef} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
      >
        <div className="min-w-0">
          <h2 className="text-18 font-semibold text-gray-900 truncate">{group.title}</h2>
          <p className="text-13 text-gray-500">
            {/* {total} guests • {confirmed} confirmed • {remaining} remaining */}
          </p>
        </div>

        <Button
          variant="outlineBrand"
          size="sm"
          className=" text-brand-500 hover:bg-brand-500 hover:text-white rounded-md text-[12px]" 
          onClick={(e) => {
            e.stopPropagation()
            onAddGuest(group.id, true)
          }}
        >
          <Plus className="h-3 w-3 " />
          Add New Guest
        </Button>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {/* Add dashed row */}
          {/* <button
            type="button"
            onClick={() => onAddGuest(group.id, true)}
            className="w-full text-left px-4 py-4"
          >
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/30 px-4 py-4 hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <Plus className="h-5 w-5 text-brand-500" />
              </div>
              <div className="min-w-0">
                <p className="text-14 font-medium text-gray-900">Add new guest</p>
                <p className="text-12 text-gray-500 truncate">Create a new line in this group</p>
              </div>
            </div>
          </button> */}

          {/* Rows */}
          {groupGuests.length === 0 ? (
            <div className="px-4 pb-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center">
                <p className="text-14 text-gray-600 mb-3">No guests yet</p>
                {/* <Button
                  variant="brand"
                  size="sm"
                  className="!text-white"
                  onClick={() => onAddGuest(group.id, true)}
                >
                  <Plus className="h-4 w-4 mr-2 text-white" />
                  Add Guest
                </Button> */}
              </div>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {groupGuests.map(guest => (
                  <GuestRow
                    key={getRowKey(guest)}
                    guest={guest}
                    onToggleSelect={onToggleSelect}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                ))}
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    groupGuests.filter(g => g.selected).forEach(g => onDelete(g.id))
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  disabled={!hasSelected}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>

                {/* <Button
                  variant="brand"
                  size="sm"
                  onClick={() => onAddGuest(group.id, true)}
                  className="!text-white"
                >
                  <Plus className="h-4 w-4 mr-2 text-white" />
                  Add Guest
                </Button> */}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
