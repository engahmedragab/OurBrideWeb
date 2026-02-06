'use client'

import type { MouseEvent } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { useI18nTranslations } from '@/i18n/hooks'

export type PlanningSideMenuTab = {
    label: string
    href: string
    value: string
    needsInit?: boolean
    icon?: LucideIcon
}

export interface PlanningSideMenuProps {
    tabs: PlanningSideMenuTab[]
    activeValue: string
    onTabClick?: (tab: PlanningSideMenuTab, event: MouseEvent<HTMLAnchorElement>) => void
    isInitializingTab?: string | null
    showIndicators?: boolean
    className?: string
}

export const PlanningSideMenu = ({
    tabs,
    activeValue,
    onTabClick,
    isInitializingTab = null,
    showIndicators = true,
    className,
}: PlanningSideMenuProps) => {
  const tSideMenu = useI18nTranslations('eventsPlanning.sideMenu')
  const tTabs = useI18nTranslations('eventsPlanning.sideMenu.tabs')
  const tStatus = useI18nTranslations('eventsPlanning.sideMenu.status')

  return (
    <div className={cn('bg-white rounded-2xl p-2 lg:border lg:border-gray-200 lg:shadow-sm', className)}>
      <div className="hidden lg:block px-3 py-2 text-12 font-semibold text-gray-500 uppercase tracking-wide">
        {tSideMenu('title')}
      </div>

      <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-col lg:items-stretch lg:gap-1">
        {tabs.map(tab => {
          const isActive = activeValue === tab.value
          const isLoading = isInitializingTab === tab.value
          const needsInit = tab.needsInit === true

          return (
            <Link
              key={tab.value}
              href={tab.href}
              onClick={(event) => onTabClick?.(tab, event)}
              className={cn(
                'flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold transition-colors',
                'whitespace-nowrap',
                'lg:shrink-0 lg:flex-row lg:items-center lg:justify-between lg:gap-2 lg:px-3 md:text-14 lg:font-medium',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                isActive ? ' text-brand-500' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-2 min-w-0 justify-center lg:flex-1 lg:justify-start">
                {tab.icon && (
                  <tab.icon
                    className={cn(
                      'hidden lg:block w-4 h-4 flex-shrink-0',
                      isActive ? 'text-brand-600' : 'text-gray-500'
                    )}
                  />
                )}
                
                <span className="whitespace-nowrap capitalize text-center lg:text-left lg:truncate">{tTabs(tab.label)}</span>
              </div>

              {showIndicators && (
                <span className="flex items-center gap-1 h-4 lg:h-auto lg:ml-2">
                  {isLoading && (
                    <span
                      className={cn(
                        'inline-flex items-center justify-center',
                        'h-3 w-3 rounded-full lg:h-4 lg:w-4',
                        'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
                        'relative'
                      )}
                      title={tStatus('initializing')}
                    >
                      <span className="absolute inset-0 rounded-full bg-blue-200/60 animate-ping" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                    </span>
                  )}

                  {!isLoading && needsInit && (
                    <span
                      className={cn(
                        'inline-flex items-center justify-center',
                        'h-3 w-3 rounded-full lg:h-4 lg:w-4',
                        'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
                        'relative'
                      )}
                      title={tStatus('needsInit')}
                    >
                      <span className="absolute inset-0 rounded-full bg-yellow-200/60 animate-ping" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-yellow-600" />
                    </span>
                  )}

                  {!isLoading && !needsInit && tab.value !== 'overview' && (
                    <span
                      className={cn(
                        'inline-flex items-center justify-center',
                        'h-3 w-3 rounded-full lg:h-4 lg:w-4',
                        'bg-green-100 text-green-700 ring-1 ring-green-200'
                      )}
                      title={tStatus('ready')}
                    >
                      <span className="text-[10px] leading-none">✓</span>
                    </span>
                  )}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
