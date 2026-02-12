'use client'

import { useMemo, useState, useEffect, Suspense } from 'react'
import { Plus, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingOverlay, LoadingSpinner } from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { useEventId } from '@/hooks/planning'
import { useGuestBook, useSyncGuestBook, useSyncGuestBookDelta } from '@/hooks/guestBooks'
import { usePlanningBookController } from '@/hooks/planning/usePlanningBookController'
import { useInitGuestBooks, useAddGuestBookModels } from '@/hooks/bookInit'

import {
  GuestsHeader,
  GuestsTabs,
  GuestsSummary,
  GuestGroupCard,
  GuestsTable,
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
import type { UserType } from '@/../client/common/api/gen/ourbride-api'
import { GuestStatus as GuestStatusEnum, GuestRelevant } from '@/types/responses/book-enums'
import { generateTempId } from '@/utils/sync/tempIds'
import { buildBookRequestFromLocal, convertLineToRequest, convertCategoryToRequest } from '@/utils/planning/mappers/invitationMappers'
import type { SyncBookDeltaResponse } from '@/hooks/planning/usePlanningBookController'
import { BookClass, UserType as LocalUserType } from '@/types/responses/book-enums'
import { useI18nTranslations } from '@/i18n/hooks'

type GuestBookDraft = GuestBookResponse & {
  lineCategories?: Array<GuestLineCategoryResponse & { clientId?: string }>
  lines?: Array<GuestLineResponse & { clientId?: string }>
}

/**
 * Normalize guestRelevant value to GuestRelevant enum
 */
const normalizeGuestRelevant = (value?: string | number | null): GuestRelevant => {
  if (value === 0 || value === 'Others' || value === '0' || value === GuestRelevant.Others) {
    return GuestRelevant.Others
  }
  if (value === 1 || value === 'Bride' || value === '1' || value === GuestRelevant.Bride) {
    return GuestRelevant.Bride
  }
  if (value === 2 || value === 'Groom' || value === '2' || value === GuestRelevant.Groom) {
    return GuestRelevant.Groom
  }
  // Default to Others
  return GuestRelevant.Others
}

const toSideFromGuestRelevant = (guestRelevant?: string | number | null, activeSide?: GuestSide): GuestSide => {
  const normalized = normalizeGuestRelevant(guestRelevant)
  // If guestRelevant is "Others", show in the active side
  if (normalized === GuestRelevant.Others) {
    return activeSide || 'bride'
  }
  // Map guestRelevant to side
  if (normalized === GuestRelevant.Bride) {
    return 'bride'
  }
  if (normalized === GuestRelevant.Groom) {
    return 'groom'
  }
  // Default fallback
  return activeSide || 'bride'
}

const toUiStatus = (isDone?: boolean): GuestStatus => (isDone ? 'confirmed' : 'none')

const mapLineToGuest = (line: GuestLineResponse & { clientId?: string }, selectedIds: Set<string>, activeSide: GuestSide): Guest => {
  const guestRelevant = line.guestRelevant
  const side = toSideFromGuestRelevant(guestRelevant, activeSide)
  const groupId: GuestGroupId =
    line.lineCategoryId != null ? String(line.lineCategoryId) : 'uncategorized'

  const idStr = String(line.id ?? '')
  const stableClientId = line.clientId ? String(line.clientId) : idStr

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
    status: toUiStatus(line.isDone),
    selected: selectedIds.has(idStr),
    clientId: stableClientId,
  }
}

export default function InvitationPage() {
  const t = useI18nTranslations('eventsPlanning.guestList')
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner text={t('common.loading')} />
        </div>
      }
    >
      <InvitationPageContent />
    </Suspense>
  )
}

