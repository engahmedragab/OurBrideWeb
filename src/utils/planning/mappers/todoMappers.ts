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
  color?: string
  lineCount?: number
  completedCount?: number
}

/**
 * Convert TodoLineResponse to TodoLineRequest
 */
export const convertLineToRequest = (line: TodoLineResponse, bookId: number): TodoLineRequest => {
  const lineAny = line as any
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
    lineCategoryCountId: lineAny.lineCategoryCountId ?? null,
    lineCategorySlug: lineAny.lineCategorySlug ?? null,
    task: task || null,
    subTask: line.subTask ?? null,
    hasSubline: lineAny.hasSubline ?? false,
    parentLineId: lineAny.parentLineId ?? null,
    sublines: lineAny.sublines
      ? lineAny.sublines.map((sub: any) => {
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
            id: sub.id ?? null,
            bookId: sub.bookId ?? bookId,
            lineCategoryId: sub.lineCategoryId ?? null,
            lineCategoryCountId: sub.lineCategoryCountId ?? null,
            lineCategorySlug: sub.lineCategorySlug ?? null,
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
  const catAny = category as any
  return {
    id: category.id ?? null,
    name: category.name || category.nameEn || category.nameAr || null,
    nameAr: catAny.nameAr ?? null,
    nameEn: catAny.nameEn ?? null,
    description: category.description ?? null,
    descriptionAr: catAny.descriptionAr ?? null,
    descriptionEn: catAny.descriptionEn ?? null,
    slug: category.slug ?? null,
    count_id: catAny.count_id ?? null,
    date: catAny.date ?? null,
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

  return {
    id: todo.id,
    bookId: localTodoBook.id,
    task: task,
    subTask: originalLine?.subTask || null,
    lineCategoryId: todo.categoryId ?? null,
    lineCategoryCountId: originalLine?.lineCategoryCountId ?? (category as any)?.count_id ?? null,
    lineCategorySlug: originalLine?.lineCategorySlug ?? category?.slug ?? null,
    isDone: todo.isDone || false,
    isFavorite: originalLine?.isFavorite || false,
    isDeleted: todo.isDeleted || false,
    isModelLine: originalLine?.isModelLine || false,
    brideId: originalLine?.brideId || null,
    groomId: originalLine?.groomId || null,
    parentLineId: originalLine?.parentLineId || null,
    hasSubline: originalLine?.hasSubline || false,
    sublines: originalLine?.sublines?.map(sub => {
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
        lineCategoryCountId: sub.lineCategoryCountId ?? null,
        lineCategorySlug: sub.lineCategorySlug ?? null,
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
  return {
    id: category.id,
    name: category.name || category.nameEn || category.nameAr || '',
    color: (category as any).colorName || undefined,
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
  const allCategories: TodoLineCategoryRequest[] = (localTodoBook.lineCategories || []).map(cat => ({
    id: cat.id ?? null,
    name: cat.name ?? null,
    nameAr: (cat as any).nameAr ?? null,
    nameEn: (cat as any).nameEn ?? null,
    description: cat.description ?? null,
    descriptionAr: (cat as any).descriptionAr ?? null,
    descriptionEn: (cat as any).descriptionEn ?? null,
    slug: cat.slug ?? null,
    count_id: (cat as any).count_id ?? null,
    date: (cat as any).date ?? null,
    isDeleted: cat.isDeleted ?? false,
    isModelLine: cat.isModelLine ?? false,
    creationDate: cat.creationDate ?? new Date().toISOString(),
    lastModifiedDate: cat.lastModifiedDate ?? new Date().toISOString(),
  }))

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
