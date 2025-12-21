/**
 * Service Invoice Item Response
 */

import type { BaseResponse } from '@/types/responses/common'

export interface ServiceInvoiceItemResponse extends BaseResponse {
  productName: string
  serviceName: string
  quantity: number
  price: number
  total: number
  description: string
}
