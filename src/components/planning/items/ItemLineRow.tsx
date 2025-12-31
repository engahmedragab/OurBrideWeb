'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { UiItem } from '@/app/events/planning/items/page'
import { CheckCircle2, Circle, Trash2 } from 'lucide-react'

export function ItemLineRow({
  item,
  onToggleDone,
  onDelete,
}: {
  item: UiItem
  onToggleDone: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-white p-4">
      <button
        type="button"
        onClick={onToggleDone}
        className="mt-0.5 rounded-full p-1 hover:bg-gray-100"
        aria-label="Toggle done"
      >
        {item.isDone ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className={cn('text-sm font-medium', item.isDone && 'line-through text-gray-400')}>
          {item.title}
        </div>

        {item.description ? (
          <div className="mt-1 line-clamp-2 text-xs text-gray-500">{item.description}</div>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          {item.dueDate ? <span>Due : {item.dueDate}</span> : null}
          {item.dueTime ? <span>{item.dueTime}</span> : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            item.isDone ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700',
          )}
        >
          {item.isDone ? 'Completed' : 'Pending'}
        </span>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Delete item"
        >
          <Trash2 className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}
