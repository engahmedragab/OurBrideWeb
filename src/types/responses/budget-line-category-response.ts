/**
 * Budget Line Category Response
 */

import type { LineCategoryResponse } from './line-category-response'

export interface BudgetLineCategoryResponse extends LineCategoryResponse {
  estimated?: number
  pending?: number
  paid?: number
  final?: number
  count?: number
  iconName: string
  colorName: string
}


