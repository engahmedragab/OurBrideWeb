/**
 * Main Note Book Response
 */

import type { MainBookResponse } from './main-book-response'
import type { MainNoteLineResponse } from './main-note-line-response'

export interface MainNoteBookResponse extends MainBookResponse<MainNoteLineResponse> {
  notes?: MainNoteLineResponse[]
}
