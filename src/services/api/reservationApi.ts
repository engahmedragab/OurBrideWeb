// Reservation API service functions

import { apiClient } from '@/services/api/apiClient'
import type {
  ReservationRequest,
  ReservationUpdateRequest,
  GroupReservationRequest,
  ClientTestFeedbackRequest,
  MultipleServicesTimeSlotsRequest,
} from '@/../client/common/api/gen/ourbride-api'
import type {
  ReservationResponse,
  TimeSlotResponse,
} from '@/types/responses'
import { ReservationStatus } from '@/types/responses/common'

/**
 * Helper function to safely extract data from API response
 */
const extractResponseData = (response: unknown): unknown => {
  const responseAny = response as unknown as { data?: { data?: unknown } | unknown } | Record<string, unknown>
  if (responseAny && typeof responseAny === 'object') {
    if ('data' in responseAny) {
      const data = responseAny.data
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data?: unknown }).data ?? data
      }
      return data
    }
  }
  return responseAny
}

/**
 * Get available time slots for a service
 * Endpoint: GET /api/v1/services/reservations/{serviceId}/available-timeslots
 * Supports both client and provider use cases
 */
export const getAvailableTimeSlots = async (
  serviceId: number,
  options?: {
    staffId?: number | string // Can be number or string (for flexibility)
    branchId?: number
    startDate?: string // ISO date string
  }
): Promise<TimeSlotResponse[]> => {
  try {
    // Convert staffId to number if it's a string
    const staffId = options?.staffId 
      ? (typeof options.staffId === 'string' ? parseInt(options.staffId, 10) : options.staffId)
      : undefined
    
    const response = await apiClient.api.getReservationGenerateTimeSlots(
      serviceId,
      {
        staffId: staffId && !isNaN(staffId) ? staffId : undefined,
        branchId: options?.branchId,
        startDate: options?.startDate,
      }
    )
    // Extract time slots from response
    const timeSlots = extractResponseData(response)
    
    // Ensure it's an array
    return Array.isArray(timeSlots) ? timeSlots : []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch available time slots')
  }
}

/**
 * Get available time slots for multiple services
 * Endpoint: POST /api/v1/services/reservations/available-timeslots/multiple
 */
export const getAvailableTimeSlotsForMultipleServices = async (
  request: MultipleServicesTimeSlotsRequest
): Promise<TimeSlotResponse[]> => {
  try {
    const response = await apiClient.api.postReservationGenerateTimeSlotsForMultipleServices(request)
    // Extract time slots from response
    const timeSlots = extractResponseData(response)
    
    // Ensure it's an array
    return Array.isArray(timeSlots) ? timeSlots : []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch available time slots for multiple services')
  }
}

/**
 * Create a reservation (Client)
 * Endpoint: POST /api/v1/services/reservations/client
 * Returns a ReservationResponse or queued response
 */
