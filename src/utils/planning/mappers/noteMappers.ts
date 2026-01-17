/**
 * Mappers for NoteBook (Notes)
 */
import type { NoteBookDraft } from '@/hooks/planning/bookDrafts'
import type { NoteBookRequest, NoteLineRequest } from '@/../client/common/api/gen/ourbride-api'

export const convertLineToRequest = (line: any, bookId: number): NoteLineRequest => {
  // Preserve negative IDs for new items (temporary IDs)
  const lineId = line.id !== undefined && line.id !== null ? line.id : null
  
  return {
    id: lineId,
    bookId: line.bookId ?? bookId,
    title: line.title ?? null,
    note: line.note ?? null,
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
 * Build NoteBookRequest from local state
 * Includes all lines (including deleted ones) for sync
 */
export const buildNoteBookRequestFromLocal = (draft: NoteBookDraft): NoteBookRequest => {
  const now = new Date().toISOString()
  const d: any = draft as any

  if (!d.id || d.id <= 0) {
    throw new Error('Invalid note book id. Make sure the book is initialized and fetched first.')
  }

  const bookId = d.id as number

  const lines = (d.lines || []).map((l: any) => {
    // Preserve negative IDs for new items (temporary IDs)
    const lineId = l.id !== undefined && l.id !== null ? l.id : null
    
    return {
      id: lineId,
      isDone: l.isDone ?? false,
      isFavorite: l.isFavorite ?? false,
      isDeleted: l.isDeleted ?? false,
      isModelLine: l.isModelLine ?? false,

      brideId: l.brideId ?? d.brideId ?? null,
      groomId: l.groomId ?? d.groomId ?? null,

      bookId,
      creationDate: l.creationDate ?? now,
      lastModifiedDate: l.lastModifiedDate ?? now,

      title: l.title ?? '',
      note: l.note ?? '',
    }
  })

  return {
    id: bookId,
    groomId: d.groomId ?? null,
    brideId: d.brideId ?? null,
    weddingPlannerId: d.weddingPlannerId ?? null,

    bookType: d.bookType,
    bookClass: d.bookClass,

    title: d.title ?? null,
    description: d.description ?? null,

    createdBy: d.createdBy ?? d.brideId ?? null,
    lastModifiedBy: d.lastModifiedBy ?? d.brideId ?? null,

    isModelsAdd: d.isModelsAdd ?? false,
    isBookInit: d.isBookInit ?? true,
    isDeleted: d.isDeleted ?? false,
    count: d.count ?? 0,

    creationDate: d.creationDate ?? now,
    lastModifiedDate: now,

    lines,
    slug: d.slug ?? '',
  } as any as NoteBookRequest
}
