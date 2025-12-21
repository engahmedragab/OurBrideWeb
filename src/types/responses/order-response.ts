/**
 * Order Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type {
  OrderStatus,
  PaymentStatus,
  DeliveryStatus,
} from '@/../client/common/api/gen/ourbride-api'
import type { PurchaseResponse } from './purchase-response'
import type { CartResponse } from './cart-response'
import type { DeliveryResponse } from './delivery-response'
import type { CheckoutOrderResponse } from './checkout-order-response'
import type { PaymentPlanResponse } from './payment-plan-response'
import type { PaymentPlanItemResponse } from './payment-plan-item-response'
import type { PaymentResponse } from './payment-response'
import type { PaymentSummaryResponse } from './payment-summary-response'
import type { OrderSummaryResponse } from './order-summary-response'

export interface OrderResponse {
  id: number
  orderNumber: string
  price: number
  count: number
  orderDate: string // ISO DateTime string
  deliveryDate: string | null // ISO DateTime string
  orderId: string
  status: OrderStatus
  comment: string
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
  deliveryId: number
  delivery: DeliveryResponse | null
  purchases: PurchaseResponse[]
  cartId: number | null
  cart: CartResponse | null
  checkoutOrderId: number | null
  checkoutOrder: CheckoutOrderResponse | null
  paymentPlanId: number | null
  paymentPlan: PaymentPlanResponse | null
  paymentPlanItems: PaymentPlanItemResponse[]
  payments: PaymentResponse[]
  totalPaidAmount: number
  totalRemainingAmount: number
  paymentProgressPercentage: number
  orderSummary: OrderSummaryResponse | null
  paymentSummary: PaymentSummaryResponse | null
  totalAmount: number
  discountAmount: number | null
  taxAmount: number | null
  shippingAmount: number | null
  finalAmount: number
  depositAmount: number | null
  clientId: string | null // Guid
  clientName: string
  clientEmail: string
  clientPhone: string
  createdBy: string // Guid
  createdByUserName: string
  createdByUserEmail: string
  createdByUserPhone: string
  providerId: number | null
  providerName: string
  providerLogo: string
  providerUserId: string | null // Guid
  providerUserName: string
  paymentMethod: string
  paymentStatusText: string
  couponCode: string
  paymentPlanName: string
  numberOfPayments: number | null
  paidAmount: number | null
  firstPaymentDate: string | null // ISO DateTime string
  lastPaymentDate: string | null // ISO DateTime string
  paymentPlanStatus: string
  hasPaymentPlan: boolean
  isActive: boolean
  isCompleted: boolean
  isCancelled: boolean
  isOverdue: boolean
  daysOverdue: number
  isDeleted: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  slug: string
  providerNotes: string
  orderNotes: string
  preferredDeliveryDate: string | null // ISO DateTime string
  isUrgent: boolean
  requireClientConfirmation: boolean
  clientConfirmed: boolean
}
