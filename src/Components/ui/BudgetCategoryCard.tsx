'use client'

import React from 'react'
import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WeddingCakeIcon } from '@/assets/icons/WeddingCakeIcon'
import { BridalBeautyIcon } from '@/assets/icons/BridalBeautyIcon'
import { WeddingHallIcon } from '@/assets/icons/WeddingHallIcon'
import { BouquetIcon } from '@/assets/icons/BouquetIcon'
import { PhotographyIcon } from '@/assets/icons/PhotographyIcon'
import { AccessoriesIcon } from '@/assets/icons/AccessoriesIcon'

export interface BudgetItem {
  id: string
  itemType?: string
  name: string
  estimatedCost: number
  paidAmount: number
  notes?: string
}

export interface BudgetCategory {
  id: string
  name: string
  icon?: React.ReactNode
  total: number
  estimatedCost: number
  finalCost: number
  items: BudgetItem[]
}

export interface BudgetCategoryCardProps {
  category: BudgetCategory
  isExpanded?: boolean
  onToggle?: () => void
  onEditItem?: (item: BudgetItem) => void
  onDeleteItem?: (item: BudgetItem) => void
  onAddItem?: (categoryId: string) => void
}

// Helper function to get icon based on category id
const getCategoryIcon = (categoryId: string) => {
  const iconProps = { className: 'h-5 w-5 sm:h-6 sm:w-6 text-brand-500' }
  
  switch (categoryId) {
    case 'entertainment':
      return <AccessoriesIcon {...iconProps} />
    case 'beauty':
      return <BridalBeautyIcon {...iconProps} />
    case 'cake':
      return <BouquetIcon {...iconProps} />
    case 'hospitality':
      return <WeddingHallIcon {...iconProps} />
    case 'party':
      return <BouquetIcon {...iconProps} />
    default:
      return <AccessoriesIcon {...iconProps} />
  }
}

export const BudgetCategoryCard = ({
  category,
  isExpanded = false,
  onToggle,
  onEditItem,
  onDeleteItem,
  onAddItem,
}: BudgetCategoryCardProps) => {
  // Calculate realistic progress based on paid amount vs estimated cost
  const totalPaid = category.items.reduce((sum, item) => sum + item.paidAmount, 0)
  const totalEstimated = category.items.reduce((sum, item) => sum + item.estimatedCost, 0)
  
  const progressPercentage =
    totalEstimated > 0
      ? Math.min((totalPaid / totalEstimated) * 100, 100)
      : 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 transition-colors"
      >
        {/* Category Icon */}
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-brand-500 rounded-2xl flex items-center justify-center">
          {category.icon ? (
            <div className="text-brand-500 [&>svg]:text-brand-500 [&>svg]:stroke-brand-500">
              {category.icon}
            </div>
          ) : (
            <div className="text-brand-500 [&>svg]:text-brand-500 [&>svg]:stroke-brand-500">
              {getCategoryIcon(category.id)}
            </div>
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 text-left min-w-0">
          <h3 className="text-16 sm:text-18 font-semibold text-gray-900 truncate">
            {category.name}
          </h3>
          <p className="text-14 text-gray-500 mt-0.5">
            Total: £{category.total.toLocaleString()}
          </p>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-4 sm:p-5 space-y-4">
            {/* Cost Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-12 text-gray-500 mb-1">
                  Estimated Cost
                </p>
                <p className="text-16 font-semibold text-gray-900">
                  £{totalEstimated.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-12 text-gray-500 mb-1">
                  Paid
                </p>
                <p className="text-16 font-semibold text-gray-900">
                  £{totalPaid.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-12 text-gray-500">
                  Progress
                </span>
                <span className="text-12 font-semibold text-brand-500">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            {category.items.length > 0 ? (
              <div className="space-y-3 pt-2">
                {category.items.map(item => {
                  const itemProgress =
                    item.estimatedCost > 0
                      ? Math.min(
                          (item.paidAmount / item.estimatedCost) * 100,
                          100
                        )
                      : 0

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {item.itemType && (
                            <p className="text-12 text-brand-500 font-medium mb-1">
                              {item.itemType}
                            </p>
                          )}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-14 sm:text-16 font-semibold text-gray-900">
                              {item.name}
                            </h4>
                            {(onEditItem || onDeleteItem) && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {onEditItem && (
                                  <button
                                    onClick={() => onEditItem(item)}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Edit item"
                                  >
                                    <Edit2 className="h-4 w-4 text-brand-500" />
                                  </button>
                                )}
                                {onDeleteItem && (
                                  <button
                                    onClick={() => onDeleteItem(item)}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label="Delete item"
                                  >
                                    <Trash2 className="h-4 w-4 text-brand-500" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-12 text-gray-600">
                              <span>Cost:</span>
                              <span className="font-medium">
                                {item.estimatedCost.toLocaleString()} (Estimated)
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-12 text-gray-600">
                              <span>Paid:</span>
                              <span className="font-medium">
                                {item.paidAmount.toLocaleString()}
                              </span>
                            </div>
                            {item.notes && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-12 text-gray-500 italic">
                                  {item.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-2 h-20 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="w-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                              style={{ height: `${itemProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* Empty State - Add Item */
              <div className="pt-2">
                <button
                  onClick={() => onAddItem?.(category.id)}
                  className="w-full flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:border-brand-500 hover:bg-brand-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 group-hover:bg-brand-500 transition-colors duration-200 mb-3">
                    <Plus className="h-6 w-6 text-brand-500 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <p className="text-14 font-medium text-gray-700 group-hover:text-brand-500 transition-colors duration-200">
                    Add items to this category
                  </p>
                  <p className="text-12 text-gray-400 mt-1">
                    Click to add your first item
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

