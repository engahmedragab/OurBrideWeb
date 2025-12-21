/**
 * Provider Info Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { OwnerResponse } from './owner-response'
import type { ProviderStatus, ProviderRate } from '@/types/responses/common'

export interface ProviderInfoResponse extends BaseLookupResponse {
  phoneNumber: string
  profileURL: string
  rate: number | null
  likes: number | null
  shortAddress: string
  providerStatus: ProviderStatus
  providerRate: ProviderRate
  placeName: string
  providersAreaName: string
  servicesCount: number
  productsCount: number
  serviceClasses: string
  serviceClassIds: number[]
  ownerId: string // Guid
  owner: OwnerResponse | null
  localGuiderId: string // Guid
  isVerified: boolean
  isProfileComplete: boolean
  profileCompletionPercentage: number
}
