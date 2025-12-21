/**
 * Service Invoice Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type { ServiceInvoiceItemResponse } from './service-invoice-item-response'

export interface ServiceInvoiceResponse extends BaseResponse {
  orderId: number
  orderNumber: string
  orderDate: string // ISO DateTime string
  billingName: string
  billingAddress: string
  totalAmount: number
  discountAmount: number | null
  finalAmount: number
  depositAmount: number | null
  discountCodes: string[]
  items: ServiceInvoiceItemResponse[]
  providerId: number | null
  providerName: string
  providerEmail: string
  providerPhone: string
  clientId: string // Guid
  clientName: string
  clientEmail: string
  clientPhone: string
  paymentMethod: string
  paymentStatus: string
  couponCode: string
  paymentPlanId: number | null
  paymentPlanName: string
  numberOfPayments: number | null
  paymentAmount: number | null
  firstPaymentDate: string | null // ISO DateTime string
  lastPaymentDate: string | null // ISO DateTime string
  paymentPlanStatus: string
  hasPaymentPlan: boolean
  providerNotes: string
  orderNotes: string
  preferredDeliveryDate: string | null // ISO DateTime string
  isUrgent: boolean
  requireClientConfirmation: boolean
  clientConfirmed: boolean
  pdfData: string // Base64 encoded byte array
  fileName: string
}
