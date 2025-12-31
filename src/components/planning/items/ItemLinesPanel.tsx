'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { UiItem } from '@/app/events/planning/items/page'
import { ItemLineRow } from './ItemLineRow'
import { AddNewLineCard } from './AddNewLineCard'

export function ItemLinesPanel({
  className,
  categoryName,
  stats,
  items,
  onToggleDone,
  onDeleteItem,
  onAddNewLine,
}: {
  className?: string
  categoryName: string
  stats: { total: number; completed: number; remaining: number }
  items: UiItem[]
  onToggleDone: (id: number) => void
  onDeleteItem: (id: number) => void
  onAddNewLine: () => void
}) {
  return (
    <section className={cn('rounded-xl border bg-white p-4', className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{categoryName}</h2>
        <div className="mt-1 text-xs text-gray-500">
          {stats.total} items • {stats.completed} completed • {stats.remaining} remaining
        </div>
      </div>

      <div className="space-y-3">
        {/* ✅ مساحة إضافة line جديدة */}
        <AddNewLineCard onClick={onAddNewLine} />

        {items.map((it) => (
          <ItemLineRow
            key={it.id}
            item={it}
            onToggleDone={() => onToggleDone(it.id)}
            onDelete={() => onDeleteItem(it.id)}
          />
        ))}

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
            No items in this list yet.
          </div>
        ) : null}
      </div>
    </section>
  )
}
