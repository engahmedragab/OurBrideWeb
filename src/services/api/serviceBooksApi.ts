/**
 * ServiceBooks API Functions
 */

import { apiClient } from '@/services/api/apiClient'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

export interface ServiceBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Initialize service books for a client
 */
export const initServiceBooks = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    // Extract eventId and pass other params to API
    const { eventId, ...apiParams } = params || {}
    await apiClient.api.postServiceBooksInit(apiParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize service books')
  }
}


