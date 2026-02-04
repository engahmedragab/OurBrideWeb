'use client'

import { useState, useMemo, useCallback, Suspense } from 'react'
import { useRouter } from '@/i18n/navigation'
import { ChevronLeft, Save, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui'
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
import type { SyncBookDeltaResponse } from '@/hooks/planning/usePlanningBookController'
import { BookClass, UserType as ResponseUserType } from '@/types/responses'
import { useI18nTranslations, useIsRTL } from '@/i18n/hooks'
import { cn } from '@/lib'

function BudgetPageContent() {
  const isRTL = useIsRTL()
  const t = useI18nTranslations('eventsPlanning.budget')
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
    book: (budgetBook as unknown as BudgetBookDraft) ?? null,
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
        data: delta as unknown as import('@/types/syncDelta').SyncBookDeltaRequest<import('@/../client/common/api/gen/ourbride-api').BudgetLineRequest, import('@/../client/common/api/gen/ourbride-api').BudgetLineCategoryRequest>,
        query: { eventId: eventId ?? undefined },
      })
      return response as unknown as SyncBookDeltaResponse<BudgetBookDraft>
    },
    refetch,
    refetchAfterSave: true,
    requireEventId: true,
    convertLineToRequest: (line: unknown, bookId: number) => {
      return convertLineToRequest(line as Record<string, unknown>, bookId)
    },
    convertCategoryToRequest: (category: unknown) => {
      return convertCategoryToRequest(category as Record<string, unknown>)
    },
    getBookId: (book) => book.id ?? null,
    shouldInit: (b) => !b?.id,
    initFn: async () => {
      await initMutation.mutateAsync({
        eventId: eventId ?? undefined,
        userType: null as unknown as UserType | undefined,
        clientId: null as unknown as string | undefined,
      })
    },
    shouldAddModels: (b) => b?.isModelsAdd === false,
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
    getLineId: (line: unknown) => (line as BudgetLineResponse).id,
    getCategoryId: (cat: unknown) => (cat as BudgetLineCategoryResponse).id,
    isSameLine: (current: unknown, last: unknown) => {
      const curr = current as BudgetLineResponse
      const lst = last as BudgetLineResponse
      return (
        (curr.isDeleted ?? false) === (lst.isDeleted ?? false) &&
        (curr.expense ?? '') === (lst.expense ?? '') &&
        (curr.lineCategoryId ?? null) === (lst.lineCategoryId ?? null) &&
        (curr.estimated ?? 0) === (lst.estimated ?? 0) &&
        (curr.paid ?? 0) === (lst.paid ?? 0) &&
        (curr.final ?? null) === (lst.final ?? null) &&
        (curr.isDone ?? false) === (lst.isDone ?? false) &&
        (curr.isFavorite ?? false) === (lst.isFavorite ?? false)
      )
    },
    isSameCategory: (current: unknown, last: unknown) => {
      const curr = current as BudgetLineCategoryResponse
      const lst = last as BudgetLineCategoryResponse
      return (
        (curr.isDeleted ?? false) === (lst.isDeleted ?? false) &&
        (curr.name ?? '') === (lst.name ?? '') &&
        (curr.description ?? null) === (lst.description ?? null) &&
        (curr.estimated ?? 0) === (lst.estimated ?? 0) &&
        (curr.iconName ?? null) === (lst.iconName ?? null) &&
        (curr.colorName ?? null) === (lst.colorName ?? null)
      )
    },
    getLineCategoryId: (line: unknown) => (line as BudgetLineResponse).lineCategoryId ?? null,
    isLineDeleted: (line: unknown) => (line as BudgetLineResponse).isDeleted ?? false,
    isLineDone: (line: unknown) => (line as BudgetLineResponse).isDone ?? false,
    isCategoryDeleted: (cat: unknown) => (cat as BudgetLineCategoryResponse).isDeleted ?? false,
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
    return calculateBudgetStats(localDraft, activeCategoryId)
  }, [localDraft, activeCategoryId])

  // Filter lines using controller helpers
  const filteredLines = useMemo(() => {
    if (!localDraft) return []

    // Use controller helper to get lines by category, or all lines if no category selected
    let lines: BudgetLineResponse[] = activeCategoryId !== null
      ? (getLinesByCategory(activeCategoryId) as BudgetLineResponse[])
      : (localDraft.lines || []).filter((line: BudgetLineResponse) => !line.isDeleted)

    // Apply additional filters
    switch (filterType) {
      case 'done':
        lines = lines.filter((l: BudgetLineResponse) => l.isDone)
        break
      case 'not-done':
        lines = lines.filter((l: BudgetLineResponse) => !l.isDone)
        break
      case 'favorite':
        lines = lines.filter((l: BudgetLineResponse) => l.isFavorite)
        break
      case 'not-favorite':
        lines = lines.filter((l: BudgetLineResponse) => !l.isFavorite)
        break
      default:
        // Keep all lines
        break
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      lines = lines.filter((line: BudgetLineResponse) => {
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
        const category = line.lineCategoryId ? (getCategoryById(line.lineCategoryId) as BudgetLineCategoryResponse | null) : null
        const categoryMatch = category
        
          ? ((category.name || '').toLowerCase().includes(query) ||
            (category.nameAr || '').toLowerCase().includes(query) ||
            (category.nameEn || '').toLowerCase().includes(query))
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
          ...current,
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

      const selectedCategory: BudgetLineCategoryResponse | null =
        finalCategoryId != null
          ? (getCategoryById(finalCategoryId) as BudgetLineCategoryResponse | null)
          : null

      const lineCategorySlug = selectedCategory?.slug ?? null
      const categoryWithCountId = selectedCategory as (BudgetLineCategoryResponse & { count_id?: number | null }) | null
      const lineCategoryCountId = categoryWithCountId?.count_id ?? null

      const result = applyLocalUpdate((current) => {
        const d = current as BudgetBookDraft
        if (data.id && data.id > 0) {
          // Update existing
          return {
            ...d,
            lines: (d.lines || []).map((line: BudgetLineResponse) =>
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

          const newLine: BudgetLineResponse = {
            id: tempLineId,
            bookId: d.id || 0,
            slug: `budget-line-${tempLineId}`,

            expense: data.expense || '',
            expenseAr: data.expenseAr || '',
            expenseEn: data.expenseEn || '',

            lineCategoryId: finalCategoryId ?? undefined,

            estimated: data.estimated ?? 0,
            paid: data.paid ?? 0,
            final: data.final ?? 0,
            dueDate: data.dueDate ?? null,
            count: data.count ?? 0,

            payer: data.payer || '',
            note: data.note || '',
            iconName: data.iconName || '',
            colorName: data.colorName || '',

            isDone: data.isDone ?? false,
            isFavorite: data.isFavorite ?? false,
            isDeleted: false,
            isModelLine: false,

            brideId: d.brideId ?? undefined,
            groomId: d.groomId ?? undefined,

            creationDate: now,
            lastModifiedDate: now,
            
            // Required LineResponse fields
            lineType: (typeof d.bookType === 'number' ? d.bookType : ResponseUserType.Guest) as ResponseUserType,
            bookClass: (typeof d.bookClass === 'number' ? d.bookClass : BookClass.Budget) as BookClass,
            createdBy: d.createdBy || '',
            lastModifiedBy: d.lastModifiedBy || '',
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
        const d = current as BudgetBookDraft
        return {
          ...d,
          lines: (d.lines || []).map((line: BudgetLineResponse) =>
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
        const d = current as BudgetBookDraft
        return {
          ...d,
          lines: (d.lines || []).map((line: BudgetLineResponse) =>
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
      const d = current as BudgetBookDraft
      return {
        ...d,
        lines: (d.lines || []).map((l: BudgetLineResponse) =>
          l.id === line.id ? { ...l, isDeleted: true, lastModifiedDate: now } : l
        ),
      } as BudgetBookDraft
    })
    if (!result.ok || !result.book) return

    setIsDeleteModalOpen(false)
    setItemToDelete(null)

    await syncNow(result.book)
    addToast(`${line.expense}, ${t('toasts.deletedSuccessfully')}` ,'success')
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
        const d = current as BudgetBookDraft
        if (data.id && data.id > 0) {
          // Update existing category (no line data)
          return {
            ...d,
            lineCategories: (d.lineCategories || []).map((cat: BudgetLineCategoryResponse) =>
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
            addToast(t('toasts.lineDataRequired'), 'error')
            return current
          }

          const tempId = generateTempId()
          const tempCountId = Date.now()
          const slug = slugify(data.name)

          const newCategory: BudgetLineCategoryResponse = {
            id: tempId,
            name: data.name,
            nameAr: data.nameAr || data.name,
            nameEn: data.nameEn || data.name,
            description: data.description || '',
            descriptionAr: data.descriptionAr || data.description || '',
            descriptionEn: data.descriptionEn || data.description || '',
            estimated: 0, // Category estimated not used
            pending: undefined,
            paid: undefined,
            final: undefined,
            count: undefined,
            iconName: data.iconName || '',
            colorName: data.colorName || '',
            slug: slug || '',
            count_id: tempCountId,
            isDeleted: false,
            isModelLine: false,
            creationDate: now,
            lastModifiedDate: now,
            createdBy: d.createdBy || '',
            lastModifiedBy: d.lastModifiedBy || '',
          } as BudgetLineCategoryResponse & { count_id?: number }

          // Create line linked to the new category
          const tempLineId = generateTempId()
          const newLine: BudgetLineResponse = {
            id: tempLineId,
            bookId: d.id || 0,
            expense: data.lineData.expense || '',
            expenseAr: data.lineData.expenseAr || '',
            expenseEn: data.lineData.expenseEn || '',
            lineCategoryId: tempId, // Link to temp category
            slug: `budget-line-${tempLineId}`,
            estimated: data.lineData.estimated ?? 0,
            paid: data.lineData.paid ?? 0,
            final: data.lineData.final ?? 0,
            dueDate: data.lineData.dueDate ?? null,
            count: data.lineData.count ?? 0,
            payer: data.lineData.payer || '',
            note: data.lineData.note || '',
            iconName: data.lineData.iconName || '',
            colorName: data.lineData.colorName || '',
            isDone: data.lineData.isDone ?? false,
            isFavorite: data.lineData.isFavorite ?? false,
            isDeleted: false,
            isModelLine: false,
            brideId: d.brideId ?? undefined,
            groomId: d.groomId ?? undefined,
            creationDate: now,
            lastModifiedDate: now,
            // Required LineResponse fields
            lineType: (typeof d.bookType === 'number' ? d.bookType : ResponseUserType.Guest) as ResponseUserType,
            bookClass: (typeof d.bookClass === 'number' ? d.bookClass : BookClass.Budget) as BookClass,
            createdBy: d.createdBy || '',
            lastModifiedBy: d.lastModifiedBy || '',
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
      addToast(data.id ? t('toasts.categorySaved') : t('toasts.categoryAndLineAdded'), 'success')
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
      const d = current as BudgetBookDraft
      return {
        ...d,
        lineCategories: (d.lineCategories || []).map((c: BudgetLineCategoryResponse) =>
          c.id === categoryId ? { ...c, isDeleted: true, lastModifiedDate: now } : c
        ),
        lines: (d.lines || []).map((line: BudgetLineResponse) =>
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
    addToast(t('toasts.categoryDeletedSuccessfully', { name: category.name }), 'success')
  }, [itemToDelete, activeCategoryId, applyLocalUpdate, syncNow, addToast])

  // Manual Save (optional, you already sync on each action)
  const handleSave = useCallback(async () => {
    const result = await save()
    if (!result.ok) {
      if (result.reason === 'loading' || result.reason === 'no-changes') {
        addToast(result.message || t('toasts.noChangesToSave'), 'info')
        if (result.reason === 'no-changes') setHasUnsavedChanges(false)
      } else {
        addToast(result.message || t('toasts.failedToSaveChanges'), 'error')
      }
      return
    }
    addToast(result.message || t('toasts.changesSavedSuccessfully'), 'success')
  }, [save, addToast, setHasUnsavedChanges])

  // Loading
  if (isLoading || isInitializing || isAddingModels) {
    const loadingTitle = isInitializing
      ? t('loading.initializingTitle')
      : isAddingModels
        ? t('loading.addingModelsTitle')
        : t('loading.loadingBudgetTitle')
    const loadingSubtitle = isInitializing
      ? t('loading.initializingSubtitle')
      : isAddingModels
        ? t('loading.addingModelsSubtitle')
        : t('loading.loadingBudgetSubtitle')

    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className={cn("h-5 w-5 text-gray-700", isRTL ? 'rotate-180' : 'rotate-0')} />
          </button>
          <h1 className="text-24 sm:text-28 font-semibold text-gray-900">
            {t('pageTitle')}
          </h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text={loadingTitle} fullScreen={true} />
        </div>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-16 text-red-600 mb-4">{t('error.failedToLoad')}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t('error.retry')}
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
          <p className="text-16">{t('event.eventIdRequired')}</p>
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
              <ChevronLeft className={cn("h-4 w-4 text-gray-700", isRTL ? 'rotate-180' : 'rotate-0')} />
            </button>
            <h1 className="text-20 font-semibold text-gray-900">{t('pageTitle')}</h1>
          </div>

          {localDraft && (
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Input */}
              <div className="relative w-full sm:w-auto sm:min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
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
              {syncMutation.isPending ? t('header.saving') : t('header.saveChanges')}
            </Button>

            {hasUnsavedChanges && (
              <span className="text-16 text-brand-500 font-medium">{t('header.unsavedChanges')}</span>
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
              lines={filteredLines}
              categories={(localDraft?.lineCategories || []) as BudgetLineCategoryResponse[]}
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
          <p className="text-16">{t('noBudgetTitle')}</p>
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
            title={t('modals.confirmDelete.title')}
            message={
              itemToDelete?.type === 'line'
                ? t('modals.confirmDelete.lineMessage')
                : t('modals.confirmDelete.categoryMessage')
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
            <LoadingSpinner size="lg"  fullScreen={true} />
          </div>
        </div>
      }
    >
      <BudgetPageContent />
    </Suspense>
  )
}
