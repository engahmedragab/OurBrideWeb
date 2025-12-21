/**
 * Order Summary Response
 */

export interface OrderSummaryResponse {
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
}
