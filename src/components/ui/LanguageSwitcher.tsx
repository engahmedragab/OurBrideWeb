'use client'

import { useEffect, useState } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useI18nLocale } from '@/i18n'
import { SelectPopover } from './SelectPopover'
import { Button } from './Button'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Locale } from '@/i18n/config'

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
] as const

export interface LanguageSwitcherProps {
  variant?: 'icon' | 'dropdown'
  className?: string
}

/**
 * LanguageSwitcher Component
 * Allows users to switch between supported languages
 * Automatically updates direction (RTL/LTR) when language changes
 */
export function LanguageSwitcher({ variant = 'dropdown', className }: LanguageSwitcherProps) {
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const currentLocale = useI18nLocale()

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLanguageChange = (newLocale: string) => {
    // Construct the new URL with the new locale prefix
    // pathname from usePathname() doesn't include the locale prefix
    const newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`
    
    // Use window.location to navigate to the new locale path
    // This will trigger the middleware to handle locale switching and direction change
    if (typeof window !== 'undefined') {
      window.location.href = newPath
    }
  }

  // Return null during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  if (variant === 'icon') {
    // Find the other locale
    const otherLocale = currentLocale === 'ar' ? 'en' : 'ar'
    const otherLanguage = languageOptions.find(opt => opt.value === otherLocale)

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleLanguageChange(otherLocale)}
        className={cn(
          'relative rounded-full border-0 bg-transparent',
          'transition-colors duration-150',
          'hover:bg-brand-50/50',
          'focus:outline-none',
          className
        )}
        aria-label={`Switch to ${otherLanguage?.label || 'other language'}`}
        title={`Switch to ${otherLanguage?.label || 'other language'}`}
      >
        <Globe className="h-5 w-5 text-brand-500" />
      </Button>
    )
  }

  return (
    <div className={className}>
      <SelectPopover
        value={currentLocale}
        onChange={handleLanguageChange}
        options={languageOptions.map(opt => ({
          value: opt.value,
          label: opt.label,
        }))}
        placeholder="Select Language"
        className=""
        optionClassName="hover:bg-transparent hover:text-brand-500 hover:bg-brand-50/50"
        selectedOptionClassName="bg-transparent text-brand-500"
        selectedIconClassName="text-brand-500"
      />
    </div>
  )
}
