/**
 * Note Book Response
 */

import type { BookResponse } from './book-response'
import type { NoteLineResponse } from './note-line-response'

export interface NoteBookResponse extends BookResponse<NoteLineResponse> {
  // No additional properties
}
