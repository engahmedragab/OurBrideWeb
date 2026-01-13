'use client'

import { useMemo, useEffect, useState, Suspense } from 'react'
import { Plus, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingOverlay, LoadingSpinner } from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { useEventId } from '@/hooks/planning'
import { useGuestBook, useSyncGuestBook } from '@/hooks/guestBooks'

import {
  GuestsHeader,
  GuestsTabs,
  GuestsSummary,
  GuestGroupCard,
  AddGuestDialog,
  AddCategoryModal,
  type Guest,
  type GuestSide,
  type GuestGroupId,
  type GuestStatus,
  type GuestGroup,
  getTotalInvitations,
  getTotalPeople,
} from '@/components/guestList'

import type { GuestLineResponse, GuestLineCategoryResponse, GuestBookResponse } from '@/types/responses'
import type { UserType, GuestBookRequest } from '@/../client/common/api/gen/ourbride-api'
import { GuestStatus as GuestStatusEnum, GuestTitle, GuestRelevant } from '@/types/responses/book-enums'
import { generateClientId } from '@/utils/guestbook/uuid'

/** temp negative id for new lines */
const generateTempId = () => -Math.floor(Date.now() + Math.random() * 1000)

type GuestBookDraft = GuestBookResponse & {
  lineCategories?: Array<GuestLineCategoryResponse & { clientId?: string }>
  lines?: Array<GuestLineResponse & { clientId?: string }>
}

const toSideFromFamily = (family?: string | null): GuestSide => {
  const f = (family || '').trim().toLowerCase()
  return f === 'groom' ? 'groom' : 'bride'
}

const toUiStatus = (isDone?: boolean): GuestStatus => (isDone ? 'confirmed' : 'none')

const mapLineToGuest = (line: GuestLineResponse, selectedIds: Set<string>): Guest => {
  const side = toSideFromFamily((line as any).family)
  const groupId: GuestGroupId =
    line.lineCategoryId != null ? String(line.lineCategoryId) : 'uncategorized'

  const idStr = String(line.id ?? '')
  const anyLine: any = line
  const stableClientId = anyLine.clientId ? String(anyLine.clientId) : idStr

  const registeredAt = line.creationDate
    ? new Date(line.creationDate).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

  return {
    id: idStr,
    side,
    groupId,
    name: (line.nickName || '').trim(),
    peopleCount: 1,
    registeredAt,
    status: toUiStatus((line as any).isDone),
    selected: selectedIds.has(idStr),
    clientId: stableClientId,
  }
}

export default function InvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <LoadingOverlay open={true} title="Loading..." />
        </div>
      }
    >
      <InvitationPageContent />
    </Suspense>
  )
}

