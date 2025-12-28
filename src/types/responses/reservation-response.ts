/**
 * Reservation response types
 */

import type { BaseResponse } from '@/types/responses/common'
import type { ServiceResponse } from './service-response'
import type { ProviderResponse } from './provider-response'
import type { UserResponse } from './user-response'
import type { WeddingPlannerResponse } from './wedding-planner-response'
import type { TimeSlotResponse } from './time-slot-response'
import type { ServicePaymentMethodResponse } from './service-payment-method-response'
import type { ProviderUserAssignmentResponse } from './provider-user-assignment-response'
import type { ServicePackageResponse } from './service-package-response'
import type { ReservationInfoResponse } from './reservation-info-response'
import type { ResourceResponse } from './resource-response'
import type { PlaceResponse } from './place-response'
import type { ReservationStatus, ServiceType, ServiceClass } from '@/types/responses/common'

export interface ReservationResponse extends BaseResponse {
  reservationId: string
  status: ReservationStatus
  totalPrice: number | null
  reservationDate: string | null // ISO DateTime string
  type: ServiceType
  serviceClass: ServiceClass
  servicePrice: number | null
  depositAmount: number | null
  serviceId: number
  service: ServiceResponse | null
  clientId: string // Guid
  client: UserResponse | null
  weddingPlannerId: string | null // Guid
  weddingPlanner: WeddingPlannerResponse | null
  confirmPaymentUserId: string | null // Guid
  completeReservationUserId: string | null // Guid
  providerId: number
  provider: ProviderResponse | null
  reservationSlotId: number | null
  reservationSlot: TimeSlotResponse | null
  requestedStartTime: string | null // ISO DateTime string
  servicePaymentMethodId: number | null
  servicePaymentMethod: ServicePaymentMethodResponse | null
  branchId: number | null
  reservationPlace: PlaceResponse | null
  staffId: number | null
  reservationStaff: ProviderUserAssignmentResponse | null
  servicePackageId: number | null
  servicePackage: ServicePackageResponse | null
  reservationInfos: ReservationInfoResponse[]
  resourceIds: number[]
  resources: ResourceResponse[]
  quantity: number | null
  isTestRequested: boolean
  isTestAccepted: boolean | null
  clientFeedback: string
  clientWantsToContinue: boolean | null
  notes: string
}
