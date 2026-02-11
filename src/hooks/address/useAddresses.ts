import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserDeliveryaddresses, getDeliveryaddressById, createDeliveryaddress, updateDeliveryaddress, deleteDeliveryaddress, setDefaultDeliveryaddress } from '@/services/api/addressApi'
import type { DeliveryAddressResponse } from '@/types/responses'
import type { DeliveryAddressRequest } from '@/../client/common/api/gen/ourbride-api'
import { isAuthenticated } from '@/auth/utils/token'
import { useToast } from '@/components/ui'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import { useI18nTranslations } from '@/i18n'

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
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (data: DeliveryAddressRequest) => {
      return await createDeliveryaddress(data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      const { message, type } = handleApiResponseForToast(
        data,
        t('addressCreatedSuccess'),
        t('addressCreatedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('addressCreatedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to update a deliveryaddress
 */

export const useUpdateAddress = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DeliveryAddressRequest }) => {
      return await updateDeliveryaddress(id, data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      const { message, type } = handleApiResponseForToast(
        data,
        t('addressUpdatedSuccess'),
        t('addressUpdatedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('addressUpdatedError')
      addToast(errorMessage, 'error')
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
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await deleteDeliveryaddress(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      addToast(t('addressDeletedSuccess'), 'success')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('addressDeletedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to set a deliveryaddress as default
 */

export const useSetDefaultAddress = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await setDefaultDeliveryaddress(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      addToast(t('addressSetDefaultSuccess'), 'success')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('addressSetDefaultError')
      addToast(errorMessage, 'error')
    },
  })
}

function addToast(_arg0: string, _arg1: string) {
  throw new Error('Function not implemented.')
}

