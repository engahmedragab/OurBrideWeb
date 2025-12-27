/**
 * Main Budget Book Response
 */

import type { MainBookResponse } from './main-book-response'
import type { MainBudgetLineResponse } from './main-budget-line-response'

export interface MainBudgetBookResponse extends MainBookResponse<MainBudgetLineResponse> {
  initialEstimated: number
}


