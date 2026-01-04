'use client'

import { useState, useEffect, useMemo } from 'react'
import { BudgetDonutChart } from './BudgetDonutChart'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cardVariants } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { formatEGP } from '@/utils/formatCurrency'
import type { BudgetLineCategoryResponse } from '@/types/responses'
import { getCategoryColor } from '@/utils/budgetbook/budgetColors'

interface CategoryStat {
  category: BudgetLineCategoryResponse
  value: number
  percentage: number
}

interface BudgetOverviewCardProps {
  totalBudget: number
  totalPaid: number
  totalEstimated: number
  totalFinal: number
  remaining: number
  savedPercentage: number
  categoryStats: CategoryStat[]
  onBudgetChange?: (newBudget: number) => void
  isLoading?: boolean
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-13 text-gray-600">{label}</span>
      <span className="text-14 font-semibold text-gray-900">{value}</span>
    </div>
  )
}

export const BudgetOverviewCard = ({
  totalBudget,
  totalPaid,
  totalEstimated,
  totalFinal,
  remaining,
  savedPercentage,
  categoryStats,
  onBudgetChange,
  isLoading = false,
}: BudgetOverviewCardProps) => {
  const [editingBudget, setEditingBudget] = useState<string>(
    Number(totalBudget || 0).toLocaleString('en-US')
  )
  const [isEditing, setIsEditing] = useState(false)

  const donutSegments = useMemo(() => {
    const segmentsWithValue = categoryStats
      .filter(stat => stat.value > 0)
      .map(stat => ({
        label: stat.category.name || 'Unnamed Category',
        value: stat.value,
        color: getCategoryColor(stat.category),
        percentage: 0,
      }))

    if (segmentsWithValue.length === 0) return []

    const totalValue = segmentsWithValue.reduce((sum, seg) => sum + seg.value, 0)
    if (totalValue === 0) return []

    return segmentsWithValue
      .map(seg => ({ ...seg, percentage: (seg.value / totalValue) * 100 }))
      .sort((a, b) => b.value - a.value)
  }, [categoryStats])

  useEffect(() => {
    if (!isEditing) {
      setEditingBudget(Number(totalBudget || 0).toLocaleString('en-US'))
    }
  }, [totalBudget, isEditing])

  const handleSave = () => {
    const numericValue = parseFloat(editingBudget.replace(/,/g, ''))
    if (!isNaN(numericValue) && numericValue >= 0 && onBudgetChange) {
      onBudgetChange(numericValue)
    }
  }

  const handleCancel = () => {
    setEditingBudget(Number(totalBudget || 0).toLocaleString('en-US'))
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-14 font-semibold text-gray-900">Budget Overview</h2>
          <span className="text-12 font-medium text-green-500">
            {savedPercentage.toFixed(0)}% Saved
          </span>
        </div>

        {/* Donut */}
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

        {/* Info */}
        <div className="space-y-2.5 px-4">
          <InfoRow label="Budget" value={formatEGP(totalBudget)} />
          {/* <InfoRow label="Remaining Budget" value={formatEGP(remaining)} /> */}
          <InfoRow label="Estimated Cost" value={formatEGP(totalEstimated)} />
          <InfoRow label="Paid" value={formatEGP(totalPaid)} />
          <InfoRow label="Final Cost" value={formatEGP(totalFinal)} />
        </div>

        {/* Input */}
        <div className="pt-3 border-t border-gray-200">
          <div className="relative">
            <Input
              type="text"
              value={editingBudget}
              onChange={e => {
                const value = e.target.value.replace(/[^0-9,]/g, '')
                setEditingBudget(value)
                setIsEditing(true)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSave()
                } else if (e.key === 'Escape') {
                  handleCancel()
                }
              }}
              suffix="EGP"
              size="lg"
              placeholder="Enter Budget"
              className="w-full pr-20"
            />

            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-brand-500 bg-white rounded-lg hover:bg-brand-500 hover:text-white hover:border-brand-500"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
