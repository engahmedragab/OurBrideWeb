/**
 * Mappers for NoteBook (Notes)
 */
import type { NoteBookDraft } from '@/hooks/planning/bookDrafts'
import type { NoteBookRequest, NoteLineRequest } from '@/../client/common/api/gen/ourbride-api'

export const convertLineToRequest = (line: Record<string, unknown>, bookId: number): NoteLineRequest => {
  // Preserve negative IDs for new items (temporary IDs)
  const lineId = line.id !== undefined && line.id !== null ? (line.id as number) : null
  
  return {
    id: lineId,
    bookId: (line.bookId as number | undefined) ?? bookId,
    title: (line.title as string | null | undefined) ?? null,
    note: (line.note as string | null | undefined) ?? null,
    isDone: (line.isDone as boolean | undefined) ?? false,
    isFavorite: (line.isFavorite as boolean | undefined) ?? false,
    isDeleted: (line.isDeleted as boolean | undefined) ?? false,
    isModelLine: (line.isModelLine as boolean | undefined) ?? false,
    brideId: (line.brideId as string | null | undefined) ?? null,
    groomId: (line.groomId as string | null | undefined) ?? null,
    creationDate: (line.creationDate as string | null | undefined) ?? null,
    lastModifiedDate: (line.lastModifiedDate as string | null | undefined) ?? null,
  }
}

/**
 * Build NoteBookRequest from local state
 * Includes all lines (including deleted ones) for sync
 */
export const buildNoteBookRequestFromLocal = (draft: NoteBookDraft): NoteBookRequest => {
  const now = new Date().toISOString()
  const d = draft as Record<string, unknown>

  if (!d.id || (d.id as number) <= 0) {
    throw new Error('Invalid note book id. Make sure the book is initialized and fetched first.')
  }

  const bookId = d.id as number

  const lines = (Array.isArray(d.lines) ? d.lines : []).map((l: Record<string, unknown>) => {
    // Preserve negative IDs for new items (temporary IDs)
    const lineId = l.id !== undefined && l.id !== null ? (l.id as number) : null
    
    return {
      id: lineId,
      isDone: (l.isDone as boolean | undefined) ?? false,
      isFavorite: (l.isFavorite as boolean | undefined) ?? false,
      isDeleted: (l.isDeleted as boolean | undefined) ?? false,
      isModelLine: (l.isModelLine as boolean | undefined) ?? false,

      brideId: (l.brideId as string | null | undefined) ?? (d.brideId as string | null | undefined) ?? null,
      groomId: (l.groomId as string | null | undefined) ?? (d.groomId as string | null | undefined) ?? null,

      bookId,
      creationDate: (l.creationDate as string | undefined) ?? now,
      lastModifiedDate: (l.lastModifiedDate as string | undefined) ?? now,

      title: (l.title as string | undefined) ?? '',
      note: (l.note as string | undefined) ?? '',
    }
  })

  return {
    id: bookId,
    groomId: (d.groomId as string | null | undefined) ?? null,
    brideId: (d.brideId as string | null | undefined) ?? null,
    weddingPlannerId: (d.weddingPlannerId as string | null | undefined) ?? null,

    bookType: d.bookType,
    bookClass: d.bookClass,

    title: (d.title as string | null | undefined) ?? null,
    description: (d.description as string | null | undefined) ?? null,

    createdBy: (d.createdBy as string | null | undefined) ?? (d.brideId as string | null | undefined) ?? null,
    lastModifiedBy: (d.lastModifiedBy as string | null | undefined) ?? (d.brideId as string | null | undefined) ?? null,

    isModelsAdd: (d.isModelsAdd as boolean | undefined) ?? false,
    isBookInit: (d.isBookInit as boolean | undefined) ?? true,
    isDeleted: (d.isDeleted as boolean | undefined) ?? false,
    count: (d.count as number | undefined) ?? 0,

    creationDate: (d.creationDate as string | undefined) ?? now,
    lastModifiedDate: now,

    lines,
    slug: (d.slug as string | undefined) ?? '',
  } as NoteBookRequest
}
