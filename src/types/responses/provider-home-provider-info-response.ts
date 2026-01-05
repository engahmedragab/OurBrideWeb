/**
 * Provider Info Response for Provider Home
 * Note: Uses number types for enums to match C# contracts
 */

import type { BaseLookupResponse } from './common/base'
import type { ProviderHomeOwnerResponse } from './provider-home-owner-response'

export interface ProviderHomeProviderInfoResponse extends BaseLookupResponse {
  phoneNumber?: string
  profileURL?: string
  rate?: number
  likes?: number
  shortAddress?: string
  providerStatus: number // ProviderStatus enum as number (0=Pending, 1=Active, 2=Suspended, 3=NotAvailable)
  providerRate: number // ProviderRate enum as number (0=Standard, 1=Silver, 2=Gold, 3=Royal, 4=Elite)
  placeName?: string
  providersAreaName?: string
  servicesCount: number
  productsCount: number
  serviceClasses?: string
  serviceClassIds?: number[]
  ownerId: string // Guid
  owner?: ProviderHomeOwnerResponse
  localGuiderId: string // Guid
  isVerified: boolean
  isProfileComplete: boolean
  profileCompletionPercentage: number
}
