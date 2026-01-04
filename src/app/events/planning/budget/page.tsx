'use client'

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingOverlay } from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { useEventId } from '@/hooks/planning'
import { useBudgetBook, useBudgetSyncMutation } from '../../../../hooks/budget/budgetBooks.hooks'

import { BudgetFiltersBar, type FilterType } from '@/components/budgetBook/components/filters/BudgetFiltersBar'
import { BudgetOverviewCard } from '@/components/budgetBook/components/BudgetOverviewCard'
import { BudgetCategoryBreakdownList } from '@/components/budgetBook/components/BudgetCategoryBreakdownList'
import { BudgetLinesTable } from '@/components/budgetBook/components/BudgetLinesTable'
import { BudgetLineModal } from '@/components/budgetBook/components/modals/BudgetLineModal'
import { CategoryModal } from '@/components/budgetBook/components/modals/CategoryModal'
import { ConfirmDeleteModal } from '@/components/budgetBook/components/modals/ConfirmDeleteModal'

import { generateTempId, slugify } from '@/utils/budgetbook/budgetAdapters'
import type { BudgetBookDraft } from '@/utils/budgetbook/budgetAdapters'
import type { BudgetBookRequest } from '@/../client/common/api/gen/ourbride-api'

import { calculateBudgetStats } from '@/utils/budgetbook/budgetStats'
import type { BudgetLineResponse, BudgetLineCategoryResponse } from '@/types/responses'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

