/**
 * Mappers for ServiceBook (Preparations)
 */
import type { ServiceLineResponse, ServiceBookResponse } from '@/types/responses'
import type { ServiceLineRequest, ServiceBookRequest, ServiceType, UserType, BookClass } from '@/../client/common/api/gen/ourbride-api'

/**
 * Convert ServiceLineResponse to ServiceLineRequest
 */
export const convertLineToRequest = (line: ServiceLineResponse, bookId: number): ServiceLineRequest => {
  // Map ServiceType enum from response to request type
  // ServiceType enum values: 0 = Rent, 1 = Buy
  const serviceType = (line.serviceType === 0 ? 0 : line.serviceType === 1 ? 1 : 0) as unknown as ServiceType

  return {
    id: line.id,
    bookId: line.bookId || bookId,
    lineCategoryId: line.lineCategoryId ?? null,
    title: line.title || line.titleEn || line.titleAr || null,
    quantity: line.quantity || null,
    price: line.price || null,
    advanceAmount: line.advanceAmount || null,
    providerName: line.providerName || null,
    seller: line.seller || null,
    buyDate: line.buyDate || null,
    isDone: line.isDone,
    isFavorite: line.isFavorite,
    isDeleted: line.isDeleted,
    isModelLine: line.isModelLine,
    serviceType,
    iconName: line.iconName || null,
    notes: line.notes || null,
    hasReminder: line.hasReminder || false,
    reminderDate: line.reminderDate || null,
    reminderText: line.reminderText || null,
    reminderType: line.reminderType || undefined,
    colorName: line.colorName || null,
  }
}

/**
 * Build ServiceBookRequest from local state
 * Service books don't have lineCategories - they use preparationId on lines
 */
export const buildBookRequestFromLocal = (localServiceBook: ServiceBookResponse): ServiceBookRequest => {
  const allLines = (localServiceBook.lines || []).map(line => convertLineToRequest(line, localServiceBook.id))

  return {
    id: localServiceBook.id,
    groomId: localServiceBook.groomId || null,
    brideId: localServiceBook.brideId || null,
    weddingPlannerId: undefined,
    bookType: (localServiceBook.bookType as unknown) as UserType | undefined,
    bookClass: localServiceBook.bookClass as unknown as BookClass | undefined,
    title: localServiceBook.title || null,
    clientName: null,
    weddingDate: null,
    eventLocation: null,
    lines: allLines,
    lineCategories: null, // Service books don't have line categories
    lastModifiedDate: new Date().toISOString(),
  }
}
