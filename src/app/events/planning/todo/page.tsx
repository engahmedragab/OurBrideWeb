'use client'

import { useState } from 'react'
import { Checkbox, Button, Input } from '@/components/ui'
import { CheckCircle2, ChevronDown, Plus, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Sofa',
    completed: false,
    isOpen: true,
    subTasks: [
      { id: 11, title: 'Three-seat fabric sofa', completed: true },
      { id: 12, title: 'Pay remaining amount', completed: true },
    ],
  },
  {
    id: 2,
    title: 'Sofa',
    completed: false,
    isOpen: true,
    subTasks: [
      { id: 21, title: 'Three-seat fabric sofa', completed: true },
      { id: 22, title: 'Pay remaining amount', completed: true },
    ],
  }
]

export default function TodosPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)

const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
const [editingSubTask, setEditingSubTask] = useState<{
  taskId: number
  subId: number
} | null>(null)

const [inputValue, setInputValue] = useState('')
  /* ---------------- TASK ACTIONS ---------------- */

  const toggleTask = (taskId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              subTasks: task.subTasks.map(sub => ({
                ...sub,
                completed: !task.completed,
              })),
            }
          : task
      )
    )
  }

  const toggleSubTask = (taskId: number, subId: number) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId) return task

        const updatedSubs = task.subTasks.map(sub =>
          sub.id === subId ? { ...sub, completed: !sub.completed } : sub
        )

        return {
          ...task,
          subTasks: updatedSubs,
          completed: updatedSubs.every(s => s.completed),
        }
      })
    )
  }

  const toggleOpen = (taskId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, isOpen: !task.isOpen } : task
      )
    )
  }

  const addTask = () => {
    const title = prompt('Task name')
    if (!title) return

    setTasks(prev => [
      ...prev,
      {
  id: Date.now(),
          title: 'New Task',
          completed: false,
          isOpen: true,
          subTasks: [],
      },
    ])
  }

  const startEditTask = (taskId: number, title: string) => {
    setEditingTaskId(taskId)
    setInputValue(title)
  }

  const saveTaskTitle = (taskId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, title: inputValue } : task
      )
    )
    setEditingTaskId(null)
  }

  const addSubTask = (taskId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: [
                ...task.subTasks,
                {
                  id: Date.now(),
                  title: 'New Sub Task',
                  completed: false,
                },
              ],
            }
          : task
      )
    )
  }

  const startEditSubTask = (
    taskId: number,
    subId: number,
    title: string
  ) => {
    setEditingSubTask({ taskId, subId })
    setInputValue(title)
  }

  const saveSubTaskTitle = (taskId: number, subId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map(sub =>
              sub.id === subId ? { ...sub, title: inputValue } : sub
              ),
            }
          : task
      )
    )
    setEditingSubTask(null)
  }

  const deleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const deleteSubTask = (taskId: number, subId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.filter(sub => sub.id !== subId),
            }
          : task
      )
    )
  }


  return (
    <div className="space-y-6 text-end">

      {/* ADD TASK BUTTON */}
      <Button
        className='text-white'
        onClick={addTask}
        variant='brand'
        size="md"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Task
      </Button>

      {/* TASKS */}
      {tasks.map(task => {
        return (
          <div
            key={task.id}
            className="bg-white border rounded-2xl p-4 space-y-3"
          >
            {/* TASK HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  size="md"
                  variant={
                      task.completed
                          ? 'successFilled'
                          : 'gray'
                  }
                  shape="square"
                  className="cursor-pointer"/>
              {editingTaskId === task.id ? (
                <Input
                  autoFocus
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onBlur={() => saveTaskTitle(task.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveTaskTitle(task.id)
                  }}
                  className="
                    border-b border-brand-500
                    outline-none
                    bg-transparent
                    text-sm
                    font-medium
                    w-[180px]
                  "
                />
              ) : (
                <span
                  onClick={() => startEditTask(task.id, task.title)}
                  className="font-medium cursor-pointer hover:text-brand-500"
                >
                  {task.title}
                </span>
              )}
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2">
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
                <div onClick={() => toggleOpen(task.id)}
                 className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-12 font-normal text-gray-700">
                        {
                            task.subTasks.filter(i => i.completed)
                                .length
                        }
                        /{task.subTasks.length}
                    </span>
                     <div
                  className={cn(
                    'transition-transform',
                    task.isOpen && 'rotate-180'
                  )}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
                </div>
       
              </div>
              
            </div>
         <div className=" h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{
                            width: `${
                                (task.subTasks.filter(i => i.completed)
                                    .length /
                                    task.subTasks.length) *
                                100
                            }%`,
                        }}
                    />
                </div>
            {/* SUB TASKS */}
            {task.isOpen && (
              <div className="space-y-2 pl-7">
                {task.subTasks.map(sub => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={sub.completed}
                        onChange={() => toggleSubTask(task.id, sub.id)}
                      />
                       {editingSubTask?.taskId === task.id &&
                        editingSubTask?.subId === sub.id ? (
                          <Input
                            autoFocus
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onBlur={() => saveSubTaskTitle(task.id, sub.id)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveSubTaskTitle(task.id, sub.id)
                              if (e.key === 'Escape') setEditingSubTask(null)
                            }}
                            className="w-full bg-transparent text-sm outline-none border-b border-gray-300"
                          />
                        ) : (
                          <span
                            onClick={() => startEditSubTask(task.id, sub.id, sub.title)}
                            className={cn(
                              'text-sm cursor-pointer',
                              sub.completed && 'line-through text-gray-400'
                            )}
                          >
                            {sub.title}
                          </span>
                        )}
                    </div>

                    <button
                      onClick={() => deleteSubTask(task.id, sub.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addSubTask(task.id)}
                  className="text-brand-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add SubTask
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
