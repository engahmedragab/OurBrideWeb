/**
 * Provider Shipping Method Response
 */

import type { ProviderShippingZoneResponse } from './provider-shipping-zone-response'
import { ProviderShippingMethodStatus } from '@/../client/common/api/gen/ourbride-api'

export interface ProviderShippingMethodResponse {
  id: number
  providerId: number
  providerName: string | null
  shippingMethodId: number
  shippingMethodName: string | null
  shippingMethodDescription: string | null
  customName: string | null
  customDescription: string | null
  isActive: boolean
  displayOrder: number
  status: ProviderShippingMethodStatus
  statusName: string | null
  creationDate: string // ISO 8601 date string
  lastModifiedDate: string | null // ISO 8601 date string
  shippingZones: ProviderShippingZoneResponse[]
}

