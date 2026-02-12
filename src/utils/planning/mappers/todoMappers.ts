/**
 * Mappers for TodoBook (Todo)
 */
import type { TodoLineResponse, TodoBookResponse, TodoLineCategoryResponse } from '@/types/responses'
import type { TodoBookRequest, TodoLineRequest, TodoLineCategoryRequest, BookClass, UserType } from '@/../client/common/api/gen/ourbride-api'

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
  nameEn?: string
  nameAr?: string
  color?: string
  lineCount?: number
  completedCount?: number
}

/**
 * Convert TodoLineResponse to TodoLineRequest
 */
export const convertLineToRequest = (line: TodoLineResponse, bookId: number): TodoLineRequest => {
  const lineAny = line as unknown as Record<string, unknown>
  // Ensure task is a valid string (2-40 chars) or null for deleted items
  // If task is invalid, use a default value or skip the line (for deleted items, null is fine)
  let task: string | null = null
  if (!line.isDeleted) {
    const taskValue = (line.task || '').trim()
    if (taskValue.length >= 2) {
      task = taskValue.length <= 40 ? taskValue : taskValue.substring(0, 40)
    } else if (taskValue.length > 0) {
      // If less than 2 chars, pad with spaces or use a default
      task = taskValue.padEnd(2, ' ').substring(0, 40)
    }
    // If task is empty or null, we can't send it - this should be caught earlier
    // For now, we'll use a placeholder to avoid validation errors
    if (!task) {
      task = 'Task' // Fallback to meet minimum length requirement
    }
  }
  
  return {
    id: line.id ?? null,
    bookId: line.bookId ?? bookId,
    lineCategoryId: line.lineCategoryId ?? null,
    lineCategoryCountId: (lineAny.lineCategoryCountId as number | null | undefined) ?? null,
    lineCategorySlug: (lineAny.lineCategorySlug as string | null | undefined) ?? null,
    task: task || null,
    subTask: line.subTask ?? null,
    hasSubline: (lineAny.hasSubline as boolean | undefined) ?? false,
    parentLineId: (lineAny.parentLineId as number | null | undefined) ?? null,
    sublines: Array.isArray(lineAny.sublines)
      ? (lineAny.sublines as TodoLineResponse[]).map((sub: TodoLineResponse) => {
          let subTask: string | null = null
          if (!sub.isDeleted) {
            const subTaskValue = (sub.task || '').trim()
            if (subTaskValue.length >= 2) {
              subTask = subTaskValue.length <= 40 ? subTaskValue : subTaskValue.substring(0, 40)
            } else if (subTaskValue.length > 0) {
              subTask = subTaskValue.padEnd(2, ' ').substring(0, 40)
            }
            if (!subTask) {
              subTask = 'Task'
            }
          }
          const subAny = sub as unknown as Record<string, unknown>
          return {
            id: sub.id ?? null,
            bookId: sub.bookId ?? bookId,
            lineCategoryId: sub.lineCategoryId ?? null,
            lineCategoryCountId: (subAny.lineCategoryCountId as number | null | undefined) ?? null,
            lineCategorySlug: (subAny.lineCategorySlug as string | null | undefined) ?? null,
            task: subTask,
            subTask: sub.subTask ?? null,
            hasSubline: sub.hasSubline ?? false,
            parentLineId: sub.parentLineId ?? null,
            isDone: sub.isDone ?? false,
            isFavorite: sub.isFavorite ?? false,
            isDeleted: sub.isDeleted ?? false,
            isModelLine: sub.isModelLine ?? false,
            brideId: sub.brideId ?? null,
            groomId: sub.groomId ?? null,
            creationDate: sub.creationDate ?? null,
            lastModifiedDate: sub.lastModifiedDate ?? null,
          }
        })
      : null,
    isDone: line.isDone ?? false,
    isFavorite: line.isFavorite ?? false,
    isDeleted: line.isDeleted ?? false,
    isModelLine: line.isModelLine ?? false,
    brideId: line.brideId ?? null,
    groomId: line.groomId ?? null,
    creationDate: line.creationDate ?? null,
    lastModifiedDate: line.lastModifiedDate ?? null,
  }
}

/**
 * Convert TodoLineCategoryResponse to TodoLineCategoryRequest
 */
export const convertCategoryToRequest = (category: TodoLineCategoryResponse): TodoLineCategoryRequest => {
  const catAny = category as unknown as Record<string, unknown>
  return {
    id: category.id ?? null,
    name: category.name || category.nameEn || category.nameAr || null,
    description: category.description ?? null,
    slug: category.slug ?? null,
    count_id: (catAny.count_id as number | null | undefined) ?? null,
    date: (catAny.date as string | null | undefined) ?? null,
    isDeleted: category.isDeleted ?? false,
    isModelLine: category.isModelLine ?? false,
    creationDate: category.creationDate ?? null,
    lastModifiedDate: category.lastModifiedDate ?? null,
  }
}

/**
 * Convert TodoLineResponse to UiTodo
 */
export const convertLineToUiTodo = (line: TodoLineResponse, categoryName: string): UiTodo => {
  return {
    id: line.id,
    title: line.task || '',
    isDone: line.isDone || false,
    categoryId: line.lineCategoryId || 0,
    categoryName: categoryName,
    isDeleted: line.isDeleted || false,
  }
}

/**
 * Convert UiTodo to TodoLineRequest
 */
