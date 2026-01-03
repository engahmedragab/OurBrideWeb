'use client'

import React, { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { UiItem } from '@/app/events/planning/items/page'
import { ItemLineRow } from './ItemLineRow'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CreateItemModal } from '@/components/planning/items/CreateItemModal'
import { EditItemModal } from '@/components/planning/items/EditItemModal'

export type ItemFormData = {
  name: string
  description?: string
  quantity?: number
  totalPrice?: number
  providerName?: string
  buyDate?: string
  isDone?: boolean
}

export function ItemLinesPanel({
  className,
  categoryName,
  stats,
  items,
  onToggleDone,
  onDeleteItem,
  onAddNewLine,
  onEditItem,
}: {
  className?: string
  categoryName: string
  stats: { total: number; completed: number; remaining: number }
  items: UiItem[]
  onToggleDone: (id: number) => void
  onDeleteItem: (id: number) => void
  onAddNewLine: (data: ItemFormData) => Promise<void> | void
  onEditItem: (itemId: number, data: ItemFormData) => Promise<void> | void
}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)

  const editingItem = useMemo(() => {
    if (editingItemId == null) return null
    return items.find((i) => i.id === editingItemId) ?? null
  }, [items, editingItemId])

  return (
    <section className={cn('rounded-xl border bg-white p-4', className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{categoryName}</h2>
          <div className="mt-1 text-xs text-gray-500">
            {stats.total} items • {stats.completed} completed • {stats.remaining} remaining
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          className="h-9 rounded-xl px-3 text-xs text-primary hover:bg-gray-100"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add new item
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <ItemLineRow
            key={it.id}
            item={it}
            onToggleDone={() => onToggleDone(it.id)}
            onDelete={() => onDeleteItem(it.id)}
            onEdit={() => {
              setEditingItemId(it.id)
              setEditOpen(true)
            }}
          />
        ))}

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
            No items in this list yet.
          </div>
        ) : null}
      </div>

      <CreateItemModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (data) => {
          await onAddNewLine(data)
          setCreateOpen(false)
        }}
      />

      <EditItemModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setEditingItemId(null)
        }}
        initialValues={
          editingItem
            ? {
                name: editingItem.title,
                description: editingItem.description,
                quantity: editingItem.quantity,
                totalPrice: editingItem.totalPrice,
                providerName: editingItem.providerName,
                buyDate: editingItem.buyDate,
                isDone: editingItem.isDone,
              }
            : null
        }
        onSubmit={async (data) => {
          if (editingItemId == null) return
          await onEditItem(editingItemId, data)
          setEditOpen(false)
          setEditingItemId(null)
        }}
      />
    </section>
  )
}
