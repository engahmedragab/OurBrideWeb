/**
 * Category Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'

export interface CategoryResponse extends BaseLookupResponse {
  id: number
  parentId: number | null
  level: number
  path: string | null
  imageUrl: string | null
  iconUrl: string | null
  isActive: boolean
  displayOrder: number
  productCount: number | null
  subCategories: CategoryResponse[] | null
}
