import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { noteBookKeys } from './noteBooks.keys'
import { initNoteBooks, syncNoteBook, getNoteBook } from '@/services/api/noteBooksApi'
import type { NoteBooksQuery } from '@/services/api/noteBooksApi'
import type { NoteBookResponse } from '@/types/responses'
import type { NoteBookRequest } from '@/../client/common/api/gen/ourbride-api'

const normalizeQuerySafe = (query?: NoteBooksQuery): NoteBooksQuery | undefined => {
  if (!query) return undefined
  const q: any = { ...query }

  for (const key of Object.keys(q)) {
    if (q[key] === null) q[key] = undefined
    if (typeof q[key] === 'string' && q[key].trim() === '') q[key] = undefined
  }

  Object.keys(q).forEach((k) => q[k] === undefined && delete q[k])
  return Object.keys(q).length ? (q as NoteBooksQuery) : undefined
}

const invalidateNoteBookQueries = (queryClient: ReturnType<typeof useQueryClient>, query?: NoteBooksQuery) => {
  queryClient.invalidateQueries({ queryKey: noteBookKeys.all() })
  if (query) queryClient.invalidateQueries({ queryKey: noteBookKeys.book(query) })
}

export const useNoteBook = (
  query?: NoteBooksQuery,
  options?: Omit<UseQueryOptions<NoteBookResponse | null, Error>, 'queryKey' | 'queryFn'>
) => {
  const normalizedQuery = normalizeQuerySafe(query)

  return useQuery<NoteBookResponse | null, Error>({
    queryKey: noteBookKeys.book(normalizedQuery),
    queryFn: () => getNoteBook(normalizedQuery),
    ...options,
  })
}

export const useInitNoteBooks = (
  options?: Omit<
    UseMutationOptions<void, Error, { eventId?: number; clientId?: string; userType?: any }, unknown>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { eventId?: number; clientId?: string; userType?: any }, unknown>({
    mutationFn: async (params) => {
      const safe: any = { ...params }
      Object.keys(safe).forEach((k) => safe[k] == null && delete safe[k])
      if (typeof safe.clientId === 'string' && !safe.clientId.trim()) delete safe.clientId

      await initNoteBooks(safe)
    },
    onSuccess: (_data, variables) => {
      invalidateNoteBookQueries(queryClient, normalizeQuerySafe(variables as any))
    },
    ...options,
  })
}

export const useNoteSyncMutation = (
  options?: Omit<UseMutationOptions<void, Error, NoteBookRequest & { query?: NoteBooksQuery }, unknown>, 'mutationFn'>
) => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, NoteBookRequest & { query?: NoteBooksQuery }, unknown>({
    mutationFn: async ({ query, ...data }) => {
      const normalizedQuery = normalizeQuerySafe(query)
      await syncNoteBook(data, normalizedQuery)
    },
    onSuccess: (_data, variables) => {
      invalidateNoteBookQueries(queryClient, normalizeQuerySafe(variables.query))
    },
    ...options,
  })
}