export const createReservation = async (
  data: ReservationRequest
): Promise<ReservationResponse & { queued?: boolean }> => {
  try {
    // Use the client reservation creation endpoint
    const response = await apiClient.api.postReservationCreateByClient(data)
    const responseAny = response as unknown as { status?: number; statusCode?: number; data?: { statusCode?: number; data?: unknown } | unknown } | Record<string, unknown>
    
    // Check if response indicates queued status (202)
    // Check both the response status and the data statusCode
    const responseStatus = (responseAny && typeof responseAny === 'object' && ('status' in responseAny || 'statusCode' in responseAny))
      ? (responseAny.status ?? (responseAny as { statusCode?: number }).statusCode)
      : undefined
    const dataStatusCode = (responseAny && typeof responseAny === 'object' && 'data' in responseAny && responseAny.data && typeof responseAny.data === 'object' && 'statusCode' in responseAny.data)
      ? (responseAny.data as { statusCode?: number }).statusCode
      : undefined
    const isQueued = responseStatus === 202 || dataStatusCode === 202
    
    // Extract response data
    const responseData = extractResponseData(response)
    
    if (isQueued) {
      // Operation queued - return with queued flag
      // Note: When queued, data might be null, so reservationId might not be available
      const responseObj = responseData as { reservationId?: string; data?: { reservationId?: string }; id?: string } | null
      const reservationId = responseObj?.reservationId || (responseObj && typeof responseObj === 'object' && 'data' in responseObj && responseObj.data && typeof responseObj.data === 'object' && 'reservationId' in responseObj.data ? (responseObj.data as { reservationId?: string }).reservationId : undefined) || responseObj?.id
      return {
        ...(responseObj as unknown as ReservationResponse || {} as unknown as ReservationResponse),
        reservationId: reservationId || undefined,
        statusCode: 202,
        queued: true,
      } as ReservationResponse & { queued?: boolean; statusCode?: number }
    }
    
    // Immediate completion (200)
    return responseData as ReservationResponse
  } catch (error: unknown) {
    // Check if error response has 202 status (queued)
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } }
      if (axiosError.response?.status === 202) {
        // Reservation was queued - extract reservation ID if available
        const queuedData = axiosError.response.data as unknown as { reservationId?: string; data?: { reservationId?: string } } | Record<string, unknown>
        const reservationId = (queuedData && typeof queuedData === 'object' && 'reservationId' in queuedData)
          ? queuedData.reservationId
          : (queuedData && typeof queuedData === 'object' && 'data' in queuedData && queuedData.data && typeof queuedData.data === 'object' && 'reservationId' in queuedData.data)
            ? (queuedData.data as { reservationId?: string }).reservationId
            : undefined
        
        // Return a response indicating the reservation was queued
        return {
          ...queuedData,
          reservationId,
          queued: true,
        } as ReservationResponse & { queued?: boolean }
      }
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to create reservation')
  }
}

/**
 * Create a group reservation
 * Endpoint: POST /api/v1/services/reservations/group
 */
export interface GroupReservationResponse {
  reservations: ReservationResponse[]
  createdReservations?: ReservationResponse[]
  failedReservations?: ReservationResponse[]
  totalRequested?: number
  successCount?: number
  failureCount?: number
  allSucceeded?: boolean
  queued?: boolean
  statusCode?: number
  message?: string
}

