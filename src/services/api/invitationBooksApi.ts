/**
 * InvitationBooks API Functions
 * API service for managing wedding invitation books
 */

import { apiClient } from '@/services/api/apiClient'
import type {
  InvitationBookResponse,
  InvitationResponse,
  InvitationStatsResponse,
  InvitationModelResponse,
  InvitationModelRequest,
  WeddingCheckInResponse,
} from '@/types/responses/invitation-book-response'
import type {
  InvitationRequest,
  InvitationUpdateRequest,
  SendWeddingInvitationRequest,
  RsvpRequest,
  WeddingCheckInRequest,
  CreateInvitationsFromGuestBookRequest,
  UserType,
  InvitationStatus,
  GuestRelevant,
} from '@/../client/common/api/gen/ourbride-api'

export interface InvitationBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

const normalizeQuery = (query?: InvitationBooksQuery) => {
  if (!query) return undefined
  return {
    clientId: null as unknown as string | undefined,
    userType: null as unknown as UserType | undefined,
    eventId: query.eventId,
  }
}

/** Extract response data from various wrapper structures */
const extractData = <T>(response: unknown): T => {
  const r = response as any
  if (r?.data?.data !== undefined) return r.data.data
  if (r?.data !== undefined) {
    if (typeof r.data === 'object' && 'id' in r.data) return r.data
    if (Array.isArray(r.data)) return r.data as unknown as T
    if (typeof r.data === 'object' && 'data' in r.data) return r.data.data
    return r.data
  }
  return r
}

// ─── STEP 1: Initialize ───────────────────────────────────────────────────────

export const initInvitationBook = async (
  query?: InvitationBooksQuery
): Promise<InvitationBookResponse> => {
  try {
    const params = normalizeQuery(query)
    const response = await apiClient.api.postInvitationBooksInit(params)
    return extractData<InvitationBookResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize invitation book')
  }
}

// ─── STEP 2: Browse & Manage Templates (InvitationModel) ────────────────────

/** Axios instance with auth/lang interceptors already attached */
const http = () => apiClient.http.instance

export const getInvitationModels = async (): Promise<InvitationModelResponse[]> => {
  try {
    const response = await apiClient.api.getInvitationBooksGetModels()
    const data = extractData<InvitationModelResponse[] | { items?: InvitationModelResponse[] }>(response)
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) return data.items
    return []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch invitation models')
  }
}

export const getInvitationModelById = async (
  modelId: number
): Promise<InvitationModelResponse> => {
  try {
    const response = await http().get(`/api/v1/books/invitationbooks/models/${modelId}`)
    return extractData<InvitationModelResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch invitation model')
  }
}

export const createInvitationModel = async (
  data: InvitationModelRequest,
  query?: InvitationBooksQuery
): Promise<InvitationModelResponse> => {
  try {
    const params = normalizeQuery(query)
    const response = await http().post('/api/v1/books/invitationbooks/models', data, { params })
    return extractData<InvitationModelResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create invitation model')
  }
}

/**
 * Partial update — only non-null fields are overwritten on the server.
 * Pass only the fields you want to change.
 */
export const updateInvitationModel = async (
  modelId: number,
  data: Partial<InvitationModelRequest>,
  query?: InvitationBooksQuery
): Promise<InvitationModelResponse> => {
  try {
    const params = normalizeQuery(query)
    const response = await http().put(`/api/v1/books/invitationbooks/models/${modelId}`, data, { params })
    return extractData<InvitationModelResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update invitation model')
  }
}

export const deleteInvitationModel = async (
  modelId: number
): Promise<void> => {
  try {
    await http().delete(`/api/v1/books/invitationbooks/models/${modelId}/delete`)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete invitation model')
  }
}

// ─── STEP 3: Bulk Create from Guest Book ──────────────────────────────────────

export const createInvitationsFromGuestBook = async (
  data: CreateInvitationsFromGuestBookRequest,
  query?: InvitationBooksQuery
): Promise<InvitationBookResponse> => {
  try {
    const params = normalizeQuery(query)
    const response = await apiClient.api.postInvitationBooksCreateFromGuestBook(data, params)
    return extractData<InvitationBookResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create invitations from guest book')
  }
}

// ─── STEP 4: Create Single Invitation ─────────────────────────────────────────

export const createInvitation = async (
  data: InvitationRequest,
  query?: InvitationBooksQuery
): Promise<InvitationResponse> => {
  try {
    const params = normalizeQuery(query)
    const response = await apiClient.api.postInvitationBooksCreate(data, params)
    return extractData<InvitationResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create invitation')
  }
}

// ─── STEP 5: Update Invitation ────────────────────────────────────────────────

