/**
 * Resource Response
 */

export interface ResourceResponse {
  id: number
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  providerId: number
  providerName: string
  branchId: number | null
  branchName: string
  type: number // ResourceType enum
  typeName: string
  status: number // ResourceStatus enum
  statusName: string
  capacity: number | null
  location: string
  isBookable: boolean
  requiresMaintenance: boolean
  lastMaintenanceDate: string | null // ISO DateTime string
  nextMaintenanceDate: string | null // ISO DateTime string
  isAvailable: boolean // Computed property
  creationDate: string // ISO DateTime string
  lastModifiedDate: string // ISO DateTime string
}
