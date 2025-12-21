/**
 * Service Payment Method Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type { InstalmentType, PaymentMethodStatus } from '@/types/responses/common'
import type { PaymentMethodResponse } from './payment-method-response'

export interface ServicePaymentMethodResponse extends BaseResponse {
  serviceId: number
  paymentMethodId: number
  paymentMethod: PaymentMethodResponse | null
  instalmentTypes: InstalmentType | null
  status: PaymentMethodStatus
}
