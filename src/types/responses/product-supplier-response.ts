/**
 * Product Supplier Response
 */

import type { ProviderInfoResponse } from './provider-info-response'
import type { ProviderProductAttributeResponse } from './provider-product-attribute-response'
import type { ProviderProductTagResponse } from './provider-product-tag-response'
import type { ProviderCategoryResponse } from './provider-category-response'
import type { ProviderSubCategoryResponse } from './provider-sub-category-response'

export interface ProductSupplierResponse {
  id: number
  supplierId: number
  supplierName: string | null
  productId: number
  productName: string | null
  productSKU: string | null
  supplierSKU: string | null
  supplierPrice: number | null // decimal?
  currency: string | null
  leadTimeDays: number | null
  isActive: boolean
  notes: string | null
  creationDate: string // ISO DateTime string
  lastModifiedDate: string | null // ISO DateTime string
  createdBy: string | null // Guid?
  updatedBy: string | null // Guid?
  providerId: number | null
  provider: ProviderInfoResponse | null
  branchId: number | null
  staffId: string | null // Guid?
  providerProductAttributes: ProviderProductAttributeResponse[] | null
  providerProductTags: ProviderProductTagResponse[] | null
  providerCategories: ProviderCategoryResponse[] | null
  providerSubCategories: ProviderSubCategoryResponse[] | null
}
