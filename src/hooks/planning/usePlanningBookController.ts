import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Delta sync types
export type DeltaSet<T> = {
  created: T[]
  updated: T[]
  deletedIds: number[]
  tempIdMap?: { [key: string]: number }
}

export type SyncBookDeltaResponse<TBook> = {
  book: TBook
  serverTime: string
  categoryIdMap: { [tempId: string]: number }
  lineIdMap: { [tempId: string]: number }
}

type PlanningBookControllerOptions<TBook, TLine = unknown, TCategory = unknown> = {
  book: TBook | null | undefined
  isLoading: boolean
  eventId?: number | null
  syncFn: (current: TBook) => Promise<void>
  refetchAfterSave?: boolean
  // Delta sync (optional - if provided, will be used instead of syncFn)
  syncDeltaFn?: (delta: {
    lines: DeltaSet<TLine>
    lineCategories: DeltaSet<TCategory>
    bookId?: number
    eventId?: number
    lastSyncAt?: string
  }) => Promise<SyncBookDeltaResponse<TBook>>
  // Mappers for converting lines/categories to request format
  convertLineToRequest?: (line: TLine, bookId: number) => unknown
  convertCategoryToRequest?: (category: TCategory, bookId: number) => unknown
  refetch?: () => Promise<unknown>
  onFirstLoad?: (book: TBook) => void
  onHydrate?: (book: TBook) => void
  requireEventId?: boolean
  validateFn?: (book: TBook) => string | undefined
  markSyncedOnSave?: boolean
  // Init logic (optional, centralized)
  shouldInit?: (book: TBook | null | undefined) => boolean
  initFn?: () => Promise<void>
  // Add models logic (optional, centralized)
  shouldAddModels?: (book: TBook | null | undefined) => boolean
  addModelsFn?: () => Promise<void>
  // Mutation hooks for tracking pending states (optional)
  initMutation?: { isPending: boolean }
  addModelsMutation?: { isPending: boolean }
  // Change detection (centralized)
  isSameBookBase?: (current: TBook, last: TBook) => boolean
  getLines?: (book: TBook) => TLine[]
  getCategories?: (book: TBook) => TCategory[]
  getLineId?: (line: TLine) => number | string
  getCategoryId?: (category: TCategory) => number | string
  isSameLine?: (current: TLine, last: TLine) => boolean
  isSameCategory?: (current: TCategory, last: TCategory) => boolean
  // Category helpers
  getLineCategoryId?: (line: TLine) => number | string | null
  isLineDeleted?: (line: TLine) => boolean
  isLineDone?: (line: TLine) => boolean
  isCategoryDeleted?: (category: TCategory) => boolean
  // Book ID getter
  getBookId?: (book: TBook) => number | null | undefined
}

