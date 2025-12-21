/**
 * Product Tag Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface ProductTagResponse extends BaseLookupResponse {
  // Note: id, isDeleted, creationDate, lastModifiedDate, slug, nameAr, nameEn, descriptionAr, descriptionEn come from BaseLookupResponse
  wooCommerceId: number | null
  name: string // Computed property from nameAr/nameEn
  description: string | null // Computed property from descriptionAr/descriptionEn
  tag: string
  count: number | null
  isActive: boolean
}
