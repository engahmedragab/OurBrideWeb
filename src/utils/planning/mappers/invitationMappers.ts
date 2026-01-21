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
  const lineAny = line as unknown as Record<string, unknown>
  const guestRelevant = normalizeGuestRelevant(lineAny.guestRelevant as string | number | undefined)
  
  return {
    id: line.id ?? null,
    bookId: line.bookId ?? bookId,
    lineCategoryId: line.lineCategoryId ?? null,
    isDeleted: line.isDeleted ?? false,
    isModelLine: line.isModelLine ?? false,
    creationDate: line.creationDate ?? null,
    lastModifiedDate: line.lastModifiedDate ?? null,
    guestRelevant: guestRelevant as unknown as GuestLineRequest['guestRelevant'], // Ensure enum value is used
    nickName: line.nickName ?? null,
    title: (line.title as unknown as GuestLineRequest['title'] | undefined) ?? undefined,
    attended: line.attended ?? false,
    family: line.family ?? null,
    status: (line.status as unknown as GuestLineRequest['status'] | undefined) ?? undefined,
    peopleCount: (lineAny.peopleCount as number | null | undefined) ?? null,
    lineCategoryCountId: (lineAny.lineCategoryCountId as number | null | undefined) ?? null,
    lineCategorySlug: (lineAny.lineCategorySlug as string | null | undefined) ?? null,
    brideId: line.brideId ?? null,
    groomId: line.groomId ?? null,
    isDone: line.isDone ?? false,
    isFavorite: line.isFavorite ?? false,
  } as unknown as GuestLineRequest
}

export const convertCategoryToRequest = (category: GuestLineCategoryResponse): GuestLineCategoryRequest => {
  const catAny = category as unknown as Record<string, unknown>
  const guestRelevant = normalizeGuestRelevant(catAny.guestRelevant as string | number | undefined)
  
  return {
    id: category.id ?? null,
    isDeleted: category.isDeleted ?? false,
    isModelLine: category.isModelLine ?? false,
    creationDate: category.creationDate ?? null,
    lastModifiedDate: category.lastModifiedDate ?? null,
    guestRelevant: guestRelevant as unknown as GuestLineCategoryRequest['guestRelevant'], // Ensure enum value is used
    name: category.name ?? null,
    nameAr: category.nameAr ?? null,
    nameEn: category.nameEn ?? null,
    description: category.description ?? null,
    descriptionAr: category.descriptionAr ?? null,
    descriptionEn: category.descriptionEn ?? null,
    slug: category.slug ?? null,
    count_id: (catAny.count_id as number | null | undefined) ?? null,
  } as unknown as GuestLineCategoryRequest
}

/**
 * Build GuestBookRequest from local state
 * Includes all lines and categories (including deleted ones) for sync
 */
export const buildBookRequestFromLocal = (draft: GuestBookDraft): GuestBookRequest => {
  return {
    ...(draft as unknown as GuestBookRequest),
    lastModifiedDate: new Date().toISOString(),
    lineCategories: (draft.lineCategories || []).map(c => {
      const catAny = c as unknown as Record<string, unknown>
      const guestRelevant = normalizeGuestRelevant(catAny.guestRelevant as string | number | undefined)
      return {
        ...(catAny as unknown as GuestLineCategoryRequest),
        guestRelevant: guestRelevant as unknown as GuestLineCategoryRequest['guestRelevant'], // Ensure enum value is used
      }
    }),
    lines: (draft.lines || []).map(l => {
      const lineAny = l as unknown as Record<string, unknown>
      const guestRelevant = normalizeGuestRelevant(lineAny.guestRelevant as string | number | undefined)
      return {
        ...(lineAny as unknown as GuestLineRequest),
        bookId: l.bookId ?? draft.id ?? 0, // Ensure bookId is set
        guestRelevant: guestRelevant as unknown as GuestLineRequest['guestRelevant'], // Ensure enum value is used
      }
    }),
  } as unknown as GuestBookRequest
}
