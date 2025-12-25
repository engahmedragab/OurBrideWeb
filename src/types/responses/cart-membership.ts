/**
 * Cart Membership Response
 */

import type { CartItemType } from '@/components/ui/CartItem'

export interface CartMembership {
  id: string
  title: string
  image: string
  price: number
  quantity: number
  purchaseId: number
  membershipId: number | null
  purchasePrice?: number | null // Price from PurchaseResponse (price or totalPrice)
  purchaseDate?: string // Date from PurchaseResponse (creationDate or buyDate)
  type: CartItemType
}


