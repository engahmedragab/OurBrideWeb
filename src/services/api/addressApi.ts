// Deliveryaddresses API service functions

import { apiClient } from '@/services/api/apiClient'
import type { DeliveryAddressResponse } from '@/types/responses'
import type { DeliveryAddressRequest } from '@/../client/common/api/gen/ourbride-api'
import type { PaginatedList } from '@/types/responses'

/**
 * Get all deliveryaddresses for the current user
 * Uses the authentication token to identify the user
 */
export const getUserDeliveryaddresses = async (query?: {
  page?: number
  pageSize?: number
}): Promise<
  PaginatedList<DeliveryAddressResponse> | DeliveryAddressResponse[]
> => {
  try {
    // Use the correct API method from generated API
    const response = await apiClient.api.getDeliveryAddressGetAll()
    const responseAny: any = response

    // Extract data from response structure: { data: [...], success: true, statusCode: 200, ... }
    // Check for responseAny?.data?.data first (nested structure)
    // Then responseAny?.data (direct array)
    // Then responseAny (fallback)
    let data = responseAny?.data?.data ?? responseAny?.data ?? responseAny

    // If it's already an array, return it directly
    if (Array.isArray(data)) {
      return data
    }

    // If it's a paginated response, return it
    if (data && typeof data === 'object' && 'items' in data) {
      return data as PaginatedList<DeliveryAddressResponse>
    }

    // Fallback: return empty array
    return []
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch deliveryaddresses'
    )
  }
}

/**
 * Get deliveryaddress by ID
 */
export const getDeliveryaddressById = async (
  id: number
): Promise<DeliveryAddressResponse> => {
  try {
    const response = await apiClient.api.getDeliveryAddressGetById(id)
    const responseAny: any = response
    // Extract data from response structure: { data: {...}, success: true, ... }
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as DeliveryAddressResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch deliveryaddress'
    )
  }
}

/**
 * Create a new deliveryaddress
 */
export const createDeliveryaddress = async (
  data: DeliveryAddressRequest
): Promise<DeliveryAddressResponse> => {
  try {
    const response = await apiClient.api.postDeliveryAddressCreate(data)
    const responseAny: any = response
    // Extract data from response structure: { data: {...}, success: true, ... }
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as DeliveryAddressResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to create deliveryaddress'
    )
  }
}

/**
 * Update an existing deliveryaddress
 */
export const updateDeliveryaddress = async (
  id: number,
  data: DeliveryAddressRequest
): Promise<DeliveryAddressResponse> => {
  try {
    const response = await apiClient.api.putDeliveryAddressUpdate(id, data)
    const responseAny: any = response
    // Extract data from response structure: { data: {...}, success: true, ... }
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as DeliveryAddressResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to update deliveryaddress'
    )
  }
}

/**
 * Delete a deliveryaddress
 */
export const deleteDeliveryaddress = async (id: number): Promise<void> => {
  try {
    await apiClient.api.deleteDeliveryAddressDelete(id)
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to delete deliveryaddress'
    )
  }
}

/**
 * Get default deliveryaddress
 */
export const getDefaultDeliveryaddress =
  async (): Promise<DeliveryAddressResponse | null> => {
    try {
      const response = await apiClient.api.getDeliveryAddressGetDefaultAddress()
      const responseAny: any = response
      // Extract data from response structure: { data: {...}, success: true, ... }
      return (responseAny?.data?.data ??
        responseAny?.data ??
        responseAny) as DeliveryAddressResponse | null
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch default deliveryaddress'
      )
    }
  }

/**
 * Set a deliveryaddress as default
 */
export const setDefaultDeliveryaddress = async (
  id: number
): Promise<DeliveryAddressResponse> => {
  try {
    // Get the current deliveryaddress first to preserve other fields
    const currentDeliveryaddress = await getDeliveryaddressById(id)
    const updateData: DeliveryAddressRequest = {
      ...currentDeliveryaddress,
      isDefault: true,
    }
    const response = await apiClient.api.putDeliveryAddressUpdate(
      id,
      updateData
    )
    const responseAny: any = response
    // Extract data from response structure: { data: {...}, success: true, ... }
    return (responseAny?.data?.data ??
      responseAny?.data ??
      responseAny) as DeliveryAddressResponse
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to set default deliveryaddress'
    )
  }
}

/**
 * Clear all deliveryaddresses
 */
export const clearDeliveryaddresses = async (): Promise<void> => {
  try {
    await apiClient.api.deleteDeliveryAddressClear()
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to clear deliveryaddresses'
    )
  }
}
