'use client'

import { ReactNode } from 'react'

export interface SectionHeaderProps {
  title: string
  count?: number
  suffix?: string
  rightContent?: ReactNode
  className?: string
}

export const SectionHeader = ({
  title,
  count,
  suffix,
  rightContent,
  className,
}: SectionHeaderProps) => {
  return (
    <div
      className={`flex items-center justify-between mb-8 ${className || ''}`}
    >
      <div>
        <h2 className="text-32 font-semibold text-gray-900">{title}</h2>
        {count !== undefined && suffix && (
          <p className="text-16 text-gray-600 mt-2">
            {count} {suffix}
          </p>
        )}
      </div>
      {rightContent && <div>{rightContent}</div>}
      {count !== undefined && !suffix && !rightContent && (
        <p className="text-16 text-gray-600">{count}</p>
      )}
    </div>
  )
}
