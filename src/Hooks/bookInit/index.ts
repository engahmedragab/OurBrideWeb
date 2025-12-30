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
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

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
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initItemBooks(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Item books initialized successfully',
        'Failed to initialize item books'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize item books'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Service Books
 */
export const useInitServiceBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initServiceBooks(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Service books initialized successfully',
        'Failed to initialize service books'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize service books'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Guest Books
 */
export const useInitGuestBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initGuestBooks(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Guest books initialized successfully',
        'Failed to initialize guest books'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize guest books'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Note Books
 */
export const useInitNoteBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initNoteBooks(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Note books initialized successfully',
        'Failed to initialize note books'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize note books'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Todo Books
 */
export const useInitTodoBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initTodoBooks(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Todo books initialized successfully',
        'Failed to initialize todo books'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize todo books'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Occasion Books
 */
export const useInitOccasionBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initOccasionBooks(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['occasionBook'] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Occasion books initialized successfully',
        'Failed to initialize occasion books'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize occasion books'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Event Books
 */
export const useInitEventBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initEventBooks(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Event books initialized successfully',
        'Failed to initialize event books'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize event books'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Budget Books
 */
export const useInitBudgetBooks = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await initBudgetBook(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      const { message, type } = handleApiResponseForToast(
        response,
        'Budget books initialized successfully',
        'Failed to initialize budget books'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize budget books'
      addToast(errorMessage, 'error')
    },
  })
}












