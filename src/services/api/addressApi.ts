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
}): Promise<PaginatedList<AddressResponse>> => {
  try {
    const user = getUser()
    if (!user?.id) {
      throw new Error('User not authenticated')
    }
    const response = await apiClient.api.getAddressGetByUserId(user.id, query)
    const responseAny: any = response
    return (responseAny?.data?.data ?? responseAny?.data ?? responseAny) as PaginatedList<AddressResponse>
  } catch (error: unknown) {
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

