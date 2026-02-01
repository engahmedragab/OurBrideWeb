'use client'

import React, { useMemo, useState, useCallback, Suspense } from 'react'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { Button, LoadingOverlay, LoadingSpinner } from '@/components/ui'
import { Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { ItemListsSidebar } from '@/components/planning/items/ItemListsSidebar'
import { ItemLinesPanel } from '@/components/planning/items/ItemLinesPanel'
import type { ItemFormData } from '@/components/planning/items/ItemLinesPanel'
import { CreateItemListModal } from '@/components/planning/items/CreateItemListModal'
import type { ColorKey } from '@/components/planning/items/CreateItemListModal'
import { useItemBook, useSyncItemBook, useSyncItemBookDelta } from '@/hooks/itemBooks'
import { useEventId } from '@/hooks/planning'
import { usePlanningBookController } from '@/hooks/planning/usePlanningBookController'
import { useInitItemBooks, useAddItemBookModels } from '@/hooks/bookInit'
import type { ItemLineResponse, ItemBookResponse, ItemLineCategoryResponse } from '@/types/responses'
import type { ItemBookRequest, UserType, BookClass } from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaResponse } from '@/hooks/planning/usePlanningBookController'
import { generateTempId } from '@/utils/sync/tempIds'
import {
  type UiItem,
  type UiCategory,
  convertLineToUiItem,
  convertUiItemToLineRequest,
  convertCategoryToUi,
  buildBookRequestFromLocal as buildItemBookRequest,
  convertLineToRequest,
  convertCategoryToRequest,
} from '@/utils/planning/mappers/itemsMappers'
import { useI18nTranslations, useIsRTL } from '@/i18n'

