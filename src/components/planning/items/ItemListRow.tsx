'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, Trash2 } from 'lucide-react'
import type { UiCategory } from '@/app/events/planning/items/page'

const STYLE_BY_COLOR: Record<
  string,
  { bg: string; border: string }
> = {
  gray: { bg: 'bg-gray-50', border: 'border-gray-200' },
  red: { bg: 'bg-red-50', border: 'border-red-200' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200' },
  green: { bg: 'bg-green-50', border: 'border-green-200' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200' },
}

export function ItemListRow({
  category,
  active,
  onClick,
  onDelete,
}: {
  category: UiCategory
  active?: boolean
  onClick?: () => void
  onDelete?: () => void
}) {
  const colorKey = category.color ?? 'gray'
  const style = STYLE_BY_COLOR[colorKey] ?? STYLE_BY_COLOR.gray

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border px-3 py-3 text-left transition',
        style.bg,
        style.border,

        // تفاعل خفيف جدًا
        'hover:brightness-[0.98] focus:outline-none',

        // active بدون border تقيل
        active ? 'brightness-[0.97]' : '',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-gray-900">
            {category.name}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onDelete ? (
            <span
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete()
              }}
              className="rounded-md p-2 hover:bg-white/60"
              role="button"
              aria-label="Delete list"
            >
              <Trash2 className="h-4 w-4 text-primary" />
            </span>
          ) : null}

          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </button>
  )
}
