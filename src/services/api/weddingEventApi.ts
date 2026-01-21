// Wedding Event API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  WeddingEventCreateRequest,
  WeddingEventUpdateRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type { WeddingEventResponse, EventInfoResponse } from '@/types/responses'
import { UserType, BookClass } from '@/types/responses/book-enums'

/**
 * Get all wedding events
 */
export const getWeddingEvents = async (params?: {
  page?: number
  pageSize?: number
  providerId?: number
  branchId?: number
  staffId?: string
}): Promise<WeddingEventResponse[]> => {
  try {
    // Pass query parameters directly
    const response = await apiClient.api.getWeddingEventGetAllEvents(params as unknown as Parameters<typeof apiClient.api.getWeddingEventGetAllEvents>[0])
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (Array.isArray(data)) {
        return data as WeddingEventResponse[]
      }
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as WeddingEventResponse[]
      }
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        return data.items as WeddingEventResponse[]
      }
    }
    if (Array.isArray(responseAny)) {
      return responseAny as WeddingEventResponse[]
    }
    
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch wedding events')
  }
}

/**
 * Get wedding event by ID
 */
export const getWeddingEventById = async (eventId: number): Promise<WeddingEventResponse | null> => {
  try {
    const response = await apiClient.api.getWeddingEventGetEventById(eventId)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as WeddingEventResponse
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as unknown as WeddingEventResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as unknown as WeddingEventResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch wedding event')
  }
}

/**
 * Create a new wedding event
 */
export const createWeddingEvent = async (data: WeddingEventCreateRequest): Promise<WeddingEventResponse> => {
  try {
    const response = await apiClient.api.postWeddingEventCreateEvent(data)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as WeddingEventResponse
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as unknown as WeddingEventResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as unknown as WeddingEventResponse
    }
    
    throw new Error('Invalid response format from create wedding event endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create wedding event')
  }
}

/**
 * Update a wedding event
 */
export const updateWeddingEvent = async (
  eventId: number,
  data: WeddingEventUpdateRequest
): Promise<WeddingEventResponse> => {
  try {
    const response = await apiClient.api.putWeddingEventUpdateEvent(eventId, data)
    const responseAny = response as unknown as Record<string, unknown>
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as unknown as WeddingEventResponse
      }
      if (data && typeof data === 'object' && 'id' in data) {
        return data as unknown as WeddingEventResponse
      }
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as unknown as WeddingEventResponse
    }
    
    throw new Error('Invalid response format from update wedding event endpoint')
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update wedding event')
  }
}

/**
 * Delete a wedding event
 */
export const deleteWeddingEvent = async (eventId: number): Promise<void> => {
  try {
    await apiClient.api.deleteWeddingEventDeleteEvent(eventId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete wedding event')
  }
}

/**
 * Convert string bookType to UserType enum
 */
const convertBookType = (bookType: string | number | undefined): UserType => {
  if (typeof bookType === 'number') {
    return bookType as UserType
  }
  if (typeof bookType === 'string') {
    const typeMap: Record<string, UserType> = {
      'Guest': UserType.Guest,
      'Bride': UserType.Bride,
      'Groom': UserType.Groom,
      'Owner': UserType.Owner,
      'Admin': UserType.Admin,
      'FamilyMember': UserType.FamilyMember,
      'LocalGuider': UserType.LocalGuider,
      'ProviderUser': UserType.ProviderUser,
      'WeddingPlanner': UserType.WeddingPlanner,
    }
    return typeMap[bookType] ?? UserType.Guest
  }
  return UserType.Guest
}

/**
 * Convert string bookClass to BookClass enum
 */
const convertBookClass = (bookClass: string | number | undefined): BookClass => {
  if (typeof bookClass === 'number') {
    return bookClass as BookClass
  }
  if (typeof bookClass === 'string') {
    const classMap: Record<string, BookClass> = {
      'Event': BookClass.Event,
      'Budget': BookClass.Budget,
      'Guest': BookClass.Guest,
      'Item': BookClass.Item,
      'Note': BookClass.Note,
      'Occasion': BookClass.Occasion,
      'Service': BookClass.Service,
      'Todo': BookClass.Todo,
      // Handle "Main" as a special case - might need to be determined by context
      'Main': BookClass.Event, // Default fallback, but this should be set based on actual book type
    }
    return classMap[bookClass] ?? BookClass.Event
  }
  return BookClass.Event
}

/**
 * Normalize book object by converting string enums to proper enum types
 */
const normalizeBook = (book: Record<string, unknown> | null | undefined, expectedBookClass: BookClass): Record<string, unknown> | null | undefined => {
  if (!book) return book
  
  return {
    ...book,
    bookType: convertBookType(book.bookType as string | number | undefined),
    bookClass: book.bookClass === 'Main' ? expectedBookClass : convertBookClass(book.bookClass as string | number | undefined),
  }
}

/**
 * Get event info (all books) for a wedding event
 */
export const getEventInfo = async (eventId: number): Promise<EventInfoResponse | null> => {
  try {
    const response = await apiClient.api.getWeddingEventGetEventInfo(eventId)
    const responseAny = response as unknown as Record<string, unknown>
    
    let eventInfo: Record<string, unknown> | null = null
    
    // Handle different response structures
    if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        eventInfo = data.data as Record<string, unknown>
      } else if (data && typeof data === 'object') {
        eventInfo = data as Record<string, unknown>
      }
    } else if (responseAny && typeof responseAny === 'object' && 'itemBook' in responseAny) {
      eventInfo = responseAny
    }
    
    if (!eventInfo) {
      return null
    }
    
    // Normalize all books by converting string enums to proper enum types
    return {
      itemBook: normalizeBook(eventInfo.itemBook as Record<string, unknown> | null | undefined, BookClass.Item) as unknown as EventInfoResponse['itemBook'],
      serviceBook: normalizeBook(eventInfo.serviceBook as Record<string, unknown> | null | undefined, BookClass.Service) as unknown as EventInfoResponse['serviceBook'],
      budgetBook: normalizeBook(eventInfo.budgetBook as Record<string, unknown> | null | undefined, BookClass.Budget) as unknown as EventInfoResponse['budgetBook'],
      eventBook: normalizeBook(eventInfo.eventBook as Record<string, unknown> | null | undefined, BookClass.Event) as unknown as EventInfoResponse['eventBook'],
      guestBook: normalizeBook(eventInfo.guestBook as Record<string, unknown> | null | undefined, BookClass.Guest) as unknown as EventInfoResponse['guestBook'],
      noteBook: normalizeBook(eventInfo.noteBook as Record<string, unknown> | null | undefined, BookClass.Note) as unknown as EventInfoResponse['noteBook'],
      todoBook: normalizeBook(eventInfo.todoBook as Record<string, unknown> | null | undefined, BookClass.Todo) as unknown as EventInfoResponse['todoBook'],
      occasionBook: normalizeBook(eventInfo.occasionBook as Record<string, unknown> | null | undefined, BookClass.Occasion) as unknown as EventInfoResponse['occasionBook'],
    } as EventInfoResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch event info')
  }
}


