'use client'

import { useState, useMemo, useCallback, Suspense } from 'react'
import { useRouter } from '@/i18n/navigation'
import { ChevronLeft, Save, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingOverlay } from '@/components/ui'
import { useToast } from '@/components/ui/Toaster'
import { useEventId } from '@/hooks/planning'
import { useBudgetBook, useBudgetSyncMutation, useBudgetSyncDeltaMutation } from '@/hooks/budget/budgetBooks.hooks'
import { usePlanningBookController } from '@/hooks/planning/usePlanningBookController'
import { useInitBudgetBooks, useAddBudgetBookModels } from '@/hooks/bookInit'

import { BudgetFiltersBar, type FilterType } from '@/components/budgetBook/components/filters/BudgetFiltersBar'
import { BudgetOverviewCard } from '@/components/budgetBook/components/BudgetOverviewCard'
import { BudgetCategoryBreakdownList } from '@/components/budgetBook/components/BudgetCategoryBreakdownList'
import { BudgetLinesTable } from '@/components/budgetBook/components/BudgetLinesTable'
import { BudgetLineModal } from '@/components/budgetBook/components/modals/BudgetLineModal'
import { CategoryModal } from '@/components/budgetBook/components/modals/CategoryModal'
import { ConfirmDeleteModal } from '@/components/budgetBook/components/modals/ConfirmDeleteModal'

import { slugify } from '@/hooks/planning/bookUtils'
import { generateTempId } from '@/utils/sync/tempIds'
import type { BudgetBookDraft } from '@/hooks/planning/bookDrafts'
import { buildBudgetBookRequestFromLocal, convertLineToRequest, convertCategoryToRequest } from '@/utils/planning/mappers/budgetMappers'

import { calculateBudgetStats } from '@/utils/budgetbook/budgetStats'
import type { BudgetLineResponse, BudgetLineCategoryResponse } from '@/types/responses'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

