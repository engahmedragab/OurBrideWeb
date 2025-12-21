/**
 * Review Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface ReviewResponse extends BaseLookupResponse {
  sourceId: number
  source: number // Source enum
  providerId: number | null
  branchId: number | null
  staffId: string | null // Guid
  userId: string | null // Guid
  scopeLevel: number // TenantScopeLevel enum
  isGlobal: boolean
  isInherited: boolean
  parentId: number | null
  rate: number | null
  likes: number | null
  dislikes: number | null
  comment: string
  isActive: boolean
  title: string
  summary: string
  status: number // ReviewStatus enum
  isVerified: boolean
  isAnonymous: boolean
  isFeatured: boolean
  reviewType: string
  category: string
  tags: string
  language: string
  isModerated: boolean
  moderatedBy: string | null // Guid
  moderatedAt: string | null // ISO DateTime string
  moderationNotes: string
  moderationReason: string
  viewCount: number
  shareCount: number
  reportCount: number
  lastViewedAt: string | null // ISO DateTime string
  lastSharedAt: string | null // ISO DateTime string
}
