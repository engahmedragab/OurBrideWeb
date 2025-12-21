/**
 * Checkout response type
 */

// Note: CheckoutStatus doesn't exist in the generated API, using string for now

export interface CheckoutResponse {
  id: number
  checkoutOrderNumber: string
  orderId: number | null
  cartId: number | null
  paymentPlanId: number | null
  totalAmount: number
  discountAmount: number | null
  taxAmount: number | null
  shippingAmount: number | null
  depositAmount: number | null
  paymentMethod: string
  status: string // CheckoutStatus enum - not available in generated API
  createdDate: string // ISO DateTime string
  completedDate: string | null // ISO DateTime string
  message?: string
  redirectUrl?: string
}
