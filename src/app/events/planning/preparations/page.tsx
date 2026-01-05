'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button, LoadingSpinner } from '@/components/ui'
import { Plus, ChevronLeft, Save } from 'lucide-react'
import { CategoryCard } from '@/components/planning/CategoryCard'
import { CreateCategoryModal } from '@/components/planning/CreateCategoryModal'
import {
  useServiceBook,
  useSyncServiceBook,
  useServiceCategories,
} from '@/hooks/serviceBooks'
import { useEventId } from '@/hooks/planning'
import { useToast } from '@/components/ui/Toaster'
import type {
  ServiceBookResponse,
  ServiceLineCategoryResponse,
  ServiceLineResponse,
} from '@/types/responses'
import type {
  ServiceLineCategoryRequest,
  ServiceBookRequest,
  ServiceLineRequest,
  UserType,
  ServiceType,
  BookClass,
} from '@/../client/common/api/gen/ourbride-api'

/**
 * Extended ServiceBook type with categories for local state management
 */
interface ServiceBookWithCategories extends ServiceBookResponse {
  lineCategories?: ServiceLineCategoryResponse[] | null
}

/**
 * Convert ServiceLineCategoryResponse to ServiceLineCategoryRequest
 */
const convertCategoryToRequest = (
  category: ServiceLineCategoryResponse
): ServiceLineCategoryRequest => {
  return {
    id: category.id || null,
    name: category.name || category.nameEn || category.nameAr || null,
    description:
      category.description ||
      category.descriptionEn ||
      category.descriptionAr ||
      null,
    slug: category.slug || null,
    isDeleted: Boolean(category.isDeleted),
    isModelLine: Boolean(category.isModelLine),
    creationDate: category.creationDate || null,
    lastModifiedDate: category.lastModifiedDate || null,
  }
}

/**
 * Convert ServiceLineResponse to ServiceLineRequest
 */
const convertLineToRequest = (
  line: ServiceLineResponse,
  bookId: number
): ServiceLineRequest => {
  // Map ServiceType enum from response to request type
  // ServiceType enum values: 0 = Rent, 1 = Buy
  const serviceType = (line.serviceType === 0
    ? 0
    : line.serviceType === 1
      ? 1
      : 0) as unknown as ServiceType

  return {
    id: line.id,
    bookId: line.bookId || bookId,
    lineCategoryId: line.lineCategoryId || null,
    title: line.title || line.titleEn || line.titleAr || null,
    quantity: line.quantity || null,
    price: line.price || null,
    advanceAmount: line.advanceAmount || null,
    providerName: line.providerName || null,
    seller: line.seller || null,
    buyDate: line.buyDate || null,
    isDone: line.isDone,
    isFavorite: line.isFavorite,
    isDeleted: line.isDeleted,
    isModelLine: line.isModelLine,
    serviceType,
    iconName: line.iconName || null,
    notes: line.notes || null,
    hasReminder: line.hasReminder || false,
    reminderDate: line.reminderDate || null,
    reminderText: line.reminderText || null,
    reminderType: line.reminderType || undefined,
    colorName: line.colorName || null,
  }
}

/**
 * Build ServiceBookRequest from local state
 * Includes all categories (including deleted ones) for sync
 */
const buildBookRequestFromLocal = (
  localServiceBook: ServiceBookWithCategories
): ServiceBookRequest => {
  const allLines = (localServiceBook.lines || []).map(line =>
    convertLineToRequest(line, localServiceBook.id)
  )
  const allCategories = (localServiceBook.lineCategories || []).map(
    convertCategoryToRequest
  )

  return {
    id: localServiceBook.id,
    groomId: localServiceBook.groomId || null,
    brideId: localServiceBook.brideId || null,
    weddingPlannerId: undefined,
    bookType: localServiceBook.bookType as unknown as UserType | undefined,
    bookClass: localServiceBook.bookClass as unknown as BookClass | undefined,
    title: localServiceBook.title || null,
    clientName: null,
    weddingDate: null,
    eventLocation: null,
    lines: allLines,
    lineCategories: allCategories.length > 0 ? allCategories : null,
    lastModifiedDate: new Date().toISOString(),
  }
}

/**
 * Check if there are actual changes between current state and last synced state
 */
