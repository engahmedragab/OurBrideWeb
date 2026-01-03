import { useQuery } from '@tanstack/react-query'
import {
  getProviderBranchPortfolio,
  getProviderTeamMemberPortfolio,
  getProviderTeamUsers,
  getProviderBranches,
} from '@/services/api/providerApi'
import type { MediaResponse } from '@/types/responses'
import type { BranchPortfolioResponse } from '@/types/responses/branch-portfolio-response'
import type { PlaceResponse } from '@/types/responses'
import type { ProviderUserAssignmentResponse } from '@/types/responses/provider-user-assignment-response'

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
  return useQuery<BranchPortfolioResponse, Error>({
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
  return useQuery<BranchPortfolioResponse, Error>({
    queryKey: ['provider-team-member-portfolio', providerId, teamMemberId],
    queryFn: () => getProviderTeamMemberPortfolio(providerId, teamMemberId),
    enabled: options?.enabled !== false && !!providerId && !!teamMemberId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch all provider team users/staff members
 */
export const useProviderTeamUsers = (
  providerId: number,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<ProviderUserAssignmentResponse[], Error>({
    queryKey: ['provider-team-users', providerId],
    queryFn: () => getProviderTeamUsers(providerId),
    enabled: options?.enabled !== false && !!providerId && providerId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch all provider branches
 */
export const useProviderBranches = (
  providerId: number,
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<PlaceResponse[], Error>({
    queryKey: ['provider-branches', providerId],
    queryFn: () => getProviderBranches(providerId),
    enabled: options?.enabled !== false && !!providerId && providerId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}


