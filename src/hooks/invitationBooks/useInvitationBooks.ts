/**
 * InvitationBooks React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  initInvitationBook,
  getInvitationBook,
  getInvitations,
  getInvitationModels,
  getInvitationModelById,
  createInvitationModel,
  updateInvitationModel,
  deleteInvitationModel,
  getInvitationStats,
  getInvitationsByStatus,
  getInvitationsBySide,
  getInvitationById,
  createInvitation,
  createInvitationsFromGuestBook,
  updateInvitation,
  deleteInvitation,
  sendInvitation,
  sendAllInvitations,
  resendInvitation,
  viewInvitation,
  submitRsvp,
  checkInGuest,
  type InvitationBooksQuery,
} from '@/services/api/invitationBooksApi'
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
  InvitationStatus,
  GuestRelevant,
} from '@/../client/common/api/gen/ourbride-api'
import { isAuthenticated } from '@/auth/utils/token'

// ─── Query Keys ──────────────────────────────────────────────────────────────

const keys = {
  all: ['invitationBook'] as const,
  book: (query?: InvitationBooksQuery) => [...keys.all, 'book', query] as const,
  invitations: (query?: InvitationBooksQuery) => [...keys.all, 'list', query] as const,
  invitation: (id: number) => [...keys.all, 'detail', id] as const,
  stats: (query?: InvitationBooksQuery) => [...keys.all, 'stats', query] as const,
  models: () => [...keys.all, 'models'] as const,
  model: (id: number) => [...keys.all, 'model', id] as const,
  byStatus: (status: InvitationStatus, query?: InvitationBooksQuery) => [...keys.all, 'byStatus', status, query] as const,
  bySide: (side: GuestRelevant, query?: InvitationBooksQuery) => [...keys.all, 'bySide', side, query] as const,
  publicView: (token: string) => ['invitationView', token] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useInvitationBook = (query?: InvitationBooksQuery & { enabled?: boolean }) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  return useQuery<InvitationBookResponse | null>({
    queryKey: keys.book(queryParams),
    queryFn: () => getInvitationBook(queryParams),
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useInvitations = (query?: InvitationBooksQuery & { enabled?: boolean }) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  return useQuery<InvitationResponse[]>({
    queryKey: keys.invitations(queryParams),
    queryFn: () => getInvitations(queryParams),
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useInvitationById = (id: number, enabled = true) => {
  const authenticated = isAuthenticated()
  return useQuery<InvitationResponse | null>({
    queryKey: keys.invitation(id),
    queryFn: () => getInvitationById(id),
    enabled: enabled && authenticated && id > 0,
    staleTime: 5 * 60 * 1000,
  })
}

export const useInvitationStats = (query?: InvitationBooksQuery & { enabled?: boolean }) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  return useQuery<InvitationStatsResponse>({
    queryKey: keys.stats(queryParams),
    queryFn: () => getInvitationStats(queryParams),
    enabled: enabled && authenticated,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export const useInvitationModels = (enabled = true) => {
  const authenticated = isAuthenticated()
  return useQuery<InvitationModelResponse[]>({
    queryKey: keys.models(),
    queryFn: () => getInvitationModels(),
    enabled: enabled && authenticated,
    staleTime: 10 * 60 * 1000,
  })
}

export const useInvitationModelById = (modelId: number, enabled = true) => {
  const authenticated = isAuthenticated()
  return useQuery<InvitationModelResponse>({
    queryKey: keys.model(modelId),
    queryFn: () => getInvitationModelById(modelId),
    enabled: enabled && authenticated && modelId > 0,
    staleTime: 10 * 60 * 1000,
  })
}

export const useCreateInvitationModel = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, query }: { data: InvitationModelRequest; query?: InvitationBooksQuery }) =>
      createInvitationModel(data, query),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.models() })
    },
  })
}

export const useUpdateInvitationModel = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data, query }: { id: number; data: Partial<InvitationModelRequest>; query?: InvitationBooksQuery }) =>
      updateInvitationModel(id, data, query),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.models() })
    },
  })
}

export const useDeleteInvitationModel = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteInvitationModel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.models() })
    },
  })
}

export const useInvitationsByStatus = (
  status: InvitationStatus,
  query?: InvitationBooksQuery & { enabled?: boolean }
) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  return useQuery<InvitationResponse[]>({
    queryKey: keys.byStatus(status, queryParams),
    queryFn: () => getInvitationsByStatus(status, queryParams),
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export const useInvitationsBySide = (
  side: GuestRelevant,
  query?: InvitationBooksQuery & { enabled?: boolean }
) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  return useQuery<InvitationResponse[]>({
    queryKey: keys.bySide(side, queryParams),
    queryFn: () => getInvitationsBySide(side, queryParams),
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000,
  })
}

/** Public - no auth required */
export const useViewInvitation = (token: string, enabled = true) => {
  return useQuery<InvitationResponse>({
    queryKey: keys.publicView(token),
    queryFn: () => viewInvitation(token),
    enabled: enabled && !!token,
    staleTime: 60 * 1000,
    retry: 1,
  })
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useInitInvitationBook = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (query?: InvitationBooksQuery) => initInvitationBook(query),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export const useCreateInvitationsFromGuestBook = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, query }: { data: CreateInvitationsFromGuestBookRequest; query?: InvitationBooksQuery }) =>
      createInvitationsFromGuestBook(data, query),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export const useCreateInvitation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, query }: { data: InvitationRequest; query?: InvitationBooksQuery }) =>
      createInvitation(data, query),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export const useUpdateInvitation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InvitationUpdateRequest }) =>
      updateInvitation(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export const useDeleteInvitation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, query }: { id: number; query?: InvitationBooksQuery }) =>
      deleteInvitation(id, query),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export const useSendInvitation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SendWeddingInvitationRequest }) =>
      sendInvitation(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export const useSendAllInvitations = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (query?: InvitationBooksQuery) => sendAllInvitations(query),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

export const useResendInvitation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SendWeddingInvitationRequest }) =>
      resendInvitation(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

/** Public - no auth required */
export const useSubmitRsvp = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: RsvpRequest }) =>
      submitRsvp(token, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: keys.publicView(variables.token) })
    },
  })
}

export const useCheckInGuest = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: WeddingCheckInRequest) => checkInGuest(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}