/* eslint-disable @typescript-eslint/no-explicit-any */
function BudgetPageContent() {
  const router = useRouter()
  const { addToast } = useToast()
  const eventId = useEventId()

  const syncMutation = useBudgetSyncMutation()
  const syncDeltaMutation = useBudgetSyncDeltaMutation()
  const initMutation = useInitBudgetBooks()
  const addModelsMutation = useAddBudgetBookModels()

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
  const [searchQuery, setSearchQuery] = useState<string>('')

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

  const {
    localBook: localDraft,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    save,
    applyLocalUpdate,
    getActiveCategories,
    getLinesByCategory,
    getCategoryById,
    isInitializing,
    isAddingModels,
  } = usePlanningBookController<BudgetBookDraft>({
    book: (budgetBook as any as BudgetBookDraft) ?? null,
    isLoading,
    eventId: eventId ?? undefined,
    syncFn: async (draft) => {
      const payload = buildBudgetBookRequestFromLocal(draft)
      await syncMutation.mutateAsync({
        ...payload,
        query: { eventId: eventId ?? undefined },
      })
    },
    syncDeltaFn: async (delta) => {
      const response = await syncDeltaMutation.mutateAsync({
        data: delta,
        query: { eventId: eventId ?? undefined },
      })
      return response as any
    },
    refetch,
    refetchAfterSave: true,
    requireEventId: true,
    convertLineToRequest,
    convertCategoryToRequest,
    getBookId: (book) => (book as any).id ?? null,
    shouldInit: (b) => !b?.id,
    initFn: async () => {
      await initMutation.mutateAsync({
        eventId: eventId ?? undefined,
        userType: null as unknown as UserType | undefined,
        clientId: null as unknown as string | undefined,
      })
    },
    shouldAddModels: (b) => (b as any)?.isModelsAdd === false,
    addModelsFn: async () => {
      await addModelsMutation.mutateAsync({
        eventId: eventId ?? undefined,
        userType: null as unknown as UserType | undefined,
        clientId: null as unknown as string | undefined,
      })
    },
    initMutation,
    addModelsMutation,
    isSameBookBase: (current, last) =>
      (current.initialEstimated ?? null) === (last.initialEstimated ?? null),
    getLines: (book) => book.lines || [],
    getCategories: (book) => book.lineCategories || [],
    getLineId: (line: any) => line.id,
    getCategoryId: (cat: any) => cat.id,
    isSameLine: (current: any, last: any) =>
      (current.isDeleted ?? false) === (last.isDeleted ?? false) &&
      (current.expense ?? '') === (last.expense ?? '') &&
      (current.lineCategoryId ?? null) === (last.lineCategoryId ?? null) &&
      (current.estimated ?? 0) === (last.estimated ?? 0) &&
      (current.paid ?? 0) === (last.paid ?? 0) &&
      (current.final ?? null) === (last.final ?? null) &&
      (current.isDone ?? false) === (last.isDone ?? false) &&
      (current.isFavorite ?? false) === (last.isFavorite ?? false),
    isSameCategory: (current: any, last: any) =>
      (current.isDeleted ?? false) === (last.isDeleted ?? false) &&
      (current.name ?? '') === (last.name ?? '') &&
      (current.description ?? null) === (last.description ?? null) &&
      (current.estimated ?? 0) === (last.estimated ?? 0) &&
      (current.iconName ?? null) === (last.iconName ?? null) &&
      (current.colorName ?? null) === (last.colorName ?? null),
    getLineCategoryId: (line: any) => line.lineCategoryId ?? null,
    isLineDeleted: (line: any) => line.isDeleted ?? false,
    isLineDone: (line: any) => line.isDone ?? false,
    isCategoryDeleted: (cat: any) => cat.isDeleted ?? false,
  })

  const syncNow = useCallback(
    async (bookOverride?: BudgetBookDraft) => {
      const result = await save(bookOverride)
      if (!result.ok && result.reason !== 'no-changes' && result.message) {
        addToast(result.message, 'error')
      }
    },
    [save, addToast]
  )

  // Category selection toggle
  const handleCategoryClick = useCallback((categoryId: number | null) => {
    setActiveCategoryId(prev => (categoryId === prev ? null : categoryId))
  }, [])

  // Stats
  const stats = useMemo(() => {
    if (!localDraft) return null
    return calculateBudgetStats(localDraft as any, activeCategoryId as any)
  }, [localDraft, activeCategoryId])

  // Filter lines using controller helpers
  const filteredLines = useMemo(() => {
    if (!localDraft) return []

    // Use controller helper to get lines by category, or all lines if no category selected
    let lines: any[] = activeCategoryId !== null
      ? getLinesByCategory(activeCategoryId)
      : (localDraft.lines || []).filter((line: any) => !line.isDeleted)

    // Apply additional filters
    switch (filterType) {
      case 'done':
        lines = lines.filter((l: any) => l.isDone)
        break
      case 'not-done':
        lines = lines.filter((l: any) => !l.isDone)
        break
      case 'favorite':
        lines = lines.filter((l: any) => l.isFavorite)
        break
      case 'not-favorite':
        lines = lines.filter((l: any) => !l.isFavorite)
        break
      default:
        // Keep all lines
        break
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      lines = lines.filter((line: any) => {
        // Search in expense fields
        const expenseMatch =
          (line.expense || '').toLowerCase().includes(query) ||
          (line.expenseAr || '').toLowerCase().includes(query) ||
          (line.expenseEn || '').toLowerCase().includes(query)

        // Search in note
        const noteMatch = (line.note || '').toLowerCase().includes(query)

        // Search in payer
        const payerMatch = (line.payer || '').toLowerCase().includes(query)

        // Search in category name
        const category = line.lineCategoryId ? getCategoryById(line.lineCategoryId) : null
        const categoryMatch = category
          ? (((category as any).name || '').toLowerCase().includes(query) ||
            ((category as any).nameAr || '').toLowerCase().includes(query) ||
            ((category as any).nameEn || '').toLowerCase().includes(query))
          : false

        return expenseMatch || noteMatch || payerMatch || categoryMatch
      })
    }

    return lines
  }, [localDraft, activeCategoryId, filterType, searchQuery, getLinesByCategory, getCategoryById])

  // Handlers
  const handleBudgetChange = useCallback(
    async (newBudget: number) => {
      const result = applyLocalUpdate((current) => {
        const now = new Date().toISOString()
        return {
          ...(current as any),
          initialEstimated: newBudget,
          lastModifiedDate: now,
        } as BudgetBookDraft
      })
      if (!result.ok || !result.book) return
      await syncNow(result.book)
    },
    [applyLocalUpdate, syncNow]
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
          ? getCategoryById(finalCategoryId)
          : null

      const lineCategorySlug = selectedCategory?.slug ?? null
      const lineCategoryCountId = selectedCategory?.count_id ?? null

      const result = applyLocalUpdate((current) => {
        const d: any = current as any
        if (data.id && data.id > 0) {
          // Update existing
          return {
            ...d,
            lines: (d.lines || []).map((line: any) =>
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
          } as BudgetBookDraft
        } else {
          // Create new (local temp id; payload keeps negative id)
          const tempLineId = generateTempId()

          const newLine: any = {
            id: tempLineId,
            bookId: d.id || 0,

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

            brideId: d.brideId ?? null,
            groomId: d.groomId ?? null,

            creationDate: now,
            lastModifiedDate: now,
          }

          return {
            ...d,
            lines: [...(d.lines || []), newLine],
          } as BudgetBookDraft
        }
      })

      if (!result.ok || !result.book) return

      setIsBudgetLineModalOpen(false)
      setEditingLine(null)

      await syncNow(result.book)
      addToast('Budget line saved', 'success')
    },
    [applyLocalUpdate, activeCategoryId, getCategoryById, syncNow, addToast]
  )

  const handleToggleDone = useCallback(
    async (lineId: number) => {
      const result = applyLocalUpdate((current) => {
        const now = new Date().toISOString()
        const d: any = current as any
        return {
          ...d,
          lines: (d.lines || []).map((line: any) =>
            line.id === lineId ? { ...line, isDone: !line.isDone, lastModifiedDate: now } : line
          ),
        } as BudgetBookDraft
      })
      if (!result.ok || !result.book) return
      await syncNow(result.book)
    },
    [applyLocalUpdate, syncNow]
  )

  const handleToggleFavorite = useCallback(
    async (lineId: number) => {
      const result = applyLocalUpdate((current) => {
        const now = new Date().toISOString()
        const d: any = current as any
        return {
          ...d,
          lines: (d.lines || []).map((line: any) =>
            line.id === lineId
              ? { ...line, isFavorite: !line.isFavorite, lastModifiedDate: now }
              : line
          ),
        } as BudgetBookDraft
      })
      if (!result.ok || !result.book) return
      await syncNow(result.book)
    },
    [applyLocalUpdate, syncNow]
  )

  const handleDeleteLine = useCallback((line: BudgetLineResponse) => {
    setItemToDelete({ type: 'line', item: line })
    setIsDeleteModalOpen(true)
  }, [])

  const confirmDeleteLine = useCallback(async () => {
    if (!itemToDelete || itemToDelete.type !== 'line') return
    const line = itemToDelete.item as BudgetLineResponse
    const result = applyLocalUpdate((current) => {
      const now = new Date().toISOString()
      const d: any = current as any
      return {
        ...d,
        lines: (d.lines || []).map((l: any) =>
          l.id === line.id ? { ...l, isDeleted: true, lastModifiedDate: now } : l
        ),
      } as BudgetBookDraft
    })
    if (!result.ok || !result.book) return

    setIsDeleteModalOpen(false)
    setItemToDelete(null)

    await syncNow(result.book)
    addToast(`"${line.expense}" deleted successfully`, 'success')
  }, [itemToDelete, applyLocalUpdate, syncNow, addToast])

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
      const now = new Date().toISOString()
      const result = applyLocalUpdate((current) => {
        const d: any = current as any
        if (data.id && data.id > 0) {
          // Update existing category (no line data)
          return {
            ...d,
            lineCategories: (d.lineCategories || []).map((cat: any) =>
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
          } as BudgetBookDraft
        } else {
          // Create new category + line together
          if (!data.lineData) {
            addToast('Line data is required when creating a new category', 'error')
            return current
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
            bookId: d.id || 0,
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
            brideId: d.brideId ?? null,
            groomId: d.groomId ?? null,
            creationDate: now,
            lastModifiedDate: now,
          }

          // Select new category immediately
          setActiveCategoryId(tempId)

          return {
            ...d,
            lineCategories: [...(d.lineCategories || []), newCategory],
            lines: [...(d.lines || []), newLine],
          } as BudgetBookDraft
        }
      })

      if (!result.ok || !result.book) return

      setIsCategoryModalOpen(false)
      setEditingCategory(null)

      await syncNow(result.book)
      addToast(data.id ? 'Category saved' : 'Category and line added', 'success')
    },
    [applyLocalUpdate, syncNow, addToast]
  )

  const handleDeleteCategory = useCallback(
    (categoryId: number) => {
      const category = getCategoryById(categoryId)
      if (category) {
        setItemToDelete({ type: 'category', item: category as BudgetLineCategoryResponse })
        setIsDeleteModalOpen(true)
      }
    },
    [getCategoryById]
  )

  const confirmDeleteCategory = useCallback(async () => {
    if (!itemToDelete || itemToDelete.type !== 'category') return
    const category = itemToDelete.item as BudgetLineCategoryResponse
    const categoryId = category.id
    const result = applyLocalUpdate((current) => {
      const now = new Date().toISOString()
      const d: any = current as any
      return {
        ...d,
        lineCategories: (d.lineCategories || []).map((c: any) =>
          c.id === categoryId ? { ...c, isDeleted: true, lastModifiedDate: now } : c
        ),
        lines: (d.lines || []).map((line: any) =>
          line.lineCategoryId === categoryId
            ? { ...line, isDeleted: true, lastModifiedDate: now }
            : line
        ),
      } as BudgetBookDraft
    })
    if (!result.ok || !result.book) return

    if (activeCategoryId === categoryId) setActiveCategoryId(null)

    setIsDeleteModalOpen(false)
    setItemToDelete(null)

    await syncNow(result.book)
    addToast(`Category "${category.name}" deleted successfully`, 'success')
  }, [itemToDelete, activeCategoryId, applyLocalUpdate, syncNow, addToast])

  // Manual Save (optional, you already sync on each action)
  const handleSave = useCallback(async () => {
    const result = await save()
    if (!result.ok) {
      if (result.reason === 'loading' || result.reason === 'no-changes') {
        addToast(result.message || 'No changes to save', 'info')
        if (result.reason === 'no-changes') setHasUnsavedChanges(false)
      } else {
        addToast(result.message || 'Failed to save changes', 'error')
      }
      return
    }
    addToast(result.message || 'Changes saved successfully', 'success')
  }, [save, addToast, setHasUnsavedChanges])

  // Loading
  if (isLoading || isInitializing || isAddingModels) {
    const loadingTitle = isInitializing
      ? 'Initializing budget book...'
      : isAddingModels
        ? 'Adding default models...'
        : 'Loading budget...'
    const loadingSubtitle = isInitializing
      ? 'Setting up your budget book'
      : isAddingModels
        ? 'Please wait while we add default categories'
        : 'Please wait a moment'

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
          <LoadingOverlay open={true} title={loadingTitle} subtitle={loadingSubtitle} />
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
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Input */}
              <div className="relative w-full sm:w-auto sm:min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search expenses, notes, payer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                  size="md"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>
              <BudgetFiltersBar filterType={filterType} onFilterChange={setFilterType} />
            </div>
          )}
        </div>

        {(hasUnsavedChanges || syncMutation.isPending) && (
          <div className="flex items-center gap-3 ml-2 mt-3">
            <Button
              variant="brand"
              size="md"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || syncMutation.isPending || !localDraft}
              className="flex items-center gap-2 rounded-xl !text-white"
              type="button"
            >
              <Save className="h-4 w-4" />
              {syncMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>

            {hasUnsavedChanges && (
              <span className="text-16 text-brand-500 font-medium">Unsaved changes</span>
            )}
          </div>
        )}
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
                const category = getCategoryById(categoryId)
                if (category) {
                  setEditingCategory(category as BudgetLineCategoryResponse)
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
            categories={getActiveCategories() as BudgetLineCategoryResponse[]}
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
