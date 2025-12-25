// Wedding Event API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  WeddingEventCreateRequest,
  WeddingEventUpdateRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type { WeddingEventResponse, EventInfoResponse } from '@/types/responses'

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
    // Pass query parameters via RequestParams
    const response = await apiClient.api.getWeddingEventGetAllEvents({
      params: params || {},
    } as unknown)
    const responseAny = response as unknown
    
    // Handle different response structures
    if (Array.isArray(responseAny?.data)) {
      return responseAny.data as WeddingEventResponse[]
    }
    if (responseAny?.data?.data && Array.isArray(responseAny.data.data)) {
      return responseAny.data.data as WeddingEventResponse[]
    }
    if (responseAny?.data?.items && Array.isArray(responseAny.data.items)) {
      return responseAny.data.items as WeddingEventResponse[]
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
    const responseAny = response as unknown
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as WeddingEventResponse
    }
    if (responseAny?.data) {
      return responseAny.data as WeddingEventResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as WeddingEventResponse
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
    const responseAny = response as unknown
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as WeddingEventResponse
    }
    if (responseAny?.data) {
      return responseAny.data as WeddingEventResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as WeddingEventResponse
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
    const responseAny = response as unknown
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as WeddingEventResponse
    }
    if (responseAny?.data) {
      return responseAny.data as WeddingEventResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'id' in responseAny) {
      return responseAny as WeddingEventResponse
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
 * Get event info (all books) for a wedding event
 */
export const getEventInfo = async (eventId: number): Promise<EventInfoResponse | null> => {
  try {
    const response = await apiClient.api.getWeddingEventGetEventInfo(eventId)
    const responseAny = response as unknown
    
    // Handle different response structures
    if (responseAny?.data?.data) {
      return responseAny.data.data as EventInfoResponse
    }
    if (responseAny?.data) {
      return responseAny.data as EventInfoResponse
    }
    if (responseAny && typeof responseAny === 'object' && 'itemBook' in responseAny) {
      return responseAny as EventInfoResponse
    }
    
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch event info')
  }
}


