/**
 * Guest Book Adapters
 * 
 * Functions to convert between API response format and local draft format
 */

import type { GuestBookResponse, GuestLineResponse, GuestLineCategoryResponse } from '@/types/responses'
import type { GuestBookRequest, GuestLineRequest, GuestLineCategoryRequest } from '@/../client/common/api/gen/ourbride-api'
import { GuestRelevant, GuestStatus, GuestTitle } from '@/types/responses/book-enums'
import { GuestRelevant as ApiGuestRelevant, GuestStatus as ApiGuestStatus, GuestTitle as ApiGuestTitle } from '@/../client/common/api/gen/ourbride-api'

/**
 * Draft type for local state (matches API response structure)
 */
export type GuestBookDraft = GuestBookResponse

/**
 * Convert title to enum - handle both string and number
 * 
 */
const normalizeGuestTitle = (title: any): GuestTitle | null => {
  if (title === null || title === undefined) {
    return GuestTitle.NoFormalities // Default to NoFormalities
  }
  
  // If it's already a number (enum), return it
  if (typeof title === 'number') {
    return title as GuestTitle
  }
  
  // If it's a string, try to convert it
  if (typeof title === 'string') {
    // Try to find the enum value by string name
    const titleKey = title as keyof typeof GuestTitle
    if (titleKey in GuestTitle) {
      return GuestTitle[titleKey] as GuestTitle
    }
    // If string is a number, parse it
    const parsed = parseInt(title, 10)
    if (!isNaN(parsed)) {
      return parsed as GuestTitle
    }
  }
  
  // Default to NoFormalities
  return GuestTitle.NoFormalities
}

/**
 * Convert status to enum - handle both string and number
 */
const normalizeGuestStatus = (status: any): GuestStatus => {
  if (status === null || status === undefined) {
    return GuestStatus.None
  }
  
  if (typeof status === 'number') {
    return status as GuestStatus
  }
  
  if (typeof status === 'string') {
    const statusKey = status as keyof typeof GuestStatus
    if (statusKey in GuestStatus) {
      return GuestStatus[statusKey] as GuestStatus
    }
    const parsed = parseInt(status, 10)
    if (!isNaN(parsed)) {
      return parsed as GuestStatus
    }
  }
  
  return GuestStatus.None
}

/**
 * Convert guestRelevant to enum - handle both string and number
 */
const normalizeGuestRelevant = (relevant: any): GuestRelevant => {
  if (relevant === null || relevant === undefined) {
    return GuestRelevant.Others
  }
  
  if (typeof relevant === 'number') {
    return relevant as GuestRelevant
  }
  
  if (typeof relevant === 'string') {
    const relevantKey = relevant as keyof typeof GuestRelevant
    if (relevantKey in GuestRelevant) {
      return GuestRelevant[relevantKey] as GuestRelevant
    }
    const parsed = parseInt(relevant, 10)
    if (!isNaN(parsed)) {
      return parsed as GuestRelevant
    }
  }
  
  return GuestRelevant.Others
}

/**
 * Convert numeric GuestTitle enum to API string enum
 */
const convertTitleToApi = (title: GuestTitle | null | undefined): ApiGuestTitle | undefined => {
  if (title === null || title === undefined) {
    return undefined
  }
  
  // Map numeric enum to string enum
  const titleMap: Record<GuestTitle, ApiGuestTitle> = {
    [GuestTitle.NoFormalities]: ApiGuestTitle.NoFormalities,
    [GuestTitle.Rev]: ApiGuestTitle.Rev,
    [GuestTitle.Sir]: ApiGuestTitle.Sir,
    [GuestTitle.Mr]: ApiGuestTitle.Mr,
    [GuestTitle.Mister]: ApiGuestTitle.Mister,
    [GuestTitle.Mrs]: ApiGuestTitle.Mrs,
    [GuestTitle.Ms]: ApiGuestTitle.Ms,
    [GuestTitle.Miss]: ApiGuestTitle.Miss,
    [GuestTitle.Madam]: ApiGuestTitle.Madam,
  }
  
  return titleMap[title] ?? undefined
}

/**
 * Convert numeric GuestStatus enum to API string enum
 */
