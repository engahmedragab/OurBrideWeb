/**
 * Cart Product Response
 */

import type { CartItemType } from '@/components/ui/CartItem'

export interface CartProduct {
  id: string
  title: string
  image: string
  originalPrice: number
  discountedPrice: number
  quantity: number
  deliveryDate?: string
  discountPercentage?: number
  purchaseId: number // Store purchase ID for API calls
  purchasePrice?: number | null // Price from PurchaseResponse (price or totalPrice)
  purchaseDate?: string // Date from PurchaseResponse (creationDate or buyDate)
  type: CartItemType
}
