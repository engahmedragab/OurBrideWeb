/**
 * Cart Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type { CartStatus } from '@/../client/common/api/gen/ourbride-api'
import type { ProviderInfoResponse } from './provider-info-response'
import type { PurchaseResponse } from './purchase-response'
import type { OrderResponse } from './order-response'
import type { PriceCalculationResponse } from './price-calculation-response'
import type { PaymentGatewayResponse } from './payment-gateway-response'
import type { PaymentPlanResponse } from './payment-plan-response'
import type { PaymentPlanItemResponse } from './payment-plan-item-response'
import type { PaymentResponse } from './payment-response'
import type { PaymentSummaryResponse } from './payment-summary-response'
import type { CheckoutOrderResponse } from './checkout-order-response'
import type { CartSummaryResponse } from './cart-summary-response'

export interface CartResponse {
  id: number
  price: number
  discountPrice: number
  couponCode: string
  count: number
  providerId: number | null
  provider: ProviderInfoResponse | null
  status: CartStatus
  active: boolean
  purchases: PurchaseResponse[]
  isDeleted: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  slug: string
  priceCalculation: PriceCalculationResponse | null
  paymentGateways: PaymentGatewayResponse[]
  createdBy: string // Guid
  createdByUserName: string | null
  createdByUserEmail: string | null
  createdByUserPhone: string | null
  orders: OrderResponse[]
  currentOrderId: number | null
  currentOrder: OrderResponse | null
  paymentPlanId: number | null
  paymentPlan: PaymentPlanResponse | null
  paymentPlanItems: PaymentPlanItemResponse[]
  payments: PaymentResponse[]
  totalPaidAmount: number
  totalRemainingAmount: number
  paymentProgressPercentage: number
  cartSummary: CartSummaryResponse | null
  paymentSummary: PaymentSummaryResponse | null
  isCompleted: boolean
  isAbandoned: boolean
  hasActiveOrders: boolean
  hasOverduePayments: boolean
  lastActivityDate: string | null // ISO DateTime string
  daysSinceLastActivity: number
  checkoutOrders: CheckoutOrderResponse[]
  currentCheckoutOrder: CheckoutOrderResponse | null
}
