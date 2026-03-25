'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, LoadingSpinner } from '@/components/ui'
import { Save, ChevronLeft, Plus } from 'lucide-react'
import { useServiceBook, useSyncServiceBook, useInitServiceBooks } from '@/hooks/serviceBooks'
import { useEventId } from '@/hooks/planning'
import { usePreparations } from '@/hooks/planning/usePreparations'
import { useToast } from '@/components/ui/Toaster'
import {
  PreparationsSummaryCard,
  PreparationsTable,
  ServiceModal,
  ConfirmDialog,
} from '@/components/planning'
import type { ServiceLineResponse, ServiceBookResponse } from '@/types/responses'
import type { ServiceBookRequest, UserType } from '@/../client/common/api/gen/ourbride-api'
import type { PreparationService } from '@/types/planning'
import { normalizeIconName } from '@/utils/serviceIconMapper'

/**
 * Convert ServiceLineResponse to PreparationService format
 * Maps backend fields to table columns exactly as specified:
 * - Service column: line.title (fallback to titleEn then titleAr), icon from line.iconName
 * - Status column: "Completed" if line.isDone === true, else "Still on the way"
 * - Paid column: line.advanceAmount if exists, otherwise 0
 * - Due column: line.buyDate if valid (not 0001-01-01...), otherwise shows "-"
 */
const convertServiceLineToPreparationService = (line: ServiceLineResponse): PreparationService => {
  // Map serviceType enum to string
  const serviceTypeStr = line.serviceType === 0 ? 'rent' : line.serviceType === 1 ? 'buy' : 'rent'

  return {
    id: String(line.id),
    // Service column: show line.title (fallback to titleEn then titleAr)
    title: line.title || line.titleEn || line.titleAr || '',
    // Service column: show icon using line.iconName
    icon: { kind: 'asset', value: line.iconName || '' },
    serviceType: serviceTypeStr,
    quantity: line.quantity || 1,
    cost: line.price || 0,
    // Paid column: show advanceAmount if exists, otherwise 0
    advancePayment: line.advanceAmount || 0,
    providerUserName: line.providerName || line.seller || '',
    // Due column: show buyDate if valid (not 0001-01-01...), otherwise will show "-" in table
    purchaseDate: line.buyDate || '',
    // Status column: if line.isDone === true → "Completed", else → "Still on the way"
    completed: line.isDone || false,
  }
}

