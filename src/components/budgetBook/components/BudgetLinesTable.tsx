'use client'

import { Plus } from 'lucide-react'
import { cardVariants } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BudgetLineRowActions } from './BudgetLineRowActions'
// import { getCategoryColor } from '@/utils/budgetColors' // Temporarily comment out due to missing module
import { formatEGP } from '@/utils/formatCurrency'
import { cn } from '@/lib/utils'
import type { BudgetLineResponse, BudgetLineCategoryResponse } from '@/types/responses'
import { getCategoryColor } from '@/utils/budgetbook/budgetColors'
import { useI18nLocale, useI18nTranslations } from '@/i18n/hooks'
import { pickLocalizedText } from '@/utils/translation/i18nText'

interface BudgetLinesTableProps {
  lines: BudgetLineResponse[]
  categories: BudgetLineCategoryResponse[]
  totalBudget: number
  onToggleDone?: (lineId: number) => void
  onToggleFavorite?: (lineId: number) => void
  onEdit?: (line: BudgetLineResponse) => void
  onDelete?: (line: BudgetLineResponse) => void
  onCreateLine?: () => void
  isLoading?: boolean
  activeCategoryId?: number | null
}

export const BudgetLinesTable = ({
  lines,
  categories, 
  totalBudget,
  onToggleDone,
  onToggleFavorite,
  onEdit,
  onDelete,
  onCreateLine,
  isLoading = false,
  activeCategoryId
}: BudgetLinesTableProps) => {
  const t = useI18nTranslations('eventsPlanning.budget')
  const locale = useI18nLocale()
  const getCategory = (categoryId: number | null) => {
    return categories.find(cat => cat.id === categoryId)
  }

  const getLineLabel = (line: BudgetLineResponse) =>
    pickLocalizedText(locale, {
      ar: line.expenseAr || line.expense,
      en: line.expenseEn || line.expense,
      fallback: line.expense,
    }) || t('lines.unnamedService')
  const calculatePercentage = (amount: number) => {
    if (totalBudget === 0) return 0
    return (amount / totalBudget) * 100
  }

  if (isLoading) {
    return (
      <div className={cn(cardVariants({ variant: 'default', padding: 'lg' }), 'p-6')}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className={cn(cardVariants({ variant: 'default', padding: 'lg' }), 'p-6')}>
        <div className="text-center py-12 text-gray-500">
        <div className="flex items-center justify-center md:justify-end px-4 py-3 border-b border-gray-200 bg-white">
          <Button
            variant="brand"
            size="sm"
            onClick={onCreateLine}
            className="text-white whitespace-nowrap !rounded-lg h-9 px-3 "
          >
            <Plus className="h-3.5 w-3.5 mr-1.5 text-white" />
            {t('lines.addNew')}
          </Button>
        </div>
          <p className="text-14">{t('lines.empty')}</p>
        </div>
      </div>
    )
  }
  const selectedCategory =
  activeCategoryId != null
    ? categories.find(c => c.id === activeCategoryId)
    : null

const selectedEstimated = selectedCategory?.estimated ?? null

  return (
    <div className={cn(cardVariants({ variant: 'default' }), 'overflow-hidden shadow-sm border border-gray-200')}>
      {/* Table Header with Add New Button */}
      {onCreateLine && (
  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
    {/* ✅ Left: يظهر بس لما يكون فيه category مختارة */}
    <div className="flex items-center gap-2">
      {selectedCategory ? (
        <>
          <span className="text-12 font-medium text-gray-500 uppercase tracking-wider">
            {t('lines.estimatedLabel')}
          </span>
          <span className="text-14 font-semibold text-gray-900">
            {selectedEstimated !== null ? formatEGP(selectedEstimated) : '--'}
          </span>
        </>
      ) : (
        <span className="text-12 text-gray-400">
          {t('lines.selectCategoryHint')}
        </span>
      )}
    </div>

    {/* Right: Add New */}
    <Button
      variant="brand"
      size="sm"
      onClick={onCreateLine}
      type="button"
      className="text-white whitespace-nowrap !rounded-lg h-9 px-3"
    >
      <Plus className="h-3.5 w-3.5 mr-1.5 text-white" />
      {t('lines.addNew')}
    </Button>
  </div>
)}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                {t('lines.headers.service')}
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                {t('lines.headers.totalPrice')}
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                {t('lines.headers.paid')}
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                {t('lines.headers.remaining')}
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                {t('lines.headers.percentOfBudget')}
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                {t('lines.headers.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {lines.map((line, index) => {
              const category = getCategory(line.lineCategoryId || null)
              const color = category ? getCategoryColor(category) : '#ccc'
              const estimated = line.estimated || 0
              const paid = line.paid || 0
              const remaining = estimated - paid
              const percentage = calculatePercentage(estimated)
              const isEven = index % 2 === 0

              return (
                <tr
                  key={line.id}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    isEven ? 'bg-white' : 'bg-gray-50'
                  )}
                >
                  {/* Service with colored vertical bar */}
                  <td className="px-4 py-4 align-middle border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-12 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-14 font-medium text-gray-900">
                        {getLineLabel(line)}
                      </span>
                    </div>
                  </td>

                  {/* Total Price */}
                  <td className="px-4 py-4 align-middle border-b border-gray-100">
                    <span className="text-14 font-medium text-gray-900">
                      {formatEGP(line.estimated)}
                    </span>
                  </td>

                  {/* Paid */}
                  <td className="px-4 py-4 align-middle border-b border-gray-100">
                    <span className="text-14 font-medium text-gray-900">
                      {formatEGP(line.paid)}
                    </span>
                  </td>

                  {/* Remaining */}
                  <td className="px-4 py-4 align-middle border-b border-gray-100">
                    <span className="text-14 font-medium text-gray-900">
                      {formatEGP(remaining)}
                    </span>
                  </td>

                  {/* % Of Budget */}
                  <td className="px-4 py-4 align-middle border-b border-gray-100">
                    <span className="text-14 font-medium text-gray-600">
                      {percentage.toFixed(0)}%
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 align-middle border-b border-gray-100">
                    <BudgetLineRowActions
                      isDone={line.isDone}
                      isFavorite={line.isFavorite}
                      onToggleDone={
                        onToggleDone ? () => onToggleDone(line.id) : undefined
                      }
                      onToggleFavorite={
                        onToggleFavorite
                          ? () => onToggleFavorite(line.id)
                          : undefined
                      }
                      onEdit={onEdit ? () => onEdit(line) : undefined}
                      onDelete={onDelete ? () => onDelete(line) : undefined}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div> 
  )
}

