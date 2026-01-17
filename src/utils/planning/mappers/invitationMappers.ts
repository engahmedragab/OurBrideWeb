/**
 * Mappers for GuestBook (Invitation)
 */
import type { GuestLineResponse, GuestLineCategoryResponse, GuestBookResponse } from '@/types/responses'
import type { GuestBookRequest } from '@/../client/common/api/gen/ourbride-api'
import type { GuestLineRequest, GuestLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'
import { GuestRelevant } from '@/types/responses/book-enums'

type GuestBookDraft = GuestBookResponse & {
  lineCategories?: Array<GuestLineCategoryResponse & { clientId?: string }>
  lines?: Array<GuestLineResponse & { clientId?: string }>
}

/**
 * Normalize guestRelevant value to GuestRelevant enum
 */
const normalizeGuestRelevant = (value?: string | number | null): GuestRelevant => {
  if (value === 0 || value === 'Others' || value === '0' || value === GuestRelevant.Others) {
    return GuestRelevant.Others
  }
  if (value === 1 || value === 'Bride' || value === '1' || value === GuestRelevant.Bride) {
    return GuestRelevant.Bride
  }
  if (value === 2 || value === 'Groom' || value === '2' || value === GuestRelevant.Groom) {
    return GuestRelevant.Groom
  }
  // Default to Others
  return GuestRelevant.Others
}

export const convertLineToRequest = (line: GuestLineResponse, bookId: number): GuestLineRequest => {
  const lineAny = line as any
  const guestRelevant = normalizeGuestRelevant(lineAny.guestRelevant)
  
  return {
    ...(lineAny as any),
    id: line.id ?? null,
    bookId: line.bookId ?? bookId,
    lineCategoryId: line.lineCategoryId ?? null,
    isDeleted: line.isDeleted ?? false,
    isModelLine: line.isModelLine ?? false,
    creationDate: line.creationDate ?? null,
    lastModifiedDate: line.lastModifiedDate ?? null,
    guestRelevant: guestRelevant, // Ensure enum value is used
  } as GuestLineRequest
}

export const convertCategoryToRequest = (category: GuestLineCategoryResponse): GuestLineCategoryRequest => {
  const catAny = category as any
  const guestRelevant = normalizeGuestRelevant(catAny.guestRelevant)
  
  return {
    ...(catAny as any),
    id: category.id ?? null,
    isDeleted: category.isDeleted ?? false,
    isModelLine: category.isModelLine ?? false,
    creationDate: category.creationDate ?? null,
    lastModifiedDate: category.lastModifiedDate ?? null,
    guestRelevant: guestRelevant, // Ensure enum value is used
  } as GuestLineCategoryRequest
}

/**
 * Build GuestBookRequest from local state
 * Includes all lines and categories (including deleted ones) for sync
 */
export const buildBookRequestFromLocal = (draft: GuestBookDraft): GuestBookRequest => {
  return {
    ...(draft as any),
    lastModifiedDate: new Date().toISOString(),
    lineCategories: (draft.lineCategories || []).map(c => {
      const catAny = c as any
      const guestRelevant = normalizeGuestRelevant(catAny.guestRelevant)
      return {
        ...catAny,
        guestRelevant: guestRelevant, // Ensure enum value is used
      }
    }),
    lines: (draft.lines || []).map(l => {
      const lineAny = l as any
      const guestRelevant = normalizeGuestRelevant(lineAny.guestRelevant)
      return {
        ...lineAny,
        guestRelevant: guestRelevant, // Ensure enum value is used
      }
    }),
  } as GuestBookRequest
}
