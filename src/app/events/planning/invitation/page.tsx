'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toaster'
import {
  GuestsHeader,
  GuestsTabs,
  GuestsSummary,
  GuestGroupCard,
  AddGuestDialog,
  type Guest,
  type GuestSide,
  type GuestGroupId,
  type GuestStatus,
  type GuestGroup,
  initialMockGuests,
  DEFAULT_GROUPS,
  getGuestsBySide,
  getTotalInvitations,
  getTotalPeople,
  getGroupsFromGuests,
} from '@/components/guestList'

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>(initialMockGuests)
  const [groups, setGroups] = useState<GuestGroup[]>(DEFAULT_GROUPS)
  const [activeSide, setActiveSide] = useState<GuestSide>('bride')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [defaultGroupId, setDefaultGroupId] = useState<GuestGroupId | undefined>()
  const [expandedGroupId, setExpandedGroupId] = useState<GuestGroupId | null>('family')
  const [scrollToGroupId, setScrollToGroupId] = useState<GuestGroupId | null>(null)
  const { addToast } = useToast()

  const filteredGuests = useMemo(
    () => getGuestsBySide(guests, activeSide),
    [guests, activeSide]
  )

  // Reset expanded group when side changes
  useEffect(() => {
    setExpandedGroupId(null)
  }, [activeSide])

  // Get all groups from guests (dynamic) - only groups that actually have guests
  const availableGroups = useMemo(() => {
    const groupsFromGuests = getGroupsFromGuests(guests)
    const groupMap = new Map<GuestGroupId, GuestGroup>()
    
    // Only add groups that have guests
    groupsFromGuests.forEach(group => {
      groupMap.set(group.id, group)
    })
    
    // Add any manually added groups that have guests
    groups.forEach(group => {
      const hasGuests = guests.some(g => g.groupId === group.id)
      if (hasGuests && !groupMap.has(group.id)) {
        groupMap.set(group.id, group)
      }
    })
    
    return Array.from(groupMap.values())
  }, [guests, groups])

  const invitationsCount = useMemo(
    () => getTotalInvitations(filteredGuests),
    [filteredGuests]
  )

  const peopleTotal = useMemo(
    () => getTotalPeople(filteredGuests),
    [filteredGuests]
  )

  const handleRefresh = () => {
    setGuests(initialMockGuests)
    setGroups(DEFAULT_GROUPS)
    addToast('Guest list refreshed', 'success')
  }

  const handleToggleSelect = (id: string) => {
    setGuests(prev =>
      prev.map(guest =>
        guest.id === id ? { ...guest, selected: !guest.selected } : guest
      )
    )
  }

  const handleToggleStatus = (id: string) => {
    setGuests(prev =>
      prev.map(guest =>
        guest.id === id
          ? {
              ...guest,
              status: guest.status === 'confirmed' ? 'none' : 'confirmed',
            }
          : guest
      )
    )
  }

  const handleDelete = (id: string) => {
    setGuests(prev => prev.filter(guest => guest.id !== id))
    addToast('Guest deleted', 'info')
  }

  const handleAddGuest = (groupId?: GuestGroupId, isGroupLevel = false) => {
    setDefaultGroupId(isGroupLevel ? groupId : undefined)
    setIsAddDialogOpen(true)
  }

  const handleAddNewGroup = (groupTitle: string): GuestGroupId => {
    const newGroupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newGroup: GuestGroup = {
      id: newGroupId,
      title: groupTitle,
    }
    setGroups(prev => [...prev, newGroup])
    addToast(`Group "${groupTitle}" added`, 'success')
    return newGroupId
  }

  const handleGroupCreated = (groupId: GuestGroupId) => {
    // This will be called when a new group is created in the dialog
    // The group is already added by handleAddNewGroup, so we just need to track it
  }

  const handleSubmitGuest = (guestData: {
    side: GuestSide
    groupId: GuestGroupId
    name: string
    peopleCount: number
    registeredAt: string
    status: GuestStatus
  }) => {
    const newGuest: Guest = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...guestData,
      selected: false,
    }
    setGuests(prev => [...prev, newGuest])
    
    // Auto-focus the group that the guest was added to
    setExpandedGroupId(guestData.groupId)
    setScrollToGroupId(guestData.groupId)
    
    // Reset scroll flag after a delay
    setTimeout(() => {
      setScrollToGroupId(null)
    }, 1000)
    
    addToast('Guest added successfully', 'success')
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <GuestsHeader onRefresh={handleRefresh} />

      <GuestsTabs activeSide={activeSide} onSideChange={setActiveSide} />

      <GuestsSummary
        side={activeSide}
        invitationsCount={invitationsCount}
        peopleTotal={peopleTotal}
      />

      {/* Groups Section */}
      {filteredGuests.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-16 text-gray-500 mb-4">No guests yet</p>
          <Button variant="brand" onClick={() => handleAddGuest()} className="text-white ">
            Add New Guest
            <Plus className="h-4 w-4 ml-2 text-white" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4 mb-20 sm:mb-6">
          {availableGroups.map(group => {
            const groupGuests = filteredGuests.filter(
              g => g.groupId === group.id
            )
            // Only show groups that have guests for the current side
            if (groupGuests.length === 0) {
              return null
            }
            return (
              <GuestGroupCard
                key={group.id}
                group={group}
                guests={groupGuests}
                isExpanded={expandedGroupId === group.id}
                onToggleExpand={() => {
                  setExpandedGroupId(expandedGroupId === group.id ? null : group.id)
                }}
                onToggleSelect={handleToggleSelect}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onAddGuest={handleAddGuest}
                scrollIntoView={scrollToGroupId === group.id}
              />
            )
          })}
        </div>
      )}

      {/* Add Guest Button - Sticky on Mobile - Only show when there are guests */}
      {filteredGuests.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 sm:relative sm:bottom-auto sm:left-auto sm:right-auto bg-white border-t border-gray-200 sm:border-t-0 sm:bg-transparent p-4 sm:p-0 sm:mt-6 z-10 shadow-lg sm:shadow-none">
          <Button
            variant="brand"
            size="lg"
            onClick={() => handleAddGuest()}
            className="w-full sm:w-auto sm:px-6 text-white "
          >
            Add new guests
            <Plus className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Add Guest Dialog */}
      <AddGuestDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false)
          setDefaultGroupId(undefined)
        }}
        onSubmit={handleSubmitGuest}
        defaultSide={activeSide}
        defaultGroupId={defaultGroupId}
        forcedGroupId={defaultGroupId} // Lock group when called from group-level button
        allowGroupCreation={!defaultGroupId} // Only allow creation from global button
        availableGroups={useMemo(() => {
          // For dialog, include default groups even if empty, plus groups with guests
          const dialogGroups = new Map<GuestGroupId, GuestGroup>()
          
          // Add default groups (always available for selection)
          DEFAULT_GROUPS.forEach(group => {
            dialogGroups.set(group.id, group)
          })
          
          // Add groups from guests
          availableGroups.forEach(group => {
            dialogGroups.set(group.id, group)
          })
          
          // Add manually created groups
          groups.forEach(group => {
            dialogGroups.set(group.id, group)
          })
          
          return Array.from(dialogGroups.values())
        }, [availableGroups, groups])}
        onAddNewGroup={handleAddNewGroup}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  )
}
