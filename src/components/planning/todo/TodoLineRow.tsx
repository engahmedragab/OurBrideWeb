'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { UiTodo } from '@/app/events/planning/todo/page'
import { CheckCircle2, Circle, Trash2 } from 'lucide-react'

export function TodoLineRow({
  todo,
  onToggleDone,
  onDelete,
  onEdit,
}: {
  todo: UiTodo
  onToggleDone: () => void
  onDelete: () => void
  onEdit: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onEdit()
        onToggleDone()
      }}
      className={cn(
        'flex items-center gap-3 rounded-xl border bg-white p-4 transition hover:bg-gray-50'
      )}
    >
      {/* Toggle Done (الدائرة) */}
      <button
        type="button"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          onToggleDone()
        }}
        className=" rounded-full p-1 hover:bg-gray-100"
        aria-label="Toggle done"
      >
        {todo.isDone ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1 flex items-center">
        <div
          className={cn(
            'text-sm font-medium text-gray-900 ',
            todo.isDone && 'line-through text-gray-400'
          )}
        >
          {todo.title}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            todo.isDone
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-100 text-gray-700'
          )}
        >
          {todo.isDone ? 'Completed' : 'Pending'}
        </span>

        <button
          type="button"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Delete todo"
        >
          <Trash2 className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}
