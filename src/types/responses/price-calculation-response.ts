/**
 * Pricing calculation response types
 */

import type { ShippingMethodResponse } from './shipping-method-response'

export interface PriceCalculationResponse {
  subtotal: number
  tax: number
  shippingCost: number
  discount: number
  total: number
  depositAmount: number
  depositPaid: number
  depositRemaining: number
  membershipDiscount: number
  membershipCreditUsed: number
  membershipSessionsUsed: number | null
  giftCardAmount: number
  walletAmount: number
  couponDiscount: number
  cashCardAmount: number
  couponCode: string
  membershipId: number | null
  appliedGiftCardCodes: string[]
  shippingMethod: ShippingMethodResponse | null
}
