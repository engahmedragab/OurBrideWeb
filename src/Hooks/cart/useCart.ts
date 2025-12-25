import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCart,
  getCartByProvider,
  getCartProviders,
  addPurchase,
  updatePurchase,
  removePurchase,
  getAllCartsWithProviders,
  checkout,
  validateCoupon,
  clearCart,
} from '@/services/api/purchaseApi'
import type { PurchaseRequest } from '@/../client/common/api/gen/ourbride-api'
import { PurchaseType } from '@/../client/common/api/gen/ourbride-api'
import type { CartResponse, PurchaseResponse, CheckoutResponse, CartProviderResponse } from '@/types/responses'
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
 * Hook to fetch cart by provider ID
 */
export const useCartByProvider = (providerId: number | null, enabled = true) => {
  return useQuery({
    queryKey: ['cart', 'provider', providerId],
    queryFn: async () => {
      if (!providerId) {
        throw new Error('Provider ID is required')
      }
      const cart = await getCartByProvider(providerId)
      return cart
    },
    enabled: enabled && providerId !== null && providerId > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch cart providers (providers that have items in the user's cart)
 */
export const useCartProviders = (enabled = true) => {
  return useQuery({
    queryKey: ['cart-providers'],
    queryFn: async () => {
      const providers = await getCartProviders()
      return providers
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
      queryClient.invalidateQueries({ queryKey: ['cart', 'provider'] })
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
      queryClient.invalidateQueries({ queryKey: ['cart', 'provider'] })
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

/**
 * Hook to clear all items from cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await clearCart()
    },
    onSuccess: () => {
      // Invalidate all cart-related queries to refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'provider'] })
      queryClient.invalidateQueries({ queryKey: ['cart-providers'] })
    },
  })
}

/**
 * Hook to add a product to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      productId: number
      quantity?: number
      providerId?: number
      branchId?: number
      price?: number
    }): Promise<CartResponse> => {
      const purchaseRequest: PurchaseRequest = {
        purchaseType: PurchaseType.Product,
        productId: data.productId,
        quantity: data.quantity || 1,
        providerId: data.providerId,
        // Note: branchId might need to be passed differently based on API
        price: data.price,
      }
      return await addPurchase(purchaseRequest)
    },
    onSuccess: () => {
      // Invalidate cart queries to refetch updated cart
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'provider'] })
      queryClient.invalidateQueries({ queryKey: ['cart-providers'] })
    },
  })
}
