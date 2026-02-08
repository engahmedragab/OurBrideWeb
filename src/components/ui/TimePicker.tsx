'use client'

import { useState, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import { Input } from './Input'
import { cn } from '@/lib/utils'
import { useIsRTL } from '@/i18n/hooks'

export interface TimePickerProps {
  value?: string // Format: "HH:MM" (24-hour format)
  onChange?: (time: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  errorMessage?: string
  variant?: 'default' | 'error' | 'fill'
  size?: 'sm' | 'md' | 'lg'
  use12Hour?: boolean // Whether to use 12-hour format (AM/PM)
}

/**
 * TimePicker Component
 * A custom time picker with hour and minute selection
 */
export function TimePicker({
  value = '',
  onChange,
  placeholder = 'Select time',
  className,
  disabled = false,
  errorMessage,
  variant = 'default',
  size = 'md',
  use12Hour = false,
}: TimePickerProps) {
  const isRTL = useIsRTL()
  const [isOpen, setIsOpen] = useState(false)
  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('AM')
  const popoverRef = useRef<HTMLDivElement>(null)

  // Parse value string to hours and minutes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number)
      if (use12Hour) {
        const hour12 = h % 12 || 12
        setHours(hour12)
        setAmPm(h >= 12 ? 'PM' : 'AM')
      } else {
        setHours(h)
      }
      setMinutes(m || 0)
    } else {
      setHours(use12Hour ? 12 : 0)
      setMinutes(0)
      setAmPm('AM')
    }
  }, [value, use12Hour])

  // Generate hour options
  const hourOptions = use12Hour
    ? Array.from({ length: 12 }, (_, i) => i + 1) // 1-12
    : Array.from({ length: 24 }, (_, i) => i) // 0-23

  // Generate minute options (increment by 5)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5) // 0, 5, 10, ..., 55

  const handleHourSelect = (hour: number) => {
    setHours(hour)
    updateTime(hour, minutes, amPm)
  }

  const handleMinuteSelect = (minute: number) => {
    setMinutes(minute)
    updateTime(hours, minute, amPm)
  }

  const handleAmPmToggle = () => {
    const newAmPm = amPm === 'AM' ? 'PM' : 'AM'
    setAmPm(newAmPm)
    updateTime(hours, minutes, newAmPm)
  }

  const updateTime = (h: number, m: number, ap: 'AM' | 'PM') => {
    let hour24 = h
    if (use12Hour) {
      if (ap === 'PM' && h !== 12) {
        hour24 = h + 12
      } else if (ap === 'AM' && h === 12) {
        hour24 = 0
      }
    }
    const timeString = `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    onChange?.(timeString)
  }

  // Format display value
  const displayValue = value
    ? (() => {
        const [h, m] = value.split(':').map(Number)
        if (use12Hour) {
          const hour12 = h % 12 || 12
          const ampm = h >= 12 ? 'PM' : 'AM'
          return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
        }
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      })()
    : ''

  const sizeClasses = {
    sm: 'h-9 text-14',
    md: 'h-11 text-14',
    lg: 'h-12 text-16',
  }

  const variantClasses = {
    default: 'border-gray-300 focus:border-brand-500 focus:ring-brand-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    fill: 'bg-gray-50 border-gray-300 focus:border-brand-500 focus:ring-brand-500',
  }

  return (
    <div className={cn('relative', className)} ref={popoverRef}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              type="text"
              value={displayValue}
              placeholder={placeholder}
              readOnly
              disabled={disabled}
              className={cn(
                sizeClasses[size],
                variantClasses[variant],
                'cursor-pointer pr-10',
                errorMessage && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              onClick={() => !disabled && setIsOpen(true)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Clock className={cn('w-4 h-4 text-gray-400', errorMessage && 'text-red-500')} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'w-auto p-0',
            isRTL ? 'text-right' : 'text-left'
          )}
          align={isRTL ? 'end' : 'start'}
        >
          <div className="p-4">
            {/* Time Display */}
            <div className="flex items-center justify-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <div className="text-32 font-bold text-gray-900 w-12 text-center">
                  {String(hours).padStart(2, '0')}
                </div>
                <span className="text-24 font-bold text-gray-900">:</span>
                <div className="text-32 font-bold text-gray-900 w-12 text-center">
                  {String(minutes).padStart(2, '0')}
                </div>
              </div>
              {use12Hour && (
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    type="button"
                    onClick={() => handleAmPmToggle()}
                    className={cn(
                      'px-3 py-1 rounded-lg text-12 font-semibold transition-colors',
                      amPm === 'AM'
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAmPmToggle()}
                    className={cn(
                      'px-3 py-1 rounded-lg text-12 font-semibold transition-colors',
                      amPm === 'PM'
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    PM
                  </button>
                </div>
              )}
            </div>

            {/* Hour Selection Grid */}
            <div className="mb-4">
              <label className="text-12 font-medium text-gray-500 mb-2 block">
                {use12Hour ? 'Hour' : 'Hour (24h)'}
              </label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {hourOptions.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleHourSelect(h)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-14 font-medium transition-colors',
                      hours === h
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {String(h).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Minute Selection Grid */}
            <div>
              <label className="text-12 font-medium text-gray-500 mb-2 block">Minute</label>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {minuteOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMinuteSelect(m)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-14 font-medium transition-colors',
                      minutes === m
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {String(m).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <p className="text-12 text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  )
}
