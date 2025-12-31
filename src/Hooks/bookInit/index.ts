/**
 * Book Initialization Hooks
 * Centralized hooks for initializing all book types
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { initItemBooks } from '@/services/api/itemBooksApi'
import { initServiceBooks } from '@/services/api/serviceBooksApi'
import { initGuestBooks } from '@/services/api/guestBooksApi'
import { initNoteBooks } from '@/services/api/noteBooksApi'
import { initTodoBooks } from '@/services/api/todoBooksApi'
import { initOccasionBooks } from '@/services/api/occasionBooksApi'
import { initEventBooks } from '@/services/api/eventBooksApi'
// Note: Budget init is in a different location
// We'll import it dynamically or create a wrapper
import { apiClient } from '@/services/api/apiClient'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

const initBudgetBook = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    // Normalize params: set clientId and userType to null, keep eventId
    const normalizedParams = params ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: params.eventId,
    } : undefined
    await apiClient.api.postBudgetBooksInit(normalizedParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize budget book')
  }
}

export interface InitBookParams {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Hook to initialize Item Books
 */
export const useInitItemBooks = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initItemBooks(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
    },
  })
}

/**
 * Hook to initialize Service Books
 */
export const useInitServiceBooks = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initServiceBooks(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
    },
  })
}

/**
 * Hook to initialize Guest Books
 */
export const useInitGuestBooks = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initGuestBooks(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
    },
  })
}

/**
 * Hook to initialize Note Books
 */
export const useInitNoteBooks = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initNoteBooks(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
    },
  })
}

/**
 * Hook to initialize Todo Books
 */
export const useInitTodoBooks = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initTodoBooks(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
    },
  })
}

/**
 * Hook to initialize Occasion Books
 */
export const useInitOccasionBooks = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initOccasionBooks(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['occasionBook'] })
    },
  })
}

/**
 * Hook to initialize Event Books
 */
export const useInitEventBooks = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initEventBooks(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
    },
  })
}

/**
 * Hook to initialize Budget Books
 */
export const useInitBudgetBooks = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initBudgetBook(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
    },
  })
}













