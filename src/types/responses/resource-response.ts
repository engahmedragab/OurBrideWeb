/**
 * Resource Response
 */

import type { BaseResponse } from '@/types/responses/common'
import type { ResourceType, ResourceStatus } from '@/types/responses/common'

export interface ResourceResponse extends BaseResponse {
  id: number
  nameAr: string
  nameEn: string
  descriptionAr: string | null
  descriptionEn: string | null
  providerId: number
  providerName: string | null
  branchId: number | null
  branchName: string | null
  type: ResourceType
  typeName: string | null
  status: ResourceStatus
  statusName: string | null
  capacity: number | null
  location: string | null
  isBookable: boolean
  requiresMaintenance: boolean | null
  lastMaintenanceDate: string | null // ISO DateTime string
  nextMaintenanceDate: string | null // ISO DateTime string
  isAvailable: boolean // Computed property
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
}
