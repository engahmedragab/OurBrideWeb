/**
 * Mappers for EventBook (Events)
 */
import type { EventBook, EventLine, EventLineCategory } from '@/../client/common/api/gen/ourbride-api'
import type { EventBookRequest, EventLineRequest, EventLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'

/**
 * Extended EventBook type with categories for local state management
 */
export interface EventBookWithCategories extends EventBook {
  lineCategories?: EventLineCategory[] | null
}

/**
 * Convert EventLine to EventLineRequest
 */
export const convertLineToRequest = (line: EventLine, bookId: number): EventLineRequest => {
  return {
    id: line.id ?? null,
    bookId,
    lineCategoryId: line.lineCategoryId ?? null,
    lineCategoryCountId: line.lineCategoryCountId ?? null,
    lineCategorySlug: line.lineCategorySlug ?? null,
    time: line.time || undefined,
    duration: line.duration || undefined,
    name: line.nameEn || line.nameAr || null,
    desctiption: line.descriptionEn || line.descriptionAr || null,
    highlighted: Boolean(line.highlighted),
    isDone: Boolean(line.isDone),
    isFavorite: Boolean(line.isFavorite),
    isDeleted: Boolean(line.isDeleted),
    isModelLine: Boolean(line.isModelLine),
    brideId: line.brideId || null,
    groomId: line.groomId || null,
    creationDate: line.creationDate || null,
    lastModifiedDate: line.lastModifiedDate || null,
  }
}

/**
 * Convert EventLineCategory to EventLineCategoryRequest
 */
export const convertCategoryToRequest = (category: EventLineCategory): EventLineCategoryRequest => {
  return {
    id: category.id ?? null,
    name: category.nameEn || category.nameAr || category.name || null,
    description: category.descriptionEn || category.descriptionAr || null,
    slug: category.slug ?? null,
    count_id: category.count_id ?? null,
    isDeleted: Boolean(category.isDeleted),
    isModelLine: Boolean(category.isModelLine),
    date: category.date || undefined,
    creationDate: category.creationDate ?? null,
    lastModifiedDate: category.lastModifiedDate ?? null,
  }
}

/**
 * Build EventBookRequest from local EventBook state
 */
export const buildEventBookRequestFromLocal = (localEventBook: EventBookWithCategories): EventBookRequest => {
  const allLines = (localEventBook.lines || []).map(line =>
    convertLineToRequest(line, localEventBook.id)
  )
  const allCategories = (localEventBook.lineCategories || []).map(category =>
    convertCategoryToRequest(category)
  )

  return {
    id: localEventBook.id,
    groomId: localEventBook.groomId || null,
    brideId: localEventBook.brideId || null,
    weddingPlannerId: localEventBook.weddingPlannerId || null,
    bookType: localEventBook.bookType,
    bookClass: localEventBook.bookClass,
    title: localEventBook.title || null,
    clientName: localEventBook.clientName || null,
    weddingDate: localEventBook.weddingDate || null,
    eventLocation: localEventBook.eventLocation || null,
    lines: allLines,
    lineCategories: allCategories.length > 0 ? allCategories : null,
    lastModifiedDate: new Date().toISOString(),
  }
}
