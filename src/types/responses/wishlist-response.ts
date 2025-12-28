/**
 * Wishlist Response
 * 
 * Response DTO for Wishlist entity
 * Matches OurBrideMain.Contracts.V1.Responses.Common.WishlistResponse
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

export interface WishlistResponse extends BaseLookupResponse {
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
  // Note: nameAr, nameEn, descriptionAr, descriptionEn come from BaseLookupResponse
  name: string // Alias for NameEn (computed property)
  description: string | null // Alias for DescriptionEn (computed property)

  // Wishlist Type and Category
  wishlistType: string | null
  type: string | null // Alias for WishlistType
  category: string | null
  tags: string | null

  // Status and Visibility
  status: CommonEntityStatus
  isPublic: boolean
  isShared: boolean
  isDefault: boolean
  isCollaborative: boolean

  // Wishlist Settings
  allowComments: boolean
  allowSuggestions: boolean
  notifyOnPriceDrop: boolean
  notifyOnAvailability: boolean
  autoRemovePurchased: boolean

  // Items and Analytics
  itemCount: number
  purchasedCount: number
  sharedCount: number
  viewCount: number
  totalEstimatedValue: number | null // decimal?
  totalPurchasedValue: number | null // decimal?
  lastModified: string | null // ISO DateTime string

  // Priority and Organization
  priority: number
  sortOrder: number
  sortBy: string | null
  sortDirection: string | null

  // Event Information
  eventName: string | null
  eventDate: string | null // ISO DateTime string
  eventEndDate: string | null // ISO DateTime string
  eventLocation: string | null

  // Collaboration Settings
  allowOthersToAdd: boolean
  allowOthersToRemove: boolean
  allowOthersToEdit: boolean
  maxCollaborators: number

  // Privacy and Security
  requireApproval: boolean
  isPasswordProtected: boolean

  // Expiration
  expiresAt: string | null // ISO DateTime string
  isTemporary: boolean

  // Audit fields
  // Note: creationDate, lastModifiedDate come from BaseLookupResponse
  createdBy: string | null // Guid?
  updatedBy: string | null // Guid?

  // Computed properties
  displayName: string // Computed: !string.IsNullOrEmpty(NameEn) ? NameEn : NameAr
  displayDescription: string | null // Computed: !string.IsNullOrEmpty(DescriptionEn) ? DescriptionEn : DescriptionAr
  isExpired: boolean // Computed: ExpiresAt != null && ExpiresAt.Value < DateTime.UtcNow
  completionPercentage: number // Computed: ItemCount == 0 ? 0 : (double)PurchasedCount / ItemCount * 100
  remainingValue: number // Computed: TotalEstimatedValue.HasValue || TotalPurchasedValue.HasValue ? TotalEstimatedValue.Value - TotalPurchasedValue.Value : 0
  isEventBased: boolean // Computed: !string.IsNullOrEmpty(EventName) && EventDate != null
  isEventActive: boolean // Computed: IsEventBased && EventDate <= now && (EventEndDate == null || EventEndDate >= now)
  isEventUpcoming: boolean // Computed: IsEventBased && EventDate > DateTime.UtcNow
  isEventPast: boolean // Computed: IsEventBased && EventEndDate != null && EventEndDate < DateTime.UtcNow

  // Source Object - contains the actual Product, Service, or Provider data
  sourceObject?: ProductResponse | ServiceResponse | FeaturedProviderResponse
}
