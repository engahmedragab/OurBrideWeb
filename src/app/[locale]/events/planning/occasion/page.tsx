'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { Button, Input, LoadingOverlay, LoadingSpinner } from '@/components/ui'
import { Plus, Trash2, Edit2, Calendar, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import occasionImage from '@/assets/images/occasion.png'
import brideNameSvg from '@/assets/svg/bridename.svg'
import groomNameSvg from '@/assets/svg/groomname.svg'
import heartSvg from '@/assets/svg/heart.svg'
import { useOccasionBook, useSyncOccasionBook, useSyncOccasionBookDelta } from '@/hooks/occasionBooks'
import { useEventId } from '@/hooks/planning'
import { usePlanningBookController } from '@/hooks/planning/usePlanningBookController'
import { useInitOccasionBooks, useAddOccasionBookModels } from '@/hooks/bookInit'
import type { OccasionLineResponse, OccasionBookResponse } from '@/types/responses'
import type { OccasionBookRequest, OccasionLineRequest, UserType, BookClass } from '@/../client/common/api/gen/ourbride-api'
import type { SyncBookDeltaResponse } from '@/hooks/planning/usePlanningBookController'
import { OccasionType } from '@/../client/common/api/gen/ourbride-api'
import {
  buildBookRequestFromLocal as buildOccasionBookRequest,
  convertLineToRequest,
} from '@/utils/planning/mappers/occasionMappers'
import { OccasionDetailView } from '@/components/occasion/components/OccasionDetailView'
import { OccasionForm } from '@/components/occasion/components/OccasionForm'
import type { OccasionFormData } from '@/schema/occasion.schema'
import { generateTempId } from '@/utils/sync/tempIds'

/**
 * Format date from ISO string to readable format
 */
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No date'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid date'
  }
}

/**
 * Format date and time from ISO string
 */
