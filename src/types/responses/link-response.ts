/**
 * Link Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type {
  Source,
  TenantScopeLevel,
  LinkType,
  CommonEntityStatus,
} from '@/types/responses/common'

export interface LinkResponse extends BaseLookupResponse {
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
  alt: string | null
  url: string | null
  urlSubnailEn: string | null
  urlSubnailAr: string | null
  type: LinkType
  category: string | null
  tags: string | null
  status: CommonEntityStatus
  isPublic: boolean
  isVerified: boolean
  isBroken: boolean
  isExternal: boolean
  clickCount: number
  viewCount: number
  lastClickedAt: string | null // ISO DateTime string
  lastViewedAt: string | null // ISO DateTime string
  lastVerifiedAt: string | null // ISO DateTime string
  openInNewTab: boolean
  trackClicks: boolean
  requireAuthentication: boolean
  accessLevel: string | null
  title: string | null
  metaDescription: string | null
  metaKeywords: string | null
  isValidated: boolean
  validatedAt: string | null // ISO DateTime string
  validationError: string | null
  responseCode: number
  responseTime: number
  expiresAt: string | null // ISO DateTime string
  isTemporary: boolean
  createdBy: string | null // Guid?
  updatedBy: string | null // Guid?
  displayName: string // Computed property
  displayDescription: string | null // Computed property
  thumbnailUrl: string | null // Computed property
  isExpired: boolean // Computed property
  isAccessible: boolean // Computed property
  linkTypeText: string // Computed property
  clickThroughRate: number // Computed property
}
