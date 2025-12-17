'use client'

import { cn } from '@/lib/utils'

export interface YearSelectorProps {
  selectedYear: number
  onChange: (year: number) => void
  className?: string
}

export const YearSelector = ({
  selectedYear,
  onChange,
  className,
}: YearSelectorProps) => {
  const currentYear = new Date().getFullYear()
  const futureYears = Array.from({ length: 10 }, (_, i) => currentYear + i)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label htmlFor="year-select" className="text-14 text-gray-700">
        Year:
      </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={e => onChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-lg text-14 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      >
        {futureYears.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}

