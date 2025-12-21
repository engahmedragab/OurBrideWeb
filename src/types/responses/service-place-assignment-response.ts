/**
 * Service Place Assignment Response
 */

import type { CommissionType } from '@/types/responses/common'
import type { PlaceResponse } from './place-response'

export interface ServicePlaceAssignmentResponse {
  id: number
  serviceId: number
  placeId: number
  place: PlaceResponse | null
  commissionType: CommissionType | null
  commissionPercentage: number | null // decimal?
  fixedCommissionAmount: number | null // decimal?
  useDefaultCommissionRule: boolean
}
