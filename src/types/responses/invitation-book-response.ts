/**
 * Invitation Book Response Types
 * Types for the wedding invitation system
 */

import type { GuestRelevant } from './book-enums'

export enum InvitationStatus {
  Draft = 0,
  Sent = 1,
  Confirmed = 2,
  Declined = 3,
  CheckedIn = 4,
}

export interface InvitationResponse {
  id: number
  bookId: number
  guestId?: string | null
  guestLineId?: number | null
  guestName: string
  guestPhone?: string | null
  guestEmail?: string | null
  brideName: string
  groomName: string
  weddingDate?: string | null
  engagementDate?: string | null
  hennaDate?: string | null
  crownDate?: string | null
  countryId?: number | null
  cityId?: number | null
  area?: string | null
  weddinghole?: string | null
  weddingAddress?: string | null
  mapsLink?: string | null
  occasionId?: number | null
  invitationModelId?: number | null
  numberOfGuests: number
  uniqueToken: string
  qrPayload: string
  status: InvitationStatus
  sentAt?: string | null
  checkedInAt?: string | null
  guestRelevant: GuestRelevant
  rsvpAt?: string | null
  rsvpNote?: string | null
  sendFailed: boolean
  isDone: boolean
  isFavorite: boolean
  isDeleted: boolean
  isModelLine: boolean
  lineCategoryId?: number | null
  createdBy: string
  lastModifiedBy: string
  slug: string
  creationDate: string
  lastModifiedDate: string
}

export interface InvitationBookResponse {
  id: number
  groomId?: string | null
  brideId?: string | null
  occasionId?: number | null
  invitations: InvitationResponse[]
  totalInvitations: number
  sentCount: number
  checkedInCount: number
  totalExpectedGuests: number
}

export interface InvitationStatsResponse {
  totalInvitations: number
  totalExpectedGuests: number
  draftCount: number
  sentCount: number
  confirmedCount: number
  declinedCount: number
  checkedInCount: number
  checkedInGuests: number
  sendFailedCount: number
  brideTotalInvitations: number
  brideSentCount: number
  brideConfirmedCount: number
  brideDeclinedCount: number
  brideCheckedInCount: number
  brideExpectedGuests: number
  groomTotalInvitations: number
  groomSentCount: number
  groomConfirmedCount: number
  groomDeclinedCount: number
  groomCheckedInCount: number
  groomExpectedGuests: number
}

export interface InvitationModelResponse {
  id: number
  templateName?: string | null
  templateNameAr?: string | null
  previewImageUrl?: string | null
  templateImageUrl?: string | null
  templateColor?: string | null
  templateCategory?: string | null
  templateCategoryAr?: string | null
  isDefault?: boolean
  sortOrder?: number
  isDeleted: boolean
  creationDate?: string
  lastModifiedDate?: string
}

export interface InvitationModelRequest {
  templateName?: string | null
  templateNameAr?: string | null
  previewImageUrl?: string | null
  templateImageUrl?: string | null
  templateColor?: string | null
  templateCategory?: string | null
  templateCategoryAr?: string | null
  isDefault?: boolean
  sortOrder?: number
}

export interface WeddingCheckInResponse {
  invitationId: number
  guestName: string
  numberOfGuests: number
  status: InvitationStatus
  checkedInAt: string
  alreadyCheckedIn: boolean
  message: string
}
