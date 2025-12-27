/**
 * Guest Book Response
 */

import type { BookResponse } from './book-response'
import type { GuestLineResponse } from './guest-line-response'
import type { GuestLineCategoryResponse } from './guest-line-category-response'

export interface GuestBookResponse extends BookResponse<GuestLineResponse> {
  brideCount?: number
  groomCount?: number
  brideFamilies?: string[]
  groomFamilies?: string[]
  brideFamiliesCount?: number
  groomFamiliesCount?: number
  lineCategories?: GuestLineCategoryResponse[]
  brideCategoriesCount?: number
  groomCategoriesCount?: number
  brideNumber?: number
  groomNumber?: number
  maxBrideNumber?: number
  maxGroomNumber?: number
}


