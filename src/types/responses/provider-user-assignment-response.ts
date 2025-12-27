/**
 * Provider User Assignment Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type { ProviderInfoResponse } from './provider-info-response'
import type { RoleResponse } from './role-response'
import type { ProviderUserResponse } from './provider-user-response'
import type { PlaceResponse } from './place-response'

export interface ProviderUserAssignmentResponse extends BaseResponse {
  providerId: number
  provider: ProviderInfoResponse | null
  providerName: string // Computed property
  role: RoleResponse | null
  roleKey: string
  user: ProviderUserResponse | null
  subscription: unknown // ProviderSubscriptionResponse - to be defined when type is available
  isActive: boolean
  branchId: number | null
  placeId: number | null
  availableBranches: PlaceResponse[]
}
