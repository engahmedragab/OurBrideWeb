/**
 * Budget Stats Calculator
 * 
 * Calculates budget statistics from draft/book data
 */

import type { BudgetBookDraft } from '../budgetAdapters'
import type { BudgetLineCategoryResponse } from '@/types/responses'

export interface CategoryStat {
  category: BudgetLineCategoryResponse
  total: number
  value: number // For donut chart visualization (sum of paid)
  percentage: number
}

export interface BudgetStats {
  totalBudget: number
  totalEstimated: number
  totalPaid: number
  remaining: number
  savedPercentage: number
  count: number
  categoryStats: CategoryStat[]
}

export const calculateBudgetStats = (
  book: BudgetBookDraft,
  activeCategoryId: number | null = null
): BudgetStats => {
  const totalBudget = book.initialEstimated || book.estimated || 0

  // Filter lines by active category
  let filteredLines = (book.lines || []).filter(line => !line.isDeleted)
  if (activeCategoryId !== null) {
    filteredLines = filteredLines.filter(
      line => line.lineCategoryId === activeCategoryId
    )
  }

  // Calculate totals from filtered lines
  const totalEstimated = filteredLines.reduce((sum, line) => sum + (line.estimated || 0), 0)
  const totalPaid = filteredLines.reduce((sum, line) => sum + (line.paid || 0), 0)
  const count = filteredLines.length

  // Budget logic:
  // budget = max(budgetBook.initialEstimated ?? 0, 0)
  // spent = sum(paid ?? 0) across filtered lines
  // remaining = max(budget - spent, 0)
  // remaining MUST NOT exceed budget
  const budget = Math.max(totalBudget, 0)
  const spent = totalPaid
  const remaining = Math.max(budget - spent, 0)

  // Saved percentage: savedPercent = budget > 0 ? (remaining / budget) * 100 : 0
  // Clamp savedPercent between 0 and 100
  const savedPercentage = Math.max(
    0,
    Math.min(100, budget > 0 ? (remaining / budget) * 100 : 0)
  )

  // Calculate category breakdown (always show all categories, but highlight active)
  // For donut chart: value = sum(paid ?? 0) per category
  // Exclude deleted categories
  const categoryStats: CategoryStat[] = (book.lineCategories || [])
    .filter(category => !category.isDeleted) // Exclude deleted categories
    .map(category => {
      const categoryLines = (book.lines || []).filter(
        line => line.lineCategoryId === category.id && !line.isDeleted
      )
      // Value rule: sum(paid ?? 0) per category (for donut chart)
      const categoryValue = categoryLines.reduce(
        (sum, line) => sum + (line.paid || 0),
        0
      )
      const categoryTotal = categoryLines.reduce((sum, line) => sum + (line.estimated || 0), 0)
      const categoryPercentage = totalBudget > 0 ? (categoryTotal / totalBudget) * 100 : 0

      return {
        category,
        total: categoryTotal,
        value: categoryValue, // For donut chart visualization (sum of paid)
        percentage: categoryPercentage,
      }
    })

  return {
    totalBudget,
    totalEstimated,
    totalPaid,
    remaining,
    savedPercentage,
    count,
    categoryStats,
  }
}

