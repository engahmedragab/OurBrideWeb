import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
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
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'
import { useI18nTranslations } from '@/i18n'
import { useMainIds } from '@/hooks/home'

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
  const t = useI18nTranslations('alert')
  return useQuery({
    queryKey: ['cart', 'provider', providerId],
    queryFn: async () => {
      if (!providerId) {
        throw new Error(t('providerIdRequired'))
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
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

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
    onSuccess: (data) => {
      // Invalidate cart queries to refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'provider'] })
      queryClient.invalidateQueries({ queryKey: ['main-ids'] })
      
      // Show success toast
      const { message, type } = handleApiResponseForToast(
        data,
        t('cartUpdatedSuccess'),
        t('cartUpdatedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('cartUpdatedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to remove a purchase
 */
export const useRemovePurchase = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

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
      queryClient.invalidateQueries({ queryKey: ['main-ids'] })
      
      // Show success toast
      addToast(t('itemRemovedSuccess'), 'success')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('itemRemovedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to checkout
 */
export const useCheckout = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
      return await checkout(data)
    },
    onSuccess: (data) => {
      // Invalidate cart queries after successful checkout
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
      queryClient.invalidateQueries({ queryKey: ['main-ids'] })
      
      // Show success toast
      const { message, type } = handleApiResponseForToast(
        data,
        t('checkoutSuccess'),
        t('checkoutError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('checkoutError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to validate coupon code
 */
export const useValidateCoupon = () => {
  const t = useI18nTranslations('alert')
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (couponCode: string) => {
      return await validateCoupon(couponCode)
    },
    onSuccess: (data) => {
      const { message, type } = handleApiResponseForToast(
        data,
       t('couponAppliedSuccess'),
        t('couponInvalidError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('couponValidateError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to clear all items from cart
 */
export const useClearCart = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

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
      queryClient.invalidateQueries({ queryKey: ['main-ids'] })
      
      // Show success toast
      addToast(t('cartClearedSuccess'), 'success')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('cartClearedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to add a product to cart
 */
export const useAddToCart = () => {
  const t = useI18nTranslations('alert')
  const queryClient = useQueryClient()
  const { addToast } = useToast()

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
    onSuccess: (data) => {
      // Invalidate cart queries to refetch updated cart
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'provider'] })
      queryClient.invalidateQueries({ queryKey: ['cart-providers'] })
      queryClient.invalidateQueries({ queryKey: ['main-ids'] })
      
      // Show success toast
      const { message, type } = handleApiResponseForToast(
        data,
        t('productAddedSuccess'),
        t('productAddedError')
      )
      addToast(message, type)
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : t('productAddedError')
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to check if items are in the cart
 * Returns helper functions to check cart status
 */
export const useCartItems = () => {
  const { data: mainIds, isLoading } = useMainIds(
    {
      page: 1,
      pageSize: 1000,
    },
    true
  )

  /**
   * Check if a product is in the cart
   */
  const isProductInCart = useMemo(() => {
    return (productId: number, providerId?: number): boolean => {
      if (!mainIds?.cart?.productId) return false
      if (mainIds.cart.productId !== productId) return false
      if (providerId !== undefined && mainIds.cart.providerId !== providerId) return false
      return true
    }
  }, [mainIds])

  /**
   * Check if a service is in the cart
   */
  const isServiceInCart = useMemo(() => {
    return (serviceId: number, providerId?: number): boolean => {
      if (!mainIds) return false
      if (mainIds.cart?.serviceId === serviceId) {
        if (providerId !== undefined && mainIds.cart?.providerId !== providerId) {
          return false
        }
        return true
      }
      if (providerId !== undefined) {
        return mainIds.cartsWithProviders?.some(
          cartWithProvider => cartWithProvider.providerId === providerId
        )
      }
      return false
    }
  }, [mainIds])

  /**
   * Get purchase quantity for a product
   */
  const getProductQuantity = useMemo(() => {
    return (productId: number, providerId?: number): number => {
      if (!mainIds?.cart?.productId) return 0
      if (mainIds.cart.productId !== productId) return 0
      if (providerId !== undefined && mainIds.cart.providerId !== providerId) return 0
      return 1
    }
  }, [mainIds])

  /**
   * Get purchase quantity for a service
   */
  const getServiceQuantity = useMemo(() => {
    return (serviceId: number, providerId?: number): number => {
      if (!mainIds?.cart?.serviceId) return 0
      if (mainIds.cart.serviceId !== serviceId) return 0
      if (providerId !== undefined && mainIds.cart.providerId !== providerId) return 0
      return 1
    }
  }, [mainIds])

  /**
   * Get purchase ID for a product (useful for removing/updating)
   */
  const getProductPurchaseId = useMemo(() => {
    return (productId: number, providerId?: number): number | null => {
      if (!mainIds?.cart?.productId) return null
      if (mainIds.cart.productId !== productId) return null
      if (providerId !== undefined && mainIds.cart.providerId !== providerId) return null
      return mainIds.cart.id ?? null
    }
  }, [mainIds])

  /**
   * Get purchase ID for a service (useful for removing/updating)
   */
  const getServicePurchaseId = useMemo(() => {
    return (serviceId: number, providerId?: number): number | null => {
      if (!mainIds?.cart?.serviceId) return null
      if (mainIds.cart.serviceId !== serviceId) return null
      if (providerId !== undefined && mainIds.cart.providerId !== providerId) return null
      return mainIds.cart.id ?? null
    }
  }, [mainIds])

  return {
    isProductInCart,
    isServiceInCart,
    getProductQuantity,
    getServiceQuantity,
    getProductPurchaseId,
    getServicePurchaseId,
    isLoading,
  }
}
