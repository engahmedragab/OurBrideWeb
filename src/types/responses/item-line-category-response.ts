/**
 * Item Line Category Response
 */

import type { LineCategoryResponse } from './line-category-response'

export interface ItemLineCategoryResponse extends LineCategoryResponse {
  count?: number
  totalPrice?: number
  completed?: number
  pending?: number
  isSubDone: boolean
  iconName: string
  colorName: string
}