function InvitationPageContent() {
  const { addToast } = useToast()
  const eventId = useEventId()

  const [activeSide, setActiveSide] = useState<GuestSide>('bride')
  const [localDraft, setLocalDraft] = useState<GuestBookDraft | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false)
  const [forcedGroupId, setForcedGroupId] = useState<GuestGroupId | undefined>(undefined)
  const [forceNewCategory, setForceNewCategory] = useState(false)

  // const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set())

  const { data: guestBook, isLoading, error, refetch } = useGuestBook({
    eventId: eventId || undefined,
    userType: undefined as unknown as UserType | undefined,
    clientId: undefined as unknown as string | undefined,
    enabled: typeof window !== 'undefined' && !!eventId,
  })

  const syncMutation = useSyncGuestBook()

  /** hydrate local draft from server when safe */
  useEffect(() => {
    if (!guestBook) {
      if (!isLoading && !hasUnsavedChanges) setLocalDraft(null)
      return
    }
    if (!hasUnsavedChanges) {
      setLocalDraft(guestBook as unknown as GuestBookDraft)
    }
  }, [guestBook, isLoading, hasUnsavedChanges])

  /** groups (categories) - shared */
  const categoryGroups: GuestGroup[] = useMemo(() => {
    if (!localDraft) return []

    const cats = (localDraft.lineCategories || []).filter(c => !c.isDeleted)

    const mapped = cats.map((cat, idx) => {
      const anyCat: any = cat
      const id =
        cat.id && cat.id !== 0
          ? String(cat.id)
          : String(anyCat.clientId || cat.slug || `tmp-${idx}`)

      return {
        id,
        title: (cat.name || '').trim(),
      }
    })

    // لو فيه lines بدون category
    const hasUncategorized = (localDraft.lines || []).some(l => !l.isDeleted && l.lineCategoryId == null)
    if (hasUncategorized) {
      mapped.unshift({ id: 'uncategorized', title: 'Uncategorized' })
    }

    return mapped
  }, [localDraft])

  /** active group selection */
  const [activeGroupId, setActiveGroupId] = useState<GuestGroupId | null>(null)

  useEffect(() => {
    if (!categoryGroups.length) {
      setActiveGroupId(null)
      return
    }
    setActiveGroupId(prev => (prev && categoryGroups.some(g => g.id === prev) ? prev : categoryGroups[0].id))
  }, [categoryGroups])

  const activeGroup = useMemo(() => {
    if (!activeGroupId) return null
    return categoryGroups.find(g => g.id === activeGroupId) || null
  }, [categoryGroups, activeGroupId])

  /** map lines -> UI guests */
  const guests: Guest[] = useMemo(() => {
    if (!localDraft) return []
    const lines = (localDraft.lines || []).filter(l => !l.isDeleted)
    return lines.map(l => mapLineToGuest(l, selectedGuestIds))
  }, [localDraft, selectedGuestIds])

  /** filter guests by side */
  const filteredGuests = useMemo(() => {
    return guests.filter(g => g.side === activeSide)
  }, [guests, activeSide])

  /** counts */
  const invitationsCount = useMemo(() => getTotalInvitations(filteredGuests), [filteredGuests])
  const peopleTotal = useMemo(() => getTotalPeople(filteredGuests), [filteredGuests])

  const handleRefresh = () => {
    refetch()
    addToast('Guest list refreshed', 'success')
  }

  const handleToggleSelect = (id: string) => {
    setSelectedGuestIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleStatus = (id: string) => {
    if (!localDraft) return
    const lineIdNum = Number(id)

    setLocalDraft(prev => {
      if (!prev) return prev
      const nextLines = (prev.lines || []).map(line => {
        if (Number(line.id) !== lineIdNum) return line
        const anyLine: any = line
        const nextIsDone = !anyLine.isDone

        return {
          ...line,
          isDone: nextIsDone,
          status: nextIsDone ? GuestStatusEnum.Confirmed : GuestStatusEnum.None,
          lastModifiedDate: new Date().toISOString(),
        } as any
      })

      return { ...prev, lines: nextLines }
    })

    setHasUnsavedChanges(true)
  }

  const handleDelete = (id: string) => {
    if (!localDraft) return
    const lineIdNum = Number(id)

    setLocalDraft(prev => {
      if (!prev) return prev
      const nextLines = (prev.lines || []).map(line =>
        Number(line.id) === lineIdNum ? ({ ...line, isDeleted: true } as any) : line
      )
      return { ...prev, lines: nextLines }
    })

    setHasUnsavedChanges(true)
    addToast('Guest deleted', 'info')
  }

  const buildSyncPayload = (draft: GuestBookDraft): GuestBookRequest => {
    // غالبًا نفس shape — هنcast بس مع الحفاظ على fields
    return {
      ...(draft as any),
      lastModifiedDate: new Date().toISOString(),
      lineCategories: (draft.lineCategories || []).map(c => ({ ...(c as any) })),
      lines: (draft.lines || []).map(l => ({ ...(l as any) })),
    } as GuestBookRequest
  }

  const handleSync = async (draftOverride?: GuestBookDraft) => {
    try {
      const draft = draftOverride || localDraft
      if (!draft) {
        addToast('Guest book not found. Please refresh the page.', 'error')
        return
      }

      const payload = buildSyncPayload(draft)

      await syncMutation.mutateAsync({
        data: payload,
        query: {
          eventId: eventId || undefined,
          userType: undefined as unknown as UserType | undefined,
          clientId: undefined as unknown as string | undefined,
        },
      })

      setHasUnsavedChanges(false)
      addToast('Changes saved successfully', 'success')
      refetch()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save changes'
      addToast(msg, 'error')
    }
  }

  /** open guest modal */
  const handleOpenAddGuest = (groupId?: GuestGroupId, fromCategorySection?: boolean) => {
    // لو فتحنا من جروب مؤقت (tmp-..) أو Uncategorized — مش هنقفل الاختيار على حاجة غير صالحة
    if (fromCategorySection) {
      setForceNewCategory(true)
      setForcedGroupId(undefined)
    } else if (groupId) {
      const n = Number(groupId)
      if (Number.isFinite(n) && n > 0) {
        setForcedGroupId(groupId)
        setForceNewCategory(false)
      } else {
        setForcedGroupId(undefined)
        setForceNewCategory(false)
      }
    } else {
      setForcedGroupId(undefined)
      setForceNewCategory(false)
    }
    setIsAddGuestOpen(true)
  }

  /** add category: يضيف في lineCategories فقط + يعمل sync فوري عشان يجيب id */
  // const handleSubmitCategory = async (categoryData: { name: string; slug?: string; description?: string }) => {
  //   if (!localDraft) return

  //   const newCategory: GuestLineCategoryResponse & { clientId?: string } = {
  //     id: 0,
  //     name: categoryData.name,
  //     description: categoryData.description || null,
  //     slug: categoryData.slug || null,
  //     guestRelevant: GuestRelevant.Others,
  //     isDeleted: false,
  //     isModelLine: false,
  //     creationDate: new Date().toISOString(),
  //     lastModifiedDate: new Date().toISOString(),
  //     createdBy: '',
  //     lastModifiedBy: '',
  //     clientId: generateClientId(), // UI stability فقط
  //   } as any

  //   const nextDraft: GuestBookDraft = {
  //     ...localDraft,
  //     lineCategories: [...(localDraft.lineCategories || []), newCategory],
  //   }

  //   setLocalDraft(nextDraft)
  //   setHasUnsavedChanges(true)

  //   // ✅ أهم نقطة: Sync فوري للـ category عشان تبقى “موجودة” وبعدين تضيف lines عليها
  //   await handleSync(nextDraft)
  //   // setIsAddCategoryOpen(false)
  // }

  /** add guest line: لازم categoryId */
  const handleSubmitGuest = (
    payload:
      | { mode: 'existing'; lineCategoryId: number; nickName: string; peopleCount: number; status: GuestStatus }
      | { mode: 'new'; category: { name: string; slug: string; description?: string }; nickName: string; peopleCount: number; status: GuestStatus }
  ) => {
    if (!localDraft) return
  
    const isDone = payload.status === 'confirmed'
    const apiStatus = isDone ? 'Confirmed' : 'None' // حسب الـ API عندك
    const now = new Date().toISOString()
  
    // 1) لو new: ضيف category في lineCategories
    let categoryIdForLine: number | 0 = payload.mode === 'existing' ? payload.lineCategoryId : 0
    let categorySlugForLine: string | null = null
  
    let nextDraft = localDraft
  
    if (payload.mode === 'new') {
      categorySlugForLine = payload.category.slug
  
      const newCategory = {
        id: 0,
        name: payload.category.name,
        description: payload.category.description || null,
        slug: payload.category.slug,
        count_id: 0,
        isDeleted: false,
        isModelLine: false,
        creationDate: now,
        lastModifiedDate: now,
        guestRelevant: activeSide === 'bride' ? 'Bride' : 'Groom',
      } as any
  
      nextDraft = {
        ...nextDraft,
        lineCategories: [...(nextDraft.lineCategories || []), newCategory],
      }
    } else {
      // existing: حاول تجيب slug من الـ category لو موجود
      const cat = (nextDraft.lineCategories || []).find(c => Number((c as any).id) === payload.lineCategoryId) as any
      categorySlugForLine = cat?.slug || null
    }
  
    // 2) ضيف line
    const newLine = {
      id: generateTempId(),
      isDone,
      isFavorite: false,
      isDeleted: false,
      isModelLine: false,
      brideId: activeSide === 'bride' ? nextDraft.brideId : null,
      groomId: activeSide === 'groom' ? nextDraft.groomId : null,
      bookId: nextDraft.id,
      lineCategoryId: categoryIdForLine,         // existing => رقم / new => 0
      lineCategoryCountId: 0,
      lineCategorySlug: categorySlugForLine,     // مهم جدًا في حالة new
      creationDate: now,
      lastModifiedDate: now,
      nickName: payload.nickName,
      title: 'NoFormalities',
      attended: false,
      family: activeSide === 'bride' ? 'Bride' : 'Groom',
      status: apiStatus,
      guestRelevant: activeSide === 'bride' ? 'Bride' : 'Groom',
    } as any
  
    nextDraft = {
      ...nextDraft,
      lines: [...(nextDraft.lines || []), newLine],
      lastModifiedDate: now,
    }
  
    setLocalDraft(nextDraft)
    setHasUnsavedChanges(true)
    addToast('Guest added', 'info')
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingOverlay open={true} title="Loading guests..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-16 text-red-600 mb-4">Failed to load guests. Please try again.</p>
        <p className="text-14 text-gray-500 mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <Button variant="outline" onClick={() => refetch()} type="button">
          Retry
        </Button>
      </div>
    )
  }

  if (!localDraft) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <GuestsHeader onRefresh={handleRefresh} />
        <div className="py-12 text-center">
          <p className="text-16 text-gray-500 mb-4">No guest book found</p>
          <Button variant="brand" onClick={() => refetch()} className="text-white" type="button">
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  const hasAnyGroups = categoryGroups.length > 0

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <GuestsHeader onRefresh={handleRefresh} />

        {(hasUnsavedChanges || syncMutation.isPending) && (
          <Button
            variant="brand"
            onClick={() => handleSync()}
            disabled={syncMutation.isPending}
            className="text-white"
            type="button"
          >
            <Save className="h-4 w-4 mr-2" />
            {syncMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <GuestsTabs activeSide={activeSide} onSideChange={setActiveSide} />

      <GuestsSummary side={activeSide} invitationsCount={invitationsCount} peopleTotal={peopleTotal} />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 mb-20 sm:mb-6">
  {/* ✅ Right (Categories) FIRST on small screens */}
  <div className="order-1 md:order-2 md:col-span-2">
    <GuestGroupCard
      group={categoryGroups}
      guests={filteredGuests}
      activeGroupId={activeGroup?.id}
      onSelectGroup={(groupId: GuestGroupId) => setActiveGroupId(groupId)}
      onAddGroup={() => handleOpenAddGuest(undefined, true)}
    />
  </div>

  {/* ✅ Left (Lines) SECOND on small screens */}
  <div className="order-2 md:order-1 md:col-span-3">
    {!hasAnyGroups || !activeGroup ? (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <p className="text-16 font-medium text-gray-900">categories</p>

          <Button
            variant="outlineBrand"
            size="sm"
            onClick={() => handleOpenAddGuest()}
            className="text-brand-500 rounded-md hover:bg-brand-500 hover:text-white"
            type="button"
          >
            <Plus className="h-4 w-4" /> Add new guest
          </Button>
        </div>

        <p className="mt-2 text-14 text-gray-500">
          Add a category first, then you can start adding guests.
        </p>
      </div>
    ) : (
      <GuestGroupCard
        key={`active-${String(activeGroup.id)}`}
        group={activeGroup}
        guests={filteredGuests}
        isExpanded={true}
        onToggleExpand={() => {}}
        onToggleSelect={handleToggleSelect}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onAddGuest={(groupId: string) => handleOpenAddGuest(groupId as GuestGroupId)}
        scrollIntoView={false}
      />
    )}
  </div>
</div>



      {/* Sticky Buttons */}
      {/* <div className="fixed bottom-0 left-0 right-0 sm:relative sm:bottom-auto sm:left-auto sm:right-auto bg-white border-t border-gray-200 sm:border-t-0 sm:bg-transparent p-4 sm:p-0 sm:mt-6 z-10 shadow-md sm:shadow-none">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="brand"
            size="lg"
            onClick={() => handleOpenAddGuest()}
            className="w-full sm:w-auto sm:px-6 text-white"
            type="button"
          >
            Add new guest
            <Plus className="h-4 w-4 ml-2" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsAddCategoryOpen(true)}
            className="w-full sm:w-auto sm:px-6"
            type="button"
          >
            Add Category
            <Plus className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div> */}

      <AddGuestDialog
        isOpen={isAddGuestOpen}
        onClose={() => {
          setIsAddGuestOpen(false)
          setForcedGroupId(undefined)
          setForceNewCategory(false)
        }}
        onSubmit={handleSubmitGuest}
        forcedGroupId={forcedGroupId}
        forceNewCategory={forceNewCategory}
        availableGroups={categoryGroups.filter(g => g.id !== 'uncategorized')}
      />

      {/* <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSubmit={handleSubmitCategory}
        isSubmitting={syncMutation.isPending}
      /> */}
    </div>
  )
}
