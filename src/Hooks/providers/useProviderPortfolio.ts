import { useQuery } from '@tanstack/react-query'
import {
  getProviderBranchPortfolio,
  getProviderTeamMemberPortfolio,
} from '@/services/api/providerApi'
import type { MediaResponse } from '@/types/responses'

/**
 * Hook to fetch portfolio for a provider branch
 */
export const useProviderBranchPortfolio = (
  providerId: number,
  branchId: number,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<MediaResponse[], Error>({
    queryKey: ['provider-branch-portfolio', providerId, branchId],
    queryFn: () => getProviderBranchPortfolio(providerId, branchId),
    enabled: options?.enabled !== false && !!providerId && !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch portfolio for a provider team member
 */
export const useProviderTeamMemberPortfolio = (
  providerId: number,
  teamMemberId: string,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<MediaResponse[], Error>({
    queryKey: ['provider-team-member-portfolio', providerId, teamMemberId],
    queryFn: () => getProviderTeamMemberPortfolio(providerId, teamMemberId),
    enabled: options?.enabled !== false && !!providerId && !!teamMemberId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}


