'use client'

import React, { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { UiTodo } from '@/app/[locale]/events/planning/todo/page'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'

import { TodoLineRow } from '@/components/planning/todo/TodoLineRow'
import { CreateTodoModal } from '@/components/planning/todo/CreateTodoModal'
import { EditTodoModal } from '@/components/planning/todo/EditTodoModal'

export function TodoLinesPanel({
  className,
  categoryName,
  stats,
  todos,
  onToggleDone,
  onDeleteTodo,
  onCreateTodo,
  onEditTodo,
}: {
  className?: string
  categoryName: string
  stats: { total: number; completed: number; pending: number }
  todos: UiTodo[]
  onToggleDone: (id: number) => void
  onDeleteTodo: (id: number) => void
  onCreateTodo: (data: { title: string; isDone?: boolean }) => Promise<void> | void
  onEditTodo: (todoId: number, data: { title: string; isDone?: boolean }) => Promise<void> | void
}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)

  const editingTodo = useMemo(() => {
    if (editingTodoId == null) return null
    return todos.find((t) => t.id === editingTodoId) ?? null
  }, [todos, editingTodoId])

  return (
    <section className={cn('rounded-xl border bg-white p-4', className)}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{categoryName}</h2>
         
        </div>

        <Button
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          className="h-9 rounded-xl px-3 text-xs text-primary
            hover:text-white hover:bg-brand-500"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add todo
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {todos.map((t) => (
          <TodoLineRow
            key={t.id}
            todo={t}
            onToggleDone={() => onToggleDone(t.id)}
            onDelete={() => onDeleteTodo(t.id)}
            onEdit={() => {
              setEditingTodoId(t.id)
              setEditOpen(true)
            }}
          />
        ))}

        {todos.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
            No todos in this list yet.
          </div>
        ) : null}
      </div>

      {/* Create */}
      <CreateTodoModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (data) => {
          await onCreateTodo(data)
          setCreateOpen(false)
        }}
      />

      {/* Edit */}
      <EditTodoModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setEditingTodoId(null)
        }}
        initialValues={
          editingTodo
            ? {
                title: editingTodo.title,
                isDone: editingTodo.isDone,
              }
            : null
        }
        onSubmit={async (data) => {
          if (editingTodoId == null) return
          await onEditTodo(editingTodoId, data)
          setEditOpen(false)
          setEditingTodoId(null)
        }}
      />
    </section>
  )
}
