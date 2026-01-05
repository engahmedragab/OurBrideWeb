'use client'

import { cn } from '@/lib/utils'
import { planningTypography } from './typography'

export interface SelectFieldOption {
  value: string
  label: string
}

export interface SelectFieldProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectFieldOption[]
  required?: boolean
  className?: string
  showLabel?: boolean
}

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
  className,
  showLabel = true,
}: SelectFieldProps) => {
  return (
    <div className={className}>
      {showLabel && label && (
        <label
          className={cn(
            'block',
            planningTypography.secondary,
            'font-medium text-gray-700 mb-2'
          )}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex w-full h-11 items-center rounded-xl border border-gray-300 bg-white px-4 text-16 font-normal leading-6 transition-colors focus:outline-none focus:ring-0 focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
        required={required}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