function ItemsPageContent() {
  const eventId = useEventId()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [createListOpen, setCreateListOpen] = useState(false)
  const t = useI18nTranslations('items')
  const isRtl =  useIsRTL()


  // Fetch item book (includes lines and categories) - GET endpoint only
  const { data: itemBook, isLoading, error, refetch } = useItemBook({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: typeof window !== 'undefined',
  })
   console.log({itemBook})
  const syncMutation = useSyncItemBook()
  const syncDeltaMutation = useSyncItemBookDelta()
  const initMutation = useInitItemBooks()
  const addModelsMutation = useAddItemBookModels()
  const {
    localBook: localItemBook,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    save,
    applyLocalUpdate,
    getActiveCategories,
    getCategoryById,
    getLinesByCategory,
    isInitializing,
    isAddingModels,
  } = usePlanningBookController<ItemBookResponse, ItemLineResponse, ItemLineCategoryResponse>({
    book: itemBook ?? null,
    isLoading,
    eventId: eventId ?? undefined,
    requireEventId: true,
    syncFn: async () => {
      if (!localItemBook) throw new Error(t('errors.ItemBookNotFound'))
      const bookRequest = buildItemBookRequest(localItemBook)
      await syncMutation.mutateAsync({
        data: bookRequest,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })
    },
    syncDeltaFn: async (delta) => {
      const response = await syncDeltaMutation.mutateAsync({
        data: delta as unknown as import('@/types/syncDelta').SyncBookDeltaRequest<import('@/../client/common/api/gen/ourbride-api').ItemLineRequest, import('@/../client/common/api/gen/ourbride-api').ItemLineCategoryRequest>,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })
      return response as unknown as SyncBookDeltaResponse<ItemBookResponse>
    },
    refetch,
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
    onFirstLoad: (book) => {
      if (book.lineCategories && book.lineCategories.length > 0) {
        setSelectedCategoryId(book.lineCategories[0].id)
      }
    },
    onHydrate: (book) => {
      if (selectedCategoryId && book.lineCategories) {
        const categoryExists = book.lineCategories.some(cat => cat.id === selectedCategoryId)
        if (!categoryExists && book.lineCategories.length > 0) {
          setSelectedCategoryId(book.lineCategories[0].id)
        }
      }
    },
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
      current.name === last.name &&
      current.description === last.description &&
      current.quantity === last.quantity &&
      current.totalPrice === last.totalPrice &&
      current.providerName === last.providerName &&
      current.buyDate === last.buyDate &&
      current.lineCategoryId === last.lineCategoryId &&
      current.isDeleted === last.isDeleted &&
      current.isDone === last.isDone,
    isSameCategory: (current, last) =>
      current.name === last.name &&
      current.colorName === last.colorName &&
      current.isDeleted === last.isDeleted,
    getLineCategoryId: (line) => line.lineCategoryId ?? null,
    isLineDeleted: (line) => line.isDeleted ?? false,
    isLineDone: (line) => line.isDone ?? false,
    isCategoryDeleted: (cat) => cat.isDeleted ?? false,
  })

  const updateItemBook = useCallback(
    (updater: (current: ItemBookResponse) => ItemBookResponse) => {
      applyLocalUpdate((current) => updater(current))
    },
    [applyLocalUpdate]
  )

  // Get categories from controller
  const categories: UiCategory[] = useMemo(() => {
    return getActiveCategories().map(convertCategoryToUi)
  }, [getActiveCategories])

  // Build category name map from controller
  const categoryNameMap = useMemo(() => {
    const map = new Map<number, string>()
    getActiveCategories().forEach((cat) => {
      const category = cat as ItemLineCategoryResponse
      const id = category.id
      const name = category.name || category.nameEn || category.nameAr || ''
      if (id) map.set(id, name)
    })
    return map
  }, [getActiveCategories])

  // Get items using controller helpers
  const items: UiItem[] = useMemo(() => {
    if (!localItemBook) return []

    // Use controller helper to get lines by category, or all active lines if no category selected
    let lines: ItemLineResponse[]
    if (selectedCategoryId !== null) {
      lines = getLinesByCategory(selectedCategoryId) as ItemLineResponse[]
    } else {
      // Get all active lines (not deleted) when no category is selected
      lines = (localItemBook.lines || []).filter(
        (line: ItemLineResponse) => !line.isDeleted
      )
    }

    return lines.map((line: ItemLineResponse) => {
      const categoryName = categoryNameMap.get(line.lineCategoryId || 0) || t('uncategorized')
      return convertLineToUiItem(line, categoryName)
    })
  }, [localItemBook, selectedCategoryId, getLinesByCategory, categoryNameMap])

  // Get selected category using controller helper
  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null
    const category = getCategoryById(selectedCategoryId)
    return category ? convertCategoryToUi(category as ItemLineCategoryResponse) : null
  }, [selectedCategoryId, getCategoryById])

  // Get visible items using controller helper
  const visibleItems = useMemo(() => {
    if (!selectedCategoryId) return []
    const categoryLines = getLinesByCategory(selectedCategoryId)
    return categoryLines.map((line: ItemLineResponse) => {
      const categoryName = categoryNameMap.get(line.lineCategoryId || 0) || t('uncategorized')
      return convertLineToUiItem(line, categoryName)
    })
  }, [selectedCategoryId, getLinesByCategory, categoryNameMap])
 console.log({visibleItems})
  const stats = useMemo(() => {
    const total = visibleItems.length
    const completed = visibleItems.filter((i) => i.isDone).length
    const remaining = total - completed
    return { total, completed, remaining }
  }, [visibleItems])



  const handleToggleDone = (itemId: number) => {
    updateItemBook((prev: ItemBookResponse) => ({
      ...prev,
      lines:
        prev.lines?.map((line: ItemLineResponse) =>
          line.id === itemId
            ? { ...line, isDone: !line.isDone, lastModifiedDate: new Date().toISOString() }
            : line
        ) || [],
    }))
  }

  const handleDeleteItem = (itemId: number) => {
    updateItemBook((prev: ItemBookResponse) => ({
      ...prev,
      lines:
        prev.lines?.map((line: ItemLineResponse) =>
          line.id === itemId
            ? { ...line, isDeleted: true, lastModifiedDate: new Date().toISOString() }
            : line
        ) || [],
    }))
  }

  const handleAddNewLine = async (data: ItemFormData) => {
    if (!selectedCategory) return

    const result = applyLocalUpdate((current) => {
      const now = new Date().toISOString()
      const d = current as ItemBookResponse
      const newLine: ItemLineResponse = {
        id: generateTempId(), // Temporary ID for new lines
        bookId: d.id,
        name: data.name,
        nameAr: data.name,
        nameEn: data.name,
        description: data.description || '',
        descriptionAr: data.description || '',
        descriptionEn: data.description || '',
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        providerName: data.providerName || '',
        buyDate: data.buyDate,
        lineCategoryId: selectedCategory.id,
        isDone: data.isDone || false,
        isFavorite: false,
        isDeleted: false,
        isModelLine: false,
        brideId: null,
        groomId: null,
        iconName: '',
        colorName: '',
        creationDate: now,
        lastModifiedDate: now,
        // Required fields from LineResponse
        bookClass: d.bookClass,
        lineType: d.bookType as unknown as UserType,
        createdBy: '',
        lastModifiedBy: '',
        slug: '',
        hasReminder: false,
        reminderText: '',
        seller: '',
        notes: '',
        providerAddress: '',
        providerLink: '',
        hasProvider: false,
        budget: false,
        itemId: 0,
        categoryId: 0,
        subCategoryId: 0,
      } as unknown as ItemLineResponse

      return {
        ...d,
        lines: [...(d.lines || []), newLine],
      }
    })
    if (!result.ok) return
  }

  const handleEditItem = async (itemId: number, data: ItemFormData) => {
    updateItemBook((prev: ItemBookResponse) => ({
      ...prev,
      lines:
        prev.lines?.map((line: ItemLineResponse) => {
          if (line.id !== itemId) return line
          return {
            ...line,
            name: data.name,
            nameAr: data.name,
            nameEn: data.name,
            description: data.description || '',
            descriptionAr: data.description || '',
            descriptionEn: data.description || '',
            quantity: data.quantity,
            totalPrice: data.totalPrice,
            providerName: data.providerName || '',
            buyDate: data.buyDate,
            isDone: data.isDone || false,
            lastModifiedDate: new Date().toISOString(),
          }
        }) || [],
    }))
  }

  const handleAddNewList = () => {
    setCreateListOpen(true)
  }

  const handleCreateList = async (data: { name: string; color: ColorKey }) => {
    const result = applyLocalUpdate((current) => {
      const now = new Date().toISOString()
      const d = current as ItemBookResponse
      const tempCategoryId = generateTempId()
      const newCategory: ItemLineCategoryResponse = {
        id: tempCategoryId, // Temporary ID
        name: data.name,
        nameAr: data.name,
        nameEn: data.name,
        description: null,
        descriptionAr: null,
        descriptionEn: null,
        iconName: '',
        colorName: data.color,
        isDeleted: false,
        isModelLine: false,
        isSubDone: false,
        creationDate: now,
        lastModifiedDate: now,
        // Required fields
        bookClass: d.bookClass,
        createdBy: '',
        lastModifiedBy: '',
        slug: '',
      } as unknown as ItemLineCategoryResponse

      // Set the new category as selected
      setSelectedCategoryId(tempCategoryId)

      return {
        ...d,
        lineCategories: [...(d.lineCategories || []), newCategory],
      }
    })
    if (!result.ok) return
    setCreateListOpen(false)
  }

  const handleDeleteList = (categoryId: number) => {
    updateItemBook((prev: ItemBookResponse) => ({
      ...prev,
      lineCategories:
        prev.lineCategories?.map((cat: ItemLineCategoryResponse) =>
          cat.id === categoryId
            ? { ...cat, isDeleted: true, lastModifiedDate: new Date().toISOString() }
            : cat
        ) || [],
    }))

    // If deleted category was selected, select first available using controller helper
    if (selectedCategoryId === categoryId) {
      const activeCategories = getActiveCategories()
      const remainingCategories = activeCategories.filter(
        (cat) => (cat as ItemLineCategoryResponse).id !== categoryId
      )
      if (remainingCategories.length > 0) {
        setSelectedCategoryId((remainingCategories[0] as ItemLineCategoryResponse).id)
      } else {
        setSelectedCategoryId(null)
      }
    }
  }

  const handleSync = async () => {
    const result = await save()
    if (!result.ok) {
      if (result.reason === 'loading' || result.reason === 'no-changes') {
        if (result.reason === 'no-changes') setHasUnsavedChanges(false)
        return
      }
      console.error(result.message || 'Failed to save changes')
      return
    }
  }

  if (isLoading || isInitializing || isAddingModels) {
    const loadingTitle = isInitializing
      ? t('loading.initializingBook')
      : isAddingModels
        ? t('loading.addingModels')
        : t('loading.items')


    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text={loadingTitle} fullScreen={true} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ErrorModal
          open={true}
          title={t('errors.loadTitle')}
          message={t('errors.loadMessage')}
          onRetry={() => window.location.reload()}
          onClose={() => { }}
        />
      </div>
    )
  }

  if (!localItemBook) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-16 text-gray-500">{t('errors.noBook')}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard/my-events"
            className="inline-flex h-9 w-9 items-center justify-center"
            aria-label="Back to My Events"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">{t('title')}</h1>
        </div>

        {(hasUnsavedChanges || syncMutation.isPending) && (
          <div className="flex items-center gap-3">
            <Button
              variant="brand"
              size="md"
              onClick={handleSync}
              disabled={syncMutation.isPending || !localItemBook || isLoading}
              className="flex items-center gap-2 rounded-xl !text-white"
              type="button"
            >
              <Save className="h-4 w-4" />
              {syncMutation.isPending ? t('actions.saving') : t('actions.save')}
            </Button>

            {hasUnsavedChanges && (
              <span className="text-16 text-brand-500 font-medium">{t('actions.unsavedChanges')}</span>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ItemLinesPanel
          categoryName={ isRtl ? (selectedCategory?.nameAr || t('lists.untitled')) : (selectedCategory?.nameEn || t('lists.untitled'))}
          stats={stats}
          items={visibleItems}
          onToggleDone={handleToggleDone}
          onDeleteItem={handleDeleteItem}
          onAddNewLine={handleAddNewLine}
          onEditItem={handleEditItem}
        />

        <ItemListsSidebar
          title={t('lists.yourLists')}
          actionLabel={t('actions.addNew')}
          onAction={handleAddNewList}
          categories={categories}
          selectedCategoryId={selectedCategoryId || 0}
          onSelectCategory={setSelectedCategoryId}
          onDeleteCategory={handleDeleteList}
        />
      </div>

      <CreateItemListModal
        open={createListOpen}
        onClose={() => setCreateListOpen(false)}
        onSubmit={handleCreateList}
      />
    </div>
  )
}

export default function ItemsPage() {
  const t = useI18nTranslations('items')
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" text={t('loading.items')} fullScreen={true} />
          </div>
        </div>
      }
    >
      <ItemsPageContent />
    </Suspense>
  )
}
