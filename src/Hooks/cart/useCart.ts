import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCart,
  updatePurchase,
  removePurchase,
  getAllCartsWithProviders,
  checkout,
  validateCoupon,
} from '@/services/api/purchaseApi'
import type { CartResponse, PurchaseResponse, CheckoutResponse } from '@/types/responses'
import type {
  PurchaseUpdateRequest,
  PurchaseRemoveRequest,
  CheckoutRequest,
} from '@/../client/common/api/gen/ourbride-api'

/**
 * Hook to fetch cart data
 */
export const useCart = (enabled = true) => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cart = await getCart()
      return cart
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch all carts with providers (for services)
 */
export const useCartsWithProviders = (enabled = true) => {
  return useQuery({
    queryKey: ['carts-with-providers'],
    queryFn: async () => {
      const carts = await getAllCartsWithProviders()
      return carts
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to update a purchase
 */
export const useUpdatePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: PurchaseUpdateRequest
    }) => {
      return await updatePurchase(id, data)
    },
    onSuccess: () => {
      // Invalidate cart queries to refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
    },
  })
}

/**
 * Hook to remove a purchase
 */
export const useRemovePurchase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: PurchaseRemoveRequest
    }) => {
      await removePurchase(id, data)
    },
    onSuccess: () => {
      // Invalidate cart queries to refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
    },
  })
}

/**
 * Hook to checkout
 */
export const useCheckout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
      return await checkout(data)
    },
    onSuccess: () => {
      // Invalidate cart queries after successful checkout
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
    },
  })
}

/**
 * Hook to validate coupon code
 */
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async (couponCode: string) => {
      return await validateCoupon(couponCode)
    },
  })
}