export const createGroupReservation = async (
  data: GroupReservationRequest
): Promise<GroupReservationResponse> => {
  try {
    const response = await apiClient.api.postReservationCreateGroupReservations(data)
    const responseAny = response as unknown as { status?: number; statusCode?: number; data?: { statusCode?: number; data?: unknown; message?: string } | unknown; message?: string } | Record<string, unknown>
    
    // Check if response indicates queued status (202)
    const responseStatus = (responseAny && typeof responseAny === 'object' && ('status' in responseAny || 'statusCode' in responseAny))
      ? (responseAny.status ?? (responseAny as { statusCode?: number }).statusCode)
      : undefined
    const dataStatusCode = (responseAny && typeof responseAny === 'object' && 'data' in responseAny && responseAny.data && typeof responseAny.data === 'object' && 'statusCode' in responseAny.data)
      ? (responseAny.data as { statusCode?: number }).statusCode
      : undefined
    const isQueued = responseStatus === 202 || dataStatusCode === 202
    
    // Extract response data - new structure: data.createdReservations contains array of ReservationResponse
    const responseData = extractResponseData(response)
    
    // Handle queued response (202)
    if (isQueued) {
      // When queued, data might be null or have createdReservations
      const responseObj = responseData as { createdReservations?: unknown[]; failedReservations?: unknown[]; totalRequested?: number; successCount?: number; failureCount?: number; allSucceeded?: boolean } | unknown[] | null
      const reservations = (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'createdReservations' in responseObj)
        ? responseObj.createdReservations
        : (Array.isArray(responseObj) ? responseObj : [])
      return {
        reservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
        createdReservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
        failedReservations: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'failedReservations' in responseObj && Array.isArray(responseObj.failedReservations)) ? (responseObj.failedReservations as ReservationResponse[]) : [],
        totalRequested: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'totalRequested' in responseObj) ? responseObj.totalRequested : undefined,
        successCount: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'successCount' in responseObj) ? responseObj.successCount : undefined,
        failureCount: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'failureCount' in responseObj) ? responseObj.failureCount : undefined,
        allSucceeded: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'allSucceeded' in responseObj) ? responseObj.allSucceeded : undefined,
        queued: true,
        statusCode: 202,
        message: (responseAny && typeof responseAny === 'object' && 'data' in responseAny && responseAny.data && typeof responseAny.data === 'object' && 'message' in responseAny.data)
          ? (responseAny.data as { message?: string }).message
          : (responseAny && typeof responseAny === 'object' && 'message' in responseAny)
            ? (responseAny as { message?: string }).message
            : 'Group reservation queued for processing',
      }
    }
    
    // Immediate completion (200) - data.createdReservations contains array of ReservationResponse
    const responseObj = responseData as { createdReservations?: unknown[]; reservations?: unknown[]; failedReservations?: unknown[]; totalRequested?: number; successCount?: number; failureCount?: number; allSucceeded?: boolean } | unknown[] | null
    const reservations = (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'createdReservations' in responseObj)
      ? responseObj.createdReservations
      : (Array.isArray(responseObj) ? responseObj : [])
        || (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'reservations' in responseObj ? responseObj.reservations : [])
    
    return {
      reservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
      createdReservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
      failedReservations: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'failedReservations' in responseObj && Array.isArray(responseObj.failedReservations)) ? (responseObj.failedReservations as ReservationResponse[]) : [],
      totalRequested: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'totalRequested' in responseObj) ? responseObj.totalRequested : undefined,
      successCount: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'successCount' in responseObj) ? responseObj.successCount : undefined,
      failureCount: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'failureCount' in responseObj) ? responseObj.failureCount : undefined,
      allSucceeded: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'allSucceeded' in responseObj) ? responseObj.allSucceeded : undefined,
      queued: false,
      statusCode: 200,
      message: (responseAny && typeof responseAny === 'object' && 'data' in responseAny && responseAny.data && typeof responseAny.data === 'object' && 'message' in responseAny.data)
        ? (responseAny.data as { message?: string }).message
        : (responseAny && typeof responseAny === 'object' && 'message' in responseAny)
          ? (responseAny as { message?: string }).message
          : undefined,
    }
  } catch (error: unknown) {
    // Check if error response has 202 status (queued)
    const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
    if (axiosError.response?.status === 202) {
      // Reservation was queued
      const queuedData = axiosError.response.data as unknown as { data?: unknown; message?: string; createdReservations?: unknown[]; reservations?: unknown[]; failedReservations?: unknown[]; totalRequested?: number; successCount?: number; failureCount?: number; allSucceeded?: boolean } | Record<string, unknown>
      const responseData = (queuedData && typeof queuedData === 'object' && 'data' in queuedData) ? queuedData.data : queuedData
      const responseObj = responseData as { createdReservations?: unknown[]; reservations?: unknown[]; failedReservations?: unknown[]; totalRequested?: number; successCount?: number; failureCount?: number; allSucceeded?: boolean; message?: string } | unknown[] | null
      const reservations = (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'createdReservations' in responseObj)
        ? responseObj.createdReservations
        : (Array.isArray(responseObj) ? responseObj : [])
          || (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'reservations' in responseObj ? responseObj.reservations : [])
      
      return {
        reservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
        createdReservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
        failedReservations: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'failedReservations' in responseObj && Array.isArray(responseObj.failedReservations)) ? (responseObj.failedReservations as ReservationResponse[]) : [],
        totalRequested: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'totalRequested' in responseObj) ? responseObj.totalRequested : undefined,
        successCount: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'successCount' in responseObj) ? responseObj.successCount : undefined,
        failureCount: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'failureCount' in responseObj) ? responseObj.failureCount : undefined,
        allSucceeded: (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'allSucceeded' in responseObj) ? responseObj.allSucceeded : undefined,
        queued: true,
        statusCode: 202,
        message: (queuedData && typeof queuedData === 'object' && 'message' in queuedData)
          ? (queuedData as { message?: string }).message
          : (responseObj && typeof responseObj === 'object' && !Array.isArray(responseObj) && 'message' in responseObj)
            ? responseObj.message
            : 'Group reservation queued for processing',
      }
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to create group reservation')
  }
}

