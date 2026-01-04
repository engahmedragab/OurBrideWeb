'use client'

import { Edit2, Trash2, Plus } from 'lucide-react'
import { cardVariants } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
// @ts-ignore - budgetColors might be missing or in a different location during lint/test time
import { getCategoryColor } from '@/utils/budgetColors'
import { CategoryIcon } from './CategoryIcon'
import type { BudgetLineCategoryResponse } from '@/types/responses'

interface BudgetCategoryBreakdownListProps {
  categoryStats: Array<{
    category: BudgetLineCategoryResponse
    total: number
    percentage: number
  }>
  activeCategoryId: number | null // null means "All"
  onCategoryClick: (categoryId: number | null) => void
  onEditCategory?: (categoryId: number) => void
  onDeleteCategory?: (categoryId: number) => void
  onCreateCategory?: () => void
  totalBudget: number
  totalEstimated: number
  isLoading?: boolean
}

export const BudgetCategoryBreakdownList = ({
  categoryStats,
  activeCategoryId,
  onCategoryClick,
  onEditCategory,
  onDeleteCategory,
  onCreateCategory,
  totalBudget,
  totalEstimated,
  isLoading = false,
}: BudgetCategoryBreakdownListProps) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          cardVariants({ variant: 'default', padding: 'sm' }),
          'h-[320px] sm:h-[360px] md:h-[380px] lg:h-[400px] overflow-hidden flex flex-col shadow-sm border border-gray-200'
        )}
      >
        <div className="animate-pulse space-y-2 p-3">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        cardVariants({ variant: 'default', padding: 'sm' }),
        'h-[320px] sm:h-[360px] md:h-[380px] lg:h-[400px] overflow-hidden flex flex-col shadow-sm border border-gray-200 p-0'
      )}
    >
      {/* Header with Title and Add Category Button - Fixed, not scrollable */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 flex-shrink-0 border-b border-gray-100">
        <h3 className="text-14 font-semibold text-gray-900">Categories</h3>
        {onCreateCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateCategory}
            className="text-brand-500 whitespace-nowrap !rounded-lg h-9 px-3  border-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New
          </Button>
        )}
      </div>

      {/* Scrollable List Area */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1.5">
        {/* Category items */}
        {categoryStats.map(stat => {
          const color = getCategoryColor(stat.category)
          const isActive = activeCategoryId === stat.category.id
          return (
            <div
              key={stat.category.id}
              className={cn(
                'w-full flex items-center gap-3 py-1.5 px-2 rounded-lg transition-all relative group',
                isActive
                  ? 'bg-white border border-gray-200 shadow-sm'
                  : 'hover:bg-gray-50 border border-transparent'
              )}
              style={isActive ? { borderColor: color + '40' } : undefined}
            >
              {/* Icon badge with color */}
              <CategoryIcon
                iconName={stat.category.iconName}
                colorName={stat.category.colorName}
                size="sm"
              />
              
              {/* Category name - clickable */}
              <div
                onClick={() => onCategoryClick(stat.category.id)}
                className="flex-1 flex items-center justify-between text-left min-w-0 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onCategoryClick(stat.category.id)
                  }
                }}
              >
                <span
                  className={cn(
                    'text-13 font-medium truncate',
                    isActive ? 'text-gray-900 font-semibold' : 'text-gray-600'
                  )}
                >
                  {stat.category.name || 'Unnamed Category'}
                </span>
                {/* Action buttons */}
                {(onEditCategory || onDeleteCategory) && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                    {onEditCategory && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          onEditCategory(stat.category.id)
                        }}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-brand-500 transition-colors"
                        aria-label="Edit category"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {onDeleteCategory && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          onDeleteCategory(stat.category.id)
                          // If deleting active category, switch to "All"
                          if (activeCategoryId === stat.category.id) {
                            onCategoryClick(null)
                          }
                        }}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        aria-label="Delete category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Percentage */}
              <span className="text-13 font-medium text-gray-500 flex-shrink-0 ml-2">
                {stat.percentage.toFixed(0)}%
              </span>
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}
