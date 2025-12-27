/**
 * Service Line Response
 */

import type { LineResponse } from './line-response'
import type { ServiceType, ServiceClass, ReminderType, ProvidingType } from './book-enums'
import type { PreparationResponse } from './preparation-response'
import type { ProviderResponse } from './provider-response'
import type { ServiceResponse } from './service-response'
import type { ReservationResponse } from './reservation-response'

export interface ServiceLineResponse extends LineResponse {
  titleAr: string
  titleEn: string
  title: string
  quantity?: number
  advanceAmount?: number
  price?: number
  totalPrice?: number
  buyDate?: string // ISO DateTime string
  seller: string
  notes: string
  hasReminder: boolean
  reminderDate?: string // ISO DateTime string
  reminderText: string
  reminderType?: ReminderType
  providerName: string
  providerAddress: string
  providerLink: string
  providingType?: ProvidingType
  hasProvider: boolean
  budget: boolean
  serviceType: ServiceType
  serviceClass: ServiceClass
  iconName: string
  colorName: string
  preparationId?: number
  preparation?: PreparationResponse
  providerId?: number
  provider?: ProviderResponse
  serviceId?: number
  service?: ServiceResponse
  reservationId?: number
  reservation?: ReservationResponse
  isLinkedToService: boolean
  isLinkedToReservation: boolean
  serviceDate?: string // ISO DateTime string
  serviceNotes: string
  reservationNotes: string
}