/**
 * Get all client reservations (paginated)
 * Endpoint: GET /api/v1/services/reservations/clients/paginated
 */
export const getClientReservationsPaginated = async (options?: {
  page?: number
  pageSize?: number
  clientId?: string
  providerId?: number
}): Promise<{
  reservations: ReservationResponse[]
  totalCount: number
}> => {
  try {
    const response = await apiClient.api.getReservationGetClientReservationsPaginated({
      page: options?.page ?? 1,
      pageSize: options?.pageSize ?? 10,
      clientId: options?.clientId,
      providerId: options?.providerId,
    })
    const responseData = extractResponseData(response)
    
    // Extract reservations and total count
    // Handle both 'reservations' and 'items' field names
    if (responseData && typeof responseData === 'object' && ('reservations' in responseData || 'items' in responseData || 'totalCount' in responseData)) {
      const responseObj = responseData as { reservations?: unknown[]; items?: unknown[]; totalCount?: number }
      const reservations = responseObj.reservations ?? responseObj.items ?? []
      return {
        reservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
        totalCount: (responseData as { totalCount?: number }).totalCount ?? 0,
      }
    }
    
    return { reservations: [], totalCount: 0 }
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch client reservations')
  }
}

/**
 * Get all user reservations
 * Endpoint: GET /api/v1/services/reservations
 */
export const getUserReservations = async (): Promise<ReservationResponse[]> => {
  try {
    const response = await apiClient.api.getReservationGetByUser()
    const responseData = extractResponseData(response)
    
    return Array.isArray(responseData) ? responseData : []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch user reservations')
  }
}

/**
 * Get reservation by ID
 * Endpoint: GET /api/v1/services/reservations/{reservationId}
 */
export const getReservationById = async (
  reservationId: string
): Promise<ReservationResponse | null> => {
  try {
    const response = await apiClient.api.getReservationGetDetails(reservationId)
    const reservationData = extractResponseData(response)
    return reservationData as ReservationResponse | null
  } catch (error: unknown) {
    return null
  }
}

/**
 * Get multiple reservations by IDs (bulk)
 * Endpoint: POST /api/v1/services/reservations/by-ids
 * More efficient than calling getReservationById multiple times
 */
export const getReservationsByIds = async (
  reservationIds: string[]
): Promise<ReservationResponse[]> => {
  try {
    if (!reservationIds || reservationIds.length === 0) {
      return []
    }

    const response = await apiClient.api.postReservationGetReservationsByIds(reservationIds)
    
    // Extract reservations from response
    // Response structure might be: { data: ReservationResponse[] } or direct array
    const reservations = extractResponseData(response)
    
    // Ensure we return an array
    if (Array.isArray(reservations)) {
      return reservations as ReservationResponse[]
    }
    
    // If single reservation, wrap in array
    if (reservations && typeof reservations === 'object' && 'reservationId' in reservations) {
      return [reservations as ReservationResponse]
    }
    
    return []
  } catch (error: unknown) {
    return []
  }
}

/**
 * Update reservation (Client)
 * Endpoint: PUT /api/v1/services/reservations/client/{reservationId}
 */
export const updateReservation = async (
  reservationId: string,
  data: ReservationUpdateRequest
): Promise<ReservationResponse> => {
  try {
    const response = await apiClient.api.putReservationUpdateByClient(reservationId, data)
    const reservationData = extractResponseData(response)
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update reservation')
  }
}

/**
 * Cancel reservation
 * Endpoint: DELETE /api/v1/services/reservations/{reservationId}/cancel
 */
export const cancelReservation = async (
  reservationId: string
): Promise<void> => {
  try {
    await apiClient.api.deleteReservationCancelReservation(reservationId)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to cancel reservation')
  }
}

/**
 * Complete reservation
 * Endpoint: POST /api/v1/services/reservations/complete
 */
