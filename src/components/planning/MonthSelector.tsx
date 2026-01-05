'use client'

import { cn } from '@/lib/utils'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export interface MonthSelectorProps {
  selectedMonth: number
  onChange: (month: number) => void
  className?: string
}

export const MonthSelector = ({
  selectedMonth,
  onChange,
  className,
}: MonthSelectorProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label htmlFor="month-select" className="text-14 text-gray-700">
        Month:
      </label>
      <select
        id="month-select"
        value={selectedMonth}
        onChange={e => onChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-lg text-14 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      >
        {MONTHS.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
    </div>
  )
}
