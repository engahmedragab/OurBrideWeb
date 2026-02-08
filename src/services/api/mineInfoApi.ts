import { apiClient } from './apiClient'
import type { UserMainIdsResponse } from '@/types/responses'

export const getUserMainIds = async (query?: {
  providerId?: number
  branchId?: number
  staffId?: string
  page?: number
  pageSize?: number
}): Promise<UserMainIdsResponse> => {
  const response = await apiClient.http.request<UserMainIdsResponse, any>({
    path: '/api/v1/mineinfo/main-ids',
    method: 'GET',
    secure: true,
    query,
  })
  return (response?.data ?? response) as UserMainIdsResponse
}
