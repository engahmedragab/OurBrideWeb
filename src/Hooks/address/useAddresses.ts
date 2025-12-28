import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserAddresses, getAddressById, createAddress, updateAddress, deleteAddress } from '@/services/api/addressApi'
import type { AddressResponse } from '@/types/responses'
import type { CreateAddressRequest, UpdateAddressRequest } from '@/../client/common/api/gen/ourbride-api'
import { isAuthenticated, getToken, getUser } from '@/auth/utils/token'

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
  const token = getToken()
  const user = getUser()
  
  const queryEnabled = enabled && authenticated
  
  console.log('[useAddresses] Hook called', { 
    enabled, 
    queryParams, 
    authenticated,
    queryEnabled,
    'willQueryRun': queryEnabled,
    'enabledValue': enabled,
    'authenticatedValue': authenticated,
    'hasToken': !!token,
    'hasUser': !!user,
    'userId': user?.id,
    'tokenLength': token?.length,
  })
  
  const queryResult = useQuery<AddressResponse[]>({
    queryKey: ['addresses', 'user', queryParams],
    queryFn: async () => {
      console.log('[useAddresses] ✅ queryFn EXECUTED - API call starting', { queryParams })
      try {
        const response = await getUserAddresses(queryParams)
        console.log('[useAddresses] Raw API response:', response)
        console.log('[useAddresses] Response type:', typeof response)
        console.log('[useAddresses] Is array?', Array.isArray(response))
        console.log('[useAddresses] Has items property?', response && typeof response === 'object' && 'items' in response)
        
        // Handle both paginated response and direct array
        let addresses: AddressResponse[] = []
        
        if (Array.isArray(response)) {
          console.log('[useAddresses] Response is direct array, length:', response.length)
          addresses = response
        } else if (response && typeof response === 'object' && 'items' in response) {
          console.log('[useAddresses] Response is paginated, items:', (response as { items?: AddressResponse[] }).items)
          addresses = (response as { items?: AddressResponse[] }).items || []
        } else {
          console.warn('[useAddresses] Unexpected response structure:', response)
          addresses = []
        }
        
        console.log('[useAddresses] Final addresses array:', addresses)
        console.log('[useAddresses] Addresses count:', addresses.length)
        return addresses
      } catch (error) {
        console.error('[useAddresses] Error in queryFn:', error)
        throw error
      }
    },
    enabled: queryEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
  
  // Log query state to understand why it might not be running
  console.log('[useAddresses] Query state:', {
    status: queryResult.status,
    fetchStatus: queryResult.fetchStatus,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isEnabled: queryResult.isEnabled,
    isError: queryResult.isError,
    error: queryResult.error,
    dataLength: queryResult.data?.length || 0,
    'queryEnabled': queryEnabled,
    'whyDisabled': !queryEnabled ? (!enabled ? 'enabled=false' : !authenticated ? 'not authenticated' : 'unknown') : 'enabled',
  })
  
  if (!queryEnabled) {
    console.warn('[useAddresses] ⚠️ Query is DISABLED. Reason:', {
      enabled,
      authenticated,
      hasToken: !!token,
      hasUser: !!user,
    })
  }
  
  return queryResult
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

