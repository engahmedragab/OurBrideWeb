/**
 * Delivery Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type { DeliveryStatus } from '@/../client/common/api/gen/ourbride-api'
import type { OrderResponse } from './order-response'

export interface DeliveryResponse {
  id: number
  startDeliveryDate: string | null // ISO DateTime string
  deliveryDate: string | null // ISO DateTime string
  status: DeliveryStatus
  order: OrderResponse | null
  isDeleted: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  slug: string
}
