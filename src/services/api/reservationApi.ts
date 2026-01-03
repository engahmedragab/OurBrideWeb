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
  CartResponse,
} from '@/types/responses'
import { ReservationStatus } from '@/types/responses/common'

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
    const responseAny: any = response
    
    // Extract time slots from response
    const timeSlots = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    
    // Ensure it's an array
    return Array.isArray(timeSlots) ? timeSlots : []
  } catch (error: unknown) {
    console.error('Error fetching available time slots:', error)
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
    const responseAny: any = response
    
    // Extract time slots from response
    const timeSlots = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    
    // Ensure it's an array
    return Array.isArray(timeSlots) ? timeSlots : []
  } catch (error: unknown) {
    console.error('Error fetching available time slots for multiple services:', error)
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
    const responseAny: any = response
    
    // Check if response indicates queued status (202)
    // Check both the response status and the data statusCode
    const responseStatus = responseAny?.status || responseAny?.statusCode
    const dataStatusCode = responseAny?.data?.statusCode
    const isQueued = responseStatus === 202 || dataStatusCode === 202
    
    // Extract response data
    const responseData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    
    if (isQueued) {
      // Operation queued - return with queued flag
      // Note: When queued, data might be null, so reservationId might not be available
      const reservationId = responseData?.reservationId || responseData?.data?.reservationId || responseData?.id
      return {
        ...responseData,
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
        const queuedData = axiosError.response.data as any
        const reservationId = queuedData?.reservationId || queuedData?.data?.reservationId
        
        // Return a response indicating the reservation was queued
        return {
          ...queuedData,
          reservationId,
          queued: true,
        } as ReservationResponse & { queued?: boolean }
      }
    }
    
    console.error('Error creating reservation:', error)
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
    const responseAny: any = response
    
    // Check if response indicates queued status (202)
    const responseStatus = responseAny?.status || responseAny?.statusCode
    const dataStatusCode = responseAny?.data?.statusCode
    const isQueued = responseStatus === 202 || dataStatusCode === 202
    
    // Extract response data - new structure: data.createdReservations contains array of ReservationResponse
    const responseData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    
    // Handle queued response (202)
    if (isQueued) {
      // When queued, data might be null or have createdReservations
      const reservations = responseData?.createdReservations || (Array.isArray(responseData) ? responseData : [])
      return {
        reservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
        createdReservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
        failedReservations: responseData?.failedReservations || [],
        totalRequested: responseData?.totalRequested,
        successCount: responseData?.successCount,
        failureCount: responseData?.failureCount,
        allSucceeded: responseData?.allSucceeded,
        queued: true,
        statusCode: 202,
        message: responseAny?.data?.message || responseAny?.message || 'Group reservation queued for processing',
      }
    }
    
    // Immediate completion (200) - data.createdReservations contains array of ReservationResponse
    const reservations = responseData?.createdReservations || 
      (Array.isArray(responseData) ? responseData : []) ||
      (responseData?.reservations || [])
    
    return {
      reservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
      createdReservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
      failedReservations: responseData?.failedReservations || [],
      totalRequested: responseData?.totalRequested,
      successCount: responseData?.successCount,
      failureCount: responseData?.failureCount,
      allSucceeded: responseData?.allSucceeded,
      queued: false,
      statusCode: 200,
      message: responseAny?.data?.message || responseAny?.message,
    }
  } catch (error: unknown) {
    // Check if error response has 202 status (queued)
    const axiosError = error as { response?: { status?: number; data?: unknown }; message?: string }
    if (axiosError.response?.status === 202) {
      // Reservation was queued
      const queuedData = axiosError.response.data as any
      const responseData = queuedData?.data ?? queuedData
      const reservations = responseData?.createdReservations || 
        (Array.isArray(responseData) ? responseData : []) ||
        (responseData?.reservations || [])
      
      return {
        reservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
        createdReservations: Array.isArray(reservations) ? (reservations as ReservationResponse[]) : [],
        failedReservations: responseData?.failedReservations || [],
        totalRequested: responseData?.totalRequested,
        successCount: responseData?.successCount,
        failureCount: responseData?.failureCount,
        allSucceeded: responseData?.allSucceeded,
        queued: true,
        statusCode: 202,
        message: queuedData?.message || responseData?.message || 'Group reservation queued for processing',
      }
    }
    
    console.error('Error creating group reservation:', error)
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
    const responseAny: any = response
    
    const responseData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    
    // Extract reservations and total count
    // Handle both 'reservations' and 'items' field names
    if (responseData && typeof responseData === 'object') {
      const reservations = responseData.reservations ?? responseData.items ?? []
      return {
        reservations: Array.isArray(reservations) ? reservations : [],
        totalCount: responseData.totalCount ?? 0,
      }
    }
    
    return { reservations: [], totalCount: 0 }
  } catch (error: unknown) {
    console.error('Error fetching client reservations:', error)
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
    const responseAny: any = response
    
    const responseData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    
    return Array.isArray(responseData) ? responseData : []
  } catch (error: unknown) {
    console.error('Error fetching user reservations:', error)
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
    const responseAny: any = response
    
    const reservationData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return reservationData as ReservationResponse | null
  } catch (error: unknown) {
    console.error('Error fetching reservation:', error)
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
    const responseAny: any = response
    
    // Extract reservations from response
    // Response structure might be: { data: ReservationResponse[] } or direct array
    const reservations = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    
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
    console.error('Error fetching reservations by IDs:', error)
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
    const responseAny: any = response
    
    const reservationData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    console.error('Error updating reservation:', error)
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
    console.error('Error cancelling reservation:', error)
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
    const responseAny: any = response
    
    const reservationData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    console.error('Error completing reservation:', error)
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
    const responseAny: any = response
    
    const reservationData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    console.error('Error submitting review:', error)
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
    const responseAny: any = response
    
    const reservationData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    console.error('Error confirming reservation payment:', error)
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
    const responseAny: any = response
    
    const availability = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return Boolean(availability)
  } catch (error: unknown) {
    console.error('Error checking slot availability:', error)
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
    const responseAny: any = response
    
    const reservationData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    console.error('Error submitting client test feedback:', error)
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
    const responseAny: any = response
    
    const reservationData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    console.error('Error updating reservation status:', error)
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
    const responseAny: any = response
    
    const reservationData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    console.error('Error creating reservation by provider:', error)
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
    const responseAny: any = response
    
    const reservationData = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return reservationData as ReservationResponse
  } catch (error: unknown) {
    console.error('Error updating reservation by provider:', error)
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
    const responseAny: any = response
    
    const reservations = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    return Array.isArray(reservations) ? reservations : []
  } catch (error: unknown) {
    console.error('Error fetching reservations by provider:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch reservations by provider')
  }
}

/**
 * Change reservation status (alias for updateReservationStatus, used for cancel/delete)
 * Endpoint: POST /api/v1/services/reservations/change-status
 * Note: For cancel, you can also use cancelReservation which uses DELETE endpoint
 */
export const changeReservationStatus = updateReservationStatus
