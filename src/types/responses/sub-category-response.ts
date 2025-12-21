/**
 * Sub Category Response
 */

import type { BaseLookupResponse } from '@/types/responses/common'
import type { CategoryResponse } from './category-response'

export interface SubCategoryResponse extends BaseLookupResponse {
  id: number
  categoryId: number
  category: CategoryResponse | null
  parentId: number | null
  level: number
  path: string | null
  imageUrl: string | null
  iconUrl: string | null
  isActive: boolean
  displayOrder: number
  productCount: number | null
}
