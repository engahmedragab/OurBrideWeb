'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Button, Input, LoadingOverlay, LoadingSpinner } from '@/components/ui'
import { Plus, Trash2, Edit2, Calendar, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import occasionImage from '@/assets/images/occasion.png'
import { useOccasionBook, useSyncOccasionBook } from '@/hooks/occasionBooks'
import { useEventId } from '@/hooks/planning'
import type { OccasionLineResponse, OccasionBookResponse } from '@/types/responses'
import type { OccasionLineRequest, OccasionBookRequest, BookClass, UserType } from '@/../client/common/api/gen/ourbride-api'
import { OccasionType } from '@/../client/common/api/gen/ourbride-api'
import { OccasionDetailView } from '@/components/occasion/components/OccasionDetailView'
import { OccasionForm } from '@/components/occasion/components/OccasionForm'
import type { OccasionFormData } from './schemas/occasion.schema'

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

  // Local state to keep the book in memory
  const [localOccasionBook, setLocalOccasionBook] = useState<OccasionBookResponse | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const lastSyncedRef = useRef<OccasionBookResponse | null>(null)
  const isInitialLoadRef = useRef(true)

  // Fetch occasion book (includes lines) - GET endpoint only
  const { data: occasionBook, isLoading, error, refetch } = useOccasionBook({
    eventId: eventId || undefined,
    userType: null as unknown as UserType | undefined,
    clientId: null as unknown as string | undefined,
    enabled: typeof window !== 'undefined',
  })

  const syncMutation = useSyncOccasionBook()

  // On first load, use the book from GET endpoint immediately
  useEffect(() => {
    if (isInitialLoadRef.current && occasionBook && !localOccasionBook) {
      setLocalOccasionBook(occasionBook)
      lastSyncedRef.current = occasionBook
      isInitialLoadRef.current = false
    }
  }, [occasionBook, localOccasionBook])

  // Sync fetched data to local state when it changes (only if no unsaved changes)
  useEffect(() => {
    if (occasionBook && !hasUnsavedChanges && !isInitialLoadRef.current) {
      setLocalOccasionBook(occasionBook)
      lastSyncedRef.current = occasionBook
    } else if (occasionBook === null && !isLoading && !hasUnsavedChanges) {
      // If book is explicitly null (not just undefined), reset local state
      // But only if we're not loading and have no unsaved changes
      setLocalOccasionBook(null)
    }
  }, [occasionBook, hasUnsavedChanges, isLoading])

  // After sync, update local state from refetched data
  useEffect(() => {
    if (occasionBook && !hasUnsavedChanges && syncMutation.isSuccess) {
      setLocalOccasionBook(occasionBook)
      lastSyncedRef.current = occasionBook
      isInitialLoadRef.current = false
    }
  }, [occasionBook, hasUnsavedChanges, syncMutation.isSuccess])

  // Auto-sync every 2 minutes (only if there are actual changes)
  useEffect(() => {
    if (!eventId || !localOccasionBook || hasUnsavedChanges) return

    const interval = setInterval(async () => {
      try {
        // Check if there are actual changes before syncing
        if (!hasActualChanges()) {
          return // No changes, skip sync
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
        // Update last synced ref
        lastSyncedRef.current = localOccasionBook
        // Refetch to get latest from server
        refetch()
      } catch (error) {
        console.error('Auto-sync failed:', error)
        // Don't show toast for auto-sync failures to avoid annoying the user
      }
    }, 2 * 60 * 1000) // 2 minutes

    return () => clearInterval(interval)
  }, [eventId, localOccasionBook, hasUnsavedChanges, syncMutation, refetch])

  // Get occasion lines from local state (filter out deleted items for display)
  const occasionLines: OccasionLineResponse[] = (localOccasionBook?.lines || []).filter(line => !line.isDeleted)

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

  const editingOccasion = editingLineId
    ? (localOccasionBook?.lines || []).find(line => line.id === editingLineId) || null
    : null

  /**
   * Convert OccasionLineResponse to OccasionLineRequest
   */
  const convertLineToRequest = (line: OccasionLineResponse): OccasionLineRequest => {
    return {
      id: line.id,
      bookId: line.bookId || localOccasionBook?.id || 0,
      date: line.date,
      subDate: line.subDate || null,
      brideFirstName: line.brideFirstName || null,
      brideLastName: line.brideLastName || null,
      groomFirstName: line.groomFirstName || null,
      groomLastName: line.groomLastName || null,
      title: line.title || line.titleEn || line.titleAr || null,
      subTitle: line.subTitle || line.subTitleEn || line.subTitleAr || null,
      caption: line.caption || null,
      type: line.type || OccasionType.Wedding, // Ensure type is never null
      isDone: line.isDone,
      isFavorite: line.isFavorite,
      isDeleted: line.isDeleted,
      isModelLine: line.isModelLine,
      brideId: line.brideId || null,
      groomId: line.groomId || null,
      lineCategoryId: line.lineCategoryId || null,
      lineType: (line.lineType as unknown) as UserType | undefined,
      colorName: line.colorName || null,
      iconName: line.iconName || null,
      creationDate: line.creationDate || null,
      lastModifiedDate: line.lastModifiedDate || null,
    }
  }

  /**
   * Convert form data to OccasionLineRequest
   */
  const convertFormDataToLineRequest = (formData: OccasionFormData): OccasionLineRequest => {
    if (!localOccasionBook?.id) {
      throw new Error('Occasion book not found')
    }

    return {
      id: editingLineId || null,
      bookId: localOccasionBook.id,
      date: formData.date,
      subDate: formData.subDate || null,
      brideFirstName: formData.brideFirstName || null,
      brideLastName: formData.brideLastName || null,
      groomFirstName: formData.groomFirstName || null,
      groomLastName: formData.groomLastName || null,
      title: formData.titleEn || formData.titleAr || null,
      subTitle: formData.subTitleEn || formData.subTitleAr || null,
      caption: formData.caption || null,
      type: formData.type || OccasionType.Wedding, // Ensure type is never null/undefined
      isDone: false,
      isFavorite: false,
      isDeleted: false,
      isModelLine: false,
      brideId: null,
      groomId: null,
      lineCategoryId: null,
      lineType: undefined,
      colorName: null,
      iconName: null,
    }
  }

  /**
   * Build OccasionBookRequest from local state
   * Includes all lines (including deleted ones) for sync
   */
  const buildBookRequestFromLocal = (): OccasionBookRequest => {
    if (!localOccasionBook) {
      throw new Error('Occasion book not found')
    }

    // Include ALL lines (including deleted) for sync
    const allLines = (localOccasionBook.lines || []).map(convertLineToRequest)

    return {
      id: localOccasionBook.id,
      groomId: localOccasionBook.groomId || null,
      brideId: localOccasionBook.brideId || null,
      weddingPlannerId: undefined,
      bookType: (localOccasionBook.bookType as unknown) as UserType | undefined,
      bookClass: localOccasionBook.bookClass as unknown as BookClass | undefined,
      title: localOccasionBook.title || null,
      clientName: null,
      weddingDate: null,
      eventLocation: null,
      lines: allLines,
      lineCategories: null,
      lastModifiedDate: new Date().toISOString(),
    }
  }

  /**
   * Build OccasionBookRequest from current book and updated lines
   */
  const buildBookRequest = (updatedLines: OccasionLineRequest[]): OccasionBookRequest => {
    if (!localOccasionBook) {
      throw new Error('Occasion book not found')
    }

    return {
      id: localOccasionBook.id,
      groomId: localOccasionBook.groomId || null,
      brideId: localOccasionBook.brideId || null,
      weddingPlannerId: undefined,
      bookType: (localOccasionBook.bookType as unknown) as UserType | undefined,
      bookClass: localOccasionBook.bookClass as unknown as BookClass | undefined,
      title: localOccasionBook.title || null,
      clientName: null,
      weddingDate: null,
      eventLocation: null,
      lines: updatedLines,
      lineCategories: null,
      lastModifiedDate: new Date().toISOString(),
    }
  }

  /**
   * Check if there are actual changes between current state and last synced state
   */
  const hasActualChanges = (): boolean => {
    if (!localOccasionBook || !lastSyncedRef.current) {
      return !!localOccasionBook // If we have local state but no last synced, there are changes
    }

    const current = localOccasionBook
    const lastSynced = lastSyncedRef.current

    // Compare basic book properties
    if (
      current.id !== lastSynced.id ||
      current.groomId !== lastSynced.groomId ||
      current.brideId !== lastSynced.brideId ||
      current.title !== lastSynced.title
    ) {
      return true
    }

    // Compare lines - check count first
    const currentLines = current.lines || []
    const lastSyncedLines = lastSynced.lines || []

    if (currentLines.length !== lastSyncedLines.length) {
      return true
    }

    // Deep compare each line
    for (let i = 0; i < currentLines.length; i++) {
      const currentLine = currentLines[i]
      const lastSyncedLine = lastSyncedLines.find(l => l.id === currentLine.id)

      if (!lastSyncedLine) {
        return true // New line added
      }

      // Compare key properties that would indicate a change
      if (
        currentLine.date !== lastSyncedLine.date ||
        currentLine.subDate !== lastSyncedLine.subDate ||
        currentLine.titleEn !== lastSyncedLine.titleEn ||
        currentLine.titleAr !== lastSyncedLine.titleAr ||
        currentLine.subTitleEn !== lastSyncedLine.subTitleEn ||
        currentLine.subTitleAr !== lastSyncedLine.subTitleAr ||
        currentLine.caption !== lastSyncedLine.caption ||
        currentLine.brideFirstName !== lastSyncedLine.brideFirstName ||
        currentLine.brideLastName !== lastSyncedLine.brideLastName ||
        currentLine.groomFirstName !== lastSyncedLine.groomFirstName ||
        currentLine.groomLastName !== lastSyncedLine.groomLastName ||
        currentLine.type !== lastSyncedLine.type ||
        currentLine.isDeleted !== lastSyncedLine.isDeleted ||
        currentLine.isDone !== lastSyncedLine.isDone ||
        currentLine.isFavorite !== lastSyncedLine.isFavorite
      ) {
        return true
      }
    }

    return false
  }

  const handleFormSubmit = async (formData: OccasionFormData) => {
    try {
      if (!localOccasionBook) {
        if (isLoading) {
          return
        }
        return
      }

      // Get current lines from local state (including deleted ones for sync)
      const allLocalLines = localOccasionBook.lines || []
      const currentLines = allLocalLines.map(convertLineToRequest)

      // Create or update the line
      const lineRequest = convertFormDataToLineRequest(formData)

      if (editingLineId) {
        // Update existing line in local state (check all lines including deleted)
        const existingLine = allLocalLines.find(line => line.id === editingLineId)
        if (existingLine) {
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
            lastModifiedDate: new Date().toISOString(),
          }
          setLocalOccasionBook(prev => {
            if (!prev) return prev
            return {
              ...prev,
              lines: prev.lines?.map(line => line.id === editingLineId ? updatedLine : line) || []
            }
          })
        }
      } else {
        // Add new line to local state - use first existing line as template or create minimal structure
        const templateLine = allLocalLines[0]
        const newLine: OccasionLineResponse = templateLine ? {
          ...templateLine,
          id: 0, // Temporary ID for new lines (0 indicates new, not yet saved)
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
          creationDate: new Date().toISOString(),
          lastModifiedDate: new Date().toISOString(),
        } : ({
          // Fallback if no existing lines - this should rarely happen
          id: 0,
          bookId: localOccasionBook.id,
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
          bookClass: localOccasionBook.bookClass,
          createdBy: '',
          lastModifiedBy: '',
          slug: '',
          creationDate: new Date().toISOString(),
          lastModifiedDate: new Date().toISOString(),
        } as unknown as OccasionLineResponse)

        setLocalOccasionBook(prev => {
          if (!prev) return prev
          return {
            ...prev,
            lines: [...(prev.lines || []), newLine]
          }
        })
      }

      setHasUnsavedChanges(true)
      handleCancel()
    } catch (error) {
      // Error handling - no toast
      console.error('Failed to save occasion:', error)
    }
  }

  const handleSync = async () => {
    try {
      if (!localOccasionBook) {
        if (isLoading) {
          return
        }
        return
      }

      // Check if there are actual changes before syncing
      if (!hasActualChanges()) {
        setHasUnsavedChanges(false)
        return
      }

      // Build the full book request from local state
      const bookRequest = buildBookRequestFromLocal()

      // Sync the entire book
      await syncMutation.mutateAsync({
        data: bookRequest,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })

      setHasUnsavedChanges(false)
      lastSyncedRef.current = localOccasionBook

      // Refetch to get latest from server
      refetch()
    } catch (error) {
      // Error handling - no toast
      console.error('Failed to save changes:', error)
    }
  }

  const handleDelete = (lineId: number) => {
    

    if (!localOccasionBook) {
      if (isLoading) {
        return
      }
      return
    }

    // Mark the line as deleted in local state
    setLocalOccasionBook(prev => {
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
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading occasions..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-16 text-red-600 mb-4">
          Failed to load occasions. Please try again.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Save and Add Buttons */}
      <div className="flex items-center justify-between">
        {hasUnsavedChanges && (
          <div className="flex items-center gap-3">
          <Button
              className="rounded-lg text-10 md:text-14 lg hover:bg-brand-500 hover:text-white"
            onClick={handleSync}
              variant="outlineBrand"
            size="md"
            disabled={syncMutation.isPending || !localOccasionBook || isLoading}
          >
            <Save className="w-4 h-4 " />
            {syncMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
            <span className="text-12 md:text-14 text-gray-600">Unsaved changes</span>
          </div>
        )}
        <div className={cn("flex items-center gap-2", !hasUnsavedChanges && "ml-auto")}>
          <Button
            className="rounded-lg text-10 md:text-14  hover:bg-brand-500 hover:text-white"
            onClick={handleAddNew}
            variant="outlineBrand"
            size="md"
            disabled={isFormOpen || !localOccasionBook || isLoading}
          >
            Add New Occasion
            <Plus className="w-4 h-4 " />
          </Button>
        </div>
      </div>

      {/* Form Section - Separate from cards */}
      {isFormOpen && (
        <OccasionForm
          isOpen={isFormOpen}
          onClose={handleCancel}
          onSubmit={handleFormSubmit}
          editingOccasion={editingOccasion}
          isSubmitting={syncMutation.isPending}
        />
      )}

      {/* Occasions List - Only show when form is closed */}
      {!isFormOpen && (
        <>
          {occasionLines.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-16 text-gray-600 mb-2">No occasions found</p>
          <p className="text-14 text-gray-500">Create your first occasion to get started</p>
        </div>
      ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasionLines.map(line => (
            <div
              key={line.id}
              className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOccasionClick(line)}
            >
              {/* Image Section - 50% of card */}
              <div className="relative h-48 w-full">
                <Image
                  src={occasionImage}
                  alt={line.title || line.titleEn || 'Occasion'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/20"></div>
                {/* Action Buttons Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(line)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-brand-500 hover:bg-white transition-all shadow-sm"
                    disabled={isFormOpen}
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(line.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 hover:text-red-700 hover:bg-white transition-all shadow-sm"
                    disabled={syncMutation.isPending}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Section - 50% of card */}
              <div className="p-5 space-y-3">
                {/* Occasion Title */}
                <h3 className="text-18 font-semibold text-gray-900 line-clamp-2">
                  {line.title || line.titleEn || 'Untitled Occasion'}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-2 text-14 text-gray-600">
                  <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span>{formatDate(line.date)}</span>
                </div>
              </div>
            </div>
          ))}
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


