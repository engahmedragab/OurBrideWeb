/**
 * Provider Product Brand Response
 */

import type { BaseEntityResponse } from '@/types/responses/common'
import type { ProviderProductBrandStatus } from '@/../client/common/api/gen/ourbride-api'

export interface ProviderProductBrandResponse extends BaseEntityResponse {
  // Note: id, isDeleted, creationDate, lastModifiedDate, slug come from BaseEntityResponse
  providerId: number
  productBrandId: number | null
  customName: string | null
  customDescription: string | null
  customColor: string | null
  customIcon: string | null
  isActive: boolean
  displayOrder: number
  status: ProviderProductBrandStatus

  // Provider-created item fields (used when ProductBrandId is null)
  providerCreatedName: string | null
  providerCreatedDescription: string | null
  providerCreatedSlug: string | null
  providerCreatedColor: string | null
  providerCreatedIcon: string | null

  // Approval tracking
  approvedBy: string | null // Guid?
  approvedAt: string | null // ISO DateTime string
  approvalNotes: string | null
  rejectionReason: string | null

  // Computed property
  isProviderCreated: boolean
}
