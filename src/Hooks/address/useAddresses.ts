import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserDeliveryaddresses, getDeliveryaddressById, createDeliveryaddress, updateDeliveryaddress, deleteDeliveryaddress, setDefaultDeliveryaddress } from '@/services/api/addressApi'
import type { DeliveryAddressResponse } from '@/types/responses'
import type { DeliveryAddressRequest } from '@/../client/common/api/gen/ourbride-api'
import { isAuthenticated } from '@/auth/utils/token'

/**
 * Hook to fetch user deliveryaddresses
 */
export const useAddresses = (query?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = query || {}
  const authenticated = isAuthenticated()
  const queryEnabled = enabled && authenticated
  
  const queryResult = useQuery<DeliveryAddressResponse[]>({
    queryKey: ['addresses', 'user', queryParams],
    queryFn: async () => {
      const response = await getUserDeliveryaddresses(queryParams)
      
      // Handle both paginated response and direct array
      let addresses: DeliveryAddressResponse[] = []
      
      if (Array.isArray(response)) {
        addresses = response
      } else if (response && typeof response === 'object' && 'items' in response) {
        addresses = (response as { items?: DeliveryAddressResponse[] }).items || []
      }
      
      return addresses
    },
    enabled: queryEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
  
  return queryResult
}

/**
 * Hook to create a new deliveryaddress
 */
export const useCreateAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: DeliveryAddressRequest) => {
      return await createDeliveryaddress(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

/**
 * Hook to update a deliveryaddress
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DeliveryAddressRequest }) => {
      return await updateDeliveryaddress(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

/**
 * Hook to get a single deliveryaddress by ID
 */
export const useAddress = (id: number, enabled: boolean = true) => {
  return useQuery<DeliveryAddressResponse>({
    queryKey: ['address', id],
    queryFn: async () => {
      return await getDeliveryaddressById(id)
    },
    enabled: enabled && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to delete a deliveryaddress
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await deleteDeliveryaddress(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

/**
 * Hook to set a deliveryaddress as default
 */
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await setDefaultDeliveryaddress(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}

