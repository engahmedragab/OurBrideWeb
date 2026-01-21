'use client'

import { useMemo } from 'react'
import { MainBudgetBookResponse } from '@/types/responses'
import type { BudgetLineResponse } from '@/types/responses'
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

  // Calculate paid from lines (lines may contain paid/estimated even if not in type definition)
  const paid = useMemo(() => {
    const lines = (book.lines || []) as BudgetLineResponse[]
    const activeLines = lines.filter((line: BudgetLineResponse) => !line?.isDeleted)
    return activeLines.reduce((sum: number, line: BudgetLineResponse) => {
      return sum + (Number(line.paid) || 0)
    }, 0)
  }, [book.lines])

  // Calculate remaining budget
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
          type="button"
        >
          View All
        </button>
      </div>
      <div className="flex flex-col items-center">
      <DonutChart data={chartData} />
        {initialEstimated > 0 ? (
          <>
          
            <div className="mt-2 space-y-2 w-full">
              <div className="flex items-center justify-between">
                <span className="text-12 text-gray-600">All Budget</span>
                <span className="text-12 font-semibold text-gray-900">
                  {initialEstimated.toLocaleString()} EGP
                </span>
              </div>
              {paid > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-12 text-gray-600">Paid</span>
                  <span className="text-12 font-semibold text-gray-900">
                    {paid.toLocaleString()} EGP
                  </span>
                </div>
              )}
              {remaining > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-12 text-gray-600">Remaining</span>
                  <span className="text-12 font-semibold text-gray-900">
                    {remaining.toLocaleString()} EGP
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-13 text-gray-500">No budget set yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