const convertStatusToApi = (status: GuestStatus): ApiGuestStatus => {
  const statusMap: Record<GuestStatus, ApiGuestStatus> = {
    [GuestStatus.None]: ApiGuestStatus.None,
    [GuestStatus.Pending]: ApiGuestStatus.Pending,
    [GuestStatus.OnlyCeremony]: ApiGuestStatus.OnlyCeremony,
    [GuestStatus.OnlyReception]: ApiGuestStatus.OnlyReception,
    [GuestStatus.Confirmed]: ApiGuestStatus.Confirmed,
    [GuestStatus.Canceled]: ApiGuestStatus.Canceled,
  }
  
  return statusMap[status] ?? ApiGuestStatus.None
}

/**
 * Convert numeric GuestRelevant enum to API string enum
 */
const convertGuestRelevantToApi = (relevant: GuestRelevant): ApiGuestRelevant => {
  const relevantMap: Record<GuestRelevant, ApiGuestRelevant> = {
    [GuestRelevant.Others]: ApiGuestRelevant.Others,
    [GuestRelevant.Bride]: ApiGuestRelevant.Bride,
    [GuestRelevant.Groom]: ApiGuestRelevant.Groom,
  }
  
  return relevantMap[relevant] ?? ApiGuestRelevant.Others
}

/**
 * Convert API response to draft format
 * IMPORTANT: Do NOT filter by activeSide - keep ALL lines and categories
 * Filtering should only happen in the UI layer, not in data adapters
 */
export const mapApiToDraft = (apiData: GuestBookResponse | null | any, activeSide?: 'bride' | 'groom'): GuestBookDraft | null => {
  if (!apiData) return null

  // Normalize lines - convert string enums to numbers
  // DO NOT filter by activeSide - keep ALL lines
  const normalizedLines = (apiData.lines || []).map((line: any) => ({
    ...line,
    title: normalizeGuestTitle(line.title),
    status: normalizeGuestStatus(line.status),
    guestRelevant: normalizeGuestRelevant(line.guestRelevant),
  }))

  // Keep ALL categories - do not filter by activeSide
  const allCategories = apiData.lineCategories || []

  return {
    ...apiData,
    lines: normalizedLines,
    lineCategories: allCategories,
  } as GuestBookDraft
}

/**
 * Convert draft to sync payload
 * IMPORTANT: Do NOT filter by activeSide - send ALL lines and categories
 * The filtering should only happen in the UI, not in the sync payload
 */
