/**
 * Favorite Response
 * Response DTO for Favorite entity
 * Matches OurBrideMain.Contracts.V1.Responses.Common.FavoriteResponse
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type {
  Source,
  TenantScopeLevel,
  CommonEntityStatus,
} from '@/types/responses/common'

export interface FavoriteResponse extends BaseLookupResponse {
  // Source Information
  sourceId: number
  source: Source

  // Multi-tenant scoping
  providerId: number | null
  branchId: number | null
  staffId: string | null // Guid
  userId: string | null // Guid
  scopeLevel: TenantScopeLevel
  isGlobal: boolean
  isInherited: boolean
  parentId: number | null

  // Basic Information
  // Note: FavoriteResponse overrides BaseLookupResponse properties with new keyword in C#
  nameAr: string
  nameEn: string
  descriptionEn: string
  descriptionAr: string

  // Favorite Type and Category
  favoriteType: string | null
  category: string | null
  tags: string | null

  // Status and Visibility
  status: CommonEntityStatus
  isPublic: boolean
  isShared: boolean
  isFeatured: boolean

  // Priority and Rating
  priority: number
  rating: number | null
  notes: string | null

  // Usage Analytics
  viewCount: number
  shareCount: number
  lastViewedAt: string | null // ISO DateTime string
  lastSharedAt: string | null // ISO DateTime string

  // Expiration
  expiresAt: string | null // ISO DateTime string
  isTemporary: boolean

  // Audit fields
  // Note: creationDate, lastModifiedDate come from BaseLookupResponse
  createdBy: string | null // Guid
  updatedBy: string | null // Guid

  // Computed properties
  displayName: string // Computed: !string.IsNullOrEmpty(NameEn) ? NameEn : NameAr
  displayDescription: string | null // Computed: !string.IsNullOrEmpty(DescriptionEn) ? DescriptionEn : DescriptionAr
  isExpired: boolean // Computed: ExpiresAt != null && ExpiresAt.Value < DateTime.UtcNow
}
