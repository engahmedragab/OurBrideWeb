'use client'

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingOverlay, LoadingSpinner } from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { useEventId } from '@/hooks/planning'
import { useGuestBook, useSyncGuestBook } from '@/hooks/guestBooks/useGuestBooks'
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
  getGuestsBySide,
  getTotalInvitations,
  getTotalPeople,
  getGroupsFromGuests,
} from '@/components/guestList'
import { mapApiToDraft, mapDraftToSyncPayload, generateTempId, type GuestBookDraft } from '@/utils/guestbook/adapters'
import type { GuestLineResponse, GuestLineCategoryResponse } from '@/types/responses'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'
import { GuestRelevant, GuestStatus as GuestStatusEnum, GuestTitle } from '@/types/responses/book-enums'

/**
 * Convert GuestLineResponse to Guest UI type
 */
const mapLineToGuest = (line: GuestLineResponse): Guest => {
  // Determine side based on guestRelevant
  const side: GuestSide = line.guestRelevant === GuestRelevant.Bride ? 'bride' : 
                         line.guestRelevant === GuestRelevant.Groom ? 'groom' : 
                         line.guestRelevant === GuestRelevant.Others ? 'bride' : 'bride' // Default to bride for Others
  
  // Use lineCategoryId as groupId, or default to 'friends'
  const groupId: GuestGroupId = line.lineCategoryId?.toString() || 'friends'
  
  // Use nickName as name, fallback to family if nickName is empty
  const name = line.nickName?.trim() || line.family?.trim() || ''
  
  // For peopleCount, we'll use 1 as default (can be extended if API provides this)
  // TODO: Check if API provides peopleCount in a different field
  const peopleCount = 1
  
  // Use creationDate as registeredAt, format it properly
  const registeredAt = line.creationDate 
    ? new Date(line.creationDate).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]
  
  // Map status based on isDone: if isDone is true, status is confirmed, otherwise none
  const status: GuestStatus = line.isDone ? 'confirmed' : 'none'
  
  return {
    id: line.id.toString(),
    side,
    groupId,
    name,
    peopleCount,
    registeredAt,
    status,
    selected: false,
  }
}

/**
 * Convert Guest UI type to GuestLineRequest
 */
const mapGuestToLineRequest = (
  guest: Guest,
  bookId: number,
  lineId?: number | null
): any => {
  // isDone and status are linked: isDone true = confirmed, isDone false = none
  const isDone = guest.status === 'confirmed'
  return {
    id: lineId || null,
    bookId,
    lineCategoryId: parseInt(guest.groupId) || null,
    nickName: guest.name,
    title: null, // GuestTitle.NoFormalities
    attended: false,
    family: null,
    status: isDone ? GuestStatusEnum.Confirmed : GuestStatusEnum.None,
    guestRelevant: guest.side === 'bride' ? GuestRelevant.Bride : GuestRelevant.Groom,
    isDone: isDone,
    isFavorite: false,
    isDeleted: false,
    isModelLine: false,
    brideId: guest.side === 'bride' ? undefined : null,
    groomId: guest.side === 'groom' ? undefined : null,
    creationDate: guest.registeredAt || new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
  }
}

