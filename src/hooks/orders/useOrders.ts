import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrders,
  getClientOrders,
  getOrdersByStatus,
  cancelOrder,
} from '@/services/api/orderApi'
import type { OrderResponse, PaginatedList } from '@/types/responses'
import { searchOrders as searchPurchaseOrders } from '@/services/api/purchaseApi'
import type { ServiceOrderResponse } from '@/types/responses'
import type { ServiceOrderSearchRequest } from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

/**
 * Hook to fetch orders
 */
export const useOrders = (params?: {
  page?: number
  pageSize?: number
  providerId?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery({
    queryKey: ['orders', queryParams],
    queryFn: async () => {
      const result = await getOrders(queryParams)
      return result
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch client orders
 */
export const useClientOrders = (params?: {
  page?: number
  pageSize?: number
  clientId?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery({
    queryKey: ['client-orders', queryParams],
    queryFn: async () => {
      const result = await getClientOrders(queryParams)
      return result
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch orders by status
 */
export const useOrdersByStatus = (
  status: string,
  params?: {
    providerId?: number
    enabled?: boolean
  }
) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery({
    queryKey: ['orders-by-status', status, queryParams],
    queryFn: async () => {
      const orders = await getOrdersByStatus(status, queryParams)
      return orders
    },
    enabled: enabled && !!status,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to search service orders (from purchase API)
 */
export const useServiceOrders = (params?: {
  enabled?: boolean
  searchRequest?: ServiceOrderSearchRequest
}) => {
  const { enabled = true, searchRequest } = params || {}

  return useQuery({
    queryKey: ['service-orders', searchRequest],
    queryFn: async () => {
      // Use default search request if none provided
      const request: ServiceOrderSearchRequest = searchRequest || {
        // Add default search parameters
      }
      const result = await searchPurchaseOrders(request)
      return result
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to cancel an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (orderId: number) => {
      return await cancelOrder(orderId)
    },
    onSuccess: (data) => {
      // Invalidate orders queries to refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['client-orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders-by-status'] })
      
      // Show success toast
      const { message, type } = handleApiResponseForToast(
        data,
        'Order cancelled successfully',
        'Failed to cancel order'
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order'
      addToast(errorMessage, 'error')
    },
  })
}