function PreparationsLinesContent() {
  const { addToast } = useToast()
  const params = useParams()
  const router = useRouter()
  const eventId = useEventId()
  const categoryId = params?.categoryId ? parseInt(String(params.categoryId), 10) : null

  const [editingService, setEditingService] = useState<PreparationService | undefined>()
  const [serviceToDelete, setServiceToDelete] = useState<PreparationService | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  // Local state to keep the book in memory
  const [localServiceBook, setLocalServiceBook] = useState<ServiceBookResponse | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSyncedRef = useRef<ServiceBookResponse | null>(null)
  const isInitialLoadRef = useRef(true)

  // Optimistic UI: pending lines added locally before sync/refetch
  const [pendingLines, setPendingLines] = useState<Array<ServiceLineResponse & { clientTempId?: string }>>([])

  // Fetch service book
  const { data: serviceBook, isLoading, error, refetch } = useServiceBook({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: typeof window !== 'undefined',
  })

  // Fetch categories (kept for potential future use)
  // const { data: categories } = useServiceCategories({
  //   enabled: typeof window !== 'undefined',
  // })

  // Fetch preparations (services) for dropdown
  const { data: preparations = [] } = usePreparations({
    enabled: typeof window !== 'undefined',
  })

  const syncMutation = useSyncServiceBook()
  const initMutation = useInitServiceBooks()

  // Initialize service book if missing
  useEffect(() => {
    if (!isLoading && !serviceBook && eventId && !initMutation.isPending) {
      initMutation.mutate({
        eventId,
        clientId: undefined,
        userType: undefined,
      })
    }
  }, [isLoading, serviceBook, eventId, initMutation])

  // On first load, use the book from GET endpoint immediately
  useEffect(() => {
    if (isInitialLoadRef.current && serviceBook && !localServiceBook) {
      setLocalServiceBook(serviceBook)
      lastSyncedRef.current = serviceBook
      isInitialLoadRef.current = false
    }
  }, [serviceBook, localServiceBook])

  // Sync fetched data to local state when it changes (only if no unsaved changes)
  useEffect(() => {
    if (serviceBook && !hasUnsavedChanges && !isInitialLoadRef.current) {
      setLocalServiceBook(serviceBook)
      lastSyncedRef.current = serviceBook
    } else if (serviceBook === null && !isLoading && !hasUnsavedChanges) {
      setLocalServiceBook(null)
    }
  }, [serviceBook, hasUnsavedChanges, isLoading])

  // After sync, update local state from refetched data and remove pending lines
  useEffect(() => {
    if (serviceBook && !hasUnsavedChanges && syncMutation.isSuccess) {
      setLocalServiceBook(serviceBook)
      lastSyncedRef.current = serviceBook
      isInitialLoadRef.current = false

      // Remove pending lines that have been saved (deduplicate)
      // Match by checking if line exists in server response with same title and similar timestamp
      const bookData = (serviceBook as unknown as { data?: ServiceBookResponse } | ServiceBookResponse)
      const actualBook: ServiceBookResponse = 'data' in bookData && bookData.data ? bookData.data : bookData as ServiceBookResponse
      const serverLineIds = new Set((actualBook?.lines || []).map(line => line.id))

      setPendingLines(prev =>
        prev.filter(pendingLine => {
          // If pending line has a real ID now, it was saved
          if (pendingLine.id && pendingLine.id > 0 && serverLineIds.has(pendingLine.id)) {
            return false
          }
          // Also match by title and creation timestamp if available
          const matchingServerLine = (actualBook?.lines || []).find(serverLine =>
            serverLine.title === pendingLine.title &&
            serverLine.lineCategoryId === pendingLine.lineCategoryId &&
            Math.abs(new Date(serverLine.creationDate || '').getTime() - new Date(pendingLine.creationDate || '').getTime()) < 5000 // Within 5 seconds
          )
          if (matchingServerLine) {
            return false
          }
          // Keep pending lines that haven't been saved yet
          return true
        })
      )
    }
  }, [serviceBook, hasUnsavedChanges, syncMutation.isSuccess])

  // Auto-sync every 2 minutes (only if there are actual changes)
  useEffect(() => {
    if (!eventId || !localServiceBook || hasUnsavedChanges) return

    const interval = setInterval(async () => {
      try {
        if (!hasActualChanges()) {
          return
        }

        const bookRequest = buildBookRequestFromLocal()
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
      } catch (error) {
      }
    }, 2 * 60 * 1000) // 2 minutes

    return () => clearInterval(interval)
  }, [eventId, localServiceBook, hasUnsavedChanges, syncMutation, refetch])

  // Extract server lines from GET response - use correct path: serviceBookResponse?.data?.lines
  // The API returns { success: true, data: { lines: [...] } }
  const serverLines: ServiceLineResponse[] = useMemo(() => {
    if (!serviceBook) return []

    // Check if serviceBook has a 'data' property (wrapped response)
    // If yes, use serviceBook.data.lines, otherwise use serviceBook.lines
    const bookData = (serviceBook as unknown as { data?: ServiceBookResponse } | ServiceBookResponse)
    const actualBook: ServiceBookResponse = 'data' in bookData && bookData.data ? bookData.data : bookData as ServiceBookResponse
    const allLines = actualBook?.lines || []

    // Only filter by isDeleted (temporarily remove category filter)
    return allLines.filter((line: ServiceLineResponse) => line.isDeleted !== true)
  }, [serviceBook])

  // Merge server lines with pending lines (optimistic UI)
  const mergedLines: ServiceLineResponse[] = useMemo(() => {
    const allLines = [...pendingLines, ...serverLines]
    // Filter out deleted items
    return allLines.filter((line: ServiceLineResponse) => line.isDeleted !== true)
  }, [pendingLines, serverLines])

  // Convert to PreparationService format for table
  const services: PreparationService[] = useMemo(() => {
    return mergedLines.map(convertServiceLineToPreparationService)
  }, [mergedLines])

  /**
   * Normalize date to match backend format
   * Backend uses "0001-01-01T00:00:00Z" for empty dates
   */
  const normalizeDateForBackend = (date: string | null | undefined): string => {
    if (!date || date === '0001-01-01' || date === '0001-01-01T00:00:00' || date === '0001-01-01T00:00:00Z') {
      return '0001-01-01T00:00:00Z'
    }

    // If already ISO format, return as is
    if (date.includes('T')) {
      return date.endsWith('Z') ? date : `${date}Z`
    }

    // If YYYY-MM-DD format, convert to ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return `${date}T00:00:00.000Z`
    }

    // Try to parse and convert
    try {
      const parsed = new Date(date)
      if (isNaN(parsed.getTime())) {
        return '0001-01-01T00:00:00Z'
      }
      return parsed.toISOString()
    } catch {
      return '0001-01-01T00:00:00Z'
    }
  }

  /**
   * Prepare line for sync - matches backend response shape exactly
   * Removes only server-managed fields (createdBy, lastModifiedBy, creationDate, lastModifiedDate)
   * For new lines, omits id completely
   */
  const prepareLineForSync = (line: ServiceLineResponse): Record<string, unknown> => {
    const isNewLine = line.id === null || line.id === undefined

    // Start with full line object (matches backend response shape)
    const preparedLine: Record<string, unknown> = {
      titleAr: line.titleAr || line.title || '',
      titleEn: line.titleEn || line.title || '',
      title: line.title || line.titleEn || line.titleAr || '',
      quantity: line.quantity ?? null,
      advanceAmount: line.advanceAmount ?? null,
      price: line.price ?? null,
      totalPrice: line.totalPrice ?? null,
      buyDate: normalizeDateForBackend(line.buyDate),
      seller: line.seller ?? null,
      notes: line.notes ?? null,
      hasReminder: line.hasReminder || false,
      reminderDate: normalizeDateForBackend(line.reminderDate),
      reminderText: line.reminderText ?? null,
      reminderType: line.reminderType ?? null,
      providerName: line.providerName ?? null,
      providerAddress: line.providerAddress ?? null,
      providerLink: line.providerLink ?? null,
      providingType: line.providingType ?? null,
      hasProvider: line.hasProvider || false,
      budget: line.budget || false,
      serviceType: line.serviceType === 0 ? 'Rent' : line.serviceType === 1 ? 'Buy' : 'Rent',
      serviceClass: line.serviceClass === 0 ? 'None' : String(line.serviceClass),
      iconName: line.iconName || 'Sparkles',
      colorName: line.colorName ?? null,
      preparationId: line.preparationId ?? null,
      preparation: line.preparation ?? null,
      providerId: line.providerId ?? null,
      provider: line.provider ?? null,
      serviceId: line.serviceId ?? null,
      service: line.service ?? null,
      reservationId: line.reservationId ?? null,
      reservation: line.reservation ?? null,
      isLinkedToService: line.isLinkedToService || false,
      isLinkedToReservation: line.isLinkedToReservation || false,
      serviceDate: line.serviceDate ?? null,
      serviceNotes: line.serviceNotes ?? null,
      reservationNotes: line.reservationNotes ?? null,
      groomId: line.groomId ?? null,
      brideId: line.brideId ?? null,
      lineType: line.lineType || localServiceBook?.bookType || 'Bride',
      bookClass: line.bookClass || localServiceBook?.bookClass || 'Service',
      isDone: line.isDone || false,
      isFavorite: line.isFavorite || false,
      isDeleted: line.isDeleted || false,
      isModelLine: isNewLine ? false : (line.isModelLine || false),
      bookId: line.bookId || localServiceBook?.id || 0,
      lineCategoryId: line.lineCategoryId ?? categoryId ?? null,
      slug: line.slug || '',
    }

    // Always include id if present (keep negative temp IDs for new lines)
    if (line.id !== null && line.id !== undefined) {
      preparedLine.id = line.id
    }

    return preparedLine
  }

  /**
   * Build ServiceBookRequest from local state
   * Uses structuredClone to maintain backend response shape exactly
   * Only removes server-managed fields
   */
  const buildBookRequestFromLocal = (): ServiceBookRequest => {
    if (!localServiceBook) {
      throw new Error('Service book not found')
    }

    // Clone the entire book object to maintain shape
    const payload = structuredClone(localServiceBook) as unknown as Record<string, unknown>

    // Prepare all lines to match backend shape
    payload.lines = (localServiceBook.lines || []).map(prepareLineForSync)

    // Remove server-managed fields from root
    delete payload.createdBy
    delete payload.lastModifiedBy
    delete payload.creationDate
    delete payload.lastModifiedDate

    // Ensure required root fields exist
    payload.completed = payload.completed ?? 0
    payload.pending = payload.pending ?? 0
    payload.isSubDone = payload.isSubDone ?? false
    payload.isModelsAdd = payload.isModelsAdd ?? true
    payload.count = payload.count ?? (Array.isArray(payload.lines) ? payload.lines.length : 0)

    // Debug: Log final payload to verify structure
    if (process.env.NODE_ENV === 'development') {
      const linesArray = Array.isArray(payload.lines) ? payload.lines : []
      const newLines = linesArray.filter((l: Record<string, unknown>) =>
        typeof l.id !== 'number' || l.id <= 0
      )
    }

    // Cast to ServiceBookRequest (backend accepts the same shape)
    return payload as unknown as ServiceBookRequest
  }

  /**
   * Check if there are actual changes between current state and last synced state
   */
  const hasActualChanges = (): boolean => {
    if (!localServiceBook || !lastSyncedRef.current) {
      return !!localServiceBook
    }

    const current = localServiceBook
    const lastSynced = lastSyncedRef.current

    if (
      current.id !== lastSynced.id ||
      current.groomId !== lastSynced.groomId ||
      current.brideId !== lastSynced.brideId ||
      current.title !== lastSynced.title
    ) {
      return true
    }

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
        currentLine.quantity !== lastSyncedLine.quantity ||
        currentLine.price !== lastSyncedLine.price ||
        currentLine.advanceAmount !== lastSyncedLine.advanceAmount ||
        currentLine.buyDate !== lastSyncedLine.buyDate ||
        currentLine.providerName !== lastSyncedLine.providerName ||
        currentLine.seller !== lastSyncedLine.seller ||
        currentLine.isDone !== lastSyncedLine.isDone ||
        currentLine.isDeleted !== lastSyncedLine.isDeleted ||
        currentLine.isFavorite !== lastSyncedLine.isFavorite ||
        currentLine.lineCategoryId !== lastSyncedLine.lineCategoryId
      ) {
        return true
      }
    }

    return false
  }

  const handleAdd = () => {
    setEditingService(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (service: PreparationService) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleDelete = (service: PreparationService) => {
    setServiceToDelete(service)
    setIsConfirmDialogOpen(true)
  }

  const handleSave = async (serviceData: {
    completed: boolean
    serviceKey: string // Now contains preparation ID as string
    title: string
    serviceType: 'rent' | 'buy'
    quantity: number
    cost: number
    advancePayment: number
    providerUserName: string
    purchaseDate: string
  }) => {
    try {
      if (!localServiceBook || !categoryId) {
        addToast('Service book or category not found', 'error')
        return
      }

      // Find the selected preparation to get iconName
      // Normalize iconName to ensure it's a string name, not hex code
      let iconName = 'Sparkles' // Default icon name
      if (serviceData.serviceKey) {
        const selectedPreparation = preparations.find(p => String(p.id) === serviceData.serviceKey)
        if (selectedPreparation) {
          // Normalize iconName: convert hex code to string name if needed
          iconName = normalizeIconName(selectedPreparation.iconName, selectedPreparation.name || selectedPreparation.nameEn || selectedPreparation.nameAr)
        }
      }

      const mappedService: Omit<PreparationService, 'id'> = {
        title: serviceData.title,
        icon: { kind: 'asset', value: iconName },
        serviceType: serviceData.serviceType,
        quantity: serviceData.quantity,
        cost: serviceData.cost,
        advancePayment: serviceData.advancePayment,
        providerUserName: serviceData.providerUserName,
        purchaseDate: serviceData.purchaseDate || '',
        completed: serviceData.completed,
      }

      const preparationId = serviceData.serviceKey ? parseInt(serviceData.serviceKey, 10) : null

      if (editingService) {
        // Update existing line
        const existingLine = localServiceBook.lines?.find(l => String(l.id) === editingService.id)
        if (existingLine) {
          const updatedLine: ServiceLineResponse = {
            ...existingLine,
            title: mappedService.title,
            titleEn: mappedService.title,
            titleAr: mappedService.title,
            quantity: mappedService.quantity,
            price: mappedService.cost,
            advanceAmount: mappedService.advancePayment,
            providerName: mappedService.providerUserName,
            seller: mappedService.providerUserName,
            buyDate: mappedService.purchaseDate || undefined,
            isDone: mappedService.completed,
            iconName: mappedService.icon.value,
            preparationId: preparationId || existingLine.preparationId,
            serviceType: mappedService.serviceType === 'rent' ? 0 : 1,
            lastModifiedDate: new Date().toISOString(),
          }
          setLocalServiceBook(prev => {
            if (!prev) return prev
            return {
              ...prev,
              lines: prev.lines?.map(line => line.id === existingLine.id ? updatedLine : line) || []
            }
          })
        }
      } else {
        // Add new line - create full line object matching backend response shape
        const templateLine = localServiceBook.lines?.[0]
        const baseLine = templateLine || {} as ServiceLineResponse

        const clientTempId = crypto.randomUUID()
        const newLine: ServiceLineResponse & { clientTempId?: string } = {
          // ID will be omitted in sync (set to 0 locally for tracking)
          id: 0,
          bookId: localServiceBook.id,
          lineCategoryId: categoryId || undefined,

          // Title fields
          titleAr: mappedService.title,
          titleEn: mappedService.title,
          title: mappedService.title,

          // Quantity and pricing
          quantity: mappedService.quantity,
          advanceAmount: mappedService.advancePayment,
          price: mappedService.cost,
          totalPrice: undefined,

          // Date fields
          buyDate: mappedService.purchaseDate || undefined,

          // Provider fields
          seller: mappedService.providerUserName || '',
          providerName: mappedService.providerUserName || '',
          providerAddress: baseLine.providerAddress || '',
          providerLink: baseLine.providerLink || '',
          providingType: baseLine.providingType || undefined,
          hasProvider: !!mappedService.providerUserName,

          // Notes
          notes: baseLine.notes || '',

          // Reminder fields
          hasReminder: baseLine.hasReminder || false,
          reminderDate: baseLine.reminderDate || undefined,
          reminderText: baseLine.reminderText || '',
          reminderType: baseLine.reminderType || undefined,

          // Service fields
          budget: baseLine.budget || false,
          serviceType: mappedService.serviceType === 'rent' ? 0 : 1,
          serviceClass: baseLine.serviceClass || (localServiceBook.bookClass as unknown as number) || 0,
          iconName: mappedService.icon.value,
          colorName: baseLine.colorName || '',

          // Linked entities
          preparationId: preparationId || undefined,
          preparation: undefined,
          providerId: baseLine.providerId || undefined,
          provider: undefined,
          serviceId: baseLine.serviceId || undefined,
          service: undefined,
          reservationId: baseLine.reservationId || undefined,
          reservation: undefined,

          // Link flags
          isLinkedToService: baseLine.isLinkedToService || false,
          isLinkedToReservation: baseLine.isLinkedToReservation || false,

          // Service date and notes
          serviceDate: baseLine.serviceDate || undefined,
          serviceNotes: baseLine.serviceNotes || '',
          reservationNotes: baseLine.reservationNotes || '',

          // Line metadata
          groomId: baseLine.groomId || localServiceBook.groomId || undefined,
          brideId: baseLine.brideId || localServiceBook.brideId || undefined,
          lineType: baseLine.lineType || localServiceBook.bookType,
          bookClass: baseLine.bookClass || localServiceBook.bookClass,

          // Status flags
          isDone: mappedService.completed,
          isFavorite: false,
          isDeleted: false,
          isModelLine: false,

          // Server-managed fields (will be removed in sync)
          createdBy: baseLine.createdBy || '',
          lastModifiedBy: baseLine.lastModifiedBy || '',
          slug: baseLine.slug || '',
          creationDate: new Date().toISOString(),
          lastModifiedDate: new Date().toISOString(),

          // Client-only field for deduplication (not sent to backend)
          clientTempId,
        }

        // Add to pendingLines for optimistic UI
        setPendingLines(prev => [...prev, newLine])

        setLocalServiceBook(prev => {
          if (!prev) return prev
          return {
            ...prev,
            lines: [...(prev.lines || []), newLine]
          }
        })
      }

      setHasUnsavedChanges(true)
      setIsModalOpen(false)
      setEditingService(undefined)
      addToast('Preparation saved. Click "Save Changes" to persist.', 'info')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save preparation'
      addToast(errorMessage, 'error')
    }
  }

  const handleConfirmDelete = () => {
    if (!serviceToDelete || !localServiceBook) return

    const lineId = parseInt(serviceToDelete.id, 10)
    setLocalServiceBook(prev => {
      if (!prev) return prev
      return {
        ...prev,
        lines: prev.lines?.map(line =>
          line.id === lineId
            ? { ...line, isDeleted: true }
            : line
        ) || []
      }
    })

    setHasUnsavedChanges(true)
    setIsConfirmDialogOpen(false)
    setServiceToDelete(undefined)
  }

  const handleSync = async () => {
    try {
      if (!localServiceBook) {
        if (isLoading) {
          addToast('Please wait while the service book is loading...', 'info')
          return
        }
        addToast('Service book not found. Please refresh the page.', 'error')
        return
      }

      if (!hasActualChanges()) {
        addToast('No changes to save', 'info')
        setHasUnsavedChanges(false)
        return
      }

      const bookRequest = buildBookRequestFromLocal()

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

      refetch()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes'
      addToast(errorMessage, 'error')
    }
  }

  const completed = mergedLines.filter((line: ServiceLineResponse) => line.isDone).length
  const total = mergedLines.length

  if (isLoading || initMutation.isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading preparations..." fullScreen={true} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-16 text-red-600 mb-4">
          Failed to load preparations. Please try again.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!categoryId) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-16 text-red-600 mb-4">Invalid category</p>
        <Button variant="outline" onClick={() => router.push('/events/planning/preparations')}>
          Back to Categories
        </Button>
      </div>
    )
  }

  const handleBack = () => {
    router.push('/events/planning/preparations')
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back, Title, Save and Add Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              aria-label="Back to Preparations"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-24 font-semibold text-gray-900">Wedding Preparations</h1>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <Button
                className="text-white"
                onClick={handleSync}
                variant="brand"
                size="md"
                disabled={syncMutation.isPending || !localServiceBook || isLoading}
              >
                <Save className="w-5 h-5 mr-2" />
                {syncMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
            <Button
              variant="brand"
              size="md"
              onClick={handleAdd}
              className="text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add new Preparation
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mb-8">
          <PreparationsSummaryCard total={total} completed={completed} />
        </div>

        {/* Preparations Table */}
        <div className="mb-8">
          <PreparationsTable
            services={services}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Modals */}
        <ServiceModal
          open={isModalOpen}
          mode={editingService ? 'edit' : 'add'}
          initialValue={
            editingService
              ? (() => {
                // Find the line to get preparationId
                const line = localServiceBook?.lines?.find(l => String(l.id) === editingService.id)
                const serviceKey = line?.preparationId ? String(line.preparationId) : undefined

                return {
                  id: editingService.id,
                  serviceKey: serviceKey || (editingService.icon.kind === 'asset' ? editingService.icon.value : undefined),
                  title: editingService.title,
                  serviceType: editingService.serviceType as 'rent' | 'buy',
                  quantity: editingService.quantity,
                  cost: editingService.cost,
                  advancePayment: editingService.advancePayment,
                  providerUserName: editingService.providerUserName,
                  purchaseDate: editingService.purchaseDate || '',
                  completed: editingService.completed,
                }
              })()
              : undefined
          }
          onClose={() => {
            setIsModalOpen(false)
            setEditingService(undefined)
          }}
          onSave={handleSave}
        />

        <ConfirmDialog
          open={isConfirmDialogOpen}
          title="Are you sure?"
          description="This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsConfirmDialogOpen(false)
            setServiceToDelete(undefined)
          }}
        />
      </div>
    </div>
  )
}

export default function PreparationsLinesClient() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" text="Loading preparations..." fullScreen={true} />
          </div>
        </div>
      }
    >
      <PreparationsLinesContent />
    </Suspense>
  )
}

