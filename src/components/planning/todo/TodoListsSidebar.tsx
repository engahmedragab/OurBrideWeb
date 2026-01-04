'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { UiTodoCategory } from '@/app/events/planning/todo/page'
import { TodoListRow } from '@/components/planning/todo/TodoListRow'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function TodoListsSidebar({
  className,
  title,
  actionLabel,
  onAction,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onDeleteCategory,
}: {
  className?: string
  title: string
  actionLabel: string
  onAction: () => void
  categories: UiTodoCategory[]
  selectedCategoryId: number
  onSelectCategory: (id: number) => void
  onDeleteCategory?: (id: number) => void
}) {
  return (
    <aside className={cn('rounded-xl border bg-white p-4', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>

        <Button
          variant="ghost"
          onClick={onAction}
          className="h-9 rounded-xl px-3 text-xs text-primary
            hover:text-white hover:bg-brand-500"
        >
          <Plus className="mr-1 h-4 w-4" />
          {actionLabel}
        </Button>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <TodoListRow
            key={cat.id}
            category={cat}
            active={cat.id === selectedCategoryId}
            onClick={() => onSelectCategory(cat.id)}
            onDelete={
              onDeleteCategory
                ? () => {
                    onDeleteCategory(cat.id)
                  }
                : undefined
            }
          />
        ))}
      </div>
    </aside>
  )
}
