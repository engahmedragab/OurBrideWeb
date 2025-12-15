'use client'

import { useState, useEffect } from 'react'
import { Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SummaryMetricCardProps {
  label: string
  value: string | number
  subLabel?: string
  subValue?: string | number
  variant?: 'default' | 'highlight'
  className?: string
  onValueChange?: (value: number) => void
  onSubValueChange?: (value: number) => void
  editable?: boolean
  editableSub?: boolean
}

export const SummaryMetricCard = ({
  label,
  value,
  subLabel,
  subValue,
  variant = 'default',
  className,
  onValueChange,
  onSubValueChange,
  editable = false,
  editableSub = false,
}: SummaryMetricCardProps) => {
  // Extract numeric value if it's a string with currency
  const numericValue = typeof value === 'number' 
    ? value 
    : typeof value === 'string' && value.startsWith('£')
    ? parseFloat(value.replace(/[£,]/g, '')) || 0
    : 0

  const numericSubValue = typeof subValue === 'number'
    ? subValue
    : typeof subValue === 'string' && subValue.startsWith('£')
    ? parseFloat(subValue.replace(/[£,]/g, '')) || 0
    : 0

  const [isEditing, setIsEditing] = useState(false)
  const [isEditingSub, setIsEditingSub] = useState(false)
  const [editValue, setEditValue] = useState(numericValue.toString())
  const [editSubValue, setEditSubValue] = useState(numericSubValue.toString())

  // Update local state when prop value changes
  useEffect(() => {
    setEditValue(numericValue.toString())
  }, [numericValue])

  useEffect(() => {
    setEditSubValue(numericSubValue.toString())
  }, [numericSubValue])

  const handleValueBlur = () => {
    setIsEditing(false)
    const numValue = parseFloat(editValue) || 0
    if (onValueChange) {
      onValueChange(numValue)
    }
  }

  const handleSubValueBlur = () => {
    setIsEditingSub(false)
    const numValue = parseFloat(editSubValue) || 0
    if (onSubValueChange) {
      onSubValueChange(numValue)
    }
  }

  const handleValueKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleValueBlur()
    }
  }

  const handleSubValueKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubValueBlur()
    }
  }

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
          <div className="flex items-center gap-2">
            {editable && isEditing ? (
              <input
                type="number"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={handleValueBlur}
                onKeyDown={handleValueKeyDown}
                className={cn(
                  'flex-1 rounded-xl border bg-white px-3 py-1.5 text-16 sm:text-18 font-semibold border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-0 transition-colors text-gray-900',
                  variant === 'highlight' ? 'text-brand-500' : 'text-gray-900'
                )}
                autoFocus
              />
            ) : (
              <>
                <p
                  className={cn(
                    'text-20 sm:text-24 font-bold flex-1',
                    variant === 'highlight' ? 'text-brand-500' : 'text-gray-900'
                  )}
                >
                  {typeof value === 'number'
                    ? `£${value.toLocaleString()}`
                    : value}
                </p>
                {editable && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 className="h-4 w-4 text-brand-500" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sub Metric */}
        {subLabel && subValue !== undefined && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-12 sm:text-14 font-medium text-brand-500 mb-1">
              {subLabel}
            </p>
            <div className="flex items-center gap-2">
              {editableSub && isEditingSub ? (
                <input
                  type="number"
                  value={editSubValue}
                  onChange={e => setEditSubValue(e.target.value)}
                  onBlur={handleSubValueBlur}
                  onKeyDown={handleSubValueKeyDown}
                  className="flex-1 rounded-xl border bg-white px-3 py-1.5 text-16 sm:text-18 font-semibold border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-0 transition-colors text-gray-900"
                  autoFocus
                />
              ) : (
                <>
                  <p className="text-16 sm:text-18 font-semibold text-gray-900 flex-1">
                    {typeof subValue === 'number'
                      ? `£${subValue.toLocaleString()}`
                      : subValue}
                  </p>
                  {editableSub && (
                    <button
                      onClick={() => setIsEditingSub(true)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Edit"
                    >
                      <Edit2 className="h-4 w-4 text-brand-500" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

