'use client'

import { usePathname } from '@/i18n/navigation'
import { PillTabs, type PillTabItem } from '../PillTabs'

export interface AuthTabsProps {
  className?: string
}

/**
 * AuthTabs - Auth-specific tabs component using PillTabs
 * Uses locale-aware navigation for i18n support
 */
export const AuthTabs = ({ className }: AuthTabsProps) => {
  const pathname = usePathname()
  const currentPath = pathname || ''

  // Check if current path is login (handles both /auth/login and /en/auth/login, /ar/auth/login)
  // Remove locale prefix if present for comparison
  const pathWithoutLocale = currentPath.replace(/^\/(en|ar)/, '') || currentPath
  const isLoginActive =
    pathWithoutLocale === '/auth/login' || pathWithoutLocale.startsWith('/auth/login')
  const activeValue = isLoginActive ? 'login' : 'signup'

  const tabs: PillTabItem[] = [
    {
      value: 'login',
      label: 'Login',
      href: '/auth/login', // Locale will be added automatically by PillTabs if it uses Link
    },
    {
      value: 'signup',
      label: 'Signup',
      href: '/auth/signup', // Locale will be added automatically by PillTabs if it uses Link
    },
  ]

  return (
    <div className="flex w-full justify-center">
      <PillTabs
        items={tabs}
        activeValue={activeValue}
        containerClassName={className}
      />
    </div>
  )
}
