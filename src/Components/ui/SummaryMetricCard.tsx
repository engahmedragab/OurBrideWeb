'use client'

import { cn } from '@/lib/utils'

export interface SummaryMetricCardProps {
  label: string
  value: string | number
  subLabel?: string
  subValue?: string | number
  variant?: 'default' | 'highlight'
  className?: string
}

export const SummaryMetricCard = ({
  label,
  value,
  subLabel,
  subValue,
  variant = 'default',
  className,
}: SummaryMetricCardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200',
        'transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <div className="space-y-2">
        {/* Main Metric */}
        <div>
          <p
            className={cn(
              'text-12 sm:text-14 font-medium mb-1',
              variant === 'highlight' ? 'text-brand-500' : 'text-gray-600'
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              'text-20 sm:text-24 font-bold',
              variant === 'highlight' ? 'text-brand-500' : 'text-gray-900'
            )}
          >
            {typeof value === 'number'
              ? value.toLocaleString()
              : value}
          </p>
        </div>

        {/* Sub Metric */}
        {subLabel && subValue !== undefined && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-12 sm:text-14 font-medium text-brand-500 mb-1">
              {subLabel}
            </p>
            <p className="text-16 sm:text-18 font-semibold text-gray-900">
              {typeof subValue === 'number'
                ? subValue.toLocaleString()
                : subValue}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

