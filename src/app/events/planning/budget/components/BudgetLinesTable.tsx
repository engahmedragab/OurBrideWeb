'use client'

import { Plus } from 'lucide-react'
import { cardVariants } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BudgetLineRowActions } from './BudgetLineRowActions'
import { getCategoryColor } from '../utils/budgetColors'
import { formatEGP } from '../utils/formatCurrency'
import { cn } from '@/lib/utils'
import type { MockBudgetLine, MockBudgetLineCategory } from '../state/mockBudgetData'

interface BudgetLinesTableProps {
  lines: MockBudgetLine[]
  categories: MockBudgetLineCategory[]
  totalBudget: number
  onToggleDone?: (lineId: number) => void
  onToggleFavorite?: (lineId: number) => void
  onEdit?: (line: MockBudgetLine) => void
  onDelete?: (line: MockBudgetLine) => void
  onCreateLine?: () => void
  isLoading?: boolean
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
}: BudgetLinesTableProps) => {
  const getCategory = (categoryId: number | null) => {
    return categories.find(cat => cat.id === categoryId)
  }


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
          <p className="text-14">No budget lines found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(cardVariants({ variant: 'default' }), 'overflow-hidden shadow-sm border border-gray-200')}>
      {/* Table Header with Add New Button */}
      {onCreateLine && (
        <div className="flex items-center justify-end px-4 py-3 border-b border-gray-200 bg-white">
          <Button
            variant="brand"
            size="sm"
            onClick={onCreateLine}
            className="text-white whitespace-nowrap !rounded-lg h-9 px-3 "
          >
            <Plus className="h-3.5 w-3.5 mr-1.5 text-white" />
            Add New
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Service
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Total Price
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Paid
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Remaining
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                % Of Budget
              </th>
              <th className="px-4 py-3 text-left text-12 font-normal text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {lines.map((line, index) => {
              const category = getCategory(line.lineCategoryId)
              const color = category ? getCategoryColor(category) : '#ccc' // fallback to default color string if category is undefined
              const remaining = line.estimated - line.paid
              const percentage = calculatePercentage(line.estimated)
              const isEven = index % 2 === 0

              return (
                <tr
                  key={line.id}
                  className={cn(
                    'hover:bg-gray-50 transition-colors',
                    isEven ? 'bg-white' : 'bg-gray-50'
                  )}
                >
                  {/* Service with colored accent bar */}
                  <td className="px-4 py-4 align-middle border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-12 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-14 font-medium text-gray-900">
                        {line.expense || 'Unnamed Service'}
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

