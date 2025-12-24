'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BudgetFiltersBar, type FilterType } from './components/filters/BudgetFiltersBar'
import { BudgetOverviewCard } from './components/BudgetOverviewCard'
import { BudgetCategoryBreakdownList } from './components/BudgetCategoryBreakdownList'
import { BudgetLinesTable } from './components/BudgetLinesTable'
import { InitBudgetBookModal } from './modals/InitBudgetBookModal'
import { BudgetLineModal } from './modals/BudgetLineModal'
import { CategoryModal } from './modals/CategoryModal'
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal'
import {
  createMockBudgetBook,
  calculateBudgetStats,
  type MockBudgetBook,
  type MockBudgetLine,
  type MockBudgetLineCategory,
} from './state/mockBudgetData'

export default function BudgetPage() {
  const router = useRouter()

  // State
  const [hasBudgetBook, setHasBudgetBook] = useState(false) // Mock flag for first-time setup
  const [budgetBook, setBudgetBook] = useState<MockBudgetBook | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Active category state (null = "All")
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)

  // Modal states
  const [isInitModalOpen, setIsInitModalOpen] = useState(false)
  const [isBudgetLineModalOpen, setIsBudgetLineModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Editing states
  const [editingLine, setEditingLine] = useState<MockBudgetLine | null>(null)
  const [editingCategory, setEditingCategory] =
    useState<MockBudgetLineCategory | null>(null)
  const [deletingItem, setDeletingItem] = useState<
    | { type: 'line'; item: MockBudgetLine }
    | { type: 'category'; item: MockBudgetLineCategory }
    | null
  >(null)

  // Filter states
  const [filterType, setFilterType] = useState<FilterType>('all')

  // Initialize with mock data (simulating API call)
  useEffect(() => {
    if (!hasBudgetBook && !budgetBook) {
      // Show init modal on first load
      setIsInitModalOpen(true)
      return
    }

    if (!budgetBook && hasBudgetBook) {
      setIsLoading(true)
      // Simulate API delay
      setTimeout(() => {
        const mockBook = createMockBudgetBook()
        setBudgetBook(mockBook)
        setIsLoading(false)
      }, 500)
    }
  }, [hasBudgetBook, budgetBook])

  // Calculate stats based on active category
  const stats = useMemo(() => {
    if (!budgetBook) return null
    return calculateBudgetStats(budgetBook, activeCategoryId)
  }, [budgetBook, activeCategoryId])

  // Filter lines based on active category, search, and status filters
  const filteredLines = useMemo(() => {
    if (!budgetBook || !stats) return []

    // Start with lines filtered by active category (already done in stats calculation)
    // But we need to apply search and status filters here
    let lines = budgetBook.lines.filter(line => {
      // Filter by active category
      if (activeCategoryId !== null) {
        if (line.lineCategoryId !== activeCategoryId) return false
      }
      // Exclude deleted lines (unless filterType is 'deleted')
      if (filterType !== 'deleted' && line.isDeleted) return false
      return true
    })

    // Apply status filter
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
        // 'all' - no additional filter
        break
    }

    return lines
  }, [budgetBook, activeCategoryId, filterType, stats])

  // Handlers
  const handleInitBudgetBook = (data: {
    title: string
    clientName: string
    weddingDate: string
    eventLocation: string
    initialEstimated: number
  }) => {
    // Create new budget book with provided data
    const newBook = createMockBudgetBook()
    newBook.title = data.title
    newBook.clientName = data.clientName
    newBook.weddingDate = data.weddingDate
    newBook.eventLocation = data.eventLocation
    newBook.initialEstimated = data.initialEstimated
    setBudgetBook(newBook)
    setHasBudgetBook(true)
    setIsInitModalOpen(false)
  }

  const handleBudgetChange = (newBudget: number) => {
    if (!budgetBook) return
    setBudgetBook({ ...budgetBook, initialEstimated: newBudget })
  }

  const handleCreateLine = () => {
    setEditingLine(null)
    setIsBudgetLineModalOpen(true)
  }

  const handleEditLine = (line: MockBudgetLine) => {
    setEditingLine(line)
    setIsBudgetLineModalOpen(true)
  }

  const handleSaveLine = (data: {
    id?: number
    expense: string
    lineCategoryId: number | null
    estimated: number
    paid: number
    final: number | null
    dueDate: string | null
    count: number | null
    payer: string | null
    note: string | null
    isDone: boolean
    isFavorite: boolean
    isDeleted: boolean
  }) => {
    if (!budgetBook) return

    // If no category selected and active category exists, use active category
    const finalCategoryId =
      data.lineCategoryId ?? (activeCategoryId !== null ? activeCategoryId : null)

    if (data.id) {
      // Update existing line
      setBudgetBook({
        ...budgetBook,
        lines: budgetBook.lines.map(line =>
          line.id === data.id
            ? {
                ...line,
                ...data,
                lineCategoryId: finalCategoryId,
              }
            : line
        ),
      })
    } else {
      // Create new line
      const newLine: MockBudgetLine = {
        id: Date.now(),
        expense: data.expense,
        lineCategoryId: finalCategoryId,
        estimated: data.estimated,
        paid: data.paid,
        final: data.final,
        dueDate: data.dueDate,
        count: data.count,
        payer: data.payer,
        note: data.note,
        isDone: data.isDone,
        isFavorite: data.isFavorite,
        isDeleted: data.isDeleted,
        iconName: null,
        colorName: null,
      }
      setBudgetBook({
        ...budgetBook,
        lines: [...budgetBook.lines, newLine],
      })
    }
    setIsBudgetLineModalOpen(false)
    setEditingLine(null)
  }

  const handleToggleDone = (lineId: number) => {
    if (!budgetBook) return
    setBudgetBook({
      ...budgetBook,
      lines: budgetBook.lines.map(line =>
        line.id === lineId ? { ...line, isDone: !line.isDone } : line
      ),
    })
  }

  const handleToggleFavorite = (lineId: number) => {
    if (!budgetBook) return
    setBudgetBook({
      ...budgetBook,
      lines: budgetBook.lines.map(line =>
        line.id === lineId ? { ...line, isFavorite: !line.isFavorite } : line
      ),
    })
  }

  const handleDeleteLine = (line: MockBudgetLine) => {
    setDeletingItem({ type: 'line', item: line })
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!budgetBook || !deletingItem) return

    if (deletingItem.type === 'line') {
      setBudgetBook({
        ...budgetBook,
        lines: budgetBook.lines.filter(
          line => line.id !== deletingItem.item.id
        ),
      })
    } else if (deletingItem.type === 'category') {
      setBudgetBook({
        ...budgetBook,
        lineCategories: budgetBook.lineCategories.filter(
          cat => cat.id !== deletingItem.item.id
        ),
      })
    }

    setIsDeleteModalOpen(false)
    setDeletingItem(null)
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleSaveCategory = (data: {
    id?: number
    name: string
    description: string | null
    iconName: string | null
    colorName: string | null
  }) => {
    if (!budgetBook) return

    if (data.id) {
      // Update existing category
      setBudgetBook({
        ...budgetBook,
        lineCategories: budgetBook.lineCategories.map(cat =>
          cat.id === data.id
            ? {
                ...cat,
                ...data,
              }
            : cat
        ),
      })
    } else {
      // Create new category
      const newCategory: MockBudgetLineCategory = {
        id: Date.now(),
        name: data.name,
        description: data.description,
        iconName: data.iconName,
        colorName: data.colorName,
      }
      setBudgetBook({
        ...budgetBook,
        lineCategories: [...budgetBook.lineCategories, newCategory],
      })
    }
    setIsCategoryModalOpen(false)
    setEditingCategory(null)
  }


  // Show init modal if no budget book exists
  if (!hasBudgetBook) {
    return (
      <>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-24 sm:text-28 font-semibold text-gray-900">
              Budget
            </h1>
          </div>
        </div>
        <InitBudgetBookModal
          isOpen={isInitModalOpen}
          onClose={() => {}}
          onCreate={handleInitBudgetBook}
        />
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
        <div className="text-center py-12">
          <p className="text-16 text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20 sm:pb-24">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 text-gray-700" />
            </button>
            <h1 className="text-20 font-semibold text-gray-900">
              Budget
            </h1>
          </div>

          {/* Filter Dropdown - Far Right */}
          {budgetBook && (
            <BudgetFiltersBar
              filterType={filterType}
              onFilterChange={setFilterType}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      ) : stats ? (
        <div className="flex flex-col space-y-4">
          {/* Top Section: Overview Card + Category List - responsive ratio */}
          <div className="grid grid-cols-1 md:grid-cols-[55%_45%]  gap-4">
            {/* Budget Overview Card */}
            <BudgetOverviewCard
              totalBudget={stats.totalBudget}
              totalPaid={stats.totalPaid}
              remaining={stats.remaining}
              savedPercentage={stats.savedPercentage}
              categoryStats={stats.categoryStats}
              onBudgetChange={handleBudgetChange}
            />

            {/* Category Breakdown List */}
            <BudgetCategoryBreakdownList
              categoryStats={stats.categoryStats}
              activeCategoryId={activeCategoryId}
              onCategoryClick={setActiveCategoryId}
              onEditCategory={(categoryId) => {
                const category = budgetBook?.lineCategories.find(c => c.id === categoryId)
                if (category) {
                  setEditingCategory(category)
                  setIsCategoryModalOpen(true)
                }
              }}
              onDeleteCategory={(categoryId) => {
                const category = budgetBook?.lineCategories.find(c => c.id === categoryId)
                if (category) {
                  setDeletingItem({ type: 'category', item: category })
                  setIsDeleteModalOpen(true)
                }
              }}
              onCreateCategory={handleCreateCategory}
              totalBudget={stats.totalBudget}
              totalEstimated={stats.totalEstimated}
            />
          </div>

          {/* Budget Lines Table - Last on mobile */}
          <div className="order-last sm:order-none">
            <BudgetLinesTable
              lines={filteredLines}
              categories={budgetBook?.lineCategories || []}
              totalBudget={stats.totalBudget}
              onToggleDone={handleToggleDone}
              onToggleFavorite={handleToggleFavorite}
              onEdit={handleEditLine}
              onDelete={handleDeleteLine}
              onCreateLine={handleCreateLine}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-16">No budget data available</p>
        </div>
      )}

      {/* Modals */}
      <InitBudgetBookModal
        isOpen={isInitModalOpen}
        onClose={() => {}}
        onCreate={handleInitBudgetBook}
      />

      {budgetBook && (
        <>
          <BudgetLineModal
            isOpen={isBudgetLineModalOpen}
            onClose={() => {
              setIsBudgetLineModalOpen(false)
              setEditingLine(null)
            }}
            onSave={handleSaveLine}
            editingLine={editingLine}
            categories={budgetBook.lineCategories}
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
              setDeletingItem(null)
            }}
            onConfirm={handleConfirmDelete}
            title="Confirm Delete"
            message="Are you sure you want to delete this item? This action cannot be undone."
            itemName={
              deletingItem?.type === 'line'
                ? deletingItem.item.expense || undefined
                : deletingItem?.type === 'category'
                  ? deletingItem.item.name || undefined
                  : undefined
            }
          />
        </>
      )}
    </div>
  )
}
