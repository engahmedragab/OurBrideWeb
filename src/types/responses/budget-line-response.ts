/**
 * Budget Line Response
 */

import type { LineResponse } from './line-response'
import type { BudgetLineCategoryResponse } from './budget-line-category-response'

export interface BudgetLineResponse extends LineResponse {
  expenseAr: string
  expenseEn: string
  expense: string
  estimated: number
  paid: number
  final: number
  dueDate: string | null // ISO DateTime string
  count: number
  payer: string
  note: string
  iconName: string
  colorName: string
  budgetLineCategory?: BudgetLineCategoryResponse
}


