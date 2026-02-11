'use client'

import React, { useMemo, useState, useCallback, Suspense } from 'react'
import { Link } from '@/i18n/navigation'
import { ChevronLeft, Save } from 'lucide-react'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { Button, LoadingSpinner,   } from '@/components/ui'
import { TodoLinesPanel } from '@/components/planning/todo/TodoLinesPanel'
import { TodoListsSidebar } from '@/components/planning/todo/TodoListsSidebar'
import { CreateItemListModal } from '@/components/planning/items/CreateItemListModal'
import type { ColorKey } from '@/components/planning/items/CreateItemListModal'
import { useTodoBook, useSyncTodoBook, useSyncTodoBookDelta } from '@/hooks/todoBooks'
import { useEventId } from '@/hooks/planning'
import { usePlanningBookController } from '@/hooks/planning/usePlanningBookController'
import { useInitTodoBooks, useAddTodoBookModels } from '@/hooks/bookInit'
import type { TodoLineResponse, TodoBookResponse, TodoLineCategoryResponse } from '@/types/responses'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaResponse } from '@/hooks/planning/usePlanningBookController'
import { generateTempId } from '@/utils/sync/tempIds'
import {
  type UiTodoCategory,
  convertLineToUiTodo,
  convertCategoryToUi,
  buildBookRequestFromLocal as buildTodoBookRequest,
  convertLineToRequest,
  convertCategoryToRequest,
} from '@/utils/planning/mappers/todoMappers'
import { useIsRTL, useI18nTranslations } from '@/i18n'
import { cn } from '@/lib'

