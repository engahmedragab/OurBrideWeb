'use client'

import React, { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { UiItem } from '@/utils/planning/mappers/itemsMappers'
import { ItemLineRow } from './ItemLineRow'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CreateItemModal } from '@/components/planning/items/CreateItemModal'
import { EditItemModal } from '@/components/planning/items/EditItemModal'
import { ItemsSummaryCard } from '@/components/planning/items/ItemsSummaryCard'
import { useI18nTranslations, useIsRTL } from '@/i18n'

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
  const t = useI18nTranslations('items')
  const isRtl =  useIsRTL()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)

  const editingItem = useMemo(() => {
    if (editingItemId == null) return null
    return items.find((i) => i.id === editingItemId) ?? null
  }, [items, editingItemId])

  return (
    <section className={cn('rounded-xl border bg-white p-4', className)}>
      {/* Summary Card */}
      <ItemsSummaryCard
        title={categoryName}
        total={stats.total}
        completed={stats.completed}
        rightSlot={
          <Button
            variant="ghost"
            onClick={() => setCreateOpen(true)}
            className="h-9 rounded-xl px-3 text-xs text-primary hover:bg-gray-100"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t('actions.addNew')}
          </Button>
        }
      />

      {/* Items List */}
      <div className="mt-4 space-y-3">
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
            {t('lists.noItems')}
          </div>
        ) : null}
      </div>

      {/* Create Modal */}
      <CreateItemModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (data) => {
          await onAddNewLine(data)
          setCreateOpen(false)
        }}
      />

      {/* Edit Modal */}
      <EditItemModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setEditingItemId(null)
        }}
        initialValues={
          editingItem
            ? {
                name: isRtl ?  editingItem.nameAr : editingItem.nameEn,
                description: isRtl ? (editingItem.descriptionAr || undefined) :  (editingItem.descriptionEn || undefined),
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
