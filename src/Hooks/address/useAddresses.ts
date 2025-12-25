import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserAddresses, getAddressById, createAddress, updateAddress, deleteAddress } from '@/services/api/addressApi'
import type { AddressResponse } from '@/types/responses'
import type { CreateAddressRequest, UpdateAddressRequest } from '@/../client/common/api/gen/ourbride-api'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch user addresses
 */
export const useAddresses = (query?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  
  return useQuery<AddressResponse[]>({
    queryKey: ['addresses', 'user', queryParams],
    queryFn: async () => {
      const response = await getUserAddresses(queryParams)
      return response.items || []
    },
    enabled: enabled && authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to create a new address
 */
export const useCreateAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateAddressRequest) => {
      return await createAddress(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

/**
 * Hook to update an address
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateAddressRequest }) => {
      return await updateAddress(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

/**
 * Hook to get a single address by ID
 */
export const useAddress = (id: number, enabled: boolean = true) => {
  return useQuery<AddressResponse>({
    queryKey: ['address', id],
    queryFn: async () => {
      return await getAddressById(id)
    },
    enabled: enabled && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to delete an address
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await deleteAddress(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

