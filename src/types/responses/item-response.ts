/**
 * Item Response
 */

import type { BaseEntityResponse } from '@/types/responses/common'

export interface ItemResponse extends BaseEntityResponse {
  // Note: id, isDeleted, creationDate, lastModifiedDate, slug come from BaseEntityResponse
  name: string
  description: string | null
  code: string | null
  barcode: string | null
  unit: string | null
  isActive: boolean
  categoryId: number | null
  subCategoryId: number | null
}