export const usePlanningBookController = <TBook, TLine = unknown, TCategory = unknown>({
  book,
  isLoading,
  eventId,
  syncFn,
  refetchAfterSave,
  syncDeltaFn,
  convertLineToRequest,
  convertCategoryToRequest,
  refetch,
  onFirstLoad,
  onHydrate,
  requireEventId,
  validateFn,
  markSyncedOnSave,
  isSameBookBase,
  getLines,
  getCategories,
  getLineId,
  getCategoryId,
  isSameLine,
  isSameCategory,
  getLineCategoryId,
  isLineDeleted,
  isLineDone,
  isCategoryDeleted,
  shouldInit,
  initFn,
  shouldAddModels,
  addModelsFn,
  initMutation,
  addModelsMutation,
  getBookId,
}: PlanningBookControllerOptions<TBook, TLine, TCategory>) => {
  const [localBook, setLocalBook] = useState<TBook | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSyncedRef = useRef<TBook | null>(null)
  const isInitialLoadRef = useRef(true)
  const hasInitAttemptedRef = useRef(false)
  const hasAddModelsAttemptedRef = useRef(false)

  const getLinesSafe = useCallback(
    (b: TBook | null) => (b && getLines ? getLines(b) : []),
    [getLines]
  )
  const getCategoriesSafe = useCallback(
    (b: TBook | null) => (b && getCategories ? getCategories(b) : []),
    [getCategories]
  )

  const getChangedLines = useCallback((): TLine[] => {
    if (!localBook || !lastSyncedRef.current || !getLines || !getLineId || !isSameLine) {
      return []
    }
    const currentLines = getLines(localBook) || []
    const lastLines = getLines(lastSyncedRef.current) || []
    return currentLines.filter((line) => {
      const id = getLineId(line)
      const last = lastLines.find((l) => getLineId(l) === id)
      if (!last) return true
      return !isSameLine(line, last)
    })
  }, [localBook, getLines, getLineId, isSameLine])

  const getChangedCategories = useCallback((): TCategory[] => {
    if (!localBook || !lastSyncedRef.current || !getCategories || !getCategoryId || !isSameCategory) {
      return []
    }
    const currentCategories = getCategories(localBook) || []
    const lastCategories = getCategories(lastSyncedRef.current) || []
    return currentCategories.filter((cat) => {
      const id = getCategoryId(cat)
      const last = lastCategories.find((c) => getCategoryId(c) === id)
      if (!last) return true
      return !isSameCategory(cat, last)
    })
  }, [localBook, getCategories, getCategoryId, isSameCategory])

  // Build delta payload for sync
  const buildDeltaPayload = useCallback((): {
    lines: DeltaSet<TLine>
    lineCategories: DeltaSet<TCategory>
    bookId?: number
    eventId?: number
  } | null => {
    const lastSynced = lastSyncedRef.current
    if (!localBook || !lastSynced || !getLines || !getCategories || !getLineId || !getCategoryId) {
      return null
    }

    const currentLines = getLinesSafe(localBook)
    const lastLines = getLinesSafe(lastSynced)
    const currentCategories = getCategoriesSafe(localBook)
    const lastCategories = getCategoriesSafe(lastSynced)

    const bookId = getBookId ? getBookId(localBook) : (localBook as Record<string, unknown>).id as number | null | undefined

    // Separate lines into created, updated, deleted
    const createdLines: TLine[] = []
    const updatedLines: TLine[] = []
    const deletedLineIds: number[] = []

    currentLines.forEach((line) => {
      const id = getLineId(line)
      const idNum = typeof id === 'string' ? parseInt(id, 10) : id
      
      // Negative ID = new item
      if (idNum < 0) {
        createdLines.push(line)
      } else {
        // Check if it exists in last sync
        const lastLine = lastLines.find((l) => getLineId(l) === id)
        if (!lastLine) {
          // New item that was created with positive ID (shouldn't happen, but handle it)
          createdLines.push(line)
        } else {
          // Check if it changed
          if (isSameLine && !isSameLine(line, lastLine)) {
            updatedLines.push(line)
          }
        }
      }
    })

    // Find deleted lines (in last but not in current, or marked as deleted)
    lastLines.forEach((lastLine) => {
      const id = getLineId(lastLine)
      const idNum = typeof id === 'string' ? parseInt(id, 10) : id
      if (idNum > 0) {
        const currentLine = currentLines.find((l) => getLineId(l) === id)
        if (!currentLine) {
          deletedLineIds.push(idNum)
        } else {
          const isDeletedFn = isLineDeleted || ((line: TLine) => !!(line as Record<string, unknown>).isDeleted)
          if (isDeletedFn(currentLine)) {
            deletedLineIds.push(idNum)
          }
        }
      }
    })

    // Separate categories into created, updated, deleted
    const createdCategories: TCategory[] = []
    const updatedCategories: TCategory[] = []
    const deletedCategoryIds: number[] = []

    currentCategories.forEach((cat) => {
      const id = getCategoryId(cat)
      const idNum = typeof id === 'string' ? parseInt(id, 10) : id
      
      // Negative ID = new item
      if (idNum < 0) {
        createdCategories.push(cat)
      } else {
        // Check if it exists in last sync
        const lastCat = lastCategories.find((c) => getCategoryId(c) === id)
        if (!lastCat) {
          createdCategories.push(cat)
        } else {
          // Check if it changed
          if (isSameCategory && !isSameCategory(cat, lastCat)) {
            updatedCategories.push(cat)
          }
        }
      }
    })

    // Find deleted categories
    lastCategories.forEach((lastCat) => {
      const id = getCategoryId(lastCat)
      const idNum = typeof id === 'string' ? parseInt(id, 10) : id
      if (idNum > 0) {
        const currentCat = currentCategories.find((c) => getCategoryId(c) === id)
        if (!currentCat) {
          deletedCategoryIds.push(idNum)
        } else {
          const isDeletedFn = isCategoryDeleted || ((cat: TCategory) => !!(cat as Record<string, unknown>).isDeleted)
          if (isDeletedFn(currentCat)) {
            deletedCategoryIds.push(idNum)
          }
        }
      }
    })

    // Convert to request format if converters provided
    const convertLine = convertLineToRequest || ((line: TLine, _bookId: number) => line as unknown)
    const convertCategory = convertCategoryToRequest || ((cat: TCategory, _bookId: number) => cat as unknown)

    return {
      bookId: bookId ?? undefined,
      eventId: eventId ?? undefined,
      lines: {
        created: createdLines.map((line) => convertLine(line, bookId || 0) as TLine),
        updated: updatedLines.map((line) => convertLine(line, bookId || 0) as TLine),
        deletedIds: deletedLineIds,
      },
      lineCategories: {
        created: createdCategories.map((cat) => convertCategory(cat, bookId || 0) as TCategory),
        updated: updatedCategories.map((cat) => convertCategory(cat, bookId || 0) as TCategory),
        deletedIds: deletedCategoryIds,
      },
    }
  }, [
    localBook,
    getLines,
    getCategories,
    getLineId,
    getCategoryId,
    isSameLine,
    isSameCategory,
    isLineDeleted,
    isCategoryDeleted,
    convertLineToRequest,
    convertCategoryToRequest,
    getBookId,
    eventId,
    getLinesSafe,
    getCategoriesSafe,
  ])

  // Update local IDs after delta sync response
  const updateLocalIdsFromDeltaResponse = useCallback(
    (response: SyncBookDeltaResponse<TBook>, currentBook: TBook): TBook => {
      if (!currentBook || !getLines || !getCategories || !getLineId || !getCategoryId) return currentBook

      const { categoryIdMap, lineIdMap } = response
      let updatedBook: TBook = currentBook

      // Update category IDs in local book
      if (Object.keys(categoryIdMap).length > 0) {
        const categories = getCategories(updatedBook) || []
        const updatedCategories = categories.map((cat) => {
          const id = getCategoryId(cat)
          const idNum = typeof id === 'string' ? parseInt(id, 10) : id
          if (idNum < 0 && categoryIdMap[String(idNum)]) {
            // Replace temp ID with server ID
            return { ...(cat as Record<string, unknown>), id: categoryIdMap[String(idNum)] } as TCategory
          }
          return cat
        })

        // Update lineCategoryId references in lines
        const lines = getLines(updatedBook) || []
        const updatedLines = lines.map((line) => {
          const lineCatId = getLineCategoryId ? getLineCategoryId(line) : (line as Record<string, unknown>).lineCategoryId as number | string | null | undefined
          if (lineCatId != null) {
            const lineCatIdNum = typeof lineCatId === 'string' ? parseInt(lineCatId, 10) : lineCatId
            if (lineCatIdNum < 0 && categoryIdMap[String(lineCatIdNum)]) {
              return { ...(line as Record<string, unknown>), lineCategoryId: categoryIdMap[String(lineCatIdNum)] } as TLine
            }
          }
          return line
        })

        updatedBook = { ...updatedBook, lines: updatedLines, lineCategories: updatedCategories } as TBook
      }

      // Update line IDs in local book
      if (Object.keys(lineIdMap).length > 0) {
        const lines = getLines(updatedBook) || []
        const updatedLines = lines.map((line) => {
          const id = getLineId(line)
          const idNum = typeof id === 'string' ? parseInt(id, 10) : id
          if (idNum < 0 && lineIdMap[String(idNum)]) {
            return { ...(line as Record<string, unknown>), id: lineIdMap[String(idNum)] } as TLine
          }
          return line
        })

        updatedBook = { ...updatedBook, lines: updatedLines } as TBook
      }

      return updatedBook
    },
    [getLines, getCategories, getLineId, getCategoryId, getLineCategoryId]
  )

  // Get active categories (not deleted)
  const getActiveCategories = useCallback((): TCategory[] => {
    if (!localBook || !getCategories) return []
    const allCategories = getCategories(localBook) || []
    if (isCategoryDeleted) {
      return allCategories.filter(cat => !isCategoryDeleted(cat))
    }
    // Default: check (cat as Record<string, unknown>).isDeleted
    return allCategories.filter(cat => !(cat as Record<string, unknown>).isDeleted)
  }, [localBook, getCategories, isCategoryDeleted])

  // Get categories with line counts
  const getCategoriesWithCounts = useCallback((): Array<TCategory & { lineCount: number; completedCount: number }> => {
    if (!localBook || !getCategories || !getLines || !getCategoryId) return []
    
    const activeCategories = getActiveCategories()
    const allLines = getLinesSafe(localBook)
    
    const isDeletedFn = isLineDeleted || ((line: TLine) => !!(line as Record<string, unknown>).isDeleted)
    const isDoneFn = isLineDone || ((line: TLine) => !!(line as Record<string, unknown>).isDone)
    const getLineCatId = getLineCategoryId || ((line: TLine) => (line as Record<string, unknown>).lineCategoryId as number | string | null | undefined ?? null)
    
    return activeCategories.map(category => {
      const categoryId = getCategoryId(category)
      const categoryLines = allLines.filter(line => {
        const lineCatId = getLineCatId(line)
        return lineCatId != null && String(lineCatId) === String(categoryId) && !isDeletedFn(line)
      })
      const completedCount = categoryLines.filter(line => isDoneFn(line)).length
      
      return {
        ...category,
        lineCount: categoryLines.length,
        completedCount,
      } as TCategory & { lineCount: number; completedCount: number }
    })
  }, [localBook, getCategories, getLines, getCategoryId, getLineCategoryId, isLineDeleted, isLineDone, getActiveCategories, getLinesSafe])

  // Get category by ID
  const getCategoryById = useCallback((categoryId: number | string | null | undefined): TCategory | null => {
    if (!localBook || !getCategories || !getCategoryId || categoryId == null) return null
    const categories = getCategories(localBook) || []
    return categories.find(cat => {
      const catId = getCategoryId(cat)
      return catId != null && String(catId) === String(categoryId)
    }) ?? null
  }, [localBook, getCategories, getCategoryId])

  // Get active lines (not deleted)
  const getActiveLines = useCallback((): TLine[] => {
    if (!localBook || !getLines) return []
    const allLines = getLinesSafe(localBook)
    const isDeletedFn = isLineDeleted || ((line: TLine) => !!(line as Record<string, unknown>).isDeleted)
    return allLines.filter(line => !isDeletedFn(line))
  }, [localBook, getLines, isLineDeleted, getLinesSafe])

  // Get lines filtered by category ID
  const getLinesByCategory = useCallback((categoryId: number | string | null | undefined): TLine[] => {
    if (!localBook || !getLines || categoryId == null) return []
    const allLines = getLinesSafe(localBook)
    const getLineCatId = getLineCategoryId || ((line: TLine) => (line as Record<string, unknown>).lineCategoryId as number | string | null | undefined ?? null)
    const isDeletedFn = isLineDeleted || ((line: TLine) => !!(line as Record<string, unknown>).isDeleted)
    return allLines.filter(line => {
      const lineCatId = getLineCatId(line)
      return lineCatId != null && String(lineCatId) === String(categoryId) && !isDeletedFn(line)
    })
  }, [localBook, getLines, getLineCategoryId, isLineDeleted, getLinesSafe])

  // Get line by ID
  const getLineById = useCallback((lineId: number | string | null | undefined): TLine | null => {
    if (!localBook || !getLines || !getLineId || lineId == null) return null
    const allLines = getLinesSafe(localBook)
    const isDeletedFn = isLineDeleted || ((line: TLine) => !!(line as Record<string, unknown>).isDeleted)
    return allLines.find(line => {
      const id = getLineId(line)
      return id != null && String(id) === String(lineId) && !isDeletedFn(line)
    }) ?? null
  }, [localBook, getLines, getLineId, isLineDeleted, getLinesSafe])

  const hasActualChanges = useMemo(() => {
    return () => {
      if (!localBook || !lastSyncedRef.current) {
        return !!localBook
      }
      if (isSameBookBase && !isSameBookBase(localBook, lastSyncedRef.current)) {
        return true
      }

      const currentLines = getLinesSafe(localBook)
      const lastLines = getLinesSafe(lastSyncedRef.current)
      if (currentLines.length !== lastLines.length) return true

      const currentCategories = getCategoriesSafe(localBook)
      const lastCategories = getCategoriesSafe(lastSyncedRef.current)
      if (currentCategories.length !== lastCategories.length) return true

      if (getLineId && isSameLine && getLines) {
        for (const line of currentLines) {
          const id = getLineId(line)
          const last = lastLines.find((l) => getLineId(l) === id)
          if (!last) return true
          if (!isSameLine(line, last)) return true
        }
      }

      if (getCategoryId && isSameCategory && getCategories) {
        for (const cat of currentCategories) {
          const id = getCategoryId(cat)
          const last = lastCategories.find((c) => getCategoryId(c) === id)
          if (!last) return true
          if (!isSameCategory(cat, last)) return true
        }
      }

      return false
    }
  }, [
    localBook,
    getLinesSafe,
    getCategoriesSafe,
    getLineId,
    isSameLine,
    getLines,
    getCategoryId,
    isSameCategory,
    getCategories,
    isSameBookBase,
  ])

  // Initial load
  useEffect(() => {
    if (isInitialLoadRef.current && book && !localBook) {
      setLocalBook(book)
      lastSyncedRef.current = book
      isInitialLoadRef.current = false
      onFirstLoad?.(book)
    }
  }, [book, localBook, onFirstLoad])

  // Init book if missing (centralized)
  useEffect(() => {
    if (!eventId || !initFn || !shouldInit) return
    if (isLoading) return
    if (!shouldInit(book)) return
    if (hasInitAttemptedRef.current) return

    hasInitAttemptedRef.current = true
    const runInit = async () => {
      try {
        await initFn()
        if (refetch) {
          await refetch()
        }
      } catch (error) {
        console.error('Init book failed:', error)
        hasInitAttemptedRef.current = false
      }
    }
    runInit()
  }, [eventId, initFn, shouldInit, book, isLoading, refetch])

  // Add models if isModelsAdd is false (centralized)
  useEffect(() => {
    if (!eventId || !addModelsFn || !shouldAddModels) return
    if (isLoading) return
    if (!shouldAddModels(book)) return
    if (hasAddModelsAttemptedRef.current) return

    hasAddModelsAttemptedRef.current = true
    const runAddModels = async () => {
      try {
        await addModelsFn()
        if (refetch) {
          await refetch()
        }
      } catch (error) {
        console.error('Add models failed:', error)
        hasAddModelsAttemptedRef.current = false
      }
    }
    runAddModels()
  }, [eventId, addModelsFn, shouldAddModels, book, isLoading, refetch])

  // Hydrate from server when safe
  useEffect(() => {
    if (book && !hasUnsavedChanges && !isInitialLoadRef.current) {
      setLocalBook(book)
      lastSyncedRef.current = book
      onHydrate?.(book)
    } else if (book === null && !isLoading && !hasUnsavedChanges) {
      setLocalBook(null)
      lastSyncedRef.current = null
    }
  }, [book, hasUnsavedChanges, isLoading, onHydrate])

  // Auto-sync every 2 minutes (only if there are actual changes)
  useEffect(() => {
    if (!eventId || !localBook || hasUnsavedChanges) return

    const interval = setInterval(async () => {
      try {
        if (!hasActualChanges()) {
          return
        }
        await syncFn(localBook)
        lastSyncedRef.current = localBook
        if (refetch) {
          await refetch()
        }
      } catch (error) {
        console.error('Auto-sync failed:', error)
      }
    }, 2 * 60 * 1000)

    return () => clearInterval(interval)
  }, [eventId, localBook, hasUnsavedChanges, hasActualChanges, syncFn, refetch])

  const markSynced = (bookToMark?: TBook | null) => {
    lastSyncedRef.current = bookToMark ?? localBook
  }

  const applyLocalUpdate = useCallback(
    (
      updater: (current: TBook) => TBook,
      options?: {
        markUnsaved?: boolean
        setUnsavedTo?: boolean
      }
    ) => {
      if (isLoading) {
        return { ok: false, reason: 'loading', message: 'Please wait while the book is loading...' }
      }
      if (!localBook) {
        return { ok: false, reason: 'missing-book', message: 'Book not found. Please refresh the page.' }
      }
      const next = updater(localBook)
      setLocalBook(next)
      if (options?.setUnsavedTo !== undefined) {
        setHasUnsavedChanges(options.setUnsavedTo)
      } else if (options?.markUnsaved !== false) {
        setHasUnsavedChanges(true)
      }
      return { ok: true, book: next }
    },
    [isLoading, localBook]
  )

  const save = useCallback(async (bookOverride?: TBook) => {
    if (requireEventId && !eventId) {
      return { ok: false, reason: 'missing-event', message: 'Event ID is required' }
    }
    if (isLoading) {
      return { ok: false, reason: 'loading', message: 'Please wait while the book is loading...' }
    }
    const bookToSave = bookOverride ?? localBook
    if (!bookToSave) {
      return { ok: false, reason: 'missing-book', message: 'Book not found. Please refresh the page.' }
    }
    if (bookOverride) {
      setLocalBook(bookOverride)
    }
    const validationError = validateFn?.(bookToSave)
    if (validationError) {
      return { ok: false, reason: 'validation', message: validationError }
    }
    if (!bookOverride && !hasActualChanges()) {
      return { ok: false, reason: 'no-changes', message: 'No changes to save' }
    }
    try {
      // Use delta sync if available, otherwise fall back to full sync
      if (syncDeltaFn) {
        const deltaPayload = buildDeltaPayload()
        if (!deltaPayload) {
          return { ok: false, reason: 'error', message: 'Failed to build delta payload' }
        }

        // Check if there are any changes
        const hasChanges =
          deltaPayload.lines.created.length > 0 ||
          deltaPayload.lines.updated.length > 0 ||
          deltaPayload.lines.deletedIds.length > 0 ||
          deltaPayload.lineCategories.created.length > 0 ||
          deltaPayload.lineCategories.updated.length > 0 ||
          deltaPayload.lineCategories.deletedIds.length > 0

        if (!hasChanges) {
          return { ok: false, reason: 'no-changes', message: 'No changes to save' }
        }

        const response = await syncDeltaFn(deltaPayload)
        
        // Log response for debugging
        console.log('[PlanningBookController] Delta sync response:', {
          hasBook: !!response.book,
          hasCategoryIdMap: !!response.categoryIdMap,
          hasLineIdMap: !!response.lineIdMap,
          categoryIdMap: response.categoryIdMap,
          lineIdMap: response.lineIdMap,
        })
        
        // Update local IDs from the response (maps temp IDs to server IDs)
        const updatedBook = localBook ? updateLocalIdsFromDeltaResponse(response, localBook) : null
        
        // Use the updated book (with mapped IDs) as the final book
        const finalBook = updatedBook || response.book

        // Update local book with the final book
        setLocalBook(finalBook)

        if (markSyncedOnSave !== false) {
          markSynced(finalBook)
        }
        
        return { ok: true, reason: 'saved', message: 'Changes saved successfully' }
      } else {
        // Fall back to full sync
        await syncFn(bookToSave)

        if (refetchAfterSave && refetch) {
          const refreshed = await refetch()
          const refreshedAny = refreshed as unknown as { data?: TBook } | TBook
          const refreshedBook = ('data' in (refreshedAny as object) ? (refreshedAny as { data?: TBook }).data : refreshedAny) as TBook | undefined
          if (refreshedBook) {
            setLocalBook(refreshedBook)
            if (markSyncedOnSave !== false) {
              markSynced(refreshedBook)
            }
            return { ok: true, reason: 'saved', message: 'Changes saved successfully' }
          }
        }

        if (markSyncedOnSave !== false) {
          markSynced(bookToSave)
        }
        return { ok: true, reason: 'saved', message: 'Changes saved successfully' }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save changes'
      return { ok: false, reason: 'error', message, error }
    }
  }, [
    requireEventId,
    eventId,
    isLoading,
    localBook,
    validateFn,
    hasActualChanges,
    syncFn,
    refetchAfterSave,
    syncDeltaFn,
    buildDeltaPayload,
    updateLocalIdsFromDeltaResponse,
    markSyncedOnSave,
  ])

  // Expose pending states from mutations
  const isInitializing = initMutation?.isPending ?? false
  const isAddingModels = addModelsMutation?.isPending ?? false

  return {
    localBook,
    setLocalBook,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    markSynced,
    lastSyncedRef,
    isInitialLoadRef,
    hasInitAttemptedRef,
    hasActualChanges,
    getChangedLines,
    getChangedCategories,
    getActiveCategories,
    getCategoriesWithCounts,
    getCategoryById,
    getActiveLines,
    getLinesByCategory,
    getLineById,
    applyLocalUpdate,
    save,
    buildDeltaPayload,
    updateLocalIdsFromDeltaResponse,
    isInitializing,
    isAddingModels,
  }
}