function InvitationPageContent() {
  const router = useRouter()
  const { addToast } = useToast()
  const eventId = useEventId()

  // Local draft state
  const [localDraft, setLocalDraft] = useState<GuestBookDraft | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSyncedRef = useRef<GuestBookDraft | null>(null)
  const isInitialLoadRef = useRef(true)

  // UI state
  const [activeSide, setActiveSide] = useState<GuestSide>('bride')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [defaultGroupId, setDefaultGroupId] = useState<GuestGroupId | undefined>()
  const [expandedGroupId, setExpandedGroupId] = useState<GuestGroupId | null>(null)
  const [scrollToGroupId, setScrollToGroupId] = useState<GuestGroupId | null>(null)
  // UI-only state for selected guests
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set())

  // Fetch guest book
  const { data: guestBook, isLoading, error, refetch } = useGuestBook({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: typeof window !== 'undefined' && !!eventId,
  })

  const syncMutation = useSyncGuestBook()

  // On first load, use the book from GET endpoint immediately
  useEffect(() => {
    if (isInitialLoadRef.current && guestBook && !localDraft) {
      console.log('[InvitationPage] Initial load - guestBook:', guestBook)
      const draft = mapApiToDraft(guestBook)
      console.log('[InvitationPage] Mapped draft:', draft)
      if (draft) {
        console.log('[InvitationPage] Draft lines count:', draft.lines?.length || 0)
        console.log('[InvitationPage] Draft categories count:', draft.lineCategories?.length || 0)
        setLocalDraft(draft)
        lastSyncedRef.current = draft
        isInitialLoadRef.current = false
      }
    }
  }, [guestBook, localDraft])


  // Sync fetched data to local state when it changes (only if no unsaved changes)
  useEffect(() => {
    if (guestBook && !hasUnsavedChanges && !isInitialLoadRef.current) {
      const draft = mapApiToDraft(guestBook)
      if (draft) {
        setLocalDraft(draft)
        lastSyncedRef.current = draft
      }
    } else if (guestBook === null && !isLoading && !hasUnsavedChanges) {
      setLocalDraft(null)
    }
  }, [guestBook, hasUnsavedChanges, isLoading])

  // After sync, update local state from refetched data
  useEffect(() => {
    if (guestBook && !hasUnsavedChanges && syncMutation.isSuccess) {
      const draft = mapApiToDraft(guestBook)
      if (draft) {
        setLocalDraft(draft)
        lastSyncedRef.current = draft
        isInitialLoadRef.current = false
      }
    }
  }, [guestBook, hasUnsavedChanges, syncMutation.isSuccess])

  // Check if there are actual changes
  const hasActualChanges = useCallback((): boolean => {
    if (!localDraft || !lastSyncedRef.current) {
      return !!localDraft
    }

    const current = localDraft
    const lastSynced = lastSyncedRef.current

    // Compare basic book properties
    if (
      current.id !== lastSynced.id ||
      current.brideNumber !== lastSynced.brideNumber ||
      current.groomNumber !== lastSynced.groomNumber ||
      current.maxBrideNumber !== lastSynced.maxBrideNumber ||
      current.maxGroomNumber !== lastSynced.maxGroomNumber
    ) {
      return true
    }

    // Compare categories
    const currentCategories = current.lineCategories || []
    const lastSyncedCategories = lastSynced.lineCategories || []

    if (currentCategories.length !== lastSyncedCategories.length) {
      return true
    }

    for (const currentCat of currentCategories) {
      const lastSyncedCat = lastSyncedCategories.find(c => c.id === currentCat.id)
      if (!lastSyncedCat) return true
      if (currentCat.isDeleted !== lastSyncedCat.isDeleted) return true
      if (!currentCat.isDeleted && (
        currentCat.name !== lastSyncedCat.name ||
        currentCat.description !== lastSyncedCat.description ||
        currentCat.guestRelevant !== lastSyncedCat.guestRelevant
      )) {
        return true
      }
    }

    // Compare lines
    const currentLines = current.lines || []
    const lastSyncedLines = lastSynced.lines || []

    if (currentLines.length !== lastSyncedLines.length) {
      return true
    }

    for (let i = 0; i < currentLines.length; i++) {
      const currentLine = currentLines[i]
      const lastSyncedLine = lastSyncedLines.find(l => l.id === currentLine.id)

      if (!lastSyncedLine) return true

      if (
        currentLine.nickName !== lastSyncedLine.nickName ||
        currentLine.lineCategoryId !== lastSyncedLine.lineCategoryId ||
        currentLine.status !== lastSyncedLine.status ||
        currentLine.guestRelevant !== lastSyncedLine.guestRelevant ||
        currentLine.isDeleted !== lastSyncedLine.isDeleted ||
        currentLine.isDone !== lastSyncedLine.isDone ||
        currentLine.isFavorite !== lastSyncedLine.isFavorite
      ) {
        return true
      }
    }

    return false
  }, [localDraft])

  // Update hasUnsavedChanges when draft changes
  useEffect(() => {
    if (localDraft && lastSyncedRef.current) {
      setHasUnsavedChanges(hasActualChanges())
    }
  }, [localDraft, hasActualChanges])

  // Auto-sync every 2 minutes (only if there are actual changes)
  useEffect(() => {
    if (!eventId || !localDraft || hasUnsavedChanges) return

    const interval = setInterval(async () => {
      try {
        if (!hasActualChanges()) {
          return
        }

        const bookRequest = mapDraftToSyncPayload(localDraft)
        await syncMutation.mutateAsync({
          data: bookRequest,
          query: {
            eventId: eventId || undefined,
            userType: null as unknown as UserType | undefined,
            clientId: null as unknown as string | undefined,
          },
        })
        lastSyncedRef.current = localDraft
        refetch()
      } catch (error) {
        console.error('Auto-sync failed:', error)
      }
    }, 2 * 60 * 1000) // 2 minutes

    return () => clearInterval(interval)
  }, [eventId, localDraft, hasUnsavedChanges, syncMutation, refetch, hasActualChanges])

  // Convert lines to guests for UI
  const guests: Guest[] = useMemo(() => {
    if (!localDraft) {
      console.log('[InvitationPage] No localDraft - returning empty guests array')
      return []
    }
    const allLines = localDraft.lines || []
    console.log('[InvitationPage] Total lines:', allLines.length)
    const nonDeletedLines = allLines.filter(line => !line.isDeleted)
    console.log('[InvitationPage] Non-deleted lines:', nonDeletedLines.length)
    const mappedGuests = nonDeletedLines.map(line => {
      const guest = mapLineToGuest(line)
      // Add selected state from UI state
      guest.selected = selectedGuestIds.has(guest.id)
      return guest
    })
    console.log('[InvitationPage] Mapped guests:', mappedGuests.length)
    return mappedGuests
  }, [localDraft, selectedGuestIds])

  // Get groups from categories - filter by active side
  const groups: GuestGroup[] = useMemo(() => {
    if (!localDraft) return []
    return (localDraft.lineCategories || [])
      .filter(cat => !cat.isDeleted)
      .filter(cat => {
        // Filter categories by active side
        if (activeSide === 'bride') {
          return cat.guestRelevant === GuestRelevant.Bride || cat.guestRelevant === GuestRelevant.Others
        } else {
          return cat.guestRelevant === GuestRelevant.Groom || cat.guestRelevant === GuestRelevant.Others
        }
      })
      .map(cat => ({
        id: cat.id.toString(),
        title: cat.name || '',
      }))
  }, [localDraft, activeSide])


  // Filter guests by active side - include guests with Others guestRelevant in both sides
  const filteredGuests = useMemo(() => {
    if (!localDraft) return []
    
    return guests.filter(guest => {
      // Find the original line to check guestRelevant
      const line = (localDraft.lines || []).find(l => l.id.toString() === guest.id)
      if (!line) return guest.side === activeSide
      
      // If guestRelevant is Others, show in both bride and groom tabs
      if (line.guestRelevant === GuestRelevant.Others) {
        return true
      }
      
      // Otherwise, filter by side
      return guest.side === activeSide
    })
  }, [guests, activeSide, localDraft])

  // Reset expanded group when side changes
  useEffect(() => {
    setExpandedGroupId(null)
  }, [activeSide])

  // Get all groups from categories and guests (dynamic)
  const availableGroups = useMemo(() => {
    const groupMap = new Map<GuestGroupId, GuestGroup>()

    // First, add all categories as groups
    groups.forEach(group => {
      groupMap.set(group.id, group)
    })

    // Then, add groups from guests that might not have categories
    const groupsFromGuests = getGroupsFromGuests(guests)
    groupsFromGuests.forEach(group => {
      if (!groupMap.has(group.id)) {
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

  // Prepare dialog groups - merge groups and availableGroups
  const dialogGroups = useMemo(() => {
    const dialogGroupsMap = new Map<GuestGroupId, GuestGroup>()
    groups.forEach(group => {
      dialogGroupsMap.set(group.id, group)
    })
    availableGroups.forEach(group => {
      dialogGroupsMap.set(group.id, group)
    })
    return Array.from(dialogGroupsMap.values())
  }, [availableGroups, groups])

  const handleSync = async () => {
    try {
      if (!localDraft) {
        if (isLoading) {
          addToast('Please wait while the guest book is loading...', 'info')
          return
        }
        addToast('Guest book not found. Please refresh the page.', 'error')
        return
      }

      if (!hasActualChanges()) {
        addToast('No changes to save', 'info')
        setHasUnsavedChanges(false)
        return
      }

      const bookRequest = mapDraftToSyncPayload(localDraft)
      
      // Log for debugging - check if new categories are included
      const newCategories = bookRequest.lineCategories?.filter(cat => cat.id === 0) || []
      const existingCategories = bookRequest.lineCategories?.filter(cat => cat.id && cat.id > 0) || []
      console.log(`[Sync] Total categories: ${bookRequest.lineCategories?.length || 0}`)
      console.log(`[Sync] New categories (id=0): ${newCategories.length}`, newCategories.map(c => ({ name: c.name, guestRelevant: c.guestRelevant })))
      console.log(`[Sync] Existing categories: ${existingCategories.length}`)
      console.log(`[Sync] Total lines: ${bookRequest.lines?.length || 0}`)
      
      if (newCategories.length === 0 && (localDraft.lineCategories || []).some(cat => cat.id && cat.id < 0)) {
        console.warn('[Sync] WARNING: Found categories with negative IDs but no new categories in payload!')
        console.warn('[Sync] Local categories:', localDraft.lineCategories?.map(c => ({ id: c.id, name: c.name })))
      }
      
      await syncMutation.mutateAsync({
        data: bookRequest,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })

      setHasUnsavedChanges(false)
      lastSyncedRef.current = localDraft
      addToast('Changes saved successfully', 'success')
      refetch()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes'
      addToast(errorMessage, 'error')
    }
  }

  const handleRefresh = () => {
    refetch()
    addToast('Guest list refreshed', 'success')
  }

  const handleToggleSelect = (id: string) => {
    // This is UI-only state, no need to sync
    setSelectedGuestIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleToggleStatus = (id: string) => {
    if (!localDraft) return

    const lineId = parseInt(id)
    setLocalDraft({
      ...localDraft,
      lines: (localDraft.lines || []).map(line =>
        line.id === lineId
          ? {
              ...line,
              isDone: !line.isDone,
              status: !line.isDone ? GuestStatusEnum.Confirmed : GuestStatusEnum.None,
            }
          : line
      ),
    })
  }

  const handleDelete = (id: string) => {
    if (!localDraft) return

    const lineId = parseInt(id)
    setLocalDraft({
      ...localDraft,
      lines: (localDraft.lines || []).map(line =>
        line.id === lineId ? { ...line, isDeleted: true } : line
      ),
    })
    addToast('Guest deleted', 'info')
  }

  const handleAddGuest = (groupId?: GuestGroupId, isGroupLevel = false) => {
    setDefaultGroupId(isGroupLevel ? groupId : undefined)
    setIsAddDialogOpen(true)
  }

  const handleSubmitGuest = (guestData: {
    side: GuestSide
    groupName: string // Changed from groupId to groupName
    name: string
    peopleCount: number
    registeredAt: string
    status: GuestStatus
  }) => {
    if (!localDraft) return

    // Create the new guest line with lineCategorySlug instead of lineCategoryId
    // isDone and status are linked: isDone true = confirmed, isDone false = none
    const isDone = guestData.status === 'confirmed'
    const newLine = {
      id: generateTempId(),
      bookId: localDraft.id || 0,
      lineCategoryId: undefined, // Set to undefined when using lineCategorySlug
      lineCategorySlug: guestData.groupName, // Use group name as slug
      nickName: guestData.name,
      title: GuestTitle.NoFormalities,
      attended: false,
      family: '',
      status: isDone ? GuestStatusEnum.Confirmed : GuestStatusEnum.None,
      guestRelevant: guestData.side === 'bride' ? GuestRelevant.Bride : GuestRelevant.Groom,
      isDone: isDone,
      isFavorite: false,
      isDeleted: false,
      isModelLine: false,
      brideId: guestData.side === 'bride' ? undefined : null,
      groomId: guestData.side === 'groom' ? undefined : null,
      creationDate: guestData.registeredAt || new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      createdBy: '',
      lastModifiedBy: '',
      slug: '',
      lineType: localDraft.bookType as any,
      bookClass: localDraft.bookClass as any,
    } as GuestLineResponse

    setLocalDraft({
      ...localDraft,
      lines: [...(localDraft.lines || []), newLine],
    })

    // Use group name as groupId for UI purposes
    const groupIdForUI = guestData.groupName
    setExpandedGroupId(groupIdForUI)
    setScrollToGroupId(groupIdForUI)
    setTimeout(() => {
      setScrollToGroupId(null)
    }, 1000)

    addToast('Guest added successfully', 'success')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading guests..." />
      </div>
    )
  }

  if (error) {
    console.error('[InvitationPage] Error loading guest book:', error)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-16 text-red-600 mb-4">
          Failed to load guests. Please try again.
        </p>
        <p className="text-14 text-gray-500 mb-4">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  // Show empty state if no book exists
  if (!localDraft && !isLoading) {
    console.log('[InvitationPage] No localDraft and not loading - showing empty state')
    console.log('[InvitationPage] guestBook:', guestBook)
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <GuestsHeader onRefresh={handleRefresh} />
        <div className="py-12 text-center">
          <p className="text-16 text-gray-500 mb-4">No guest book found</p>
          <Button variant="brand" onClick={() => refetch()} className="text-white">
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
      <GuestsHeader onRefresh={handleRefresh} />
        {hasUnsavedChanges && (
          <Button
            variant="brand"
            onClick={handleSync}
            disabled={syncMutation.isPending}
            className="text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {syncMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <GuestsTabs activeSide={activeSide} onSideChange={setActiveSide} />

      <GuestsSummary
        side={activeSide}
        invitationsCount={invitationsCount}
        peopleTotal={peopleTotal}
      />

      {/* Groups Section */}
      {filteredGuests.length === 0 && availableGroups.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-16 text-gray-500 mb-4">No guests yet</p>
          <Button variant="brand" onClick={() => handleAddGuest()} className="text-white">
            Add New Guest
            <Plus className="h-4 w-4 ml-2 text-white" />
          </Button>
        </div>
      ) : availableGroups.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-16 text-gray-500 mb-4">No groups available. Add a guest to create a group.</p>
          <Button variant="brand" onClick={() => handleAddGuest()} className="text-white">
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

      {/* Add Guest Button - Sticky on Mobile */}
      {filteredGuests.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 sm:relative sm:bottom-auto sm:left-auto sm:right-auto bg-white border-t border-gray-200 sm:border-t-0 sm:bg-transparent p-4 sm:p-0 sm:mt-6 z-10 shadow-lg sm:shadow-none">
          <Button
            variant="brand"
            size="lg"
            onClick={() => handleAddGuest()}
            className="w-full sm:w-auto sm:px-6 text-white"
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
        forcedGroupId={defaultGroupId}
        allowGroupCreation={!defaultGroupId}
        availableGroups={dialogGroups}
      />
    </div>
  )
}

export default function InvitationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    }>
      <InvitationPageContent />
    </Suspense>
  )
}
