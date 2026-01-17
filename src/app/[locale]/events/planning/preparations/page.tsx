'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Button, LoadingSpinner } from '@/components/ui'
import { ChevronLeft, Save, Plus } from 'lucide-react'
import { useServiceBook, useSyncServiceBook, useSyncServiceBookDelta } from '@/hooks/serviceBooks'
import { useEventId } from '@/hooks/planning'
import { usePlanningBookController } from '@/hooks/planning/usePlanningBookController'
import { useInitServiceBooks, useAddServiceBookModels } from '@/hooks/bookInit'
import { useToast } from '@/components/ui/Toaster'
import type { ServiceBookResponse, ServiceLineResponse } from '@/types/responses'
import type { ServiceBookRequest, UserType } from '@/../client/common/api/gen/ourbride-api'
import { buildBookRequestFromLocal, convertLineToRequest } from '@/utils/planning/mappers/preparationsMappers'
import {
  PreparationsSummaryCard,
  PreparationsTable,
  ServiceModal,
  ConfirmDialog,
} from '@/components/planning'
import type { PreparationService } from '@/types/planning'
import { usePreparations } from '@/hooks/planning/usePreparations'
import { normalizeIconName, getServiceClassNumber } from '@/utils/serviceIconMapper'

/**
 * Convert ServiceLineResponse to PreparationService format
 */
const convertServiceLineToPreparationService = (line: ServiceLineResponse): PreparationService => {
  const serviceTypeStr = line.serviceType === 0 ? 'rent' : line.serviceType === 1 ? 'buy' : 'rent'

  // Priority: serviceClass > line iconName
  // Store serviceClass in "class:X" format for ServiceCell to use getServiceIconByClass
  const iconValue = line.serviceClass !== undefined && line.serviceClass !== null
    ? `class:${line.serviceClass}`
    : (line.iconName || '')

  return {
    id: String(line.id),
    title: line.title || line.titleEn || line.titleAr || '',
    icon: { kind: 'asset', value: iconValue },
    serviceType: serviceTypeStr,
    quantity: line.quantity || 1,
    cost: line.price || 0,
    advancePayment: line.advanceAmount || 0,
    providerUserName: line.providerName || line.seller || '',
    purchaseDate: line.buyDate || '',
    completed: line.isDone || false,
  }
}

