/**
 * Book Initialization Hooks
 * Centralized hooks for initializing all book types
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { initItemBooks, addItemBookModels } from '@/services/api/itemBooksApi'
import { initServiceBooks, addServiceBookModels } from '@/services/api/serviceBooksApi'
import { initGuestBooks, addGuestBookModels } from '@/services/api/guestBooksApi'
import { initNoteBooks, addNoteBookModels } from '@/services/api/noteBooksApi'
import { initTodoBooks, addTodoBookModels } from '@/services/api/todoBooksApi'
import { initOccasionBooks, addOccasionBookModels } from '@/services/api/occasionBooksApi'
import { initEventBooks, addEventBookModels } from '@/services/api/eventBooksApi'
// Note: Budget init is in a different location
// We'll import it dynamically or create a wrapper
import { apiClient } from '@/services/api/apiClient'
import { addBudgetBookModels } from '@/services/api/budgetBooks.api'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import { useI18nTranslations } from '@/i18n'

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

const addBudgetBookModelsFn = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    const normalizedParams = params ? {
      clientId: null as unknown as string | undefined,
      userType: null as unknown as UserType | undefined,
      eventId: params.eventId,
    } : undefined
    await addBudgetBookModels(normalizedParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to add budget book models')
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
  const t = useI18nTranslations('alert')
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
        t('itemBooksInitSuccess'),
        t('itemBooksInitError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('itemBooksInitError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Service Books
 */
export const useInitServiceBooks = () => {
  const t = useI18nTranslations('alert')
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
        t('serviceBooksInitSuccess'),
        t('serviceBooksInitError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('serviceBooksInitError')
      addToast(errorMessage, 'error')
    },
  })
}


/**
 * Hook to initialize Guest Books
 */
export const useInitGuestBooks = () => {
  const t = useI18nTranslations('alert')
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
        t('guestBooksInitSuccess'),
        t('guestBooksInitError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('guestBooksInitError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Note Books
 */
export const useInitNoteBooks = () => {
  const t = useI18nTranslations('alert')
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
        t('noteBooksInitSuccess'),
        t('noteBooksInitError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('noteBooksInitError')
      addToast(errorMessage, 'error')
    },
  })
}


/**
 * Hook to initialize Todo Books
 */
export const useInitTodoBooks = () => {
  const t = useI18nTranslations('alert')
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
        t('todoBooksInitSuccess'),
        t('todoBooksInitError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('todoBooksInitError')
      addToast(errorMessage, 'error')
    },
  })
}


/**
 * Hook to initialize Occasion Books
 */
export const useInitOccasionBooks = () => {
  const t = useI18nTranslations('alert')
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
        t('occasionBooksInitSuccess'),
        t('occasionBooksInitError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('occasionBooksInitError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to initialize Event Books
 */
export const useInitEventBooks = () => {
  const t = useI18nTranslations('alert')
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
        t('eventBooksInitSuccess'),
        t('eventBooksInitError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('eventBooksInitError')
      addToast(errorMessage, 'error')
    },
  })
}


/**
 * Hook to initialize Budget Books
 */
export const useInitBudgetBooks = () => {
  const t = useI18nTranslations('alert')
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
        t('budgetBooksInitSuccess'),
        t('budgetBooksInitError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('budgetBooksInitError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to add models to Budget Books
 */
export const useAddBudgetBookModels = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await addBudgetBookModelsFn(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['budgetBook'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('budgetBookModelsAddSuccess'),
        t('budgetBookModelsAddError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('budgetBookModelsAddError')
      addToast(errorMessage, 'error')
    },
  })
}


/**
 * Hook to add models to Item Books
 */
export const useAddItemBookModels = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await addItemBookModels(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['itemBook'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('itemBookModelsAddSuccess'),
        t('itemBookModelsAddError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('itemBookModelsAddError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to add models to Service Books
 */
export const useAddServiceBookModels = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await addServiceBookModels(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['serviceBook'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('serviceBookModelsAddSuccess'),
        t('serviceBookModelsAddError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('serviceBookModelsAddError')
      addToast(errorMessage, 'error')
    },
  })
}


/**
 * Hook to add models to Guest Books
 */
export const useAddGuestBookModels = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await addGuestBookModels(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['guestBook'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('guestBookModelsAddSuccess'),
        t('guestBookModelsAddError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('guestBookModelsAddError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to add models to Note Books
 */
export const useAddNoteBookModels = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await addNoteBookModels(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['noteBook'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('noteBookModelsAddSuccess'),
        t('noteBookModelsAddError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('noteBookModelsAddError')
      addToast(errorMessage, 'error')
    },
  })
}


/**
 * Hook to add models to Todo Books
 */
export const useAddTodoBookModels = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await addTodoBookModels(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['todoBook'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('todoBookModelsAddSuccess'),
        t('todoBookModelsAddError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('todoBookModelsAddError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to add models to Occasion Books
 */
export const useAddOccasionBookModels = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await addOccasionBookModels(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['occasionBook'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('occasionBookModelsAddSuccess'),
        t('occasionBookModelsAddError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('occasionBookModelsAddError')
      addToast(errorMessage, 'error')
    },
  })
}


/**
 * Hook to add models to Event Books
 */
export const useAddEventBookModels = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (params?: InitBookParams) => {
      await addEventBookModels(params)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['eventInfo'] })
      queryClient.invalidateQueries({ queryKey: ['eventBook'] })
      const { message, type } = handleApiResponseForToast(
        response,
        t('eventBookModelsAddSuccess'),
        t('eventBookModelsAddError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : t('eventBookModelsAddError')
      addToast(errorMessage, 'error')
    },
  })
}






















