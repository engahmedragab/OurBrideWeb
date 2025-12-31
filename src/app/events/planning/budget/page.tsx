'use client'

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LoadingOverlay, LoadingSpinner } from '@/components/ui'
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
import {
  mapApiToDraft,
  mapDraftToSyncPayload,
  generateTempId,
  type BudgetBookDraft,
} from '@/utils/budgetAdapters'
import { calculateBudgetStats } from '@/utils/budgetStats'
import type { BudgetLineResponse, BudgetLineCategoryResponse } from '@/types/responses'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

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

  // On first load, use the book from GET endpoint immediately
  useEffect(() => {
    if (isInitialLoadRef.current && budgetBook && !localDraft) {
      const draft = mapApiToDraft(budgetBook)
      if (draft) {
        setLocalDraft(draft)
        lastSyncedRef.current = draft
        isInitialLoadRef.current = false
      }
    }
  }, [budgetBook, localDraft])

  // Sync fetched data to local state when it changes (only if no unsaved changes)
  useEffect(() => {
    if (budgetBook && !hasUnsavedChanges && !isInitialLoadRef.current) {
      const draft = mapApiToDraft(budgetBook)
      if (draft) {
        setLocalDraft(draft)
        lastSyncedRef.current = draft
      }
    } else if (budgetBook === null && !isLoading && !hasUnsavedChanges) {
      setLocalDraft(null)
    }
  }, [budgetBook, hasUnsavedChanges, isLoading])

  // After sync, update local state from refetched data
  useEffect(() => {
    if (budgetBook && !hasUnsavedChanges && syncMutation.isSuccess) {
      const draft = mapApiToDraft(budgetBook)
      if (draft) {
        setLocalDraft(draft)
        lastSyncedRef.current = draft
        isInitialLoadRef.current = false
      }
    }
  }, [budgetBook, hasUnsavedChanges, syncMutation.isSuccess])

  // Check if there are actual changes
  const hasActualChanges = useCallback((): boolean => {
    if (!localDraft || !lastSyncedRef.current) return !!localDraft

    const current = localDraft
    const lastSynced = lastSyncedRef.current

    // Compare basic book properties
    if (
      current.id !== lastSynced.id ||
      current.initialEstimated !== lastSynced.initialEstimated ||
      current.estimated !== lastSynced.estimated
    ) {
      return true
    }

    // Compare categories
    const currentCategories = current.lineCategories || []
    const lastSyncedCategories = lastSynced.lineCategories || []

    for (const currentCat of currentCategories) {
      const lastSyncedCat = lastSyncedCategories.find(c => c.id === currentCat.id)
      if (!lastSyncedCat) return true
      if (currentCat.isDeleted !== lastSyncedCat.isDeleted) return true

      if (
        !currentCat.isDeleted &&
        (currentCat.name !== lastSyncedCat.name ||
          currentCat.description !== lastSyncedCat.description ||
          currentCat.iconName !== lastSyncedCat.iconName ||
          currentCat.colorName !== lastSyncedCat.colorName)
      ) {
        return true
      }
    }

    for (const lastSyncedCat of lastSyncedCategories) {
      const currentCat = currentCategories.find(c => c.id === lastSyncedCat.id)
      if (!currentCat) return true
    }

    // Compare lines
    const currentLines = current.lines || []
    const lastSyncedLines = lastSynced.lines || []

    if (currentLines.length !== lastSyncedLines.length) return true

    for (const currentLine of currentLines) {
      const lastSyncedLine = lastSyncedLines.find(l => l.id === currentLine.id)
      if (!lastSyncedLine) return true

      if (
        currentLine.expense !== lastSyncedLine.expense ||
        currentLine.lineCategoryId !== lastSyncedLine.lineCategoryId ||
        currentLine.estimated !== lastSyncedLine.estimated ||
        currentLine.paid !== lastSyncedLine.paid ||
        currentLine.final !== lastSyncedLine.final ||
        currentLine.note !== lastSyncedLine.note ||
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

  // Handle category selection with toggle behavior
  const handleCategoryClick = useCallback(
    (categoryId: number | null) => {
      setActiveCategoryId(prev => (categoryId === prev ? null : categoryId))
    },
    []
  )

  // Calculate stats based on active category (لو calculateBudgetStats بتدعمها)
  const stats = useMemo(() => {
    if (!localDraft) return null
    return calculateBudgetStats(localDraft, activeCategoryId as any)
  }, [localDraft, activeCategoryId])

  // Filter lines based on active category and status filters
  const filteredLines = useMemo(() => {
    if (!localDraft || !stats) return []

    let lines = (localDraft.lines || []).filter(line => {
      if (activeCategoryId !== null && line.lineCategoryId !== activeCategoryId) return false
      if (filterType !== 'deleted' && line.isDeleted) return false
      return true
    })

    switch (filterType) {
      case 'done':
        lines = lines.filter(line => line.isDone)
        break
      case 'not-done':
        lines = lines.filter(line => !line.isDone)
        break
      case 'favorite':
        lines = lines.filter(line => line.isFavorite)
        break
      case 'not-favorite':
        lines = lines.filter(line => !line.isFavorite)
        break
      case 'deleted':
        lines = lines.filter(line => line.isDeleted)
        break
      case 'not-deleted':
        lines = lines.filter(line => !line.isDeleted)
        break
      default:
        break
    }

    return lines
  }, [localDraft, activeCategoryId, filterType, stats])

  // Handlers
  const handleBudgetChange = useCallback(
    (newBudget: number) => {
      if (!localDraft) return
      setLocalDraft({
        ...localDraft,
        initialEstimated: newBudget,
      })
    },
    [localDraft]
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
    (data: {
      id?: number
      expense: string
      lineCategoryId: number | null
      estimated: number
      paid: number
      final: number | null
      count: number | null
      payer: string | null
      note: string | null
      isDone: boolean
      isFavorite: boolean
      isDeleted: boolean
    }) => {
      if (!localDraft) return

      const finalCategoryId =
        data.lineCategoryId ?? (activeCategoryId !== null ? activeCategoryId : null)

      if (data.id && data.id > 0) {
        // Update existing line
        setLocalDraft({
          ...localDraft,
          lines: (localDraft.lines || []).map(line =>
            line.id === data.id
              ? ({
                  ...line,
                  expense: data.expense,
                  lineCategoryId: finalCategoryId,
                  estimated: data.estimated,
                  paid: data.paid,
                  final: data.final ?? 0,
                  dueDate: (line as any).dueDate ?? null, // ✅ حافظي على القديم أو null
                  count: data.count ?? 0,
                  payer: data.payer,
                  note: data.note,
                  isDone: data.isDone,
                  isFavorite: data.isFavorite,
                  isDeleted: data.isDeleted,
                } as BudgetLineResponse)
              : line
          ),
        })
      } else {
        // Create new line
        const newLine: BudgetLineResponse = {
          id: generateTempId(),
          bookId: localDraft.id || 0,
          expense: data.expense,
          lineCategoryId: finalCategoryId,
          estimated: data.estimated,
          paid: data.paid,
          final: data.final ?? 0,
          dueDate: null as any, // ✅ مهم جدًا: null مش ''
          count: data.count ?? 0,
          payer: data.payer || null,
          note: data.note || null,
          isDone: data.isDone,
          isFavorite: data.isFavorite,
          isDeleted: data.isDeleted,
          isModelLine: false,
          iconName: '',
          colorName: '',
          expenseAr: '',
          expenseEn: '',
          lineType: localDraft.bookType,
          bookClass: localDraft.bookClass,
          createdBy: '',
          lastModifiedBy: '',
          creationDate: new Date().toISOString(),
          lastModifiedDate: new Date().toISOString(),
          slug: '',
        } as BudgetLineResponse

        setLocalDraft({
          ...localDraft,
          lines: [...(localDraft.lines || []), newLine],
        })
      }

      setIsBudgetLineModalOpen(false)
      setEditingLine(null)
    },
    [localDraft, activeCategoryId]
  )

  const handleToggleDone = useCallback(
    (lineId: number) => {
      if (!localDraft) return
      setLocalDraft({
        ...localDraft,
        lines: (localDraft.lines || []).map(line =>
          line.id === lineId ? { ...line, isDone: !line.isDone } : line
        ),
      })
    },
    [localDraft]
  )

  const handleToggleFavorite = useCallback(
    (lineId: number) => {
      if (!localDraft) return
      setLocalDraft({
        ...localDraft,
        lines: (localDraft.lines || []).map(line =>
          line.id === lineId ? { ...line, isFavorite: !line.isFavorite } : line
        ),
      })
    },
    [localDraft]
  )

  const handleDeleteLine = useCallback((line: BudgetLineResponse) => {
    setItemToDelete({ type: 'line', item: line })
    setIsDeleteModalOpen(true)
  }, [])

  const confirmDeleteLine = useCallback(() => {
    if (!localDraft || !itemToDelete || itemToDelete.type !== 'line') return
    const line = itemToDelete.item as BudgetLineResponse
    setLocalDraft({
      ...localDraft,
      lines: (localDraft.lines || []).map(l => (l.id === line.id ? { ...l, isDeleted: true } : l)),
    })
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
    addToast(`"${line.expense}" deleted successfully`, 'success')
  }, [localDraft, itemToDelete, addToast])

  const handleCreateCategory = useCallback(() => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }, [])

  const handleSaveCategory = useCallback(
    (data: {
      id?: number
      name: string
      nameAr: string
      nameEn: string
      description: string
      estimated: number
      iconName: string | null
      colorName: string | null
    }) => {
      if (!localDraft) return

      if (data.id && data.id > 0) {
        setLocalDraft({
          ...localDraft,
          lineCategories: (localDraft.lineCategories || []).map(cat =>
            cat.id === data.id
              ? ({
                  ...cat,
                  name: data.name,
                  nameAr: data.nameAr,
                  nameEn: data.nameEn,
                  description: data.description,
                  descriptionAr: data.description || '',
                  descriptionEn: data.description || '',
                  estimated: data.estimated,
                  iconName: data.iconName || '',
                  colorName: data.colorName || '',
                } as BudgetLineCategoryResponse)
              : cat
          ),
        })
      } else {
        const newCategory: BudgetLineCategoryResponse = {
          id: generateTempId(),
          name: data.name,
          nameAr: data.nameAr,
          nameEn: data.nameEn,
          description: data.description,
          descriptionAr: data.description || '',
          descriptionEn: data.description || '',
          iconName: data.iconName || '',
          colorName: data.colorName || '',
          isModelLine: false,
          estimated: data.estimated,
          pending: 0,
          paid: 0,
          final: 0,
          count: 0,
          createdBy: '',
          lastModifiedBy: '',
          creationDate: new Date().toISOString(),
          lastModifiedDate: new Date().toISOString(),
          slug: '',
          isDeleted: false,
          eventId: undefined,
        } as BudgetLineCategoryResponse

        setLocalDraft({
          ...localDraft,
          lineCategories: [...(localDraft.lineCategories || []), newCategory],
        })
        setActiveCategoryId(newCategory.id)
      }

      setIsCategoryModalOpen(false)
      setEditingCategory(null)
    },
    [localDraft]
  )

  const handleDeleteCategory = useCallback(
    (categoryId: number) => {
      const category = localDraft?.lineCategories?.find(c => c.id === categoryId)
      if (category) {
        setItemToDelete({ type: 'category', item: category })
        setIsDeleteModalOpen(true)
      }
    },
    [localDraft]
  )

  const confirmDeleteCategory = useCallback(() => {
    if (!localDraft || !itemToDelete || itemToDelete.type !== 'category') return
    const category = itemToDelete.item as BudgetLineCategoryResponse
    const categoryId = category.id

    setLocalDraft({
      ...localDraft,
      lineCategories: (localDraft.lineCategories || []).map(c =>
        c.id === categoryId ? { ...c, isDeleted: true } : c
      ),
      lines: (localDraft.lines || []).map(line =>
        line.lineCategoryId === categoryId ? { ...line, isDeleted: true } : line
      ),
    })

    if (activeCategoryId === categoryId) setActiveCategoryId(null)

    setIsDeleteModalOpen(false)
    setItemToDelete(null)
    addToast(`Category "${category.name}" deleted successfully`, 'success')
  }, [localDraft, itemToDelete, activeCategoryId, addToast])

  // Save handler
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
      const payload = mapDraftToSyncPayload(localDraft)

      if (process.env.NODE_ENV === 'development') {
        console.log('[Budget] Sync payload:', payload)
      }

      await syncMutation.mutateAsync({
        ...payload,
        id: payload.id ?? localDraft?.id ?? 0,
        query: { eventId },
      })

      setHasUnsavedChanges(false)
      lastSyncedRef.current = localDraft
      addToast('Changes saved successfully', 'success')
      refetch()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes'
      addToast(errorMessage, 'error')
    }
  }, [localDraft, eventId, hasActualChanges, syncMutation, refetch, isLoading, addToast])

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
        <div className="flex items-center justify-center py-12">
          <LoadingOverlay open={true} title="Loading budget..." subtitle="Please wait a moment" />
        </div>
      </div>
    )
  }

  // Error state
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

  // Empty state
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
              <ArrowLeft className="h-4 w-4 text-gray-700" />
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
                const category = localDraft?.lineCategories?.find(c => c.id === categoryId)
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
              lines={filteredLines}
              categories={localDraft?.lineCategories || []}
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
            categories={localDraft.lineCategories || []}
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
