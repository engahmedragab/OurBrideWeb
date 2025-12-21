/**
 * Inventory Response
 */

import type { BaseEntityResponse } from '@/types/responses/common'
import type { InventoryStatus } from '@/../client/common/api/gen/ourbride-api'
import type { ProviderInfoResponse } from './provider-info-response'
import type { ProviderProductAttributeResponse } from './provider-product-attribute-response'
import type { ProviderProductTagResponse } from './provider-product-tag-response'
import type { ProviderCategoryResponse } from './provider-category-response'
import type { ProviderSubCategoryResponse } from './provider-sub-category-response'

export interface InventoryResponse extends BaseEntityResponse {
  // Note: id, isDeleted, creationDate, lastModifiedDate, slug come from BaseEntityResponse
  productId: number
  productName: string | null
  productSku: string | null
  variantId: number | null
  sku: string | null
  location: string
  placeId: number | null
  placeName: string | null

  // Stock Information
  currentStock: number
  reservedStock: number
  availableStock: number
  lowStockThreshold: number
  reorderPoint: number
  reorderQuantity: number

  // Stock Management
  trackInventory: boolean
  allowBackorders: boolean
  allowPreorders: boolean
  status: InventoryStatus

  // Cost Information
  costPrice: number | null // decimal?
  averageCost: number | null // decimal?
  currency: string

  // Supplier Information
  supplierId: number | null
  supplierName: string | null
  supplierSku: string | null
  leadTimeDays: number | null

  // Last Updated
  lastStockUpdate: string | null // ISO DateTime string
  lastRestockDate: string | null // ISO DateTime string
  nextRestockDate: string | null // ISO DateTime string

  // Multi-tenant scoping
  providerId: number | null
  provider: ProviderInfoResponse | null
  branchId: number | null
  staffId: string | null // Guid?

  // Provider-specific Multi-Filter Relationships
  providerProductAttributes: ProviderProductAttributeResponse[]
  providerProductTags: ProviderProductTagResponse[]
  providerCategories: ProviderCategoryResponse[]
  providerSubCategories: ProviderSubCategoryResponse[]

  // Additional timestamps
  createdBy: string | null // Guid?
  updatedBy: string | null // Guid?

  // Stock Movements and Alerts
  stockMovements: StockMovementResponse[]
  reorderAlerts: ReorderAlertResponse[]
}

export interface StockMovementResponse {
  id: number
  inventoryId: number
  movementType: string // StockMovementType enum
  quantity: number
  previousStock: number
  newStock: number
  reason: string | null
  referenceId: number | null
  referenceType: string | null
  notes: string | null
  createdBy: string | null // Guid?
  createdAt: string // ISO DateTime string
}

export interface ReorderAlertResponse {
  id: number
  inventoryId: number
  alertType: string // ReorderAlertType enum
  threshold: number
  currentStock: number
  isActive: boolean
  notifiedAt: string | null // ISO DateTime string
  resolvedAt: string | null // ISO DateTime string
  notes: string | null
  createdBy: string | null // Guid?
  createdAt: string // ISO DateTime string
}
