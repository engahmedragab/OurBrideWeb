/**
 * Note Line Response
 */

import type { LineResponse } from './line-response'
import type { NoteLineCategoryResponse } from './note-line-category-response'

export interface NoteLineResponse extends LineResponse {
  title: string
  note: string
  noteLineCategory?: NoteLineCategoryResponse
}
