/**
 * Book Response (Generic)
 */

import type { BaseEntityResponse } from './common'
import type { UserType, BookClass } from './book-enums'
import type { GroomResponse } from './groom-response'
import type { BrideResponse } from './bride-response'
import type { LineResponse } from './line-response'

export interface BookResponse<
  TLine extends LineResponse,
> extends BaseEntityResponse {
  groomId?: string // Guid
  groom?: GroomResponse
  brideId?: string // Guid
  bride?: BrideResponse
  bookType: UserType
  bookClass: BookClass
  eventId?: number
  isModelsAdd: boolean
  title: string
  description: string
  lines: TLine[]
  count?: number
  createdBy: string // Guid
  lastModifiedBy: string // Guid
}
