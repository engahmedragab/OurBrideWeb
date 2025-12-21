/**
 * Product Attribute Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface ProductAttributeResponse extends BaseLookupResponse {
  // Note: id, isDeleted, creationDate, lastModifiedDate, slug, nameAr, nameEn, descriptionAr, descriptionEn come from BaseLookupResponse
  wooCommerceId: number | null
  name: string // Computed property from nameAr/nameEn
  description: string | null // Computed property from descriptionAr/descriptionEn
  attribute: string
  position: number | null
  visible: boolean | null
  variation: boolean | null
  isActive: boolean
  options: string | null // JSON string
}