export const mapDraftToSyncPayload = (draft: GuestBookDraft, activeSide?: 'bride' | 'groom'): GuestBookRequest => {
  // DO NOT filter by activeSide - send ALL lines and categories
  // The filtering should only happen in the UI, not in the sync payload
  const categories = draft.lineCategories || []
  const lines = draft.lines || []
  
  // Debug: Log all categories before processing
  const negativeCategories = categories.filter(cat => cat.id && cat.id < 0)
  const positiveCategories = categories.filter(cat => cat.id && cat.id > 0)
  if (negativeCategories.length > 0) {
    console.log(`[Adapter] Found ${negativeCategories.length} new categories (negative IDs):`, 
      negativeCategories.map(c => ({ id: c.id, name: c.name })))
  }
  console.log(`[Adapter] Total categories: ${categories.length} (${positiveCategories.length} existing, ${negativeCategories.length} new)`)
  
  // Create a mapping from negative category IDs to their index in the array
  // This helps us link lines to new categories
  const negativeIdToIndexMap = new Map<number, number>()
  categories.forEach((cat, index) => {
    if (cat.id && cat.id < 0) {
      negativeIdToIndexMap.set(cat.id, index)
    }
  })

  // Convert categories - include ALL categories (including new ones with negative IDs)
  // CORRECT MAPPING:
  // - New Group Name → lineCategories.push({ name: newGroupName, id: 0, isDeleted: false, ... })
  // - Categories are stored in lineCategories[], NOT in lines[]
  // - New categories (with negative IDs) should have id: 0 for API to create them
  // - The API will create them in order and assign new IDs
  // IMPORTANT: Include all categories, not just non-deleted ones, so API can process them
  const lineCategories: GuestLineCategoryRequest[] = categories
    .map(cat => {
      // If category has negative ID or id: 0, it's new - set id: 0 for API to create it
      const categoryId = cat.id || 0
      const isNewCategory = categoryId <= 0
      
      return {
        id: isNewCategory ? 0 : categoryId, // Use 0 for new categories, actual ID for existing
        name: cat.name || null,
        description: cat.description || null,
        count_id: (cat as any).count_id || null,
        isModelLine: cat.isModelLine || false,
        isDeleted: cat.isDeleted || false,
        guestRelevant: convertGuestRelevantToApi(normalizeGuestRelevant(cat.guestRelevant)), // Convert to API enum
        // Include multilingual fields even though they're not in type definition
        nameAr: (cat as any).nameAr || (cat as any).name || null,
        nameEn: (cat as any).nameEn || (cat as any).name || null,
        descriptionAr: (cat as any).descriptionAr || (cat as any).description || null,
        descriptionEn: (cat as any).descriptionEn || (cat as any).description || null,
      } as any
    })

  // Convert lines - include all lines (including deleted) for sync
  // If line has lineCategorySlug, use it and set lineCategoryId to null
  // If line has lineCategoryId (positive), use it and set lineCategorySlug to null
  const convertedLines: GuestLineRequest[] = lines
    .map(line => {
      let lineCategoryId = line.lineCategoryId || null
      let lineCategorySlug = (line as any).lineCategorySlug || null
      
      // If line has lineCategorySlug, it means we're using slug for new category
      // Set lineCategoryId to null in this case
      if (lineCategorySlug) {
        lineCategoryId = null
      } else if (lineCategoryId && lineCategoryId < 0) {
        // If line has a negative category ID, it's pointing to a new category
        // Find the category by negative ID
        const category = categories.find(cat => cat.id === lineCategoryId)
        if (category) {
          // Use the category's slug or name for linking
          lineCategorySlug = (category as any).slug || category.name || null
          // Set lineCategoryId to null - API will assign it when creating the category
          lineCategoryId = null
        }
      }
      
      // Ensure isDone and status are synchronized: isDone true = confirmed, isDone false = none
      const isDone = line.isDone || false
      const normalizedStatus = isDone ? GuestStatus.Confirmed : GuestStatus.None
      const apiStatus = convertStatusToApi(normalizedStatus)
      
      const normalizedTitle = normalizeGuestTitle(line.title)
      const apiTitle = convertTitleToApi(normalizedTitle)
      
      return {
        id: line.id || null,
        bookId: draft.id || 0,
        lineCategoryId: lineCategoryId, // null when using slug, actual ID for existing categories
        lineCategoryCountId: (line as any).lineCategoryCountId || null,
        lineCategorySlug: lineCategorySlug, // Use slug/name for new categories
        nickName: line.nickName || null,
        title: apiTitle, // Convert to API string enum
        attended: line.attended || false,
        family: line.family || null,
        status: apiStatus, // Convert to API string enum
        guestRelevant: convertGuestRelevantToApi(normalizeGuestRelevant(line.guestRelevant)), // Convert to API enum
        isDone: isDone,
        isFavorite: line.isFavorite || false,
        isDeleted: line.isDeleted || false,
        isModelLine: line.isModelLine || false,
        brideId: line.brideId || null,
        groomId: line.groomId || null,
        creationDate: line.creationDate || null,
        lastModifiedDate: line.lastModifiedDate || null,
      }
    })

  const payload = {
    id: draft.id || 0,
    groomId: draft.groomId || null,
    brideId: draft.brideId || null,
    weddingPlannerId: undefined,
    bookType: draft.bookType as any,
    bookClass: draft.bookClass as any,
    title: draft.title || null,
    clientName: null,
    weddingDate: null,
    eventLocation: null,
    lines: convertedLines,
    lineCategories, // Ensure new categories (with id: 0) are included
    lastModifiedDate: new Date().toISOString(),
    brideNumber: draft.brideNumber || null,
    groomNumber: draft.groomNumber || null,
    maxBrideNumber: draft.maxBrideNumber || null,
    maxGroomNumber: draft.maxGroomNumber || null,
  }
  
  // Debug: Log new categories being sent
  const newCategoriesCount = lineCategories.filter(cat => cat.id === 0).length
  if (newCategoriesCount > 0) {
    console.log(`[GuestBook Sync] Sending ${newCategoriesCount} new category/categories:`, 
      lineCategories.filter(cat => cat.id === 0).map(c => ({ name: c.name, id: c.id }))
    )
  }
  
  return payload
}

/**
 * Generate temporary ID for new items
 */
export const generateTempId = (): number => {
  // Use negative timestamp to ensure uniqueness and indicate it's temporary
  return -Date.now()
}

