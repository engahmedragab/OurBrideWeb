'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { planningTypography } from './typography'
import { WeddingDressIcon } from '@/assets/icons/WeddingDressIcon'
import { WeddingHallIcon } from '@/assets/icons/WeddingHallIcon'
import { PhotographyIcon } from '@/assets/icons/PhotographyIcon'
import { BridalBeautyIcon } from '@/assets/icons/BridalBeautyIcon'
import { WeddingCakeIcon } from '@/assets/icons/WeddingCakeIcon'
import { BouquetIcon } from '@/assets/icons/BouquetIcon'
import { WeddingSuitIcon } from '@/assets/icons/WeddingSuitIcon'
import { AccessoriesIcon } from '@/assets/icons/AccessoriesIcon'

// Service options with icons - single source of truth
export const SERVICE_OPTIONS = [
  { serviceKey: 'weddingDress', label: 'Wedding Dress', Icon: WeddingDressIcon },
  { serviceKey: 'weddingHall', label: 'Wedding Hall', Icon: WeddingHallIcon },
  { serviceKey: 'photography', label: 'Photography', Icon: PhotographyIcon },
  { serviceKey: 'bridalBeauty', label: 'Bridal Beauty', Icon: BridalBeautyIcon },
  { serviceKey: 'weddingCake', label: 'Wedding Cake', Icon: WeddingCakeIcon },
  { serviceKey: 'bouquet', label: 'Bouquet', Icon: BouquetIcon },
  { serviceKey: 'weddingSuit', label: 'Wedding Suit', Icon: WeddingSuitIcon },
  { serviceKey: 'accessories', label: 'Accessories', Icon: AccessoriesIcon },
] as const

export interface ServiceSelectProps {
  value: string
  onChange: (serviceKey: string) => void
  required?: boolean
}

export const ServiceSelect = ({
  value,
  onChange,
  required = false,
}: ServiceSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedService = SERVICE_OPTIONS.find(s => s.serviceKey === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => {
            const next = prev < SERVICE_OPTIONS.length - 1 ? prev + 1 : 0
            // Scroll into view
            if (listRef.current) {
              const items = listRef.current.children
              if (items[next]) {
                items[next].scrollIntoView({ block: 'nearest' })
              }
            }
            return next
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => {
            const next = prev > 0 ? prev - 1 : SERVICE_OPTIONS.length - 1
            // Scroll into view
            if (listRef.current) {
              const items = listRef.current.children
              if (items[next]) {
                items[next].scrollIntoView({ block: 'nearest' })
              }
            }
            return next
          })
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < SERVICE_OPTIONS.length) {
            onChange(SERVICE_OPTIONS[focusedIndex].serviceKey)
            setIsOpen(false)
            setFocusedIndex(-1)
            buttonRef.current?.focus()
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setFocusedIndex(-1)
          buttonRef.current?.focus()
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, focusedIndex, onChange])

  const handleSelect = (serviceKey: string) => {
    onChange(serviceKey)
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label
        className={cn(
          'block',
          planningTypography.secondary,
          'font-medium text-gray-700 mb-2'
        )}
      >
        Service {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        ref={buttonRef}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
        className={cn(
          'flex w-full h-11 items-center justify-between rounded-xl border bg-white px-4 text-16 font-normal leading-6 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
          'hover:border-brand-500',
          isOpen ? 'border-brand-500' : 'border-gray-300',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedService ? (
            <>
              <div className="flex-shrink-0">
                <selectedService.Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-gray-900 truncate">{selectedService.label}</span>
            </>
          ) : (
            <span className="text-gray-400">Select a service</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-400 flex-shrink-0 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-auto focus:outline-none"
        >
          {SERVICE_OPTIONS.map((service, index) => {
            const isSelected = service.serviceKey === value
            const isFocused = index === focusedIndex

            return (
              <li
                key={service.serviceKey}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(service.serviceKey)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                  'hover:bg-gray-50',
                  isFocused && 'bg-gray-50',
                  isSelected && 'bg-brand-50'
                )}
              >
                <div className="flex-shrink-0">
                  <service.Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-gray-900 text-16 font-normal leading-6 flex-1">
                  {service.label}
                </span>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-brand-500" />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
