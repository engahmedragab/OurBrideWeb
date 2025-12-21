/**
 * Follow Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type {
  Source,
  TenantScopeLevel,
  CommonEntityStatus,
} from '@/types/responses/common'

export interface FollowResponse extends BaseLookupResponse {
  sourceId: number
  source: Source
  providerId: number | null
  branchId: number | null
  staffId: string | null // Guid
  userId: string | null // Guid
  scopeLevel: TenantScopeLevel
  isGlobal: boolean
  isInherited: boolean
  parentId: number | null
  followType: string | null
  category: string | null
  tags: string | null
  status: CommonEntityStatus
  isPublic: boolean
  isMutual: boolean
  isBlocked: boolean
  isMuted: boolean
  notifyOnNewContent: boolean
  notifyOnUpdates: boolean
  notifyOnEvents: boolean
  notificationPreferences: string | null
  interactionCount: number
  contentViewed: number
  lastInteractionAt: string | null // ISO DateTime string
  lastContentViewedAt: string | null // ISO DateTime string
  followStrength: number
  priority: number
  notes: string | null
  expiresAt: string | null // ISO DateTime string
  isTemporary: boolean
  createdBy: string | null // Guid
  updatedBy: string | null // Guid
  displayName: string // Computed property
  displayDescription: string | null // Computed property
  isExpired: boolean // Computed property
  isActive: boolean // Computed property
}