export const updateInvitation = async (
  invitationLineId: number,
  data: InvitationUpdateRequest
): Promise<InvitationResponse> => {
  try {
    const response = await apiClient.api.putInvitationBooksUpdate(invitationLineId, data)
    return extractData<InvitationResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update invitation')
  }
}

// ─── STEP 6: Get Invitation Book ──────────────────────────────────────────────

export const getInvitationBook = async (
  query?: InvitationBooksQuery
): Promise<InvitationBookResponse | null> => {
  try {
    const params = normalizeQuery(query)
    const response = await apiClient.api.getInvitationBooksGetBook(params)
    const data = extractData<InvitationBookResponse | null>(response)
    if (data && typeof data === 'object' && 'id' in data) return data
    return null
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch invitation book')
  }
}

export const getInvitations = async (
  query?: InvitationBooksQuery
): Promise<InvitationResponse[]> => {
  try {
    const params = normalizeQuery(query)
    const response = await apiClient.api.getInvitationBooksGetAll(params)
    const data = extractData<InvitationResponse[]>(response)
    return Array.isArray(data) ? data : []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch invitations')
  }
}

export const getInvitationById = async (
  invitationLineId: number
): Promise<InvitationResponse | null> => {
  try {
    const response = await apiClient.api.getInvitationBooksGet(invitationLineId)
    return extractData<InvitationResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch invitation')
  }
}

// ─── STEP 7: Send Invitations ─────────────────────────────────────────────────

export const sendInvitation = async (
  invitationLineId: number,
  data: SendWeddingInvitationRequest
): Promise<InvitationResponse> => {
  try {
    const response = await apiClient.api.postInvitationBooksSendInvitation(invitationLineId, data)
    return extractData<InvitationResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send invitation')
  }
}

export const sendAllInvitations = async (
  query?: InvitationBooksQuery
): Promise<void> => {
  try {
    const params = normalizeQuery(query)
    await apiClient.api.postInvitationBooksSendAll(params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to send all invitations')
  }
}

export const resendInvitation = async (
  invitationLineId: number,
  data: SendWeddingInvitationRequest
): Promise<InvitationResponse> => {
  try {
    const response = await apiClient.api.postInvitationBooksResendInvitation(invitationLineId, data)
    return extractData<InvitationResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to resend invitation')
  }
}

// ─── STEP 8: View Invitation (Public) ─────────────────────────────────────────

export const viewInvitation = async (
  token: string
): Promise<InvitationResponse> => {
  try {
    const response = await apiClient.api.getInvitationBooksViewInvitation(token)
    return extractData<InvitationResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to view invitation')
  }
}

// ─── STEP 9: RSVP (Public) ───────────────────────────────────────────────────

export const submitRsvp = async (
  token: string,
  data: RsvpRequest
): Promise<InvitationResponse> => {
  try {
    const response = await apiClient.api.postInvitationBooksRsvp(token, data)
    return extractData<InvitationResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to submit RSVP')
  }
}

// ─── STEP 10: Check-in ───────────────────────────────────────────────────────

export const checkInGuest = async (
  data: WeddingCheckInRequest
): Promise<WeddingCheckInResponse> => {
  try {
    const response = await apiClient.api.postInvitationBooksCheckIn(data)
    return extractData<WeddingCheckInResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to check in guest')
  }
}

// ─── STEP 11: Stats & Filtered Views ─────────────────────────────────────────

export const getInvitationStats = async (
  query?: InvitationBooksQuery
): Promise<InvitationStatsResponse> => {
  try {
    const params = normalizeQuery(query)
    const response = await apiClient.api.getInvitationBooksStats(params)
    return extractData<InvitationStatsResponse>(response)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch invitation stats')
  }
}

export const getInvitationsByStatus = async (
  status: InvitationStatus,
  query?: InvitationBooksQuery
): Promise<InvitationResponse[]> => {
  try {
    const params = {
      status,
      ...normalizeQuery(query),
    }
    const response = await apiClient.api.getInvitationBooksGetByStatus(params)
    const data = extractData<InvitationResponse[]>(response)
    return Array.isArray(data) ? data : []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch invitations by status')
  }
}

export const getInvitationsBySide = async (
  side: GuestRelevant,
  query?: InvitationBooksQuery
): Promise<InvitationResponse[]> => {
  try {
    const params = {
      side,
      ...normalizeQuery(query),
    }
    const response = await apiClient.api.getInvitationBooksGetBySide(params)
    const data = extractData<InvitationResponse[]>(response)
    return Array.isArray(data) ? data : []
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch invitations by side')
  }
}

// ─── Delete Invitation ───────────────────────────────────────────────────────

export const deleteInvitation = async (
  invitationLineId: number,
  query?: InvitationBooksQuery
): Promise<void> => {
  try {
    const params = normalizeQuery(query)
    await apiClient.api.deleteInvitationBooksDelete(invitationLineId, params)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete invitation')
  }
}
