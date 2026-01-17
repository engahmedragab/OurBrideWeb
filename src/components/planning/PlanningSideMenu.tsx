'use client'

import type { MouseEvent } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import {
    LayoutDashboard,
    Wallet,
    Package,
    Calendar,
    Mail,
    Sparkles,
    CheckSquare,
    FileText,
} from 'lucide-react'

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
    return (
        <div className={cn('bg-white border border-gray-200 rounded-2xl p-2 shadow-sm', className)}>
            <div className="px-3 py-2 text-12 font-semibold text-gray-500 uppercase tracking-wide">
                Planning
            </div>
            <div className="flex flex-col gap-1">
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
                                'flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-14 font-medium transition-colors',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                                isActive
                                    ? 'bg-brand-50 text-brand-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            )}
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                {tab.icon && (
                                    <tab.icon
                                        className={cn(
                                            'w-4 h-4 flex-shrink-0',
                                            isActive ? 'text-brand-600' : 'text-gray-500'
                                        )}
                                    />
                                )}
                                <span className="truncate capitalize">{tab.label}</span>
                            </div>
                            {showIndicators && (
                                <span className="flex items-center gap-1">
                                    {isLoading && (
                                        <span
                                            className={cn(
                                                'inline-flex items-center justify-center',
                                                'h-4 w-4 rounded-full',
                                                'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
                                                'relative'
                                            )}
                                            title="Initializing..."
                                        >
                                            <span className="absolute inset-0 rounded-full bg-blue-200/60 animate-ping" />
                                            <span className="relative h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                                        </span>
                                    )}
                                    {!isLoading && needsInit && (
                                        <span
                                            className={cn(
                                                'inline-flex items-center justify-center',
                                                'h-4 w-4 rounded-full',
                                                'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
                                                'relative'
                                            )}
                                            title="Needs init"
                                        >
                                            <span className="absolute inset-0 rounded-full bg-yellow-200/60 animate-ping" />
                                            <span className="relative h-1.5 w-1.5 rounded-full bg-yellow-600" />
                                        </span>
                                    )}
                                    {!isLoading && !needsInit && tab.value !== 'overview' && (
                                        <span
                                            className={cn(
                                                'inline-flex items-center justify-center',
                                                'h-4 w-4 rounded-full',
                                                'bg-green-100 text-green-700 ring-1 ring-green-200'
                                            )}
                                            title="Ready"
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
