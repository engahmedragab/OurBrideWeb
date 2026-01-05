'use client'

import { cn } from '@/lib/utils'
import { argbToHex } from '@/utils/iconUtils'

// Color palette options with ARGB format (backend format)
// Format: "0xffRRGGBB" where RR, GG, BB are hex values
export const COLOR_OPTIONS = [
  { argb: '0xff22C55E', hex: '#22C55E', label: 'Green' },
  { argb: '0xffEAB308', hex: '#EAB308', label: 'Yellow' },
  { argb: '0xff3B82F6', hex: '#3B82F6', label: 'Blue' },
  { argb: '0xffEF4444', hex: '#EF4444', label: 'Red' },
  { argb: '0xff8B5CF6', hex: '#8B5CF6', label: 'Purple' },
  { argb: '0xffF97316', hex: '#F97316', label: 'Orange' },
  { argb: '0xffEC4899', hex: '#EC4899', label: 'Pink' },
  { argb: '0xff06B6D4', hex: '#06B6D4', label: 'Cyan' },
]

interface ColorPickerProps {
  value: string | null // ARGB format like "0xff8e8e8e"
  onChange: (colorName: string | null) => void // Returns ARGB format
  className?: string
}

export const ColorPicker = ({
  value,
  onChange,
  className,
}: ColorPickerProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="grid grid-cols-4 gap-3">
        {COLOR_OPTIONS.map(color => {
          // Compare ARGB values
          const isSelected = value === color.argb
          return (
            <button
              key={color.argb}
              type="button"
              onClick={() => onChange(color.argb)} // Return ARGB format
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg transition-all',
                'hover:bg-gray-50',
                isSelected && 'bg-brand-50 ring-2 ring-brand-500'
              )}
              aria-label={`Select ${color.label} color`}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full border-2 transition-all',
                  isSelected ? 'border-gray-900' : 'border-gray-300'
                )}
                style={{ backgroundColor: color.hex }}
              />
              <span
                className={cn(
                  'text-12 font-medium',
                  isSelected ? 'text-brand-500' : 'text-gray-600'
                )}
              >
                {color.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
