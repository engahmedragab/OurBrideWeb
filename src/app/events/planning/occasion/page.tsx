'use client'

import { useState } from 'react'
import { Button, Input, LoadingSpinner } from '@/components/ui'
import { Plus, Trash2, Edit2, Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOccasionBook, useSyncOccasionBook, useInitOccasionBooks } from '@/hooks/occasionBooks'
import { useEventId } from '@/hooks/planning'
import { useEventInfo } from '@/hooks/weddingEvents'
import { useToast } from '@/components/ui/Toaster'
import { useEffect } from 'react'
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

export default function OccasionsPage() {
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

  // Fetch occasion book (includes lines)
  const { data: occasionBook, isLoading, error } = useOccasionBook({
    eventId: eventId || undefined,
    userType: undefined,
    clientId: undefined,
    enabled: typeof window !== 'undefined',
  })

  // Fetch event info to get isBookInit status
  const { data: eventInfo } = useEventInfo(
    eventId || null,
    typeof window !== 'undefined' && eventId !== null
  )

  // Get occasion lines from the book
  const occasionLines: OccasionLineResponse[] = occasionBook?.lines || []

  // Get isBookInit status from eventInfo
  const isBookInit = eventInfo?.occasionBook?.isBookInit ?? false
  const needsInit = !isBookInit

  const syncMutation = useSyncOccasionBook()
  const initMutation = useInitOccasionBooks()

  // Check if book needs initialization (if book doesn't exist, it needs init)
  // Note: The full OccasionBookResponse doesn't have isBookInit, so we check if book is null
  useEffect(() => {
    if (
      !occasionBook &&
      !isLoading &&
      eventId &&
      typeof window !== 'undefined' &&
      !initMutation.isPending &&
      !error
    ) {
      const initializeBook = async () => {
        try {
          await initMutation.mutateAsync({
            eventId,
            userType: null as unknown as UserType | undefined,
            clientId: null as unknown as string | undefined,
          })
          addToast('Occasion book initialized successfully', 'success')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to initialize occasion book'
          addToast(errorMessage, 'error')
        }
      }
      initializeBook()
    }
  }, [occasionBook, isLoading, eventId, initMutation, addToast, error])

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
      bookId: line.bookId || occasionBook?.id || 0,
      date: line.date,
      subDate: line.subDate || null,
      brideFirstName: line.brideFirstName || null,
      brideLastName: line.brideLastName || null,
      groomFirstName: line.groomFirstName || null,
      groomLastName: line.groomLastName || null,
      title: line.title || line.titleEn || line.titleAr || null,
      subTitle: line.subTitle || line.subTitleEn || line.subTitleAr || null,
      caption: line.caption || null,
      type: line.type,
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
    if (!occasionBook?.id) {
      throw new Error('Occasion book not found')
    }

    return {
      id: editingLineId || null,
      bookId: occasionBook.id,
      date: formData.date!,
      subDate: formData.subDate || null,
      brideFirstName: formData.brideFirstName || null,
      brideLastName: formData.brideLastName || null,
      groomFirstName: formData.groomFirstName || null,
      groomLastName: formData.groomLastName || null,
      title: formData.titleEn || formData.titleAr || null,
      subTitle: formData.subTitleEn || formData.subTitleAr || null,
      caption: formData.caption || null,
      type: formData.type || undefined,
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
   * Build OccasionBookRequest from current book and updated lines
   */
  const buildBookRequest = (updatedLines: OccasionLineRequest[]): OccasionBookRequest => {
    if (!occasionBook) {
      throw new Error('Occasion book not found')
    }

    return {
      id: occasionBook.id,
      groomId: occasionBook.groomId || null,
      brideId: occasionBook.brideId || null,
      weddingPlannerId: undefined,
      bookType: (occasionBook.bookType as unknown) as UserType | undefined,
      bookClass: occasionBook.bookClass as unknown as BookClass | undefined,
      title: occasionBook.title || null,
      clientName: null,
      weddingDate: null,
      eventLocation: null,
      lines: updatedLines,
      lineCategories: null,
      lastModifiedDate: new Date().toISOString(),
    }
  }

  const handleSave = async () => {
    try {
      if (!occasionBook) {
        addToast('Occasion book not found. Please initialize it first.', 'error')
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

      // Get current lines and convert to request format
      const currentLines = occasionLines.map(convertLineToRequest)

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

      // Build the full book request
      const bookRequest = buildBookRequest(updatedLines)

      // Sync the entire book
      await syncMutation.mutateAsync({
        data: bookRequest,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })

      addToast(
        editingLineId ? 'Occasion updated successfully' : 'Occasion created successfully',
        'success'
      )
      handleCancel()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save occasion'
      addToast(errorMessage, 'error')
    }
  }

  const handleDelete = async (lineId: number) => {
    if (!confirm('Are you sure you want to delete this occasion?')) return

    try {
      if (!occasionBook) {
        addToast('Occasion book not found.', 'error')
        return
      }

      // Get current lines and convert to request format
      const currentLines = occasionLines.map(convertLineToRequest)

      // Mark the line as deleted instead of removing it
      const updatedLines = currentLines.map(line =>
        line.id === lineId
          ? { ...line, isDeleted: true }
          : line
      )

      // Build the full book request
      const bookRequest = buildBookRequest(updatedLines)

      // Sync the entire book
      await syncMutation.mutateAsync({
        data: bookRequest,
        query: {
          eventId: eventId || undefined,
          userType: null as unknown as UserType | undefined,
          clientId: null as unknown as string | undefined,
        },
      })

      addToast('Occasion deleted successfully', 'success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete occasion'
      addToast(errorMessage, 'error')
    }
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
      {/* Header with Init Flag and Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1.5 text-14 font-medium rounded",
            needsInit
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          )}>
            {needsInit ? "Needs Init" : "Initialized"}
          </span>
        </div>
        <Button
          className="text-white"
          onClick={handleAddNew}
          variant="brand"
          size="md"
          disabled={isAddingNew || editingLineId !== null}
        >
          Add New Occasion
          <Plus className="w-5 h-5 ml-2" />
        </Button>
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


