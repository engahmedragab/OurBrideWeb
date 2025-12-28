/**
 * Follow Response
 * Response DTO for Follow entity
 * Matches OurBrideMain.Contracts.V1.Responses.Common.FollowResponse
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type {
  Source,
  TenantScopeLevel,
  CommonEntityStatus,
} from '@/types/responses/common'
import type { ProductResponse } from './product-response'
import type { ServiceResponse } from './service-response'
import type { FeaturedProviderResponse } from './featured-provider-response'

export interface FollowResponse extends BaseLookupResponse {
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
  // Note: FollowResponse overrides BaseLookupResponse properties with new keyword in C#
  nameAr: string
  nameEn: string
  descriptionEn: string
  descriptionAr: string

  // Follow Type and Category
  followType: string | null
  category: string | null
  tags: string | null

  // Status and Visibility
  status: CommonEntityStatus
  isPublic: boolean
  isMutual: boolean
  isBlocked: boolean
  isMuted: boolean

  // Follow Settings
  notifyOnNewContent: boolean
  notifyOnUpdates: boolean
  notifyOnEvents: boolean
  notificationPreferences: string | null

  // Analytics
  interactionCount: number
  contentViewed: number
  lastInteractionAt: string | null // ISO DateTime string
  lastContentViewedAt: string | null // ISO DateTime string

  // Follow Strength and Priority
  followStrength: number
  priority: number
  notes: string | null

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
  isActive: boolean // Computed: Status == CommonEntityStatus.Active && !IsBlocked && !IsExpired

  // Source Object - contains the actual Product, Service, or Provider data
  sourceObject?: ProductResponse | ServiceResponse | FeaturedProviderResponse
}
