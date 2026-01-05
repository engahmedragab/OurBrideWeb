import { useCallback } from 'react'
import { useAddToCart } from '@/hooks/cart'
import type { Product } from '@/types/product'

/**
 * Hook to add a product to cart
 * Returns a handler function that can be called with product ID
 */
export const useAddProductToCart = () => {
  const addToCartMutation = useAddToCart()

  const handleAddToCart = useCallback(
    async (
      product:
        | Product
        | {
            id: string
            price: { discounted: number }
            provider: { id: string }
          },
      quantity: number = 1
    ) => {
      try {
        // Extract providerId - handle both Product type and generic object
        const providerId = product.provider?.id
          ? parseInt(product.provider.id, 10)
          : undefined

        // ProviderId check

        await addToCartMutation.mutateAsync({
          productId: parseInt(product.id, 10),
          quantity,
          providerId: providerId,
          price: product.price?.discounted,
        })
      } catch (error) {
        // Error adding product to cart
        throw error
      }
    },
    [addToCartMutation]
  )

  return {
    handleAddToCart,
    isLoading: addToCartMutation.isPending,
    isError: addToCartMutation.isError,
    error: addToCartMutation.error,
  }
}
