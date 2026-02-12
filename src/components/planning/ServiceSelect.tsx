'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { planningTypography } from './typography'
import { getServiceIcon, getServiceIconByClass } from '@/utils/serviceIconMapper'
import type { PlanningPreference } from '@/services/profile/profileApi'
import type { LucideIcon } from 'lucide-react'

type TranslationFunction = (key: string) => string

// Service option type for dropdown
export interface ServiceOption {
  serviceKey: string // Using preparation ID as key
  label: string
  Icon: LucideIcon | React.ComponentType<{ className?: string }>
  imageUrl?: string
}

// Legacy SERVICE_OPTIONS for backward compatibility (if needed)
export const SERVICE_OPTIONS: ServiceOption[] = []

export interface ServiceSelectProps {
  value: string // serviceKey (preparation ID as string)
  onChange: (serviceKey: string) => void
  required?: boolean
  services?: PlanningPreference[] // Dynamic services from API
  t?: TranslationFunction
}

export const ServiceSelect = ({
  value,
  onChange,
  required = false,
  services = [],
  t,
}: ServiceSelectProps) => {
  const defaultT = (key: string) => {
    if (key === 'fields.service') return 'Service'
    if (key === 'placeholders.selectService') return 'Select a service'
    return key
  }
  const translate = t || defaultT
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Map services from API to ServiceOption format
  const serviceOptions: ServiceOption[] = useMemo(() => {
    return services.map((service) => {
      // Priority: use serviceClass if available, otherwise use iconName, then fallback to service name
      let Icon
      if (service.class !== undefined && service.class !== null) {
        Icon = getServiceIconByClass(service.class)
      } else {
        const iconName = service.iconName || service.name || ''
        Icon = getServiceIcon(iconName)
      }

      return {
        serviceKey: String(service.id), // Use preparation ID as serviceKey
        label: service.nameEn || service.nameAr || service.name || 'Unknown',
        Icon,
        imageUrl: service.imageUrl,
      }
    })
  }, [services])

  const selectedService = serviceOptions.find(s => s.serviceKey === value)

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
            const next = prev < serviceOptions.length - 1 ? prev + 1 : 0
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
            const next = prev > 0 ? prev - 1 : serviceOptions.length - 1
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
          if (focusedIndex >= 0 && focusedIndex < serviceOptions.length) {
            onChange(serviceOptions[focusedIndex].serviceKey)
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
  }, [isOpen, focusedIndex, onChange, serviceOptions])

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
        {translate('fields.service')} {required && <span className="text-red-500">*</span>}
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
                {selectedService.imageUrl ? (
                  <img
                    src={selectedService.imageUrl}
                    alt={selectedService.label}
                    className="h-5 w-5 object-contain"
                  />
                ) : (
                  <selectedService.Icon className="h-5 w-5 text-primary" />
                )}
              </div>
              <span className="text-gray-900 truncate">{selectedService.label}</span>
            </>
          ) : (
            <span className="text-gray-400">{translate('placeholders.selectService')}</span>
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
      {isOpen && serviceOptions.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-auto focus:outline-none"
        >
          {serviceOptions.map((service, index) => {
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
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.label}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <service.Icon className="h-5 w-5 text-primary" />
                  )}
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