/* eslint-disable @typescript-eslint/no-explicit-any */
function BudgetPageContent() {
  const router = useRouter()
  const { addToast } = useToast()
  const eventId = useEventId()

  // Local draft state
  const [localDraft, setLocalDraft] = useState<BudgetBookDraft | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSyncedRef = useRef<BudgetBookDraft | null>(null)
  const isInitialLoadRef = useRef(true)

  // Active category state (null = show all lines, number = filter by category)
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)

  // Modal states
  const [isBudgetLineModalOpen, setIsBudgetLineModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'line' | 'category'
    item: BudgetLineResponse | BudgetLineCategoryResponse
  } | null>(null)

  // Editing states
  const [editingLine, setEditingLine] = useState<BudgetLineResponse | null>(null)
  const [editingCategory, setEditingCategory] = useState<BudgetLineCategoryResponse | null>(null)

  // Filter states
  const [filterType, setFilterType] = useState<FilterType>('all')

  // Fetch budget book
  const { data: budgetBook, isLoading, error, refetch } = useBudgetBook(
    {
      eventId: eventId || undefined,
      userType: null as unknown as UserType | undefined,
      clientId: null as unknown as string | undefined,
    },
    {
      enabled: typeof window !== 'undefined' && !!eventId,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  )

  const syncMutation = useBudgetSyncMutation()

  /**
   * Build FULL sync payload snapshot.
   * Key points:
   * - Local temp ids are NEGATIVE (<=0). In payload they must become id=0 (API create).
   * - For lines pointing to a temp category, lineCategoryId must be 0 AND we must send
   *   lineCategoryCountId + lineCategorySlug so server can link in the same snapshot.
   * - Keep nulls as null (don’t convert to 0), because null != 0.
   */
  const buildSyncPayload = useCallback((draft: BudgetBookDraft): BudgetBookRequest => {
    const now = new Date().toISOString()
    const d: any = draft as any

    const findCategoryByLocalId = (localId: number | null | undefined) => {
      if (localId == null) return null
      return (d.lineCategories || []).find((c: any) => c.id === localId) ?? null
    }

    const lineCategories = (d.lineCategories || []).map((c: any) => {
      const isTemp = typeof c.id === 'number' && c.id <= 0

      return {
        id: isTemp ? 0 : c.id,

        name: c.name ?? '',
        nameAr: c.nameAr ?? c.name ?? '',
        nameEn: c.nameEn ?? c.name ?? '',

        description: c.description ?? null,
        descriptionAr: c.descriptionAr ?? c.description ?? null,
        descriptionEn: c.descriptionEn ?? c.description ?? null,

        // summary fields (send them even if null)
        estimated: c.estimated ?? 0,
        pending: c.pending ?? null,
        paid: c.paid ?? null,
        final: c.final ?? null,
        count: c.count ?? null,

        iconName: c.iconName ?? null,
        colorName: c.colorName ?? null,

        slug: c.slug ?? null,
        count_id: c.count_id ?? null,

        isDeleted: c.isDeleted ?? false,
        isModelLine: c.isModelLine ?? false,
        creationDate: c.creationDate ?? now,
        lastModifiedDate: c.lastModifiedDate ?? now,
      }
    })

    const lines = (d.lines || []).map((l: any) => {
      const isTempLine = typeof l.id === 'number' && l.id <= 0

      const localCategoryId: number | null = l.lineCategoryId ?? null
      const category = findCategoryByLocalId(localCategoryId)

      const categoryIsTemp = typeof localCategoryId === 'number' && localCategoryId <= 0

      // if category is temp: payload category id must be 0, but we send slug + countId
      const payloadLineCategoryId =
        localCategoryId == null ? null : categoryIsTemp ? 0 : localCategoryId

      const payloadLineCategoryCountId = l.lineCategoryCountId ?? category?.count_id ?? null
      const payloadLineCategorySlug = l.lineCategorySlug ?? category?.slug ?? null

      return {
        id: isTempLine ? 0 : (l.id ?? 0),

        isDone: l.isDone ?? false,
        isFavorite: l.isFavorite ?? false,
        isDeleted: l.isDeleted ?? false,
        isModelLine: l.isModelLine ?? false,

        brideId: l.brideId ?? d.brideId ?? null,
        groomId: l.groomId ?? d.groomId ?? null,

        bookId: d.id ?? l.bookId ?? 0,

        lineCategoryId: payloadLineCategoryId,
        lineCategoryCountId: payloadLineCategoryCountId,
        lineCategorySlug: payloadLineCategorySlug,

        creationDate: l.creationDate ?? now,
        lastModifiedDate: l.lastModifiedDate ?? now,

        expense: l.expense ?? '',
        expenseAr: l.expenseAr ?? l.expense ?? '',
        expenseEn: l.expenseEn ?? l.expense ?? '',

        estimated: l.estimated ?? 0,
        paid: l.paid ?? 0,
        final: l.final ?? null,

        dueDate: l.dueDate ?? null,
        count: l.count ?? null,

        payer: l.payer ?? null,
        note: l.note ?? null,

        iconName: l.iconName ?? null,
        colorName: l.colorName ?? null,
      }
    })

    // NOTE: cast at end to avoid fighting generated types if they’re stricter than backend reality
    return {
      id: d.id ?? 0,

      groomId: d.groomId ?? null,
      brideId: d.brideId ?? null,
      weddingPlannerId: d.weddingPlannerId ?? null,

      bookType: d.bookType,
      bookClass: d.bookClass,

      title: d.title ?? null,
      clientName: d.clientName ?? null,
      weddingDate: d.weddingDate ?? null,
      eventLocation: d.eventLocation ?? null,

      lines,
      lineCategories,

      lastModifiedDate: now,
      initialEstimated: d.initialEstimated ?? null,
    } as any as BudgetBookRequest
  }, [])

  // Helper to sync draft immediately after any change
  const syncDraft = useCallback(
    async (draft: BudgetBookDraft) => {
      if (!eventId || !draft) return

      try {
        const payload = buildSyncPayload(draft)
        await syncMutation.mutateAsync({
          ...payload,
          query: { eventId },
        })
        await refetch() // get real ids from server
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to sync changes'
        addToast(msg, 'error')
        throw e
      }
    },
    [eventId, buildSyncPayload, syncMutation, refetch, addToast]
  )

  // Initial load
  useEffect(() => {
    if (isInitialLoadRef.current && budgetBook && !localDraft) {
      const draft = budgetBook as any as BudgetBookDraft
      setLocalDraft(draft)
      lastSyncedRef.current = draft
      isInitialLoadRef.current = false
    }
  }, [budgetBook, localDraft])

  // Sync fetched data to local state when it changes (only if no unsaved changes)
  useEffect(() => {
    if (budgetBook && !hasUnsavedChanges && !isInitialLoadRef.current) {
      const draft = budgetBook as any as BudgetBookDraft
      setLocalDraft(draft)
      lastSyncedRef.current = draft
    } else if (budgetBook === null && !isLoading && !hasUnsavedChanges) {
      setLocalDraft(null)
    }
  }, [budgetBook, hasUnsavedChanges, isLoading])

  // Detect changes (lightweight)
  const hasActualChanges = useCallback((): boolean => {
    if (!localDraft || !lastSyncedRef.current) return !!localDraft

    const a: any = localDraft
    const b: any = lastSyncedRef.current

    // Basic props
    if ((a.initialEstimated ?? null) !== (b.initialEstimated ?? null)) return true

    // Categories: compare by id (including temp ids) + key fields
    const aCats: any[] = a.lineCategories || []
    const bCats: any[] = b.lineCategories || []
    if (aCats.length !== bCats.length) return true

    for (const c of aCats) {
      const match = bCats.find(x => x.id === c.id)
      if (!match) return true
      if ((c.isDeleted ?? false) !== (match.isDeleted ?? false)) return true
      if ((c.name ?? '') !== (match.name ?? '')) return true
      if ((c.description ?? null) !== (match.description ?? null)) return true
      if ((c.estimated ?? 0) !== (match.estimated ?? 0)) return true
      if ((c.iconName ?? null) !== (match.iconName ?? null)) return true
      if ((c.colorName ?? null) !== (match.colorName ?? null)) return true
    }

    // Lines
    const aLines: any[] = a.lines || []
    const bLines: any[] = b.lines || []
    if (aLines.length !== bLines.length) return true

    for (const l of aLines) {
      const match = bLines.find(x => x.id === l.id)
      if (!match) return true
      if ((l.isDeleted ?? false) !== (match.isDeleted ?? false)) return true
      if ((l.expense ?? '') !== (match.expense ?? '')) return true
      if ((l.lineCategoryId ?? null) !== (match.lineCategoryId ?? null)) return true
      if ((l.estimated ?? 0) !== (match.estimated ?? 0)) return true
      if ((l.paid ?? 0) !== (match.paid ?? 0)) return true
      if ((l.final ?? null) !== (match.final ?? null)) return true
      if ((l.isDone ?? false) !== (match.isDone ?? false)) return true
      if ((l.isFavorite ?? false) !== (match.isFavorite ?? false)) return true
    }

    return false
  }, [localDraft])

  useEffect(() => {
    if (localDraft && lastSyncedRef.current) {
      setHasUnsavedChanges(hasActualChanges())
    }
  }, [localDraft, hasActualChanges])

  // Category selection toggle
  const handleCategoryClick = useCallback((categoryId: number | null) => {
    setActiveCategoryId(prev => (categoryId === prev ? null : categoryId))
  }, [])

  // Stats
  const stats = useMemo(() => {
    if (!localDraft) return null
    return calculateBudgetStats(localDraft as any, activeCategoryId as any)
  }, [localDraft, activeCategoryId])

  // Filter lines
  const filteredLines = useMemo(() => {
    if (!localDraft) return []
    let lines = (localDraft.lines || []) as any[]

    lines = lines.filter(line => {
      if (activeCategoryId !== null && line.lineCategoryId !== activeCategoryId) return false
      
      return true
    })

    switch (filterType) {
      case 'done':
        return lines.filter(l => l.isDone)
      case 'not-done':
        return lines.filter(l => !l.isDone)
      case 'favorite':
        return lines.filter(l => l.isFavorite)
      case 'not-favorite':
        return lines.filter(l => !l.isFavorite)
 
      default:
        return lines
    }
  }, [localDraft, activeCategoryId, filterType])

  // Handlers
  const handleBudgetChange = useCallback(
    async (newBudget: number) => {
      if (!localDraft) return
      const now = new Date().toISOString()

      const nextDraft: any = {
        ...(localDraft as any),
        initialEstimated: newBudget,
        lastModifiedDate: now,
      }

      setLocalDraft(nextDraft)
      await syncDraft(nextDraft)
    },
    [localDraft, syncDraft]
  )

  const handleCreateLine = useCallback(() => {
    setEditingLine(null)
    setIsBudgetLineModalOpen(true)
  }, [])

  const handleEditLine = useCallback((line: BudgetLineResponse) => {
    setEditingLine(line)
    setIsBudgetLineModalOpen(true)
  }, [])

  const handleSaveLine = useCallback(
    async (data: {
      id?: number
      expense: string
      expenseAr: string
      expenseEn: string
      lineCategoryId: number | null
      estimated: number
      paid: number
      final: number | null
      dueDate: string | null
      count: number | null
      payer: string | null
      note: string | null
      iconName: string | null
      colorName: string | null
      isDone: boolean
      isFavorite: boolean
      isDeleted: boolean
    }) => {
      if (!localDraft) return

      const now = new Date().toISOString()
      const finalCategoryId =
        data.lineCategoryId ?? (activeCategoryId !== null ? activeCategoryId : null)

      const selectedCategory: any =
        finalCategoryId != null
          ? (localDraft as any).lineCategories?.find((c: any) => c.id === finalCategoryId)
          : null

      const lineCategorySlug = selectedCategory?.slug ?? null
      const lineCategoryCountId = selectedCategory?.count_id ?? null

      let nextDraft: any

      if (data.id && data.id > 0) {
        // Update existing
        nextDraft = {
          ...(localDraft as any),
          lines: ((localDraft as any).lines || []).map((line: any) =>
            line.id === data.id
              ? {
                  ...line,
                  expense: data.expense,
                  expenseAr: data.expenseAr,
                  expenseEn: data.expenseEn,

                  lineCategoryId: finalCategoryId,
                  lineCategorySlug,
                  lineCategoryCountId,

                  estimated: data.estimated,
                  paid: data.paid,
                  final: data.final,
                  dueDate: data.dueDate,
                  count: data.count,

                  payer: data.payer,
                  note: data.note,
                  iconName: data.iconName,
                  colorName: data.colorName,

                  isDone: data.isDone,
                  isFavorite: data.isFavorite,
                  isDeleted: data.isDeleted,

                  lastModifiedDate: now,
                }
              : line
          ),
        }
      } else {
        // Create new (local temp id; payload converts to 0)
        const tempLineId = generateTempId()

        const newLine: any = {
          id: tempLineId,
          bookId: (localDraft as any).id || 0,

          expense: data.expense,
          expenseAr: data.expenseAr,
          expenseEn: data.expenseEn,

          lineCategoryId: finalCategoryId,
          lineCategorySlug,
          lineCategoryCountId,

          estimated: data.estimated,
          paid: data.paid,
          final: data.final,
          dueDate: data.dueDate,
          count: data.count,

          payer: data.payer,
          note: data.note,
          iconName: data.iconName,
          colorName: data.colorName,

          isDone: data.isDone,
          isFavorite: data.isFavorite,
          isDeleted: false,
          isModelLine: false,

          brideId: (localDraft as any).brideId ?? null,
          groomId: (localDraft as any).groomId ?? null,

          creationDate: now,
          lastModifiedDate: now,
        }

        nextDraft = {
          ...(localDraft as any),
          lines: [...(((localDraft as any).lines as any[]) || []), newLine],
        }
      }

      setLocalDraft(nextDraft)
      setIsBudgetLineModalOpen(false)
      setEditingLine(null)

      await syncDraft(nextDraft)
      addToast('Budget line saved', 'success')
    },
    [localDraft, activeCategoryId, syncDraft, addToast]
  )

  const handleToggleDone = useCallback(
    async (lineId: number) => {
      if (!localDraft) return
      const now = new Date().toISOString()

      const nextDraft: any = {
        ...(localDraft as any),
        lines: ((localDraft as any).lines || []).map((line: any) =>
          line.id === lineId ? { ...line, isDone: !line.isDone, lastModifiedDate: now } : line
        ),
      }

      setLocalDraft(nextDraft)
      await syncDraft(nextDraft)
    },
    [localDraft, syncDraft]
  )

  const handleToggleFavorite = useCallback(
    async (lineId: number) => {
      if (!localDraft) return
      const now = new Date().toISOString()

      const nextDraft: any = {
        ...(localDraft as any),
        lines: ((localDraft as any).lines || []).map((line: any) =>
          line.id === lineId
            ? { ...line, isFavorite: !line.isFavorite, lastModifiedDate: now }
            : line
        ),
      }

      setLocalDraft(nextDraft)
      await syncDraft(nextDraft)
    },
    [localDraft, syncDraft]
  )

  const handleDeleteLine = useCallback((line: BudgetLineResponse) => {
    setItemToDelete({ type: 'line', item: line })
    setIsDeleteModalOpen(true)
  }, [])

  const confirmDeleteLine = useCallback(async () => {
    if (!localDraft || !itemToDelete || itemToDelete.type !== 'line') return
    const line = itemToDelete.item as BudgetLineResponse
    const now = new Date().toISOString()

    const nextDraft: any = {
      ...(localDraft as any),
      lines: ((localDraft as any).lines || []).map((l: any) =>
        l.id === line.id ? { ...l, isDeleted: true, lastModifiedDate: now } : l
      ),
    }

    setLocalDraft(nextDraft)
    setIsDeleteModalOpen(false)
    setItemToDelete(null)

    await syncDraft(nextDraft)
    addToast(`"${line.expense}" deleted successfully`, 'success')
  }, [localDraft, itemToDelete, syncDraft, addToast])

  const handleCreateCategory = useCallback(() => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }, [])

  const handleSaveCategory = useCallback(
    async (data: {
      id?: number
      name: string
      nameAr: string
      nameEn: string
      description: string
      descriptionAr: string
      descriptionEn: string
      estimated: number
      iconName: string | null
      colorName: string | null
      // Line data (required when creating new category)
      lineData?: {
        expense: string
        expenseAr: string
        expenseEn: string
        estimated: number
        paid: number
        final: number | null
        dueDate: string | null
        count: number | null
        payer: string | null
        note: string | null
        iconName: string | null
        colorName: string | null
        isDone: boolean
        isFavorite: boolean
      }
    }) => {
      if (!localDraft) return

      const now = new Date().toISOString()
      let nextDraft: any

      if (data.id && data.id > 0) {
        // Update existing category (no line data)
        nextDraft = {
          ...(localDraft as any),
          lineCategories: ((localDraft as any).lineCategories || []).map((cat: any) =>
            cat.id === data.id
              ? {
                  ...cat,
                  name: data.name,
                  nameAr: data.nameAr,
                  nameEn: data.nameEn,
                  description: data.description ?? null,
                  descriptionAr: data.descriptionAr ?? null,
                  descriptionEn: data.descriptionEn ?? null,
                  estimated: data.estimated ?? 0,
                  iconName: data.iconName ?? null,
                  colorName: data.colorName ?? null,
                  lastModifiedDate: now,
                }
              : cat
          ),
        }
      } else {
        // Create new category + line together
        if (!data.lineData) {
          addToast('Line data is required when creating a new category', 'error')
          return
        }

        const tempId = generateTempId()
        const tempCountId = Date.now()
        const slug = slugify(data.name)

        const newCategory: any = {
          id: tempId,
          name: data.name,
          nameAr: data.nameAr || data.name,
          nameEn: data.nameEn || data.name,
          description: data.description || null,
          descriptionAr: data.descriptionAr || data.description || null,
          descriptionEn: data.descriptionEn || data.description || null,
          estimated: 0, // Category estimated not used
          pending: null,
          paid: null,
          final: null,
          count: null,
          iconName: data.iconName ?? null,
          colorName: data.colorName ?? null,
          slug,
          count_id: tempCountId,
          isDeleted: false,
          isModelLine: false,
          creationDate: now,
          lastModifiedDate: now,
        }

        // Create line linked to the new category
        const tempLineId = generateTempId()
        const newLine: any = {
          id: tempLineId,
          bookId: (localDraft as any).id || 0,
          expense: data.lineData.expense,
          expenseAr: data.lineData.expenseAr,
          expenseEn: data.lineData.expenseEn,
          lineCategoryId: tempId, // Link to temp category
          lineCategorySlug: slug,
          lineCategoryCountId: tempCountId,
          estimated: data.lineData.estimated,
          paid: data.lineData.paid || 0,
          final: data.lineData.final,
          dueDate: data.lineData.dueDate || null,
          count: data.lineData.count,
          payer: data.lineData.payer || null,
          note: data.lineData.note || null,
          iconName: data.lineData.iconName ?? null,
          colorName: data.lineData.colorName ?? null,
          isDone: data.lineData.isDone || false,
          isFavorite: data.lineData.isFavorite || false,
          isDeleted: false,
          isModelLine: false,
          brideId: (localDraft as any).brideId ?? null,
          groomId: (localDraft as any).groomId ?? null,
          creationDate: now,
          lastModifiedDate: now,
        }

        nextDraft = {
          ...(localDraft as any),
          lineCategories: [...(((localDraft as any).lineCategories as any[]) || []), newCategory],
          lines: [...(((localDraft as any).lines as any[]) || []), newLine],
        }

        // Select new category immediately
        setActiveCategoryId(tempId)
      }

      setLocalDraft(nextDraft)
      setIsCategoryModalOpen(false)
      setEditingCategory(null)

      await syncDraft(nextDraft)
      addToast(data.id ? 'Category saved' : 'Category and line added', 'success')
    },
    [localDraft, syncDraft, addToast]
  )

  const handleDeleteCategory = useCallback(
    (categoryId: number) => {
      const category = (localDraft as any)?.lineCategories?.find((c: any) => c.id === categoryId)
      if (category) {
        setItemToDelete({ type: 'category', item: category })
        setIsDeleteModalOpen(true)
      }
    },
    [localDraft]
  )

  const confirmDeleteCategory = useCallback(async () => {
    if (!localDraft || !itemToDelete || itemToDelete.type !== 'category') return
    const category = itemToDelete.item as BudgetLineCategoryResponse
    const categoryId = category.id
    const now = new Date().toISOString()

    const nextDraft: any = {
      ...(localDraft as any),
      lineCategories: ((localDraft as any).lineCategories || []).map((c: any) =>
        c.id === categoryId ? { ...c, isDeleted: true, lastModifiedDate: now } : c
      ),
      lines: ((localDraft as any).lines || []).map((line: any) =>
        line.lineCategoryId === categoryId
          ? { ...line, isDeleted: true, lastModifiedDate: now }
          : line
      ),
    }

    setLocalDraft(nextDraft)
    if (activeCategoryId === categoryId) setActiveCategoryId(null)

    setIsDeleteModalOpen(false)
    setItemToDelete(null)

    await syncDraft(nextDraft)
    addToast(`Category "${category.name}" deleted successfully`, 'success')
  }, [localDraft, itemToDelete, activeCategoryId, syncDraft, addToast])

  // Manual Save (optional, you already sync on each action)
  const handleSave = useCallback(async () => {
    if (!localDraft || !eventId) {
      if (isLoading) {
        addToast('Please wait while the budget book is loading...', 'info')
        return
      }
      addToast('Budget book not found. Please refresh the page.', 'error')
      return
    }

    if (!hasActualChanges()) {
      addToast('No changes to save', 'info')
      setHasUnsavedChanges(false)
      return
    }

    try {
      const payload = buildSyncPayload(localDraft)
      await syncMutation.mutateAsync({ ...payload, query: { eventId } })

      setHasUnsavedChanges(false)
      lastSyncedRef.current = localDraft

      addToast('Changes saved successfully', 'success')
      refetch()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save changes'
      addToast(msg, 'error')
    }
  }, [
    localDraft,
    eventId,
    isLoading,
    hasActualChanges,
    buildSyncPayload,
    syncMutation,
    refetch,
    addToast,
  ])

  // Loading
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-24 sm:text-28 font-semibold text-gray-900">
            Budget
          </h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <LoadingOverlay open={true} title="Loading budget..." subtitle="Please wait a moment" />
        </div>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-16 text-red-600 mb-4">Failed to load budget. Please try again.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Missing event
  if (!eventId) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
        <div className="text-center py-12 text-gray-500">
          <p className="text-16">Event ID is required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>
            <h1 className="text-20 font-semibold text-gray-900">Budget</h1>
          </div>

          {localDraft && (
            <BudgetFiltersBar filterType={filterType} onFilterChange={setFilterType} />
          )}
        </div>

        <div className="flex items-center gap-3 ml-2 mt-3">
          <Button
            variant="brand"
            size="md"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || syncMutation.isPending || !localDraft}
            className="flex items-center gap-2 rounded-xl !text-white"
          >
            <Save className="h-4 w-4" />
            {syncMutation.isPending ? 'Saving...' : 'Save'}
          </Button>

          {hasUnsavedChanges && (
            <span className="!text-16 text-brand-500 font-medium">Unsaved changes</span>
          )}
        </div>
      </div>

      {/* Main Content */}
      {stats ? (
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-4">
            <BudgetOverviewCard
              totalBudget={stats.totalBudget}
              totalPaid={stats.totalPaid}
              totalEstimated={stats.totalEstimated}
              remaining={stats.remaining}
              totalFinal={stats.totalFinal}
              savedPercentage={stats.savedPercentage}
              categoryStats={stats.categoryStats}
              onBudgetChange={handleBudgetChange}
            />

            <BudgetCategoryBreakdownList
              categoryStats={stats.categoryStats}
              activeCategoryId={activeCategoryId}
              onCategoryClick={handleCategoryClick}
              onEditCategory={categoryId => {
                const category = (localDraft as any)?.lineCategories?.find((c: any) => c.id === categoryId)
                if (category) {
                  setEditingCategory(category)
                  setIsCategoryModalOpen(true)
                }
              }}
              onDeleteCategory={handleDeleteCategory}
              onCreateCategory={handleCreateCategory}
              totalBudget={stats.totalBudget}
              totalEstimated={stats.totalEstimated}
            />
          </div>

          <div className="order-last sm:order-none">
            <BudgetLinesTable
              lines={filteredLines as any}
              categories={((localDraft as any)?.lineCategories || []) as any}
              totalBudget={stats.totalBudget}
              onToggleDone={handleToggleDone}
              onToggleFavorite={handleToggleFavorite}
              onEdit={handleEditLine}
              onDelete={handleDeleteLine}
              onCreateLine={handleCreateLine}
              activeCategoryId={activeCategoryId}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-16">No budget data available</p>
        </div>
      )}

      {/* Modals */}
      {localDraft && (
        <>
          <BudgetLineModal
            isOpen={isBudgetLineModalOpen}
            onClose={() => {
              setIsBudgetLineModalOpen(false)
              setEditingLine(null)
            }}
            onSave={handleSaveLine}
            editingLine={editingLine}
            categories={(((localDraft as any).lineCategories || []) as BudgetLineCategoryResponse[]).filter(
              c => !c.isDeleted
            )}
            defaultCategoryId={activeCategoryId}
          />

          <CategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => {
              setIsCategoryModalOpen(false)
              setEditingCategory(null)
            }}
            onSave={handleSaveCategory}
            editingCategory={editingCategory}
          />

          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false)
              setItemToDelete(null)
            }}
            onConfirm={() => {
              if (itemToDelete?.type === 'line') confirmDeleteLine()
              else if (itemToDelete?.type === 'category') confirmDeleteCategory()
            }}
            title="Confirm Delete"
            message={
              itemToDelete?.type === 'line'
                ? 'Are you sure you want to delete this budget line? This action cannot be undone.'
                : 'Are you sure you want to delete this category? All lines in this category will also be deleted. This action cannot be undone.'
            }
            itemName={
              itemToDelete?.type === 'line'
                ? (itemToDelete.item as BudgetLineResponse).expense
                : (itemToDelete?.item as BudgetLineCategoryResponse)?.name
            }
          />
        </>
      )}
    </div>
  )
}

export default function BudgetPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingOverlay open={true} title="Loading budget..." subtitle="Please wait a moment" />
          </div>
        </div>
      }
    >
      <BudgetPageContent />
    </Suspense>
  )
}
