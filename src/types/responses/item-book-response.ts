/**
 * Item Book Response
 */

import type { BookResponse } from './book-response'
import type { ItemLineResponse } from './item-line-response'
import type { ItemLineCategoryResponse } from './item-line-category-response'

export interface ItemBookResponse extends BookResponse<ItemLineResponse> {
  estimated?: number
  totalPrice?: number
  completed?: number
  pending?: number
  isSubDone?: boolean
  lineCategories?: ItemLineCategoryResponse[]
  categoriesCount?: number
}
