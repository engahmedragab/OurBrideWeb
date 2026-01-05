'use client'

import React, { useMemo, useState } from 'react'

import { ItemListsSidebar } from '@/components/planning/items/ItemListsSidebar'
import { ItemLinesPanel } from '@/components/planning/items/ItemLinesPanel'
import type { ItemFormData } from '@/components/planning/items/ItemLinesPanel'
import { CreateItemListModal } from '@/components/planning/items/CreateItemListModal'
import type { ColorKey } from '@/components/planning/items/CreateItemListModal'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export type UiItem = {
  id: number
  title: string
  description?: string
  quantity?: number
  totalPrice?: number
  providerName?: string
  buyDate?: string
  categoryId: number
  categoryName: string
  isDone: boolean
  isDeleted?: boolean
}

export type UiCategory = {
  id: number
  name: string
  color?: string
}

const INITIAL_CATEGORIES: UiCategory[] = [
  { id: 0, name: 'Untitled List', color: 'gray' },
  { id: 1, name: 'Furniture', color: 'orange' },
  { id: 2, name: 'Home Appliances', color: 'blue' },
  { id: 3, name: 'Kitchen Appliances', color: 'green' },
  { id: 4, name: 'Kitchen Tools', color: 'purple' },
  { id: 5, name: 'Home Decor', color: 'red' },
]

const INITIAL_ITEMS: UiItem[] = [
  {
    id: 101,
    title: 'Refrigerator',
    description: 'No-frost 14ft refrigerator',
    quantity: 4,
    totalPrice: 44,
    providerName: '888',
    buyDate: '2026-02-05',
    categoryId: 0,
    categoryName: 'Untitled List',
    isDone: false,
  },
  {
    id: 102,
    title: '66',
    description: '66',
    quantity: 66,
    totalPrice: 66,
    providerName: '6',
    buyDate: '2026-01-14',
    categoryId: 0,
    categoryName: 'Untitled List',
    isDone: true,
  },
]

export default function ItemsPage() {
  const [items, setItems] = useState<UiItem[]>(INITIAL_ITEMS)
  const [categories, setCategories] = useState<UiCategory[]>(INITIAL_CATEGORIES)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    INITIAL_CATEGORIES[0]?.id ?? 0
  )
  const [createListOpen, setCreateListOpen] = useState(false)

  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId) ?? null
  }, [categories, selectedCategoryId])

  const visibleItems = useMemo(() => {
    return items.filter(
      i => !i.isDeleted && i.categoryId === selectedCategoryId
    )
  }, [items, selectedCategoryId])

  const stats = useMemo(() => {
    const total = visibleItems.length
    const completed = visibleItems.filter(i => i.isDone).length
    const remaining = total - completed
    return { total, completed, remaining }
  }, [visibleItems])

  const handleToggleDone = (itemId: number) => {
    setItems(prev =>
      prev.map(it => (it.id === itemId ? { ...it, isDone: !it.isDone } : it))
    )
  }

  const handleDeleteItem = (itemId: number) => {
    setItems(prev =>
      prev.map(it => (it.id === itemId ? { ...it, isDeleted: true } : it))
    )
  }

  const handleAddNewLine = async (data: ItemFormData) => {
    if (!selectedCategory) return

    setItems(prev => {
      const nextId = prev.length ? Math.max(...prev.map(i => i.id)) + 1 : 1

      const newItem: UiItem = {
        id: nextId,
        title: data.name,
        description: data.description,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        providerName: data.providerName,
        buyDate: data.buyDate,
        isDone: !!data.isDone,
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
      }

      return [newItem, ...prev]
    })
  }

  const handleEditItem = async (itemId: number, data: ItemFormData) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== itemId) return it
        return {
          ...it,
          title: data.name,
          description: data.description,
          quantity: data.quantity,
          totalPrice: data.totalPrice,
          providerName: data.providerName,
          buyDate: data.buyDate,
          isDone: !!data.isDone,
        }
      })
    )
  }

  const handleAddNewList = () => {
    setCreateListOpen(true)
  }

  const handleCreateList = async (data: { name: string; color: ColorKey }) => {
    const nextId = categories.length
      ? Math.max(...categories.map(c => c.id)) + 1
      : 0
    const newCategory: UiCategory = {
      id: nextId,
      name: data.name,
      color: data.color,
    }
    setCategories(prev => [newCategory, ...prev])
    setSelectedCategoryId(nextId)
    setCreateListOpen(false)
  }

  const handleDeleteList = (categoryId: number) => {
    console.log('Delete list', categoryId)
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-1">
        <Link
          href="/dashboard/my-events"
          className="inline-flex h-9 w-9 items-center justify-center"
          aria-label="Back to My Events"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </Link>

        <h1 className="text-xl font-semibold text-gray-900">Items</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ItemLinesPanel
          categoryName={selectedCategory?.name ?? 'Untitled List'}
          stats={stats}
          items={visibleItems}
          onToggleDone={handleToggleDone}
          onDeleteItem={handleDeleteItem}
          onAddNewLine={handleAddNewLine}
          onEditItem={handleEditItem}
        />

        <ItemListsSidebar
          title="Your Lists"
          actionLabel="Add New"
          onAction={handleAddNewList}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onDeleteCategory={handleDeleteList}
        />
      </div>

      <CreateItemListModal
        open={createListOpen}
        onClose={() => setCreateListOpen(false)}
        onSubmit={handleCreateList}
      />
    </div>
  )
}
