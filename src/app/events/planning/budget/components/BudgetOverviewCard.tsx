'use client'

import { useState, useEffect, useMemo } from 'react'
import { BudgetDonutChart } from './BudgetDonutChart'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cardVariants } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { getCategoryColor } from '../utils/budgetColors'
import { formatEGP } from '../utils/formatCurrency'
import type { MockBudgetLineCategory } from '../state/mockBudgetData'

interface CategoryStat {
  category: MockBudgetLineCategory
  value: number // sum(paid ?? 0) per category
  percentage: number
}

interface BudgetOverviewCardProps {
  totalBudget: number
  totalPaid: number
  remaining: number
  savedPercentage: number
  categoryStats: CategoryStat[]
  onBudgetChange?: (newBudget: number) => void
  isLoading?: boolean
}

export const BudgetOverviewCard = ({
  totalBudget,
  totalPaid,
  remaining,
  savedPercentage,
  categoryStats,
  onBudgetChange,
  isLoading = false,
}: BudgetOverviewCardProps) => {
  const [editingBudget, setEditingBudget] = useState<string>(
    totalBudget.toLocaleString('en-US')
  )
  const [isEditing, setIsEditing] = useState(false)

  // Calculate donut chart segments from category stats
  // Rule: value = sum(paid ?? 0) per category
  // Sort by value desc so large segments show first
  // Percentage is calculated based on total value of all segments
  const donutSegments = useMemo(() => {
    // Filter categories with value > 0
    const segmentsWithValue = categoryStats
      .filter(stat => stat.value > 0)
      .map(stat => ({
        label: stat.category.name || 'Unnamed Category',
        value: stat.value,
        color: getCategoryColor(stat.category),
        percentage: 0, // Will be calculated below
      }))

    if (segmentsWithValue.length === 0) return []

    // Calculate total value of all segments
    const totalValue = segmentsWithValue.reduce((sum, seg) => sum + seg.value, 0)
    if (totalValue === 0) return []

    // Calculate percentage for each segment relative to total value
    // and sort by value desc
    const segments = segmentsWithValue
      .map(seg => ({
        ...seg,
        percentage: (seg.value / totalValue) * 100,
      }))
      .sort((a, b) => b.value - a.value) // Sort desc by value

    return segments
  }, [categoryStats])

  // Sync editingBudget when totalBudget changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditingBudget(totalBudget.toLocaleString('en-US'))
    }
  }, [totalBudget, isEditing])

  const handleSave = () => {
    const numericValue = parseFloat(editingBudget.replace(/,/g, ''))
    if (!isNaN(numericValue) && numericValue >= 0 && onBudgetChange) {
      onBudgetChange(numericValue)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditingBudget(totalBudget.toLocaleString('en-US'))
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className={cn(cardVariants({ variant: 'default', padding: 'lg' }), 'p-6')}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn(cardVariants({ variant: 'default', padding: 'lg' }), 'p-4 shadow-sm border border-gray-200')}>
      <div className="p-0 space-y-4">
        {/* Header with Saved % */}
        <div className="flex items-center justify-between">
          <h2 className="text-14 font-semibold text-gray-900">Budget Overview</h2>
          <span className="text-12 font-medium text-green-500">
            {savedPercentage.toFixed(0)}% Saved
          </span>
        </div>

        {/* Donut Chart */}
        <div className="flex items-center justify-center py-2">
          <BudgetDonutChart
            segments={donutSegments}
            totalBudget={totalBudget}
            remaining={remaining}
            size={150}
            thickness={25}
            gapDeg={8}
          />
        </div>

        {/* Budget Info - Under donut */}
        <div className="space-y-2.5 px-4">
          <div className="flex items-center justify-between">
            <span className="text-13 text-gray-600">Budget</span>
            <span className="text-14 font-semibold text-gray-900">
              {formatEGP(totalBudget)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-13 text-gray-600">Remaining Budget</span>
            <span className="text-14 font-semibold text-gray-900">
              {formatEGP(remaining)}
            </span>
          </div>
        </div>

        {/* Budget Input and Save */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <div className="flex-1">
            <Input
              type="text"
              value={editingBudget}
              onChange={e => {
                const value = e.target.value.replace(/[^0-9,]/g, '')
                setEditingBudget(value)
                setIsEditing(true)
              }}
              onBlur={handleCancel}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSave()
                } else if (e.key === 'Escape') {
                  handleCancel()
                }
              }}
              suffix="EGP"
              size="lg"
              className="w-full"
            />
          </div>
          {isEditing && (
            <Button
              variant="brand"
              size="md"
              onClick={handleSave}
              className="text-white whitespace-nowrap"
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

