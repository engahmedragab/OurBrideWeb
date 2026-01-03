'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Button, Input, LoadingSpinner } from '@/components/ui'
import { ErrorModal } from '@/components/ui/ErrorModal'
import { Plus, Trash2, Edit2, Calendar, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOccasionBook, useSyncOccasionBook } from '@/hooks/occasionBooks'
import { useEventId } from '@/hooks/planning'
import { useToast } from '@/components/ui/Toaster'
import type { OccasionLineResponse, OccasionBookResponse } from '@/types/responses'
import type { OccasionLineRequest, OccasionBookRequest, BookClass, UserType } from '@/../client/common/api/gen/ourbride-api'
import { OccasionType } from '@/../client/common/api/gen/ourbride-api'

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
  const { addToast } = useToast()
  const eventId = useEventId()
  const [editingLineId, setEditingLineId] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState<{
    titleEn?: string
    titleAr?: string
    subTitleEn?: string
    subTitleAr?: string
    caption?: string
    date?: string
    subDate?: string
    brideFirstName?: string
    brideLastName?: string
    groomFirstName?: string
    groomLastName?: string
    type?: OccasionType
  }>({
    titleEn: '',
    titleAr: '',
    subTitleEn: '',
    subTitleAr: '',
    caption: '',
    date: new Date().toISOString(),
    brideFirstName: '',
    brideLastName: '',
    groomFirstName: '',
    groomLastName: '',
    type: OccasionType.Wedding,
  })

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
    setFormData({
      titleEn: '',
      titleAr: '',
      subTitleEn: '',
      subTitleAr: '',
      caption: '',
      date: new Date().toISOString(),
      brideFirstName: '',
      brideLastName: '',
      groomFirstName: '',
      groomLastName: '',
      type: OccasionType.Wedding,
    })
  }

  const handleEdit = (line: OccasionLineResponse) => {
    setEditingLineId(line.id)
    setFormData({
      titleEn: line.titleEn,
      titleAr: line.titleAr,
      subTitleEn: line.subTitleEn,
      subTitleAr: line.subTitleAr,
      caption: line.caption,
      date: line.date,
      subDate: line.subDate,
      brideFirstName: line.brideFirstName,
      brideLastName: line.brideLastName,
      groomFirstName: line.groomFirstName,
      groomLastName: line.groomLastName,
      type: line.type,
    })
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingLineId(null)
    setFormData({})
  }

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
  const convertFormDataToLineRequest = (): OccasionLineRequest => {
    if (!localOccasionBook?.id) {
      throw new Error('Occasion book not found')
    }

    return {
      id: editingLineId || null,
      bookId: localOccasionBook.id,
      date: formData.date!,
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

  const handleSave = async () => {
    try {
      if (!localOccasionBook) {
        if (isLoading) {
          addToast('Please wait while the occasion book is loading...', 'info')
          return
        }
        addToast('Occasion book not found. Please refresh the page.', 'error')
        return
      }

      // Validate required fields
      if (!formData.titleEn && !formData.titleAr) {
        addToast('Please enter a title (English or Arabic)', 'error')
        return
      }

      if (!formData.date) {
        addToast('Please select a date', 'error')
        return
      }

      // Validate BrideFirstName: required, 2-15 characters
      if (!formData.brideFirstName || formData.brideFirstName.trim().length === 0) {
        addToast('Bride first name is required', 'error')
        return
      }
      if (formData.brideFirstName.trim().length < 2 || formData.brideFirstName.trim().length > 15) {
        addToast('Bride first name must be between 2 and 15 characters', 'error')
        return
      }

      // Validate GroomFirstName: required, 2-15 characters
      if (!formData.groomFirstName || formData.groomFirstName.trim().length === 0) {
        addToast('Groom first name is required', 'error')
        return
      }
      if (formData.groomFirstName.trim().length < 2 || formData.groomFirstName.trim().length > 15) {
        addToast('Groom first name must be between 2 and 15 characters', 'error')
        return
      }

      // Get current lines from local state (including deleted ones for sync)
      const allLocalLines = localOccasionBook.lines || []
      const currentLines = allLocalLines.map(convertLineToRequest)

      // Create or update the line
      const lineRequest = convertFormDataToLineRequest()

      let updatedLines: OccasionLineRequest[]
      if (editingLineId) {
        // Update existing line
        updatedLines = currentLines.map(line =>
          line.id === editingLineId ? lineRequest : line
        )
      } else {
        // Add new line
        updatedLines = [...currentLines, lineRequest]
      }

      if (editingLineId) {
        // Update existing line in local state (check all lines including deleted)
        const allLocalLines = localOccasionBook.lines || []
        const existingLine = allLocalLines.find(line => line.id === editingLineId)
        if (existingLine) {
          const updatedLine: OccasionLineResponse = {
            ...existingLine,
            date: formData.date!,
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
            type: formData.type || existingLine.type || OccasionType.Wedding, // Ensure type is never null
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
        const allLocalLines = localOccasionBook.lines || []
        const templateLine = allLocalLines[0]
        const newLine: OccasionLineResponse = templateLine ? {
          ...templateLine,
          id: 0, // Temporary ID for new lines (0 indicates new, not yet saved)
          date: formData.date!,
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
          date: formData.date!,
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to save occasion'
      addToast(errorMessage, 'error')
    }
  }

  const handleSync = async () => {
    try {
      if (!localOccasionBook) {
        if (isLoading) {
          addToast('Please wait while the occasion book is loading...', 'info')
          return
        }
        addToast('Occasion book not found. Please refresh the page.', 'error')
        return
      }

      // Check if there are actual changes before syncing
      if (!hasActualChanges()) {
        addToast('No changes to save', 'info')
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
      addToast('Changes saved successfully', 'success')

      // Refetch to get latest from server
      refetch()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes'
      addToast(errorMessage, 'error')
    }
  }

  const handleDelete = (lineId: number) => {
    if (!confirm('Are you sure you want to delete this occasion?')) return

    if (!localOccasionBook) {
      if (isLoading) {
        addToast('Please wait while the occasion book is loading...', 'info')
        return
      }
      addToast('Occasion book not found. Please refresh the page.', 'error')
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

  const updateFormField = (field: string, value: string | Date | OccasionType | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
        <ErrorModal
          open={true}
          title="Failed to Load Occasions"
          message="Failed to load occasions. Please try again."
          onRetry={() => window.location.reload()}
          onClose={() => {}}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Save and Add Buttons */}
      <div className="flex items-center justify-between">
        {hasUnsavedChanges && (
          <Button
            className="text-white"
            onClick={handleSync}
            variant="brand"
            size="md"
            disabled={syncMutation.isPending || !localOccasionBook || isLoading}
          >
            <Save className="w-5 h-5 mr-2" />
            {syncMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
        <div className={cn("flex items-center gap-2", !hasUnsavedChanges && "ml-auto")}>
          <Button
            className="text-white"
            onClick={handleAddNew}
            variant="brand"
            size="md"
            disabled={isAddingNew || editingLineId !== null || !localOccasionBook || isLoading}
          >
            Add New Occasion
            <Plus className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAddingNew || editingLineId !== null) && (
        <div className="bg-white border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-18 font-semibold text-gray-900">
              {editingLineId ? 'Edit Occasion' : 'Add New Occasion'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Title (English) *
              </label>
              <Input
                value={formData.titleEn || ''}
                onChange={e => updateFormField('titleEn', e.target.value)}
                placeholder="Enter title in English"
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Title (Arabic)
              </label>
              <Input
                value={formData.titleAr || ''}
                onChange={e => updateFormField('titleAr', e.target.value)}
                placeholder="Enter title in Arabic"
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Sub Title (English)
              </label>
              <Input
                value={formData.subTitleEn || ''}
                onChange={e => updateFormField('subTitleEn', e.target.value)}
                placeholder="Enter sub title in English"
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Sub Title (Arabic)
              </label>
              <Input
                value={formData.subTitleAr || ''}
                onChange={e => updateFormField('subTitleAr', e.target.value)}
                placeholder="Enter sub title in Arabic"
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Date *
              </label>
              <Input
                type="datetime-local"
                value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
                onChange={e => updateFormField('date', new Date(e.target.value).toISOString())}
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Sub Date (Optional)
              </label>
              <Input
                type="datetime-local"
                value={formData.subDate ? new Date(formData.subDate).toISOString().slice(0, 16) : ''}
                onChange={e => updateFormField('subDate', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Bride First Name
              </label>
              <Input
                value={formData.brideFirstName || ''}
                onChange={e => updateFormField('brideFirstName', e.target.value)}
                placeholder="Enter bride first name"
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Bride Last Name
              </label>
              <Input
                value={formData.brideLastName || ''}
                onChange={e => updateFormField('brideLastName', e.target.value)}
                placeholder="Enter bride last name"
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Groom First Name
              </label>
              <Input
                value={formData.groomFirstName || ''}
                onChange={e => updateFormField('groomFirstName', e.target.value)}
                placeholder="Enter groom first name"
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div>
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Groom Last Name
              </label>
              <Input
                value={formData.groomLastName || ''}
                onChange={e => updateFormField('groomLastName', e.target.value)}
                placeholder="Enter groom last name"
                className="h-auto px-4 py-3 text-14"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-14 font-normal text-gray-900 mb-2 block">
                Caption
              </label>
              <Input
                value={formData.caption || ''}
                onChange={e => updateFormField('caption', e.target.value)}
                placeholder="Enter caption"
                className="h-auto px-4 py-3 text-14"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleSave}
              disabled={!formData.titleEn && !formData.titleAr || !formData.date || syncMutation.isPending}
              className="text-white"
            >
              {editingLineId ? 'Update' : 'Create'} Occasion
            </Button>
          </div>
        </div>
      )}

      {/* Occasions List */}
      {occasionLines.length === 0 && !isAddingNew && editingLineId === null ? (
        <div className="bg-white border rounded-2xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-16 text-gray-600 mb-2">No occasions found</p>
          <p className="text-14 text-gray-500">Create your first occasion to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {occasionLines.map(line => (
            <div
              key={line.id}
              className="bg-white border rounded-2xl p-6 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-brand-500" />
                    <h3 className="text-18 font-semibold text-gray-900">
                      {line.title || line.titleEn || 'Untitled Occasion'}
                    </h3>
                    {line.type !== undefined && (
                      <span className="px-2 py-1 text-12 font-medium bg-brand-100 text-brand-700 rounded">
                        {getOccasionTypeLabel(line.type)}
                      </span>
                    )}
                  </div>

                  {line.subTitle && (
                    <p className="text-14 text-gray-600 mb-2">{line.subTitle}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-14 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(line.date)}</span>
                    </div>
                    {line.subDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Sub: {formatDate(line.subDate)}</span>
                      </div>
                    )}
                    {(line.brideFirstName || line.brideLastName) && (
                      <div>
                        <span className="font-medium">Bride:</span>{' '}
                        {[line.brideFirstName, line.brideLastName].filter(Boolean).join(' ')}
                      </div>
                    )}
                    {(line.groomFirstName || line.groomLastName) && (
                      <div>
                        <span className="font-medium">Groom:</span>{' '}
                        {[line.groomFirstName, line.groomLastName].filter(Boolean).join(' ')}
                      </div>
                    )}
                  </div>

                  {line.caption && (
                    <p className="text-14 text-gray-500 mt-2">{line.caption}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(line)}
                    className="p-2 text-gray-500 hover:text-brand-500 transition-colors"
                    disabled={isAddingNew || editingLineId !== null}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(line.id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    disabled={syncMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
            <LoadingSpinner size="lg" text="Loading occasions..." />
          </div>
        </div>
      }
    >
      <OccasionsPageContent />
    </Suspense>
  )
}


