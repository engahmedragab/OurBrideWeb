'use client'

import { usePathname } from 'next/navigation'
import { PillTabs, type PillTabItem } from '../PillTabs'

export interface AuthTabsProps {
  className?: string
}

/**
 * AuthTabs - Auth-specific tabs component using PillTabs
 * Uses Next.js App Router for navigation
 */
export const AuthTabs = ({ className }: AuthTabsProps) => {
  const pathname = usePathname()
  const currentPath = pathname || ''

  const isLoginActive =
    currentPath === '/auth/login' || currentPath.startsWith('/auth/login')
  const activeValue = isLoginActive ? 'login' : 'signup'

  const tabs: PillTabItem[] = [
    {
      value: 'login',
      label: 'Login',
      href: '/auth/login',
    },
    {
      value: 'signup',
      label: 'Signup',
      href: '/auth/signup',
    },
  ]

  return (
    <div className="flex w-full justify-center">
      <PillTabs items={tabs} activeValue={activeValue} containerClassName={className} />
    </div>
  )
}
