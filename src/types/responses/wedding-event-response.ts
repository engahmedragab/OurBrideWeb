/**
 * Wedding Event Response
 * Based on OurBrideMain.Contracts.V1.Responses.WeddingEvents.WeddingEventResponse
 */

import type {
  Bride,
  Groom,
  UserType,
} from '@/../client/common/api/gen/ourbride-api'

export interface WeddingEventResponse {
  /** @format int32 */
  id: number
  title: string
  description: string | null
  /** @format date-time */
  startDate: string | null
  /** @format date-time */
  endDate: string | null
  /** @format uuid */
  brideId: string | null
  bride: Bride | null
  /** @format uuid */
  groomId: string | null
  groom: Groom | null
  /** @format uuid */
  weddingPlannerId: string | null
  ownerType: UserType
  isDefault: boolean
  /** @format uuid */
  createdBy: string
  /** @format uuid */
  lastModifiedBy: string
  isDeleted: boolean
  /** @format date-time */
  creationDate: string
  /** @format date-time */
  lastModifiedDate: string
  slug: string
}
