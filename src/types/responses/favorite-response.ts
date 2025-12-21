/**
 * Favorite Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type {
  Source,
  TenantScopeLevel,
  CommonEntityStatus,
} from '@/types/responses/common'

export interface FavoriteResponse extends BaseLookupResponse {
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
  favoriteType: string | null
  category: string | null
  tags: string | null
  status: CommonEntityStatus
  isPublic: boolean
  isShared: boolean
  isFeatured: boolean
  priority: number
  rating: number | null
  notes: string | null
  viewCount: number
  shareCount: number
  lastViewedAt: string | null // ISO DateTime string
  lastSharedAt: string | null // ISO DateTime string
  expiresAt: string | null // ISO DateTime string
  isTemporary: boolean
  createdBy: string | null // Guid
  updatedBy: string | null // Guid
  displayName: string // Computed property
  displayDescription: string | null // Computed property
  isExpired: boolean // Computed property
}
