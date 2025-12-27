/**
 * Budget Book Response
 */

import type { BookResponse } from './book-response'
import type { BudgetLineResponse } from './budget-line-response'
import type { BudgetLineCategoryResponse } from './budget-line-category-response'

export interface BudgetBookResponse extends BookResponse<BudgetLineResponse> {
  estimated?: number
  initialEstimated?: number
  pending?: number
  paid?: number
  final?: number
  lineCategories?: BudgetLineCategoryResponse[]
  categoriesCount?: number
}


