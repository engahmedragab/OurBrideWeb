'use client'

import React, { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, ChevronLeft } from 'lucide-react'

import { TodoLinesPanel } from '@/components/planning/todo/TodoLinesPanel'
import { TodoListsSidebar } from '@/components/planning/todo/TodoListsSidebar'
import { CreateItemListModal } from '@/components/planning/items/CreateItemListModal'
import type { ColorKey } from '@/components/planning/items/CreateItemListModal'

export type UiTodo = {
  id: number
  title: string
  isDone: boolean
  isDeleted?: boolean
  categoryId: number
  categoryName: string
}

export type UiTodoCategory = {
  id: number
  name: string
  color?: string
}

const INITIAL_CATEGORIES: UiTodoCategory[] = [
  { id: 0, name: 'Untitled List', color: 'gray' },
  { id: 1, name: 'Home', color: 'blue' },
  { id: 2, name: 'Work', color: 'orange' },
]

const INITIAL_TODOS: UiTodo[] = [
  { id: 1, title: 'Buy milk', isDone: false, categoryId: 0, categoryName: 'Untitled List' },
  { id: 2, title: 'Call the provider', isDone: true, categoryId: 0, categoryName: 'Untitled List' },
]

export default function TodoPage() {
  const [todos, setTodos] = useState<UiTodo[]>(INITIAL_TODOS)
  const [categories, setCategories] = useState<UiTodoCategory[]>(INITIAL_CATEGORIES)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(INITIAL_CATEGORIES[0]?.id ?? 0)

  const [createListOpen, setCreateListOpen] = useState(false)

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) ?? null
  }, [categories, selectedCategoryId])

  const visibleTodos = useMemo(() => {
    return todos.filter((t) => !t.isDeleted && t.categoryId === selectedCategoryId)
  }, [todos, selectedCategoryId])

  const stats = useMemo(() => {
    const total = visibleTodos.length
    const completed = visibleTodos.filter((t) => t.isDone).length
    const pending = total - completed
    return { total, completed, pending }
  }, [visibleTodos])

  const handleToggleDone = (todoId: number) => {
    setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, isDone: !t.isDone } : t)))
  }

  const handleDeleteTodo = (todoId: number) => {
    setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, isDeleted: true } : t)))
  }

  const handleCreateTodo = async (data: { title: string; isDone?: boolean }) => {
    if (!selectedCategory) return
    setTodos((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1
      const newTodo: UiTodo = {
        id: nextId,
        title: data.title,
        isDone: Boolean(data.isDone),
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
      }
      return [newTodo, ...prev]
    })
  }

  const handleEditTodo = async (todoId: number, data: { title: string; isDone?: boolean }) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== todoId) return t
        return { ...t, title: data.title, isDone: Boolean(data.isDone) }
      }),
    )
  }

  const handleAddNewList = () => setCreateListOpen(true)

  const handleCreateList = async (data: { name: string; color: ColorKey }) => {
    const nextId = categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 0
    const newCategory: UiTodoCategory = { id: nextId, name: data.name, color: data.color }

    setCategories((prev) => [newCategory, ...prev])
    setSelectedCategoryId(nextId)
    setCreateListOpen(false)
  }

  const handleDeleteList = (categoryId: number) => {
    console.log('Delete todo list', categoryId)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center gap-1">
        <Link
          href="/dashboard/my-events"
          className="inline-flex h-9 w-9 items-center justify-center"
          aria-label="Back to My Events"
        >
        <ChevronLeft className="w-5 h-5 text-gray-700" />

        </Link>

        <h1 className="text-xl font-semibold text-gray-900">Todo</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <TodoLinesPanel
          categoryName={selectedCategory?.name ?? 'Untitled List'}
          stats={stats}
          todos={visibleTodos}
          onToggleDone={handleToggleDone}
          onDeleteTodo={handleDeleteTodo}
          onCreateTodo={handleCreateTodo}
          onEditTodo={handleEditTodo}
        />

        <TodoListsSidebar
          title="Your Lists"
          actionLabel="Add New"
          onAction={handleAddNewList}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onDeleteCategory={handleDeleteList}
        />
      </div>

      {/* نفس مودال إنشاء الليست بتاع items (Reusable) */}
      <CreateItemListModal
        open={createListOpen}
        onClose={() => setCreateListOpen(false)}
        onSubmit={handleCreateList}
      />
    </div>
  )
}
