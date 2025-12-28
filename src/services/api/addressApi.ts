// Address API service functions

import { apiClient } from '@/services/api/apiClient'
import type { AddressResponse } from '@/types/responses'
import type { CreateAddressRequest, UpdateAddressRequest } from '@/../client/common/api/gen/ourbride-api'
import type { PaginatedList } from '@/types/responses'
import { getUser } from '@/auth/utils/token'

/**
 * Get all addresses for the current user
 */
export const getUserAddresses = async (query?: {
  page?: number
  pageSize?: number
}): Promise<PaginatedList<AddressResponse> | AddressResponse[]> => {
  try {
    console.log('[getUserAddresses] Function called', { query })
    const user = getUser()
    console.log('[getUserAddresses] User:', user ? { id: user.id, hasId: !!user.id } : 'null')
    
    if (!user?.id) {
      console.error('[getUserAddresses] User not authenticated')
      throw new Error('User not authenticated')
    }
    
    console.log('[getUserAddresses] Calling API with userId:', user.id, 'query:', query)
    const response = await apiClient.api.getAddressGetByUserId(user.id, query)
    console.log('[getUserAddresses] Raw API response received:', response)
    
    const responseAny: any = response
    console.log('[getUserAddresses] responseAny:', responseAny)
    console.log('[getUserAddresses] responseAny.data:', responseAny?.data)
    console.log('[getUserAddresses] responseAny.data?.data:', responseAny?.data?.data)
    
    // Try to extract data from nested structure
    let data = responseAny?.data?.data ?? responseAny?.data ?? responseAny
    console.log('[getUserAddresses] Extracted data:', data)
    console.log('[getUserAddresses] Data type:', typeof data)
    console.log('[getUserAddresses] Is data an array?', Array.isArray(data))
    
    // If it's already an array, return it directly
    if (Array.isArray(data)) {
      console.log('[getUserAddresses] Returning direct array, length:', data.length)
      return data
    }
    
    // If it's a paginated response, return it
    if (data && typeof data === 'object' && 'items' in data) {
      console.log('[getUserAddresses] Returning paginated response, items count:', (data as { items?: AddressResponse[] }).items?.length || 0)
      return data as PaginatedList<AddressResponse>
    }
    
    // Fallback: return empty array
    console.warn('[getUserAddresses] Unexpected response structure, returning empty array')
    return []
  } catch (error: unknown) {
    console.error('[getUserAddresses] Error:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch addresses')
  }
}

/**
 * Get address by ID
 */
export const getAddressById = async (id: number): Promise<AddressResponse> => {
  try {
    const response = await apiClient.api.getAddressGetById(id)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as AddressResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch address')
  }
}

/**
 * Create a new address
 */
export const createAddress = async (data: CreateAddressRequest): Promise<AddressResponse> => {
  try {
    const response = await apiClient.api.postAddressCreate(data)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as AddressResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create address')
  }
}

/**
 * Update an existing address
 */
export const updateAddress = async (
  id: number,
  data: UpdateAddressRequest
): Promise<AddressResponse> => {
  try {
    const response = await apiClient.api.putAddressUpdate(id, data)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as AddressResponse
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update address')
  }
}

/**
 * Delete an address
 */
export const deleteAddress = async (id: number): Promise<void> => {
  try {
    await apiClient.api.deleteAddressDelete(id)
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete address')
  }
}