function PreparationsPageContent() {
  const router = useRouter()
  const eventId = useEventId()
  const { addToast } = useToast()

  const [isMounted, setIsMounted] = useState(false)
  const [currentService, setCurrentService] = useState<PreparationService | undefined>()
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const [serviceToDelete, setServiceToDelete] = useState<PreparationService | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch service book (includes lines) - GET endpoint only
  const { data: serviceBook, isLoading, refetch } = useServiceBook({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: isMounted,
  })

  // Fetch preparations (services) for dropdown
  const { data: preparations = [] } = usePreparations({
    enabled: isMounted,
  })

  const syncMutation = useSyncServiceBook()
  const syncDeltaMutation = useSyncServiceBookDelta()
  const initMutation = useInitServiceBooks()
  const addModelsMutation = useAddServiceBookModels()

  const {
    localBook: localServiceBook,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    save,
    applyLocalUpdate,
    getActiveLines,
    isInitializing,
    isAddingModels,
  } = usePlanningBookController<ServiceBookResponse, ServiceLineResponse>({
    book: serviceBook ?? null,
    isLoading,
    eventId: eventId ?? undefined,
    requireEventId: true,
    syncFn: async (book) => {
      const bookRequest = buildBookRequestFromLocal(book)
      await syncMutation.mutateAsync({
        data: bookRequest,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })
      refetch()
    },
    syncDeltaFn: async (delta) => {
      const response = await syncDeltaMutation.mutateAsync({
        data: delta,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })
      return response as any
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
    isSameBookBase: (current, last) =>
      current.id === last.id &&
      current.groomId === last.groomId &&
      current.brideId === last.brideId &&
      current.title === last.title,
    getLines: (book) => book.lines || [],
    getCategories: () => [],
    getLineId: (line) => line.id,
    getCategoryId: () => -1,
    convertLineToRequest,
    isSameLine: (current, last) =>
      current.title === last.title &&
      current.titleEn === last.titleEn &&
      current.titleAr === last.titleAr &&
      current.isDeleted === last.isDeleted &&
      current.isDone === last.isDone &&
      current.isFavorite === last.isFavorite,
    isLineDeleted: (line) => line.isDeleted ?? false,
    isLineDone: (line) => line.isDone ?? false,
  })

  // Get active lines from controller
  const activeLines = useMemo(() => getActiveLines() as ServiceLineResponse[], [getActiveLines])

  // Convert lines to PreparationService format and resolve icons from service class
  const services: PreparationService[] = useMemo(() => {
    return activeLines.map((line) => {
      const service = convertServiceLineToPreparationService(line)

      // Prefer serviceClass from line, fallback to preparation class
      const prepClass =
        line.preparation?.class ??
        preparations.find(p => p.id === line.preparationId)?.class
      const rawClass = line.serviceClass ?? prepClass
      const resolvedClass =
        typeof rawClass === 'string' ? getServiceClassNumber(rawClass) : rawClass

      const iconValue =
        resolvedClass !== undefined && resolvedClass !== null && resolvedClass !== 0
          ? `class:${resolvedClass}`
          : ''

      if (process.env.NODE_ENV === 'development') {
        // Debug icon resolution for preparations
        console.log('[Preparations] icon resolution', {
          lineId: line.id,
          title: line.title || line.titleEn || line.titleAr,
          lineServiceClass: line.serviceClass,
          preparationId: line.preparationId,
          preparationClass: prepClass,
          resolvedClass,
          iconName: line.iconName,
          iconValue,
        })
      }

      service.icon = { kind: 'asset', value: iconValue }
      return service
    })
  }, [activeLines, preparations])

  const completed = services.filter(s => s.completed).length
  const total = services.length

  const handleAdd = () => {
    setCurrentService(undefined)
    setModalMode('add')
    setIsModalOpen(true)
  }

  const handleEdit = (service: PreparationService) => {
    setCurrentService(service)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleView = (service: PreparationService) => {
    setCurrentService(service)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleDelete = (service: PreparationService) => {
    setServiceToDelete(service)
    setIsConfirmDialogOpen(true)
  }

  const handleSave = async (serviceData: {
    completed: boolean
    serviceKey: string
    title: string
    serviceType: 'rent' | 'buy'
    quantity: number
    cost: number
    advancePayment: number
    providerUserName: string
    purchaseDate: string
  }) => {
    try {
      if (!localServiceBook) {
        addToast('Service book not found', 'error')
        return
      }

      // Find the selected preparation to get serviceClass and iconName
      let iconName = 'Sparkles'
      let serviceClass: number | undefined = undefined
      if (serviceData.serviceKey) {
        const selectedPreparation = preparations.find(p => String(p.id) === serviceData.serviceKey)
        if (selectedPreparation) {
          // Priority: use serviceClass if available, otherwise use iconName
          // ServiceClass from API might be string enum, convert to number if needed
          const prepClass = selectedPreparation.class
          if (prepClass !== undefined && prepClass !== null) {
            // Convert string enum to number if needed
            serviceClass = typeof prepClass === 'string'
              ? getServiceClassNumber(prepClass)
              : prepClass
            // Store serviceClass in iconName format for consistency
            iconName = `class:${serviceClass}`
          } else {
            iconName = normalizeIconName(selectedPreparation.iconName, selectedPreparation.name || selectedPreparation.nameEn || selectedPreparation.nameAr)
          }
        }
      }

      const preparationId = serviceData.serviceKey ? parseInt(serviceData.serviceKey, 10) : null

      if (currentService && modalMode === 'edit') {
        // Update existing line
        const result = applyLocalUpdate((current) => {
          const updatedLines = (current.lines || []).map((line: ServiceLineResponse) => {
            if (String(line.id) === currentService.id) {
              return {
                ...line,
                title: serviceData.title,
                titleEn: serviceData.title,
                titleAr: serviceData.title,
                quantity: serviceData.quantity,
                price: serviceData.cost,
                advanceAmount: serviceData.advancePayment,
                providerName: serviceData.providerUserName,
                seller: serviceData.providerUserName,
                buyDate: serviceData.purchaseDate || undefined,
                isDone: serviceData.completed,
                iconName,
                serviceClass: serviceClass ?? line.serviceClass ?? 0,
                preparationId: preparationId ?? undefined,
                lastModifiedDate: new Date().toISOString(),
              }
            }
            return line
          })
          return { ...current, lines: updatedLines }
        })
        if (!result.ok) return
      } else if (modalMode === 'add') {
        // Create new line
        const newLine: ServiceLineResponse = {
          id: -Date.now(), // Temporary ID
          bookId: localServiceBook.id,
          title: serviceData.title,
          titleEn: serviceData.title,
          titleAr: serviceData.title,
          quantity: serviceData.quantity,
          price: serviceData.cost,
          advanceAmount: serviceData.advancePayment,
          providerName: serviceData.providerUserName,
          seller: serviceData.providerUserName,
          providerAddress: '',
          providerLink: '',
          buyDate: serviceData.purchaseDate || undefined,
          isDone: serviceData.completed,
          isFavorite: false,
          isDeleted: false,
          isModelLine: false,
          iconName,
          preparationId: preparationId ?? undefined,
          serviceType: serviceData.serviceType === 'rent' ? 0 : 1,
          serviceClass: serviceClass ?? 0,
          lineType: 0,
          bookClass: 0,
          hasReminder: false,
          reminderText: '',
          hasProvider: false,
          budget: false,
          isLinkedToService: false,
          isLinkedToReservation: false,
          serviceNotes: '',
          reservationNotes: '',
          notes: '',
          colorName: '',
          slug: '',
          creationDate: new Date().toISOString(),
          lastModifiedDate: new Date().toISOString(),
          createdBy: '',
          lastModifiedBy: '',
        }

        const result = applyLocalUpdate((current) => ({
          ...current,
          lines: [...(current.lines || []), newLine],
        }))
        if (!result.ok) return
        setIsModalOpen(false)
        setCurrentService(undefined)
        addToast('Preparation saved. Click "Save Changes" to persist.', 'info')
      } else {
        // View mode - just close the modal
        setIsModalOpen(false)
        setCurrentService(undefined)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save preparation'
      addToast(errorMessage, 'error')
    }
  }

  const handleConfirmDelete = () => {
    if (!serviceToDelete || !localServiceBook) return

    const result = applyLocalUpdate((current) => {
      const lineId = parseInt(serviceToDelete.id, 10)
      const updatedLines = (current.lines || []).map((line: ServiceLineResponse) =>
        line.id === lineId ? { ...line, isDeleted: true } : line
      )
      return { ...current, lines: updatedLines }
    })

    if (result.ok) {
      setIsConfirmDialogOpen(false)
      setServiceToDelete(undefined)
      addToast('Preparation deleted. Click "Save Changes" to persist.', 'info')
    }
  }

  const handleSync = async () => {
    const result = await save()
    if (!result.ok) {
      if (result.reason === 'loading' || result.reason === 'no-changes') {
        addToast(result.message || 'No changes to save', 'info')
        if (result.reason === 'no-changes') setHasUnsavedChanges(false)
        return
      }
      addToast(result.message || 'Failed to save changes', 'error')
      return
    }
    addToast(result.message || 'Changes saved successfully', 'success')
  }

  const handleBack = () => {
    router.push('/dashboard/my-events')
  }

  const handleRowClick = (service: PreparationService) => {
    // Open view modal when clicking row
    handleView(service)
  }

  // Check if initializing or adding models
  const showLoading = !isMounted || isLoading || isInitializing || isAddingModels

  if (showLoading) {
    const loadingText = isInitializing
      ? 'Initializing preparations book...'
      : isAddingModels
        ? 'Adding default models...'
        : 'Loading preparations...'

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text={loadingText} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
            {(hasUnsavedChanges || syncMutation.isPending) && (
              <>
                <Button
                  onClick={handleSync}
                  variant="brand"
                  size="md"
                  className="flex items-center gap-2 rounded-xl !text-white"
                  disabled={syncMutation.isPending || !localServiceBook || isLoading}
                  type="button"
                >
                  <Save className="h-4 w-4" />
                  {syncMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>

                {hasUnsavedChanges && (
                  <span className="text-16 text-brand-500 font-medium">Unsaved changes</span>
                )}
              </>
            )}
            <Button
              onClick={handleAdd}
              variant="brand"
              size="md"
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
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRowClick={handleRowClick}
          />
        </div>

        {/* Unified Modal - Handles Add, Edit, and View modes */}
        <ServiceModal
          open={isModalOpen}
          mode={modalMode}
          initialValue={
            currentService
              ? (() => {
                // Find the actual line from the book to get all details
                const line = activeLines.find(l => String(l.id) === currentService.id)

                // Get preparationId from the line (this is the serviceKey for the modal)
                const serviceKey = line?.preparationId ? String(line.preparationId) : ''
                const rawServiceClass = line?.serviceClass ?? line?.preparation?.class ?? undefined
                const serviceClass =
                  typeof rawServiceClass === 'string'
                    ? getServiceClassNumber(rawServiceClass)
                    : rawServiceClass

                return {
                  id: currentService.id,
                  serviceKey: serviceKey, // Use preparationId as serviceKey
                  serviceClass,
                  title: currentService.title,
                  serviceType: currentService.serviceType as 'rent' | 'buy',
                  quantity: currentService.quantity,
                  cost: currentService.cost,
                  advancePayment: currentService.advancePayment,
                  providerUserName: currentService.providerUserName,
                  purchaseDate: currentService.purchaseDate || '',
                  completed: currentService.completed,
                }
              })()
              : undefined
          }
          onClose={() => {
            setIsModalOpen(false)
            setCurrentService(undefined)
            setModalMode('add')
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

/**
 * Preparations Page
 * Shows all preparation lines in a table
 */
export default function PreparationsPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    }>
      <PreparationsPageContent />
    </Suspense>
  )
}
