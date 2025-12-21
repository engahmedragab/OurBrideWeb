/**
 * Cart Summary Response
 */

export interface CartSummaryResponse {
  totalItems: number
  serviceItems: number
  productItems: number
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  couponCode: string
  couponDiscount: number
  numberOfProviders: number
  providerNames: string[]
}
