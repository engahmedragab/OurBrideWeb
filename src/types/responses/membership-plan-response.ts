/**
 * Membership Plan Response
 */

import type { BaseEntityResponse } from './common/base'
import { MembershipType } from '@/../client/common/api/gen/ourbride-api'

export interface MembershipPlanResponse extends BaseEntityResponse {
  name: string | null
  description: string | null
  type: MembershipType
  price: number
  includedSessions: number | null
  discountPercent: number | null
  creditAmount: number | null
  durationDays: number
  allowedServices: number[]
  parentPlanId: number | null
  isActive: boolean
  providerId: number
  providerName: string | null
}

