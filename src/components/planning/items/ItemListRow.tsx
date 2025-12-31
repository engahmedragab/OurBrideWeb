'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, Trash2 } from 'lucide-react'
import type { UiCategory } from '@/app/events/planning/items/page'

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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border px-3 py-3 text-left transition hover:bg-gray-50',
        active ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-gray-900">{category.name}</div>
        </div>

        <div className="flex items-center gap-1">
          {onDelete ? (
            <span
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete()
              }}
              className="rounded-md p-2 hover:bg-gray-100"
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