export const convertUiTodoToLineRequest = (todo: UiTodo, localTodoBook: TodoBookResponse): TodoLineRequest => {
  if (!localTodoBook?.id) {
    throw new Error('Todo book not found')
  }

  // Find the original line to preserve all fields
  const originalLine = (localTodoBook.lines || []).find(l => l.id === todo.id)
  const category = (localTodoBook.lineCategories || []).find(c => c.id === todo.categoryId)

  // Ensure task is a valid string (2-40 chars) or null for deleted items
  let task: string | null = null
  if (!todo.isDeleted) {
    const taskValue = (todo.title || '').trim()
    if (taskValue.length >= 2) {
      task = taskValue.length <= 40 ? taskValue : taskValue.substring(0, 40)
    } else if (taskValue.length > 0) {
      task = taskValue.padEnd(2, ' ').substring(0, 40)
    }
    if (!task) {
      task = 'Task' // Fallback to meet minimum length requirement
    }
  }

  const originalLineAny = originalLine as unknown as Record<string, unknown>
  const categoryAny = category as unknown as Record<string, unknown>
  return {
    id: todo.id,
    bookId: localTodoBook.id,
    task: task,
    subTask: originalLine?.subTask || null,
    lineCategoryId: todo.categoryId ?? null,
    lineCategoryCountId: (originalLineAny?.lineCategoryCountId as number | null | undefined) ?? (categoryAny?.count_id as number | null | undefined) ?? null,
    lineCategorySlug: (originalLineAny?.lineCategorySlug as string | null | undefined) ?? category?.slug ?? null,
    isDone: todo.isDone || false,
    isFavorite: originalLine?.isFavorite || false,
    isDeleted: todo.isDeleted || false,
    isModelLine: originalLine?.isModelLine || false,
    brideId: originalLine?.brideId || null,
    groomId: originalLine?.groomId || null,
    parentLineId: originalLine?.parentLineId || null,
    hasSubline: originalLine?.hasSubline || false,
    sublines: originalLine?.sublines?.map(sub => {
      const subAny = sub as unknown as Record<string, unknown>
      let subTask: string | null = null
      if (!sub.isDeleted) {
        const subTaskValue = (sub.task || '').trim()
        if (subTaskValue.length >= 2) {
          subTask = subTaskValue.length <= 40 ? subTaskValue : subTaskValue.substring(0, 40)
        } else if (subTaskValue.length > 0) {
          subTask = subTaskValue.padEnd(2, ' ').substring(0, 40)
        }
        if (!subTask) {
          subTask = 'Task'
        }
      }
      return {
        id: sub.id,
        bookId: localTodoBook.id,
        task: subTask,
        subTask: sub.subTask || null,
        lineCategoryId: sub.lineCategoryId ?? null,
        lineCategoryCountId: (subAny?.lineCategoryCountId as number | null | undefined) ?? null,
        lineCategorySlug: (subAny?.lineCategorySlug as string | null | undefined) ?? null,
        isDone: sub.isDone || false,
        isFavorite: sub.isFavorite || false,
        isDeleted: sub.isDeleted || false,
        isModelLine: sub.isModelLine || false,
        brideId: sub.brideId || null,
        groomId: sub.groomId || null,
        parentLineId: sub.parentLineId || null,
        hasSubline: sub.hasSubline || false,
      }
    }) || null,
    creationDate: originalLine?.creationDate || new Date().toISOString(),
    lastModifiedDate: new Date().toISOString(),
  }
}

/**
 * Convert TodoLineCategoryResponse to UiTodoCategory
 */
export const convertCategoryToUi = (category: TodoLineCategoryResponse): UiTodoCategory => {
  const catAny = category as unknown as Record<string, unknown>
  return {
    id: category.id,
    name: category.name || category.nameEn || category.nameAr || '',
    nameEn: category.nameEn || category.name || '',
    nameAr: category.nameAr || category.name || '',
    color: (catAny.colorName as string | undefined) || undefined,
  }
}

/**
 * Build TodoBookRequest from local state
 * Includes all lines (including deleted ones) for sync
 */
export const buildBookRequestFromLocal = (localTodoBook: TodoBookResponse): TodoBookRequest => {
  if (!localTodoBook) {
    throw new Error('Todo book not found')
  }

  // Include ALL lines (including deleted) for sync
  const allLines = (localTodoBook.lines || []).map(line => 
    convertUiTodoToLineRequest(convertLineToUiTodo(line, ''), localTodoBook)
  )

  // Include ALL categories (including deleted) for sync
  const allCategories: TodoLineCategoryRequest[] = (localTodoBook.lineCategories || []).map(cat => {
    const catAny = cat as unknown as Record<string, unknown>
    return {
      id: cat.id ?? null,
      name: cat.name ?? null,
      nameAr: (catAny.nameAr as string | null | undefined) ?? null,
      nameEn: (catAny.nameEn as string | null | undefined) ?? null,
      description: cat.description ?? null,
      descriptionAr: (catAny.descriptionAr as string | null | undefined) ?? null,
      descriptionEn: (catAny.descriptionEn as string | null | undefined) ?? null,
      slug: cat.slug ?? null,
      count_id: (catAny.count_id as number | null | undefined) ?? null,
      date: (catAny.date as string | null | undefined) ?? null,
      isDeleted: cat.isDeleted ?? false,
      isModelLine: cat.isModelLine ?? false,
      creationDate: cat.creationDate ?? new Date().toISOString(),
      lastModifiedDate: cat.lastModifiedDate ?? new Date().toISOString(),
    }
  })

  return {
    id: localTodoBook.id,
    groomId: localTodoBook.groomId || null,
    brideId: localTodoBook.brideId || null,
    weddingPlannerId: undefined,
    bookType: (localTodoBook.bookType as unknown) as UserType | undefined,
    bookClass: localTodoBook.bookClass as unknown as BookClass | undefined,
    title: localTodoBook.title || null,
    clientName: null,
    weddingDate: null,
    eventLocation: null,
    lines: allLines,
    lineCategories: allCategories.length > 0 ? allCategories : null,
    lastModifiedDate: new Date().toISOString(),
  }
}
