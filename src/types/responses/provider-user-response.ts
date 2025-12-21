/**
 * Provider User Response
 */

import type { UserResponse } from './user-response'

export interface ProviderUserResponse extends UserResponse {
  providerUserId: number
  providerId: number
  providerName: string
  managerId: number | null
  managerName: string
  role: number // ProviderUserRole enum
  providersAreaId: number | null
  providersAreaName: string
  isVerified: boolean
  managedServicesCount: number
  ordersHandledCount: number
  teamMembersCount: number
  bio: string
  isCertified: boolean
  certificationUrl: string
  preferredServiceClasses: number[] // ServiceClass enum array
  interests: string[]
  skills: string[]
  areaNames: string[]
}
