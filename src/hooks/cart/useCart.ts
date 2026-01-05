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
import type {
  CartResponse,
  PurchaseResponse,
  CheckoutResponse,
  CartProviderResponse,
} from '@/types/responses'
import type {
  PurchaseUpdateRequest,
  PurchaseRemoveRequest,
  CheckoutRequest,
} from '@/../client/common/api/gen/ourbride-api'
import { useToast } from '@/components/ui/Toaster'
import { handleApiResponseForToast } from '@/utils/api-response.utils'

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
export const useCartByProvider = (
  providerId: number | null,
  enabled = true
) => {
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
    onSuccess: data => {
      // Invalidate cart queries to refetch
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'provider'] })

      // Show success toast
      const { message, type } = handleApiResponseForToast(
        data,
        'Cart updated successfully',
        'Failed to update cart'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update cart'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to remove a purchase
 */
export const useRemovePurchase = () => {
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

      // Show success toast
      addToast('Item removed from cart successfully', 'success')
    },
    onError: error => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to remove item from cart'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to checkout
 */
export const useCheckout = () => {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
      return await checkout(data)
    },
    onSuccess: data => {
      // Invalidate cart queries after successful checkout
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })

      // Show success toast
      const { message, type } = handleApiResponseForToast(
        data,
        'Checkout completed successfully',
        'Failed to complete checkout'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to complete checkout'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to validate coupon code
 */
export const useValidateCoupon = () => {
  const { addToast } = useToast()

  return useMutation({
    mutationFn: async (couponCode: string) => {
      return await validateCoupon(couponCode)
    },
    onSuccess: data => {
      const { message, type } = handleApiResponseForToast(
        data,
        'Coupon applied successfully',
        'Invalid coupon code'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to validate coupon'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to clear all items from cart
 */
export const useClearCart = () => {
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

      // Show success toast
      addToast('Cart cleared successfully', 'success')
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to clear cart'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to add a product to cart
 */
export const useAddToCart = () => {
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
    onSuccess: data => {
      // Invalidate cart queries to refetch updated cart
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['carts-with-providers'] })
      queryClient.invalidateQueries({ queryKey: ['cart', 'provider'] })
      queryClient.invalidateQueries({ queryKey: ['cart-providers'] })

      // Show success toast
      const { message, type } = handleApiResponseForToast(
        data,
        'Product added to cart successfully',
        'Failed to add product to cart'
      )
      addToast(message, type)
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add product to cart'
      addToast(errorMessage, 'error')
    },
  })
}

/**
 * Hook to check if items are in the cart
 * Returns helper functions to check cart status
 */
export const useCartItems = () => {
  const { data: cart } = useCart()
  const { data: cartsWithProviders } = useCartsWithProviders()

  // Get all purchases from all carts
  const allPurchases = useMemo(() => {
    const purchases: PurchaseResponse[] = []

    if (cart?.purchases) {
      purchases.push(...cart.purchases)
    }

    if (cartsWithProviders) {
      cartsWithProviders.forEach(cartWithProvider => {
        if (cartWithProvider.purchases) {
          purchases.push(...cartWithProvider.purchases)
        }
      })
    }

    return purchases
  }, [cart, cartsWithProviders])

  /**
   * Check if a product is in the cart
   */
  const isProductInCart = useMemo(() => {
    return (productId: number, providerId?: number): boolean => {
      return allPurchases.some(purchase => {
        if (purchase.type !== PurchaseType.Product) return false
        if (purchase.productId !== productId) return false
        if (providerId !== undefined && purchase.providerId !== providerId)
          return false
        return !purchase.isDeleted
      })
    }
  }, [allPurchases])

  /**
   * Check if a service is in the cart
   */
  const isServiceInCart = useMemo(() => {
    return (serviceId: number, providerId?: number): boolean => {
      return allPurchases.some(purchase => {
        if (purchase.type !== PurchaseType.Service) return false
        if (purchase.serviceId !== serviceId) return false
        if (providerId !== undefined && purchase.providerId !== providerId)
          return false
        return !purchase.isDeleted
      })
    }
  }, [allPurchases])

  /**
   * Get purchase quantity for a product
   */
  const getProductQuantity = useMemo(() => {
    return (productId: number, providerId?: number): number => {
      const purchase = allPurchases.find(p => {
        if (p.type !== PurchaseType.Product) return false
        if (p.productId !== productId) return false
        if (providerId !== undefined && p.providerId !== providerId)
          return false
        return !p.isDeleted
      })
      return purchase?.quantity || 0
    }
  }, [allPurchases])

  /**
   * Get purchase quantity for a service
   */
  const getServiceQuantity = useMemo(() => {
    return (serviceId: number, providerId?: number): number => {
      const purchase = allPurchases.find(p => {
        if (p.type !== PurchaseType.Service) return false
        if (p.serviceId !== serviceId) return false
        if (providerId !== undefined && p.providerId !== providerId)
          return false
        return !p.isDeleted
      })
      return purchase?.quantity || 0
    }
  }, [allPurchases])

  /**
   * Get purchase ID for a product (useful for removing/updating)
   */
  const getProductPurchaseId = useMemo(() => {
    return (productId: number, providerId?: number): number | null => {
      const purchase = allPurchases.find(p => {
        if (p.type !== PurchaseType.Product) return false
        if (p.productId !== productId) return false
        if (providerId !== undefined && p.providerId !== providerId)
          return false
        return !p.isDeleted
      })
      return purchase?.id || null
    }
  }, [allPurchases])

  /**
   * Get purchase ID for a service (useful for removing/updating)
   */
  const getServicePurchaseId = useMemo(() => {
    return (serviceId: number, providerId?: number): number | null => {
      const purchase = allPurchases.find(p => {
        if (p.type !== PurchaseType.Service) return false
        if (p.serviceId !== serviceId) return false
        if (providerId !== undefined && p.providerId !== providerId)
          return false
        return !p.isDeleted
      })
      return purchase?.id || null
    }
  }, [allPurchases])

  return {
    isProductInCart,
    isServiceInCart,
    getProductQuantity,
    getServiceQuantity,
    getProductPurchaseId,
    getServicePurchaseId,
    isLoading: !cart && !cartsWithProviders,
  }
}
