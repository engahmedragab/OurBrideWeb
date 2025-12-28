'use client'

import { useMemo } from 'react'
import { MainBudgetBookResponse } from '@/types/responses'
import { DonutChart } from './DonutChart'

export interface BudgetData {
  label: string
  value: number
  color: string
}

export interface BudgetPaymentsProps {
  book?: MainBudgetBookResponse
  onInit?: () => Promise<void>
  onNavigate?: () => void
  eventId?: number
}

export const BudgetPayments = ({
  book,
  onInit,
  onNavigate,
  eventId,
}: BudgetPaymentsProps) => {
  if (!book) {
    return null
  }

  const needsInit = !book.isBookInit

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (needsInit && onInit) {
      await onInit()
    }
    if (onNavigate) {
      onNavigate()
    }
  }

  // Get initialEstimated from book
  const initialEstimated = book.initialEstimated || 0
  // Get title from book
  const title = book.title || 'Budget Book'

  // Calculate chart data
  // For now, we'll show initialEstimated as the total budget
  // TODO: Calculate paid from lines when available in MainBudgetLineResponse
  const paid = 0 // TODO: Get from lines when paid field is available
  const remaining = Math.max(initialEstimated - paid, 0)

  const chartData = useMemo<BudgetData[]>(() => {
    if (initialEstimated === 0) {
      return []
    }
    const data: BudgetData[] = []
    if (paid > 0) {
      data.push({ label: 'Paid', value: paid, color: '#059669' })
    }
    if (remaining > 0) {
      data.push({ label: 'Remaining', value: remaining, color: '#E5E7EB' })
    }
    return data
  }, [paid, remaining, initialEstimated])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">{title}</h2>
        <button
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
          onClick={handleClick}
        >
          View Details
        </button>
      </div>
      <div className="flex flex-col items-center">
        <DonutChart data={chartData} />
        <div className="mt-2 space-y-2 w-full">
          <div className="flex items-center justify-between">
            <span className="text-13 text-gray-600">All Budget</span>
            <span className="text-14 font-semibold text-gray-900">{initialEstimated.toLocaleString()} EGP</span>
          </div>
        </div>
      </div>
    </div>
  )
}

