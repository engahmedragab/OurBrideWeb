/**
 * Service Receipt Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type {
  PaymentStatus,
  PaymentType,
  PaymentFrequency,
  PaymentPlanItemStatus,
} from '@/../client/common/api/gen/ourbride-api'

export interface ServiceReceiptResponse extends BaseResponse {
  paymentId: number
  orderId: number
  orderNumber: string
  receiptNumber: string
  receiptDate: string // ISO DateTime string
  status: PaymentStatus
  type: PaymentType
  amount: number
  paidAmount: number | null
  remainingAmount: number | null
  dueDate: string | null // ISO DateTime string
  paidDate: string | null // ISO DateTime string
  paymentMethod: string
  transactionId: string
  notes: string
  orderDate: string // ISO DateTime string
  orderTotalAmount: number
  orderPaidAmount: number
  orderRemainingAmount: number
  providerId: number | null
  providerName: string
  providerEmail: string
  providerPhone: string
  clientId: string // Guid
  clientName: string
  clientEmail: string
  clientPhone: string
  paymentPlanId: number | null
  paymentPlanName: string
  paymentPlanItemId: number | null
  paymentPlanItemNumber: number | null
  paymentPlanItemStatus: PaymentPlanItemStatus | null
  paymentNumber: number
  totalPayments: number
  serviceId: number | null
  serviceName: string
  serviceDescription: string
  isDeposit: boolean
  isFinalPayment: boolean
  paymentFrequency: PaymentFrequency | null
  daysOverdue: number
  isOverdue: boolean // Computed property
  isPaid: boolean // Computed property
  isPending: boolean // Computed property
  isDueSoon: boolean // Computed property
  unpaidAmount: number // Computed property
  outstandingAmount: number // Computed property
  pdfData: string // Base64 encoded byte array
  fileName: string
}