export const completeReservation = async (
  reservationId: string
): Promise<ReservationResponse> => {
  try {
    const response = await apiClient.api.postReservationCompleteReservation({
      reservationId,
    })
    const reservationData = extractResponseData(response)
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to complete reservation')
  }
}

/**
 * Submit review
 * Endpoint: POST /api/v1/services/reservations/review
 */
export const submitReview = async (
  reservationId: string,
  comment: string,
  rating: number
): Promise<ReservationResponse> => {
  try {
    const response = await apiClient.api.postReservationSubmitReview({
      reservationId,
      comment,
      rating,
    })
    const reservationData = extractResponseData(response)
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to submit review')
  }
}

/**
 * Confirm reservation payment
 * Endpoint: POST /api/v1/services/reservations/confirm-payment
 */
export const confirmReservationPayment = async (
  reservationId: string,
  paymentReference?: string
): Promise<ReservationResponse> => {
  try {
    const response = await apiClient.api.postReservationConfirmPayment({
      reservationId,
      paymentReference,
    })
    const reservationData = extractResponseData(response)
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to confirm reservation payment')
  }
}

/**
 * Check slot availability
 * Endpoint: GET /api/v1/services/reservations/check-slot-availability
 */
export const checkSlotAvailability = async (
  slotId: number,
  serviceId: number
): Promise<boolean> => {
  try {
    const response = await apiClient.api.getReservationCheckSlotAvailability({
      slotId,
      serviceId,
    })
    const availability = extractResponseData(response)
    return Boolean(availability)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to check slot availability')
  }
}

/**
 * Submit client test feedback
 * Endpoint: POST /api/v1/test/client-feedback
 */
export const submitClientTestFeedback = async (
  data: ClientTestFeedbackRequest
): Promise<ReservationResponse> => {
  try {
    const response = await apiClient.api.postReservationClientTestFeedback(data)
    const reservationData = extractResponseData(response)
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to submit client test feedback')
  }
}

/**
 * Update reservation status
 * Endpoint: POST /api/v1/services/reservations/change-status
 */
export const updateReservationStatus = async (
  reservationId: string,
  status: ReservationStatus
): Promise<ReservationResponse> => {
  try {
    const response = await apiClient.api.postReservationChangeStatus({
      reservationId,
      reservationStatus: status,
    })
    const reservationData = extractResponseData(response)
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update reservation status')
  }
}

// ============================================================================
// PROVIDER-SPECIFIC RESERVATION FUNCTIONS
// ============================================================================

/**
 * Create reservation by provider
 * Endpoint: POST /api/v1/services/reservations/provider/create
 */
export const createReservationByProvider = async (
  data: ReservationRequest
): Promise<ReservationResponse> => {
  try {
    const response = await apiClient.api.postReservationCreateReservation(data)
    const reservationData = extractResponseData(response)
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create reservation by provider')
  }
}

/**
 * Update reservation by provider
 * Endpoint: PUT /api/v1/services/reservations/provider/{reservationId}
 */
export const updateReservationByProvider = async (
  reservationId: string,
  data: ReservationUpdateRequest
): Promise<ReservationResponse> => {
  try {
    const response = await apiClient.api.putReservationUpdateReservation(reservationId, data)
    const reservationData = extractResponseData(response)
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update reservation by provider')
  }
}

/**
 * Get all reservations by provider ID
 * Endpoint: GET /api/v1/services/reservations/providers/{providerId}
 */
export const getReservationsByProviderId = async (
  providerId: number
): Promise<ReservationResponse[]> => {
  try {
    const response = await apiClient.api.getReservationGetProviderAll(providerId)
    const reservations = extractResponseData(response)
    return Array.isArray(reservations) ? (reservations as ReservationResponse[]) : []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch reservations by provider')
  }
}

/**
 * Change reservation status (alias for updateReservationStatus, used for cancel/delete)
 * Endpoint: POST /api/v1/services/reservations/change-status
 * Note: For cancel, you can also use cancelReservation which uses DELETE endpoint
 */
export const changeReservationStatus = updateReservationStatus
