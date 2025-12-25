'use client'

import Link from 'next/link'
import { DonutChart } from './DonutChart'

export interface BudgetData {
  label: string
  value: number
  color: string
}

export interface BudgetPaymentsProps {
  total: number
  remaining: number
  chartData: BudgetData[]
  viewDetailsHref?: string
}

export const BudgetPayments = ({
  total,
  remaining,
  chartData,
  viewDetailsHref = '/events/planning/events',
}: BudgetPaymentsProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-18 font-semibold text-gray-900">Budget & Payments</h2>
        <Link
          href={viewDetailsHref}
          className="text-12 text-brand-500 hover:text-brand-600 font-medium"
        >
          View Details
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <DonutChart data={chartData} />
        <div className="mt-2 space-y-2 w-full">
          <div className="flex items-center justify-between">
            <span className="text-13 text-gray-600">All Budget</span>
            <span className="text-14 font-semibold text-gray-900">{total.toLocaleString()} EGP</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-13 text-gray-600">Remaining Budget</span>
            <span className="text-14 font-semibold text-gray-900">{remaining.toLocaleString()} EGP</span>
          </div>
        </div>
      </div>
    </div>
  )
}

