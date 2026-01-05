/**
 * Main Note Line Response
 */

import type { MainLineResponse } from './main-line-response'

export interface MainNoteLineResponse extends MainLineResponse {
  title: string
  note: string
}
