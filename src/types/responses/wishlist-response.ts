/**
 * Wishlist Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type {
  Source,
  TenantScopeLevel,
  CommonEntityStatus,
} from '@/types/responses/common'

export interface WishlistResponse extends BaseLookupResponse {
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
  name: string
  description: string | null
  wishlistType: string | null
  type: string | null
  category: string | null
  tags: string | null
  status: CommonEntityStatus
  isPublic: boolean
  isShared: boolean
  isDefault: boolean
  isCollaborative: boolean
  allowComments: boolean
  allowSuggestions: boolean
  notifyOnPriceDrop: boolean
  notifyOnAvailability: boolean
  autoRemovePurchased: boolean
  itemCount: number
  purchasedCount: number
  sharedCount: number
  viewCount: number
  totalEstimatedValue: number | null // decimal?
  totalPurchasedValue: number | null // decimal?
  lastModified: string | null // ISO DateTime string
  priority: number
  sortOrder: number
  sortBy: string | null
  sortDirection: string | null
  eventName: string | null
  eventDate: string | null // ISO DateTime string
  eventEndDate: string | null // ISO DateTime string
  eventLocation: string | null
  allowOthersToAdd: boolean
  allowOthersToRemove: boolean
  allowOthersToEdit: boolean
  maxCollaborators: number
  requireApproval: boolean
  isPasswordProtected: boolean
  expiresAt: string | null // ISO DateTime string
  isTemporary: boolean
  createdBy: string | null // Guid?
  updatedBy: string | null // Guid?
  displayName: string // Computed property
  displayDescription: string | null // Computed property
  isExpired: boolean // Computed property
  completionPercentage: number // Computed property
  remainingValue: number // decimal - Computed property
  isEventBased: boolean // Computed property
  isEventActive: boolean // Computed property
  isEventUpcoming: boolean // Computed property
  isEventPast: boolean // Computed property
}
