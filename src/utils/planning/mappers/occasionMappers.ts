/**
 * Mappers for OccasionBook (Occasion)
 */
import type { OccasionLineResponse, OccasionBookResponse } from '@/types/responses'
import type { OccasionLineRequest, OccasionBookRequest, BookClass, UserType } from '@/../client/common/api/gen/ourbride-api'
import { OccasionType } from '@/../client/common/api/gen/ourbride-api'
import type { OccasionFormData } from '@/schema/occasion.schema'

/**
 * Convert OccasionLineResponse to OccasionLineRequest
 */
export const convertLineToRequest = (
  line: OccasionLineResponse,
  bookId: number
): OccasionLineRequest => {
  return {
    id: line.id,
    bookId: line.bookId || bookId,
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
    lineCategoryId: line.lineCategoryId ?? null,
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
export const convertFormDataToLineRequest = (
  formData: OccasionFormData,
  bookId: number,
  editingLineId?: number | null
): OccasionLineRequest => {
  return {
    id: editingLineId || null,
    bookId,
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
export const buildBookRequestFromLocal = (localOccasionBook: OccasionBookResponse): OccasionBookRequest => {
  if (!localOccasionBook) {
    throw new Error('Occasion book not found')
  }

  // Include ALL lines (including deleted) for sync
  const allLines = (localOccasionBook.lines || []).map(line =>
    convertLineToRequest(line, localOccasionBook.id)
  )

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
export const buildBookRequest = (
  localOccasionBook: OccasionBookResponse,
  updatedLines: OccasionLineRequest[]
): OccasionBookRequest => {
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