function TodoPageContent() {
  const eventId = useEventId()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [createListOpen, setCreateListOpen] = useState(false)
  const isRtl = useIsRTL()
  const t = useI18nTranslations('eventsPlanning.sideMenu.tabs')
  const tTodo = useI18nTranslations('eventsPlanning.todo')

  // Fetch todo book (includes lines and categories) - GET endpoint only
  const { data: todoBook, isLoading, error, refetch } = useTodoBook({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: typeof window !== 'undefined',
  })

  const syncMutation = useSyncTodoBook()
  const syncDeltaMutation = useSyncTodoBookDelta()
  const initMutation = useInitTodoBooks()
  const addModelsMutation = useAddTodoBookModels()
  const {
    localBook: localTodoBook,
    hasUnsavedChanges,
    save,
    applyLocalUpdate,
    getCategoriesWithCounts,
    getCategoryById,
    getLinesByCategory,
    isInitializing,
    isAddingModels,
  } = usePlanningBookController<TodoBookResponse, TodoLineResponse, TodoLineCategoryResponse>({
    book: todoBook ?? null,
    isLoading,
    eventId: eventId ?? undefined,
    requireEventId: true,
    syncFn: async () => {
      if (!localTodoBook) throw new Error('Todo book not found')
      const bookRequest = buildTodoBookRequest(localTodoBook)
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
        data: delta as unknown as import('@/types/syncDelta').SyncBookDeltaRequest<import('@/../client/common/api/gen/ourbride-api').TodoLineRequest, import('@/../client/common/api/gen/ourbride-api').TodoLineCategoryRequest>,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })
      return response as unknown as SyncBookDeltaResponse<TodoBookResponse>
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
      current.task === last.task &&
      current.isDeleted === last.isDeleted &&
      current.isDone === last.isDone &&
      current.lineCategoryId === last.lineCategoryId,
    isSameCategory: (current, last) => {
      const currentAny = current as unknown as Record<string, unknown>
      const lastAny = last as unknown as Record<string, unknown>
      return (
        current.name === last.name &&
        (currentAny.colorName as string | undefined) === (lastAny.colorName as string | undefined) &&
        current.isDeleted === last.isDeleted
      )
    },
    getLineCategoryId: (line) => line.lineCategoryId ?? null,
    isLineDeleted: (line) => line.isDeleted ?? false,
    isLineDone: (line) => line.isDone ?? false,
    isCategoryDeleted: (cat) => cat.isDeleted ?? false,
  })

  const updateTodoBook = useCallback(
    (updater: (current: TodoBookResponse) => TodoBookResponse) => {
      applyLocalUpdate((current) => updater(current))
    },
    [applyLocalUpdate]
  )


  // Get categories with counts from controller
  const categories: UiTodoCategory[] = useMemo(() => {
    const categoriesWithCounts = getCategoriesWithCounts()
    return categoriesWithCounts.map(cat => ({
      ...convertCategoryToUi(cat),
      lineCount: cat.lineCount,
      completedCount: cat.completedCount,
    }))
  }, [getCategoriesWithCounts])

  // Get selected category using controller helper
  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null
    const category = getCategoryById(selectedCategoryId)
    return category ? convertCategoryToUi(category as TodoLineCategoryResponse) : null
  }, [selectedCategoryId, getCategoryById])

  // Get visible todos using controller helper
  const visibleTodos = useMemo(() => {
    if (!selectedCategoryId) return []
    const categoryLines = getLinesByCategory(selectedCategoryId)
    const categoryMap = new Map(
      (localTodoBook?.lineCategories || [])
        .filter((cat: TodoLineCategoryResponse) => !cat.isDeleted)
        .map((cat: TodoLineCategoryResponse) => [cat.id, cat.name || cat.nameEn || cat.nameAr || ''])
    )
    return categoryLines.map((line: TodoLineResponse) => {
      const categoryName = categoryMap.get(line.lineCategoryId || 0) || tTodo('common.uncategorized')
      return convertLineToUiTodo(line, categoryName)
    })
  }, [selectedCategoryId, getLinesByCategory, localTodoBook, tTodo])

  const stats = useMemo(() => {
    const total = visibleTodos.length
    const completed = visibleTodos.filter((t) => t.isDone).length
    const pending = total - completed
    return { total, completed, pending }
  }, [visibleTodos])



  const handleToggleDone = (todoId: number) => {
    updateTodoBook(prev => ({
      ...prev,
      lines:
        prev.lines?.map(line =>
          line.id === todoId
            ? { ...line, isDone: !line.isDone, lastModifiedDate: new Date().toISOString() }
            : line
        ) || [],
    }))
  }

  const handleDeleteTodo = (todoId: number) => {
    updateTodoBook(prev => ({
      ...prev,
      lines:
        prev.lines?.map(line =>
          line.id === todoId
            ? { ...line, isDeleted: true, lastModifiedDate: new Date().toISOString() }
            : line
        ) || [],
    }))
  }

  const handleCreateTodo = async (data: { title: string; isDone?: boolean }) => {
    if (!localTodoBook || !selectedCategory) return

    // Validate task: must be 2-40 characters
    const taskValue = (data.title || '').trim()
    if (taskValue.length < 2 || taskValue.length > 40) {
      console.error('Task must be between 2 and 40 characters')
      return
    }

    const now = new Date().toISOString()
    const newLine: TodoLineResponse = {
      id: generateTempId(), // Temporary ID for new lines
      bookId: localTodoBook.id,
      task: taskValue,
      subTask: '',
      hasSubline: false,
      lineCategoryId: selectedCategory.id,
      isDone: data.isDone || false,
      isFavorite: false,
      isDeleted: false,
      isModelLine: false,
      brideId: null,
      groomId: null,
      count: 0,
      completed: 0,
      isSubDone: false,
      creationDate: now,
      lastModifiedDate: now,
      // Required fields from LineResponse
      bookClass: localTodoBook.bookClass,
      lineType: localTodoBook.bookType as unknown as UserType,
      createdBy: '',
      lastModifiedBy: '',
      slug: '',
    } as unknown as TodoLineResponse

    updateTodoBook(prev => ({
      ...prev,
      lines: [...(prev.lines || []), newLine],
    }))
  }

  const handleEditTodo = async (todoId: number, data: { title: string; isDone?: boolean }) => {
    // Validate task: must be 2-40 characters
    const taskValue = (data.title || '').trim()
    if (taskValue.length < 2 || taskValue.length > 40) {
      console.error('Task must be between 2 and 40 characters')
      return
    }

    updateTodoBook(prev => ({
      ...prev,
      lines:
        prev.lines?.map(line => {
          if (line.id !== todoId) return line
          return {
            ...line,
            task: taskValue,
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
    if (!localTodoBook) return

    const now = new Date().toISOString()
    const tempCategoryId = generateTempId()
    const newCategory: TodoLineCategoryResponse = {
      id: tempCategoryId, // Temporary ID
      name: data.name,
      nameAr: data.name,
      nameEn: data.name,
      description: null,
      descriptionAr: null,
      descriptionEn: null,
      iconName: null,
      colorName: data.color,
      isDeleted: false,
      isModelLine: false,
      date: now,
      creationDate: now,
      lastModifiedDate: now,
      // Required fields
      bookClass: localTodoBook.bookClass,
      createdBy: '',
      lastModifiedBy: '',
      slug: '',
    } as unknown as TodoLineCategoryResponse

    updateTodoBook(prev => {
      const newCategories = [...(prev.lineCategories || []), newCategory]
      return {
        ...prev,
        lineCategories: newCategories,
      }
    })

    // Set the new category as selected
    setSelectedCategoryId(tempCategoryId)
    setCreateListOpen(false)
  }

  const handleDeleteList = (categoryId: number) => {
    updateTodoBook(prev => ({
      ...prev,
      lineCategories:
        prev.lineCategories?.map(cat =>
          cat.id === categoryId
            ? { ...cat, isDeleted: true, lastModifiedDate: new Date().toISOString() }
            : cat
        ) || [],
    }))

    // If deleted category was selected, select first available
    if (selectedCategoryId === categoryId) {
      const remainingCategories = (localTodoBook?.lineCategories || [])
        .filter(cat => !cat.isDeleted && cat.id !== categoryId)
      if (remainingCategories.length > 0) {
        setSelectedCategoryId(remainingCategories[0].id)
      } else {
        setSelectedCategoryId(null)
      }
    }

  }

  const handleSync = async () => {
    const result = await save()
    if (!result.ok) {
      if (result.reason === 'loading' || result.reason === 'no-changes') {
        if (result.reason === 'no-changes') {
          applyLocalUpdate(prev => prev, { setUnsavedTo: false })
        }
        return
      }
      console.error(result.message || 'Failed to save changes')
      return
    }
  }

  if (isLoading || isInitializing || isAddingModels) {
    const loadingTitle = isInitializing
      ? tTodo('loading.initializingTitle')
      : isAddingModels
        ? tTodo('loading.addingModelsTitle')
        : tTodo('loading.loadingTodos')

    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" fullScreen={true} open={true} text={loadingTitle}  />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ErrorModal
          open={true}
          title={tTodo('error.failedToLoadTitle')}
          message={tTodo('error.failedToLoadMessage')}
          onRetry={() => window.location.reload()}
          onClose={() => { }}
        />
      </div>
    )
  }

  if (!localTodoBook) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-16 text-gray-500">{tTodo('error.todoBookNotFound')}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard/my-events"
            className="inline-flex h-9 w-9 items-center justify-center"
            aria-label={tTodo('common.backToMyEvents')}
          >
            <ChevronLeft
              className={cn(
                'w-5 h-5 text-gray-700',
                isRtl ? 'rotate-180' : 'rotate-0'
              )}
            />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">{t('ToDo')}</h1>
        </div>

        {(hasUnsavedChanges || syncMutation.isPending || syncDeltaMutation.isPending) && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              variant="brand"
              size="md"
              onClick={handleSync}
              disabled={syncMutation.isPending || syncDeltaMutation.isPending || !localTodoBook || isLoading}
              className="flex items-center gap-2 rounded-full !text-white h-9 px-4 text-sm w-full sm:w-auto"
              type="button"
            >
              <Save className="h-4 w-4" />
              {(syncMutation.isPending || syncDeltaMutation.isPending) ? tTodo('header.saving') : tTodo('header.saveChanges')}
            </Button>

            {hasUnsavedChanges && (
              <span className="text-16 text-brand-500 font-medium">{tTodo('header.unsavedChanges')}</span>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <TodoLinesPanel
          categoryName={selectedCategory?.name ?? tTodo('common.untitledList')}
          stats={stats}
          todos={visibleTodos}
          onToggleDone={handleToggleDone}
          onDeleteTodo={handleDeleteTodo}
          onCreateTodo={handleCreateTodo}
          onEditTodo={handleEditTodo}
        />

        <TodoListsSidebar
          title={tTodo('sidebar.title')}
          actionLabel={tTodo('sidebar.addNew')}
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

export default function TodoPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" fullScreen={true} open={true} text="Loading todos..." />
          </div>
        </div>
      }
    >
      <TodoPageContent />
    </Suspense>
  )
}
