/**
 * Service Staff Assignment Response
 */

import type { CommissionType } from '@/types/responses/common'

export interface ServiceStaffAssignmentResponse {
  id: number
  serviceId: number
  providerUserAssignmentId: number
  staffId: number
  staffName: string | null
  staffRole: string | null
  userId: string // Guid
  staffEmail: string | null
  commissionType: CommissionType | null
  commissionPercentage: number | null // decimal?
  fixedCommissionAmount: number | null // decimal?
  useDefaultCommissionRule: boolean
}
