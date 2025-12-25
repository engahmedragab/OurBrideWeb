import { useCallback } from 'react'
import { useAddToCart } from '@/Hooks/cart'
import type { Product } from '@/types/product'

/**
 * Hook to add a product to cart
 * Returns a handler function that can be called with product ID
 */
export const useAddProductToCart = () => {
  const addToCartMutation = useAddToCart()

  const handleAddToCart = useCallback(
    async (product: Product | { id: string; price: { discounted: number }; provider: { id: string } }, quantity: number = 1) => {
      try {
        await addToCartMutation.mutateAsync({
          productId: parseInt(product.id, 10),
          quantity,
          providerId: parseInt(product.provider.id, 10),
          price: product.price?.discounted,
        })
      } catch (error) {
        console.error('Failed to add product to cart:', error)
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