function InvitationPageContent() {
  const t = useI18nTranslations('eventsPlanning.guestList')
  const { addToast } = useToast()
  const eventId = useEventId()

  const [activeSide, setActiveSide] = useState<GuestSide>('bride')

  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false)
  const [forcedGroupId, setForcedGroupId] = useState<GuestGroupId | undefined>(undefined)
  const [forceNewCategory, setForceNewCategory] = useState(false)

  // const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set())
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch by only enabling query after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data: guestBook, isLoading, error, refetch } = useGuestBook({
    eventId: eventId || undefined,
    userType: undefined as unknown as UserType | undefined,
    clientId: undefined as unknown as string | undefined,
    enabled: isMounted && !!eventId,
  })

  const syncMutation = useSyncGuestBook()
  const syncDeltaMutation = useSyncGuestBookDelta()
  const initMutation = useInitGuestBooks()
  const addModelsMutation = useAddGuestBookModels()
  const {
    localBook: localDraft,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    save,
    applyLocalUpdate,
    getActiveCategories,
    getActiveLines,
    isInitializing,
    isAddingModels,
  } = usePlanningBookController<GuestBookDraft, GuestLineResponse, GuestLineCategoryResponse>({
    book: (guestBook as unknown as GuestBookDraft) ?? null,
    isLoading,
    eventId: eventId ?? undefined,
    requireEventId: true,
    syncFn: async (draft) => {
      const payload = buildBookRequestFromLocal(draft)
      await syncMutation.mutateAsync({
        data: payload,
        query: {
          eventId: eventId || undefined,
          userType: undefined as unknown as UserType | undefined,
          clientId: undefined as unknown as string | undefined,
        },
      })
      refetch()
    },
    syncDeltaFn: async (delta) => {
      const response = await syncDeltaMutation.mutateAsync({
        data: delta as unknown as import('@/types/syncDelta').SyncBookDeltaRequest<import('@/../client/common/api/gen/ourbride-api').GuestLineRequest, import('@/../client/common/api/gen/ourbride-api').GuestLineCategoryRequest>,
        query: {
          eventId: eventId || undefined,
          userType: undefined as unknown as UserType | undefined,
          clientId: undefined as unknown as string | undefined,
        },
      })
      return response as unknown as SyncBookDeltaResponse<GuestBookDraft>
    },
    refetch,
    shouldInit: (b) => !b?.id,
    initFn: async () => {
      await initMutation.mutateAsync({
        eventId: eventId ?? undefined,
        userType: undefined as unknown as UserType | undefined,
        clientId: undefined as unknown as string | undefined,
      })
    },
    shouldAddModels: (b) => b?.isModelsAdd === false,
    addModelsFn: async () => {
      await addModelsMutation.mutateAsync({
        eventId: eventId ?? undefined,
        userType: undefined as unknown as UserType | undefined,
        clientId: undefined as unknown as string | undefined,
      })
    },
    initMutation,
    addModelsMutation,
    isSameBookBase: (current, last) =>
      current.id === last.id &&
      current.groomId === last.groomId &&
      current.brideId === last.brideId &&
      current.title === last.title,
    getLines: (book) => book.lines || [],
    getCategories: (book) => book.lineCategories || [],
    getLineId: (line) => line.id,
    getCategoryId: (cat) => cat.id,
    convertLineToRequest,
    convertCategoryToRequest,
    isSameLine: (current, last) =>
      current.nickName === last.nickName &&
      current.isDeleted === last.isDeleted &&
      current.isDone === last.isDone,
    isSameCategory: (current, last) =>
      current.name === last.name &&
      current.isDeleted === last.isDeleted,
    getLineCategoryId: (line) => line.lineCategoryId ?? null,
    isLineDeleted: (line) => !!line.isDeleted,
    isLineDone: (line) => !!line.isDone,
    isCategoryDeleted: (cat) => !!cat.isDeleted,
  })


  /** groups (tables) - filtered by guestRelevant */
  const categoryGroups: GuestGroup[] = useMemo(() => {
    const cats = getActiveCategories()

    // Filter categories by guestRelevant: show current side + "Others"
    const filteredCats = cats.filter((cat) => {
      const catGuestRelevant = normalizeGuestRelevant(cat.guestRelevant)
      // Show if it matches the active side or is "Others"
      if (catGuestRelevant === GuestRelevant.Others) return true // Always show "Others"
      if (activeSide === 'bride' && catGuestRelevant === GuestRelevant.Bride) return true
      if (activeSide === 'groom' && catGuestRelevant === GuestRelevant.Groom) return true
      return false
    })

    const mapped = filteredCats.map((cat, idx) => {
      const anyCat = cat as unknown as Record<string, unknown>
      // Preserve numeric ID (positive or negative) as string for display
      // But ensure we always have a valid identifier
      let id: string
      if (cat.id && cat.id !== 0) {
        // Use the numeric ID (can be positive for saved, negative for temp)
        id = String(cat.id)
      } else if (anyCat.clientId) {
        id = String(anyCat.clientId)
      } else if (cat.slug) {
        id = String(cat.slug)
      } else {
        // Fallback to temp ID
        id = `tmp-${idx}`
      }

      return {
        id,
        title: (cat.name || '').trim(),
      }
    })

    // Check if there are uncategorized lines using controller helper (filtered by guestRelevant)
    const activeLines = getActiveLines()
    const hasUncategorized = activeLines.some(l => {
      const lineCatId = l.lineCategoryId
      const lineGuestRelevant = normalizeGuestRelevant(l.guestRelevant)

      const matchesSide =
        lineGuestRelevant === GuestRelevant.Others ||
        (activeSide === 'bride' && lineGuestRelevant === GuestRelevant.Bride) ||
        (activeSide === 'groom' && lineGuestRelevant === GuestRelevant.Groom)
      return lineCatId == null && matchesSide
    })
    if (hasUncategorized) {
      mapped.unshift({ id: 'uncategorized', title: t('common.uncategorized') })
    }

    return mapped
  }, [getActiveCategories, getActiveLines, activeSide])


  /** map lines -> UI guests (filtered by guestRelevant) */
  const guests: Guest[] = useMemo(() => {
    const lines = getActiveLines() as GuestLineResponse[]
    return lines
      .filter((l) => {
        // Filter by guestRelevant: show current side + "Others"
        const lineGuestRelevant = normalizeGuestRelevant(l.guestRelevant)

        if (lineGuestRelevant === GuestRelevant.Others) return true // Always show "Others"
        if (activeSide === 'bride' && lineGuestRelevant === GuestRelevant.Bride) return true
        if (activeSide === 'groom' && lineGuestRelevant === GuestRelevant.Groom) return true
        return false
      })
      .map(l => mapLineToGuest(l, selectedGuestIds, activeSide))
  }, [getActiveLines, selectedGuestIds, activeSide])

  /** filter guests by side (already filtered by guestRelevant, but ensure side matches) */
  const filteredGuests = useMemo(() => {
    return guests.filter(g => g.side === activeSide)
  }, [guests, activeSide])

  /** counts */
  const invitationsCount = useMemo(() => getTotalInvitations(filteredGuests), [filteredGuests])
  const peopleTotal = useMemo(() => getTotalPeople(filteredGuests), [filteredGuests])

  const handleRefresh = () => {
    refetch()
    addToast(t('toasts.refreshed'), 'success')
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
    const lineIdNum = Number(id)
    applyLocalUpdate((prev) => {
      const nextLines = (prev.lines || []).map((line) => {
        if (Number(line.id) !== lineIdNum) return line
        const anyLine = line as unknown as Record<string, unknown>
        const nextIsDone = !(anyLine.isDone as boolean)

        return {
          ...line,
          isDone: nextIsDone,
          status: nextIsDone ? GuestStatusEnum.Confirmed : GuestStatusEnum.None,
          lastModifiedDate: new Date().toISOString(),
        } as GuestLineResponse
      })

      return { ...prev, lines: nextLines }
    })
  }

  const handleDelete = (id: string) => {
    const lineIdNum = Number(id)
    applyLocalUpdate((prev) => {
      const nextLines = (prev.lines || []).map((line) =>
        Number(line.id) === lineIdNum ? ({ ...line, isDeleted: true, lastModifiedDate: new Date().toISOString() } as GuestLineResponse) : line
      )
      return { ...prev, lines: nextLines }
    })
    addToast(t('toasts.guestDeleted'), 'info')
  }


  const handleSync = async () => {
    const result = await save()
    if (!result.ok) {
      if (result.reason === 'loading' || result.reason === 'no-changes') {
        if (result.reason === 'no-changes') setHasUnsavedChanges(false)
        return
      }
      addToast(result.message || t('toasts.saveFailed'), 'error')
      return
    }
    addToast(result.message || t('toasts.saveSuccess'), 'success')
  }

  /** open guest modal */
  const handleOpenAddGuest = (groupId?: GuestGroupId, fromCategorySection?: boolean) => {
   
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

  /** add table: يضيف في lineCategories فقط + يعمل sync فوري عشان يجيب id */
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
    const apiStatus = isDone ? 'Confirmed' : 'None'
    const now = new Date().toISOString()

    applyLocalUpdate((currentDraft) => {
     
      let categoryIdForLine: number | null = payload.mode === 'existing' ? payload.lineCategoryId : null
      let categoryCountIdForLine: number | null = null
      let categorySlugForLine: string | null = null

      let nextDraft = currentDraft

      if (payload.mode === 'new') {
        categorySlugForLine = payload.category.slug
        const tempCategoryId = generateTempId()
        const tempCountId = Date.now()
        categoryIdForLine = tempCategoryId
        categoryCountIdForLine = tempCountId

        const newCategory: GuestLineCategoryResponse = {
          id: tempCategoryId,
          name: payload.category.name,
          nameAr: payload.category.name,
          nameEn: payload.category.name,
          description: payload.category.description || null,
          descriptionAr: payload.category.description || null,
          descriptionEn: payload.category.description || null,
          slug: payload.category.slug,
          count_id: tempCountId,
          isDeleted: false,
          isModelLine: false,
          creationDate: now,
          lastModifiedDate: now,
          createdBy: nextDraft.createdBy || '',
          lastModifiedBy: nextDraft.lastModifiedBy || '',
          guestRelevant: activeSide === 'bride' ? GuestRelevant.Bride : GuestRelevant.Groom,
        } as unknown as GuestLineCategoryResponse

        nextDraft = {
          ...nextDraft,
          lineCategories: [...(nextDraft.lineCategories || []), newCategory],
        }
      } else {
        // existing: get category from current draft
        const cat = (nextDraft.lineCategories || []).find((c) => Number(c.id) === payload.lineCategoryId) as GuestLineCategoryResponse | undefined
        categorySlugForLine = cat?.slug || null
        categoryCountIdForLine = (cat as unknown as Record<string, unknown>)?.count_id as number | null | undefined ?? null
      }

      // Determine guestRelevant for the new line
      // If using existing category, use its guestRelevant (or activeSide if it's "Others")
      // If creating new category, use activeSide
      let lineGuestRelevant: GuestRelevant
      if (payload.mode === 'existing') {
        const cat = (nextDraft.lineCategories || []).find((c) => Number(c.id) === payload.lineCategoryId) as GuestLineCategoryResponse | undefined
        const catGuestRelevant = normalizeGuestRelevant((cat as unknown as Record<string, unknown>)?.guestRelevant as string | number | null | undefined)
        // If category is "Others", use the active side; otherwise use the category's guestRelevant
        if (catGuestRelevant === GuestRelevant.Others) {
          lineGuestRelevant = activeSide === 'bride' ? GuestRelevant.Bride : GuestRelevant.Groom
        } else {
          // Use the category's guestRelevant (already normalized to enum)
          lineGuestRelevant = catGuestRelevant
        }
      } else {
        // New category: use activeSide
        lineGuestRelevant = activeSide === 'bride' ? GuestRelevant.Bride : GuestRelevant.Groom
      }

      // 2) ضيف line
      const newLine: GuestLineResponse = {
        id: generateTempId(),
        isDone,
        isFavorite: false,
        isDeleted: false,
        isModelLine: false,
        brideId: activeSide === 'bride' ? nextDraft.brideId : undefined,
        groomId: activeSide === 'groom' ? nextDraft.groomId : undefined,
        bookId: nextDraft.id,
        lineCategoryId: categoryIdForLine ?? undefined,
        lineType: (nextDraft.bookType as unknown as LocalUserType) ?? LocalUserType.Bride,
        bookClass: BookClass.Guest,
        createdBy: nextDraft.createdBy || '',
        lastModifiedBy: nextDraft.lastModifiedBy || '',
        slug: '',
        lineCategoryCountId: categoryCountIdForLine,
        lineCategorySlug: categorySlugForLine,
        creationDate: now,
        lastModifiedDate: now,
        nickName: payload.nickName,
        title: 'NoFormalities' as unknown as import('@/types/responses/book-enums').GuestTitle,
        attended: false,
        family: activeSide === 'bride' ? 'Bride' : 'Groom',
        status: apiStatus as unknown as import('@/types/responses/book-enums').GuestStatus,
        guestRelevant: lineGuestRelevant,
      } as unknown as GuestLineResponse

      return {
        ...nextDraft,
        lines: [...(nextDraft.lines || []), newLine],
        lastModifiedDate: now,
      }
    })

    addToast(t('toasts.guestAdded'), 'info')
  }

  // Show loading state if not mounted yet (to prevent hydration mismatch) or if actually loading
  if (!isMounted || isLoading || isInitializing || isAddingModels) {
    const loadingTitle = isInitializing
      ? t('loadingStates.initializingTitle')
      : isAddingModels
        ? t('loadingStates.addingModelsTitle')
        : t('loadingStates.loadingGuestsTitle')
    const loadingSubtitle = isInitializing
      ? t('loadingStates.initializingSubtitle')
      : isAddingModels
        ? t('loadingStates.addingModelsSubtitle')
        : t('loadingStates.loadingGuestsSubtitle')

    return (
      <div className="">
        <LoadingSpinner size="lg" text={loadingTitle} fullScreen={true} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-16 text-red-600 mb-4">{t('error.title')}</p>
        <p className="text-14 text-gray-500 mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <Button variant="outline" onClick={() => refetch()} type="button">
          {t('common.retry')}
        </Button>
      </div>
    )
  }

  if (!localDraft) {
    return (
      <div className="w-full py-6">
        <GuestsHeader onRefresh={handleRefresh} />
        <div className="py-12 text-center">
          <p className="text-16 text-gray-500 mb-4">{t('empty.noGuestBook')}</p>
          <Button variant="brand" onClick={() => refetch()} className="text-white" type="button">
            {t('common.refresh')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-6">
      <GuestsHeader onRefresh={handleRefresh} />
      <div className="flex items-center justify-between mb-4">
        

        {(hasUnsavedChanges || syncMutation.isPending) && (
          <div className="flex items-center gap-3">
            <Button
              variant="brand"
              size="md"
              onClick={() => handleSync()}
              disabled={syncMutation.isPending}
              className="flex items-center gap-2 rounded-xl !text-white"
              type="button"
            >
              <Save className="h-4 w-4" />
              {syncMutation.isPending ? t('common.saving') : t('common.saveChanges')}
            </Button>

            {hasUnsavedChanges && (
              <span className="text-16 text-brand-500 font-medium">{t('common.unsavedChanges')}</span>
            )}
          </div>
        )}
      </div>

      <GuestsTabs activeSide={activeSide} onSideChange={setActiveSide} />

      <GuestsSummary side={activeSide} invitationsCount={invitationsCount} peopleTotal={peopleTotal} />

      <div className="mb-6">
        <GuestsTable
          categories={categoryGroups}
          guests={filteredGuests}
          onToggleSelect={handleToggleSelect}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          onAddGuest={(groupId: GuestGroupId) => handleOpenAddGuest(groupId)}
          onAddCategory={() => handleOpenAddGuest(undefined, true)}
        />
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
