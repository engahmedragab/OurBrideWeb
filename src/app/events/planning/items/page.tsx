'use client'

import React, { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { ItemListsSidebar } from '@/components/planning/items/ItemListsSidebar'
import { ItemLinesPanel } from '@/components/planning/items/ItemLinesPanel'

export type UiItem = {
  id: number
  title: string
  description?: string
  dueDate?: string
  dueTime?: string
  categoryId: number
  categoryName: string
  isDone: boolean
  isDeleted?: boolean
  price?: number
  paid?: number
}

export type UiCategory = {
  id: number
  name: string
}

const INITIAL_CATEGORIES: UiCategory[] = [
  { id: 0, name: 'Untitled List' },
  { id: 1, name: 'Furniture' },
  { id: 2, name: 'Home Appliances' },
  { id: 3, name: 'Kitchen Appliances' },
  { id: 4, name: 'Kitchen Tools' },
  { id: 5, name: 'Home Decor' },
]

const INITIAL_ITEMS: UiItem[] = [
  {
    id: 101,
    title: 'Refrigerator',
    description: 'No-frost 14ft refrigerator',
    dueDate: '12/12/2025',
    dueTime: '4:00 PM',
    categoryId: 2,
    categoryName: 'Home Appliances',
    isDone: false,
  },
  {
    id: 102,
    title: 'Washing Machine',
    description: 'Automatic front-load washing machine',
    dueDate: '12/12/2025',
    dueTime: '4:00 PM',
    categoryId: 2,
    categoryName: 'Home Appliances',
    isDone: true,
  },
]

export default function ItemsPage() {
  const [items, setItems] = useState<UiItem[]>(INITIAL_ITEMS)
  const [categories] = useState<UiCategory[]>(INITIAL_CATEGORIES)

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(categories[0]?.id ?? 0)

  const visibleItems = useMemo(() => {
    return items.filter((i) => !i.isDeleted && i.categoryId === selectedCategoryId)
  }, [items, selectedCategoryId])

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) ?? null
  }, [categories, selectedCategoryId])

  const stats = useMemo(() => {
    const total = visibleItems.length
    const completed = visibleItems.filter((i) => i.isDone).length
    const remaining = total - completed
    return { total, completed, remaining }
  }, [visibleItems])

  const handleToggleDone = (itemId: number) => {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, isDone: !it.isDone } : it)))
  }

  const handleDeleteItem = (itemId: number) => {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, isDeleted: true } : it)))
  }

  const handleAddNewList = () => {
    console.log('Add new list')
  }

  const handleDeleteList = (categoryId: number) => {
    console.log('Delete list', categoryId)
  }

  const handleAddNewLine = () => {
    console.log('Add new line')
  }

  return (
    <div className="w-full">
      {/* Header (بدون زرار Add New الكبير) */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Items</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* MAIN (left) */}
        <ItemLinesPanel
          categoryName={selectedCategory?.name ?? 'Untitled List'}
          stats={stats}
          items={visibleItems}
          onToggleDone={handleToggleDone}
          onDeleteItem={handleDeleteItem}
          onAddNewLine={handleAddNewLine}
        />

        {/* SIDEBAR (right) */}
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
    </div>
  )
}
