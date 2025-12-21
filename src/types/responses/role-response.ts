/**
 * Role Response
 */

export interface RoleResponse {
  id: string // Guid
  name: string
  normalizedName: string
  description: string
  userType: number | null // UserType enum
  providerId: number | null
  isDeleted: boolean
}
