import type { BudgetBookDraft } from '@/hooks/planning/bookDrafts'
import type { BudgetLineCategoryResponse } from '@/types/responses'

type CategoryStat = {
  category: BudgetLineCategoryResponse
  total: number // sum(estimated) per category
  value: number // sum(paid) per category (for donut)
  percentage: number // based on totalEstimated
}

export function calculateBudgetStats(draft: BudgetBookDraft, p0: any) {
  const categories = (draft.lineCategories || []).filter(c => !c.isDeleted)
  const lines = (draft.lines || []).filter(l => !l.isDeleted)

  const totalEstimated = lines.reduce((sum, l) => sum + (Number(l.estimated) || 0), 0)
  const totalPaid = lines.reduce((sum, l) => sum + (Number(l.paid) || 0), 0)
  const totalFinal = lines.reduce((sum, l) => sum + (Number(l.final) || 0), 0)

  // ✅ الميزانية اللي المستخدم بيكتبها
  const totalBudget = Number(draft.initialEstimated) || 0

  // ✅ المتبقي من الميزانية بعد المدفوع
  const remaining = Math.max(0, totalBudget - totalPaid)

  const savedPercentage = totalBudget > 0 ? (remaining / totalBudget) * 100 : 0

  const categoryStats: CategoryStat[] = categories.map(cat => {
    const catLines = lines.filter(l => l.lineCategoryId === cat.id)
    const catEstimated = catLines.reduce((sum, l) => sum + (Number(l.estimated) || 0), 0)
    const catPaid = catLines.reduce((sum, l) => sum + (Number(l.paid) || 0), 0)

    return {
      category: cat,
      total: catEstimated,
      value: catPaid,
      percentage: 0,
    }
  })

  const denom = categoryStats.reduce((sum, s) => sum + s.total, 0)
  const normalized = categoryStats.map(s => ({
    ...s,
    percentage: denom > 0 ? (s.total / denom) * 100 : 0,
  }))

  return {
    totalBudget,
    totalEstimated,
    totalPaid,
    totalFinal,
    remaining,
    savedPercentage,
    categoryStats: normalized,
  }
}
