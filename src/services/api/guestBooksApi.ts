/**
 * GuestBooks API Functions
 */

import { apiClient } from '@/services/api/apiClient'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

export interface GuestBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Initialize guest books for a client
 */
export const initGuestBooks = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    // Extract eventId and pass other params to API
    const { eventId, ...apiParams } = params || {}
    await apiClient.api.postGuestBooksInit(apiParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize guest books')
  }
}


