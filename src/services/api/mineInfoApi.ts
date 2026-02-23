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
  // API returns { data: { userId, cart, follows, ... }, success, statusCode, message }
  const body = response?.data ?? response
  const payload = body && typeof body === 'object' && 'data' in body ? (body as { data: UserMainIdsResponse }).data : body
  return (payload ?? body) as UserMainIdsResponse
}
