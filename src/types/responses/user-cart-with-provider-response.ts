/**
 * User Cart With Provider Response
 */

import type { ProviderInfoResponse } from './provider-info-response'
import type { PurchaseResponse } from './purchase-response'

export interface UserCartWithProviderResponse {
  id: number
  price: number
  discountPrice: number
  couponCode: string
  count: number
  itemCounts: number
  active: boolean
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
  providerId: number | null
  provider: ProviderInfoResponse | null
  purchases: PurchaseResponse[]
}