const hasActualChanges = (
  localServiceBook: ServiceBookWithCategories | null,
  lastSyncedRef: ServiceBookWithCategories | null
): boolean => {
  if (!localServiceBook) {
    return false
  }

  if (!lastSyncedRef) {
    return true
  }

  const current = localServiceBook
  const lastSynced = lastSyncedRef

  // Compare basic book properties
  if (
    current.id !== lastSynced.id ||
    current.groomId !== lastSynced.groomId ||
    current.brideId !== lastSynced.brideId ||
    current.title !== lastSynced.title
  ) {
    return true
  }

  // Compare categories
  const currentCategories = current.lineCategories || []
  const lastSyncedCategories = lastSynced.lineCategories || []

  if (currentCategories.length !== lastSyncedCategories.length) {
    return true
  }

  for (let i = 0; i < currentCategories.length; i++) {
    const currentCategory = currentCategories[i]
    const lastSyncedCategory = lastSyncedCategories.find(
      c => c.id === currentCategory.id
    )

    if (!lastSyncedCategory) {
      return true
    }

    if (
      currentCategory.name !== lastSyncedCategory.name ||
      currentCategory.nameEn !== lastSyncedCategory.nameEn ||
      currentCategory.nameAr !== lastSyncedCategory.nameAr ||
      currentCategory.description !== lastSyncedCategory.description ||
      currentCategory.descriptionEn !== lastSyncedCategory.descriptionEn ||
      currentCategory.descriptionAr !== lastSyncedCategory.descriptionAr ||
      currentCategory.slug !== lastSyncedCategory.slug ||
      currentCategory.isDeleted !== lastSyncedCategory.isDeleted
    ) {
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

    if (!lastSyncedLine) {
      return true
    }

    if (
      currentLine.title !== lastSyncedLine.title ||
      currentLine.titleEn !== lastSyncedLine.titleEn ||
      currentLine.titleAr !== lastSyncedLine.titleAr ||
      currentLine.isDeleted !== lastSyncedLine.isDeleted ||
      currentLine.isDone !== lastSyncedLine.isDone ||
      currentLine.isFavorite !== lastSyncedLine.isFavorite
    ) {
      return true
    }
  }

  return false
}

export default function PreparationsCategoriesPage() {
  const router = useRouter()
  const eventId = useEventId()
  const { addToast } = useToast()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Local state to keep the book in memory
  const [localServiceBook, setLocalServiceBook] =
    useState<ServiceBookWithCategories | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSyncedRef = useRef<ServiceBookWithCategories | null>(null)
  const isInitialLoadRef = useRef(true)

  // Fetch service book (includes lines) - GET endpoint only
  const {
    data: serviceBook,
    isLoading,
    refetch,
  } = useServiceBook({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: typeof window !== 'undefined',
  })

  const syncMutation = useSyncServiceBook()

  // Fetch categories separately (ServiceBook doesn't include lineCategories in response)
  const { data: categories, refetch: refetchCategories } = useServiceCategories(
    {
      enabled: typeof window !== 'undefined',
    }
  )

  // On first load, use the book from GET endpoint and merge categories
  useEffect(() => {
    if (isInitialLoadRef.current && serviceBook && !localServiceBook) {
      const initialBook: ServiceBookWithCategories = {
        ...serviceBook,
        lineCategories: categories || [],
      }
      setLocalServiceBook(initialBook)
      lastSyncedRef.current = initialBook
      isInitialLoadRef.current = false
    }
  }, [serviceBook, categories, localServiceBook])

  // Sync fetched data to local state when it changes (only if no unsaved changes)
  useEffect(() => {
    if (
      serviceBook &&
      categories &&
      !hasUnsavedChanges &&
      !isInitialLoadRef.current
    ) {
      const updatedBook: ServiceBookWithCategories = {
        ...serviceBook,
        lineCategories: categories, // Use fetched categories
      }
      setLocalServiceBook(updatedBook)
      lastSyncedRef.current = updatedBook
    } else if (serviceBook === null && !isLoading && !hasUnsavedChanges) {
      setLocalServiceBook(null)
    }
  }, [serviceBook, categories, hasUnsavedChanges, isLoading, refetchCategories])

  // After sync, update local state from refetched data
  useEffect(() => {
    if (
      serviceBook &&
      categories &&
      !hasUnsavedChanges &&
      syncMutation.isSuccess
    ) {
      const updatedBook: ServiceBookWithCategories = {
        ...serviceBook,
        lineCategories: categories,
      }
      setLocalServiceBook(updatedBook)
      lastSyncedRef.current = updatedBook
      isInitialLoadRef.current = false
    }
  }, [serviceBook, categories, hasUnsavedChanges, syncMutation.isSuccess])

  // Auto-sync every 2 minutes (only if there are actual changes)
  useEffect(() => {
    if (!eventId || !localServiceBook || hasUnsavedChanges) return

    const interval = setInterval(
      async () => {
        try {
          if (!hasActualChanges(localServiceBook, lastSyncedRef.current)) {
            return
          }

          const bookRequest = buildBookRequestFromLocal(localServiceBook)
          await syncMutation.mutateAsync({
            data: bookRequest,
            query: {
              eventId: eventId || undefined,
              userType: null as unknown as UserType | undefined,
              clientId: null as unknown as string | undefined,
            },
          })
          lastSyncedRef.current = localServiceBook
          refetch()
          refetchCategories()
        } catch {
          // Auto-sync failed silently
        }
      },
      2 * 60 * 1000
    ) // 2 minutes

    return () => clearInterval(interval)
  }, [
    eventId,
    localServiceBook,
    hasUnsavedChanges,
    syncMutation,
    refetch,
    refetchCategories,
  ])

  // Get active categories (not deleted) for display
  const activeCategories = useMemo(() => {
    if (!localServiceBook?.lineCategories) return []
    return localServiceBook.lineCategories.filter(cat => !cat.isDeleted)
  }, [localServiceBook])

  // Calculate counts for each category
  const categoriesWithCounts = useMemo(() => {
    return activeCategories.map(category => {
      // Count lines in this category
      const categoryLines = (localServiceBook?.lines || []).filter(
        line => line.lineCategoryId === category.id && !line.isDeleted
      )
      const completedCount = categoryLines.filter(line => line.isDone).length

      return {
        ...category,
        lineCount: categoryLines.length,
        completedCount,
      }
    })
  }, [activeCategories, localServiceBook?.lines])

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/events/planning/preparations/${categoryId}`)
  }

  const handlePinnedCategoryClick = () => {
    router.push('/events/planning/preparations/1')
  }

  const handleCreateClick = () => {
    setIsCreateModalOpen(true)
  }

  const handleModalClose = () => {
    setIsCreateModalOpen(false)
  }

  const handleCreateCategory = async (data: {
    name: string
    description?: string
  }) => {
    if (!localServiceBook) {
      addToast('Service book not found. Please refresh the page.', 'error')
      return
    }

    // Create new category locally
    const newCategory: ServiceLineCategoryResponse = {
      id: 0, // Temporary ID, will be assigned by backend on sync
      name: data.name,
      nameEn: data.name,
      nameAr: '',
      description: data.description || '',
      descriptionEn: data.description || '',
      descriptionAr: '',
      slug: '',
      isDeleted: false,
      isModelLine: false,
      creationDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      createdBy: '',
      lastModifiedBy: '',
    }

    // Add to local state
    setLocalServiceBook(prev => {
      if (!prev) return prev
      return {
        ...prev,
        lineCategories: [...(prev.lineCategories || []), newCategory],
      }
    })

    setHasUnsavedChanges(true)
    setIsCreateModalOpen(false)
    addToast('Category added. Click Save to persist changes.', 'info')
  }

  const handleSync = async () => {
    if (!localServiceBook) {
      if (isLoading) {
        addToast('Please wait while the service book is loading...', 'info')
        return
      }
      addToast('Service book not found. Please refresh the page.', 'error')
      return
    }

    if (!hasActualChanges(localServiceBook, lastSyncedRef.current)) {
      addToast('No changes to save', 'info')
      setHasUnsavedChanges(false)
      return
    }

    try {
      const bookRequest = buildBookRequestFromLocal(localServiceBook)
      await syncMutation.mutateAsync({
        data: bookRequest,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })

      setHasUnsavedChanges(false)
      lastSyncedRef.current = localServiceBook
      addToast('Changes saved successfully', 'success')

      // Refetch to get latest from server
      refetch()
      refetchCategories()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save changes'
      addToast(errorMessage, 'error')
    }
  }

  const handleBack = () => {
    router.push('/dashboard/my-events')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            aria-label="Back to My Events"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-24 font-semibold text-gray-900">Preparations</h1>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Button
              onClick={handleSync}
              variant="brand"
              size="md"
              className="text-white"
              disabled={
                syncMutation.isPending || !localServiceBook || isLoading
              }
            >
              <Save className="w-5 h-5 mr-2" />
              {syncMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
          <Button
            onClick={handleCreateClick}
            variant="brand"
            size="md"
            className="text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add new Category
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading categories..." />
        </div>
      )}

      {/* Categories List */}
      {!isLoading && (
        <div className="space-y-4">
          {/* Pinned Default Card - Always First */}
          <CategoryCard
            category={
              {
                id: 1,
                name: 'Default Preparations',
                nameEn: 'Default Preparations',
                nameAr: '',
                description: 'Tap to view preparations list',
                descriptionEn: 'Tap to view preparations list',
                descriptionAr: '',
                slug: '',
                isDeleted: false,
                isModelLine: false,
                creationDate: new Date().toISOString(),
                lastModifiedDate: new Date().toISOString(),
                createdBy: '',
                lastModifiedBy: '',
                lineCount: 0,
                completedCount: 0,
              } as ServiceLineCategoryResponse & {
                lineCount: number
                completedCount: number
              }
            }
            onClick={handlePinnedCategoryClick}
            variant="pinned"
          />

          {/* Empty State */}
          {categoriesWithCounts.length === 0 && (
            <div className="bg-white border rounded-2xl p-12 text-center">
              <p className="text-16 text-gray-500 mb-4">No categories yet</p>
              <p className="text-14 text-gray-400">
                Create your first category to get started
              </p>
            </div>
          )}

          {/* Category Cards */}
          {categoriesWithCounts.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category.id!)}
            />
          ))}
        </div>
      )}

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreateCategory}
        isLoading={false} // No API call, just local state update
      />
    </div>
  )
}
