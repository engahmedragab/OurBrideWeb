/**
 * View Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type {
  Source,
  TenantScopeLevel,
  CommonEntityStatus,
} from '@/types/responses/common'

export interface ViewResponse extends BaseLookupResponse {
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
  viewType: string | null
  category: string | null
  tags: string | null
  viewCount: number
  uniqueViewCount: number
  firstViewedAt: string | null // ISO DateTime string
  lastViewedAt: string | null // ISO DateTime string
  viewDuration: number
  averageViewDuration: number
  viewSource: string | null
  referrerUrl: string | null
  userAgent: string | null
  ipAddress: string | null
  deviceType: string | null
  browser: string | null
  operatingSystem: string | null
  country: string | null
  city: string | null
  region: string | null
  status: CommonEntityStatus
  isBounce: boolean
  isReturning: boolean
  isBot: boolean
  isMobile: boolean
  scrollDepth: number
  clickCount: number
  interactionCount: number
  isEngaged: boolean
  isConversion: boolean
  conversionType: string | null
  conversionValue: number | null // decimal?
  expiresAt: string | null // ISO DateTime string
  isTemporary: boolean
  createdBy: string | null // Guid?
  updatedBy: string | null // Guid?
  displayName: string // Computed property
  displayDescription: string | null // Computed property
  isExpired: boolean // Computed property
  formattedViewDuration: string // Computed property
  engagementRate: number // Computed property
  bounceRate: number // Computed property
}
