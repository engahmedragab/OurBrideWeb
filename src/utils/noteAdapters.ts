// This file contains helper functions and types for Note Book feature

import type {
  NoteLineResponse,
  NoteLineCategoryResponse,
} from '@/types/responses'

/**
 * Note Book Draft - Local state that mirrors the API payload
 * Includes ALL fields even if not used in UI
 */
export type NoteBookDraft = {
  id?: number
  groomId?: string | null
  brideId?: string | null
  weddingPlannerId?: string | null
  bookType: any
  bookClass: any
  title?: string | null
  clientName?: string | null
  weddingDate?: string | null
  eventLocation?: string | null
  lines?: NoteLineResponse[]
  lineCategories?: NoteLineCategoryResponse[]
  count?: number | null
  createdBy?: string | null
  lastModifiedBy?: string | null
  isDeleted?: boolean
  creationDate?: string | null
  lastModifiedDate?: string | null
  slug?: string | null
}

/**
 * Generate temporary negative ID for new items
 */
export const generateTempId = (): number => -Math.floor(Date.now() + Math.random() * 1000)

/**
 * Slugify text for category slugs
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
