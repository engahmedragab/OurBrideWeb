/**
 * ItemBooks API Functions
 */

import { apiClient } from '@/services/api/apiClient'
import type { UserType } from '@/../client/common/api/gen/ourbride-api'

export interface ItemBooksQuery {
  clientId?: string
  userType?: UserType
  eventId?: number
}

/**
 * Initialize item books for a client
 */
export const initItemBooks = async (params?: {
  clientId?: string
  userType?: UserType
  eventId?: number
}): Promise<void> => {
  try {
    // Extract eventId and pass other params to API
    const { eventId, ...apiParams } = params || {}
    await apiClient.api.postItemBooksInit(apiParams)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize item books')
  }
}


