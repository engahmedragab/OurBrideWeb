/**
 * Cart Reservation Response
 */

import type { CartItemType } from '@/components/ui/CartItem'

export interface CartReservation {
  id: string
  title: string
  image: string
  price: number
  quantity: number
  purchaseId: number
  reservationId: string
  reservationDate?: string
  status: string
  purchasePrice?: number | null // Price from PurchaseResponse (price or totalPrice)
  purchaseDate?: string // Date from PurchaseResponse (creationDate or buyDate)
  type: CartItemType
}