const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No date'
  try {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${day}, ${month} ${year} ${hours}:${minutes}`
  } catch {
    return 'Invalid date'
  }
}

/**
 * Calculate time remaining until the occasion
 */
const calculateTimeRemaining = (targetDate: string | null | undefined, nowOverride?: Date) => {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, isPast: true }
  }

  const now = nowOverride ?? new Date()
  const target = new Date(targetDate)
  const diff = target.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, isPast: false }
}

/**
 * Get occasion type label
 */
const getOccasionTypeLabel = (type?: OccasionType): string => {
  if (!type) return 'Occasion'
  return type // The enum values are already strings like "Wedding", "Engagement", etc.
}

function OccasionsPageContent() {
  const eventId = useEventId()
  const [editingLineId, setEditingLineId] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionLineResponse | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [now, setNow] = useState(() => new Date())

  // Fetch occasion book (includes lines) - GET endpoint only
  const { data: occasionBook, isLoading, error, refetch } = useOccasionBook({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: typeof window !== 'undefined',
  })

  const syncMutation = useSyncOccasionBook()
  const syncDeltaMutation = useSyncOccasionBookDelta()
  const initMutation = useInitOccasionBooks()
  const addModelsMutation = useAddOccasionBookModels()
  const {
    localBook: localOccasionBook,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    save,
    applyLocalUpdate,
    getActiveLines,
    getLineById,
    isInitializing,
    isAddingModels,
  } = usePlanningBookController<OccasionBookResponse, OccasionLineResponse>({
    book: occasionBook ?? null,
    isLoading,
    eventId: eventId ?? undefined,
    requireEventId: true,
    syncFn: async () => {
      if (!localOccasionBook) throw new Error('Occasion book not found')
      const bookRequest = buildOccasionBookRequest(localOccasionBook)
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
        data: delta as unknown as import('@/types/syncDelta').SyncBookDeltaRequest<import('@/../client/common/api/gen/ourbride-api').OccasionLineRequest, import('@/../client/common/api/gen/ourbride-api').OccasionLineCategoryRequest>,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })
      return response as unknown as SyncBookDeltaResponse<OccasionBookResponse>
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
      current.date === last.date &&
      current.subDate === last.subDate &&
      current.titleEn === last.titleEn &&
      current.titleAr === last.titleAr &&
      current.subTitleEn === last.subTitleEn &&
      current.subTitleAr === last.subTitleAr &&
      current.caption === last.caption &&
      current.brideFirstName === last.brideFirstName &&
      current.brideLastName === last.brideLastName &&
      current.groomFirstName === last.groomFirstName &&
      current.groomLastName === last.groomLastName &&
      current.type === last.type &&
      current.isDeleted === last.isDeleted &&
      current.isDone === last.isDone &&
      current.isFavorite === last.isFavorite,
    isLineDeleted: (line) => line.isDeleted ?? false,
  })

  // Get occasion lines using controller helper
  const occasionLines: OccasionLineResponse[] = useMemo(() => {
    return getActiveLines() as OccasionLineResponse[]
  }, [getActiveLines])

  useEffect(() => {
    setIsMounted(true)
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleAddNew = () => {
    setIsAddingNew(true)
    setEditingLineId(null)
    setIsFormOpen(true)
  }

  const handleEdit = (line: OccasionLineResponse) => {
    setSelectedOccasion(null) // Close detail view if open
    setEditingLineId(line.id)
    setIsAddingNew(false)
    setIsFormOpen(true)
  }

  const handleOccasionClick = (line: OccasionLineResponse) => {
    setSelectedOccasion(line)
  }

  const handleCloseDetail = () => {
    setSelectedOccasion(null)
  }

  const handleEditFromDetail = (line: OccasionLineResponse) => {
    setSelectedOccasion(null)
    handleEdit(line)
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingLineId(null)
    setIsFormOpen(false)
  }

  // Get editing occasion using controller helper
  const editingOccasion = useMemo(() => {
    if (!editingLineId) return null
    return getLineById(editingLineId) as OccasionLineResponse | null
  }, [editingLineId, getLineById])




  const handleFormSubmit = async (formData: OccasionFormData) => {
    if (!localOccasionBook?.id) {
      console.error('Occasion book not found')
      return
    }

    const result = applyLocalUpdate((currentBook) => {
      const allLocalLines = currentBook.lines || []
      const now = new Date().toISOString()

      if (editingLineId) {
        // Update existing line
        const existingLine = allLocalLines.find((line) => line.id === editingLineId)
        if (!existingLine) return currentBook

        const updatedLine: OccasionLineResponse = {
          ...existingLine,
          date: formData.date,
          subDate: formData.subDate || existingLine.subDate,
          brideFirstName: formData.brideFirstName || existingLine.brideFirstName,
          brideLastName: formData.brideLastName || existingLine.brideLastName,
          groomFirstName: formData.groomFirstName || existingLine.groomFirstName,
          groomLastName: formData.groomLastName || existingLine.groomLastName,
          title: formData.titleEn || formData.titleAr || existingLine.title,
          titleEn: formData.titleEn || existingLine.titleEn,
          titleAr: formData.titleAr || existingLine.titleAr,
          subTitle: formData.subTitleEn || formData.subTitleAr || existingLine.subTitle,
          subTitleEn: formData.subTitleEn || existingLine.subTitleEn,
          subTitleAr: formData.subTitleAr || existingLine.subTitleAr,
          caption: formData.caption || existingLine.caption,
          type: formData.type || existingLine.type || OccasionType.Wedding,
          lastModifiedDate: now,
        }

        return {
          ...currentBook,
          lines: (currentBook.lines || []).map((line) => (line.id === editingLineId ? updatedLine : line)),
        }
      }

      // Create new line
      const templateLine = allLocalLines[0]
      const tempLineId = generateTempId()
      const newLine: OccasionLineResponse = templateLine
        ? {
          ...templateLine,
          id: tempLineId,
          date: formData.date,
          subDate: formData.subDate || undefined,
          brideFirstName: formData.brideFirstName || '',
          brideLastName: formData.brideLastName || '',
          groomFirstName: formData.groomFirstName || '',
          groomLastName: formData.groomLastName || '',
          title: formData.titleEn || formData.titleAr || '',
          titleEn: formData.titleEn || '',
          titleAr: formData.titleAr || '',
          subTitle: formData.subTitleEn || formData.subTitleAr || '',
          subTitleEn: formData.subTitleEn || '',
          subTitleAr: formData.subTitleAr || '',
          caption: formData.caption || '',
          type: formData.type || OccasionType.Wedding,
          isDone: false,
          isFavorite: false,
          isDeleted: false,
          creationDate: now,
          lastModifiedDate: now,
        }
        : ({
          id: tempLineId,
          bookId: currentBook.id,
          date: formData.date,
          subDate: formData.subDate,
          brideFirstName: formData.brideFirstName || '',
          brideLastName: formData.brideLastName || '',
          groomFirstName: formData.groomFirstName || '',
          groomLastName: formData.groomLastName || '',
          title: formData.titleEn || formData.titleAr || '',
          titleEn: formData.titleEn || '',
          titleAr: formData.titleAr || '',
          subTitle: formData.subTitleEn || formData.subTitleAr || '',
          subTitleEn: formData.subTitleEn || '',
          subTitleAr: formData.subTitleAr || '',
          caption: formData.caption || '',
          type: formData.type || OccasionType.Wedding,
          isDone: false,
          isFavorite: false,
          isDeleted: false,
          isModelLine: false,
          colorName: '',
          iconName: '',
          bookClass: currentBook.bookClass,
          createdBy: '',
          lastModifiedBy: '',
          slug: '',
          creationDate: now,
          lastModifiedDate: now,
        } as unknown as OccasionLineResponse)

      return {
        ...currentBook,
        lines: [...(currentBook.lines || []), newLine],
      }
    })

    if (result.ok) {
      handleCancel()
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

  const handleDelete = (lineId: number) => {
    const result = applyLocalUpdate((prev) => ({
      ...prev,
      lines:
        prev.lines?.map((line) => (line.id === lineId ? { ...line, isDeleted: true, lastModifiedDate: new Date().toISOString() } : line)) || [],
    }))
    if (!result.ok) return
  }

  if (isLoading || isInitializing || isAddingModels) {
    const loadingTitle = isInitializing
      ? 'Initializing occasion book...'
      : isAddingModels
        ? 'Adding default models...'
        : 'Loading occasions...'
    const loadingSubtitle = isInitializing
      ? 'Setting up your occasion book'
      : isAddingModels
        ? 'Please wait while we add default models'
        : 'Please wait a moment'

    return (
      <div className="flex items-center justify-center py-12">
        <LoadingOverlay open={true} title={loadingTitle} subtitle={loadingSubtitle} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ErrorModal
          open={true}
          title="Failed to Load Occasions"
          message="Failed to load occasions. Please try again."
          onRetry={() => window.location.reload()}
          onClose={() => { }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Save and Add Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {(hasUnsavedChanges || syncMutation.isPending) && (
          <div className="flex items-center gap-3">
            <Button
              variant="brand"
              size="md"
              onClick={handleSync}
              disabled={syncMutation.isPending || !localOccasionBook || isLoading}
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
        <div className={cn("flex items-center gap-2", !hasUnsavedChanges && !syncMutation.isPending && "ml-auto")}>
          <Button
            variant="brand"
            size="md"
            onClick={handleAddNew}
            disabled={isFormOpen || !localOccasionBook || isLoading}
            className="flex items-center gap-2 rounded-xl !text-white"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add New Occasion
          </Button>
        </div>
      </div>

      {/* Form Section - Modal overlay style */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <OccasionForm
              isOpen={isFormOpen}
              onClose={handleCancel}
              onSubmit={handleFormSubmit}
              editingOccasion={editingOccasion}
              isSubmitting={syncMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Occasions List - Only show when form is closed */}
      {!isFormOpen && (
        <>
          {occasionLines.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-18 font-semibold text-gray-900 mb-2">No occasions found</p>
              <p className="text-14 text-gray-600">Create your first occasion to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {occasionLines.map(line => {
                const timeRemaining = calculateTimeRemaining(line.date, now)
                return (
                  <div
                    key={line.id}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    onClick={() => handleOccasionClick(line)}
                  >
                    {/* Image Section with gradient overlay */}
                    <div className="relative h-56 w-full">
                      <Image
                        src={occasionImage}
                        alt={line.title || line.titleEn || 'Occasion'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                      {/* Action Buttons Overlay */}
                      <div className="absolute top-3 right-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEdit(line)}
                          className="p-2 bg-white/95 backdrop-blur-sm rounded-lg text-gray-700 hover:text-brand-500 hover:bg-white transition-all shadow-md hover:shadow-lg"
                          disabled={isFormOpen}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(line.id)}
                          className="p-2 bg-white/95 backdrop-blur-sm rounded-lg text-red-500 hover:text-red-700 hover:bg-white transition-all shadow-md hover:shadow-lg"
                          disabled={syncMutation.isPending}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                      {/* Names Section */}
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <Image
                            src={typeof groomNameSvg === 'string' ? groomNameSvg : groomNameSvg.src || groomNameSvg}
                            alt={line.groomFirstName || line.groomLastName || 'Groom'}
                            width={223}
                            height={42}
                            className="h-6 w-auto"
                          />
                          <p className="text-12 italic text-gray-900 font-semibold">
                            {[line.groomFirstName, line.groomLastName].filter(Boolean).join(' ') || 'Groom Name'}
                          </p>
                        </div>
                        <Image
                          src={typeof heartSvg === 'string' ? heartSvg : heartSvg.src || heartSvg}
                          alt="Heart"
                          width={188}
                          height={119}
                          className="h-8 w-auto"
                        />
                        <div className="flex flex-col items-center gap-1">
                          <Image
                            src={typeof brideNameSvg === 'string' ? brideNameSvg : brideNameSvg.src || brideNameSvg}
                            alt={line.brideFirstName || line.brideLastName || 'Bride'}
                            width={203}
                            height={38}
                            className="h-6 w-auto"
                          />
                          <p className="text-12 italic text-gray-900 font-semibold">
                            {[line.brideFirstName, line.brideLastName].filter(Boolean).join(' ') || 'Bride Name'}
                          </p>
                        </div>
                      </div>

                      {/* Occasion Title */}
                      <div className="text-center">
                        <p className="text-16 italic font-semibold text-gray-900 line-clamp-2">
                          {line.title || line.titleEn || line.titleAr || 'Occasion Name'}
                        </p>
                      </div>

                      {/* Countdown */}
                      {isMounted && !timeRemaining.isPast && (
                        <div className="flex items-baseline justify-center gap-4">
                          <div className="text-center">
                            <div className="text-18 font-bold text-gray-900 italic">
                              {timeRemaining.days}
                            </div>
                            <div className="text-12 text-gray-600 font-medium italic">Days</div>
                          </div>
                          <div className="text-center">
                            <div className="text-18 font-bold text-gray-900 italic">
                              {timeRemaining.hours}
                            </div>
                            <div className="text-12 text-gray-600 font-medium italic">Hours</div>
                          </div>
                          <div className="text-center">
                            <div className="text-18 font-bold text-gray-900 italic">
                              {timeRemaining.minutes}
                            </div>
                            <div className="text-12 text-gray-600 font-medium italic">Minutes</div>
                          </div>
                        </div>
                      )}

                      {/* Date and Time */}
                      <div className="flex items-center justify-center gap-2 text-12 text-gray-700 pt-2 border-t border-gray-100">
                        <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
                        <span>{formatDateTime(line.date)}</span>
                      </div>

                      {/* Subtitle */}
                      {(line.subTitle || line.subTitleEn || line.subTitleAr) && (
                        <p className="text-14 text-gray-500 text-center line-clamp-2">
                          {line.subTitle || line.subTitleEn || line.subTitleAr}
                        </p>
                      )}

                      {/* Caption */}
                      {line.caption && (
                        <p className="text-12 text-gray-600 italic text-center line-clamp-2">
                          {line.caption}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Occasion Detail View Modal */}
      {selectedOccasion && (
        <OccasionDetailView
          occasion={selectedOccasion}
          onClose={handleCloseDetail}
          onEdit={() => handleEditFromDetail(selectedOccasion)}
        />
      )}
    </div>
  )
}

export default function OccasionsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingOverlay open={true} title="Loading occasions..." />
          </div>
        </div>
      }
    >
      <OccasionsPageContent />
    </Suspense>
  )
}


