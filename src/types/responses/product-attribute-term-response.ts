/**
 * Product Attribute Term Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface ProductAttributeTermResponse extends BaseLookupResponse {
  // Note: id, isDeleted, creationDate, lastModifiedDate, slug, nameAr, nameEn, descriptionAr, descriptionEn come from BaseLookupResponse
  wooCommerceId: number | null
  productAttributeId: number
  name: string // Computed property from nameAr/nameEn
  slug: string
  description: string | null // Computed property from descriptionAr/descriptionEn
  menuOrder: number | null
  count: number | null
}
