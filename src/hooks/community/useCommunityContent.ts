/**
 * Community Content React Query Hooks
 */

import { useQuery } from '@tanstack/react-query'
import { getAllPosts, searchPosts } from '@/services/api/postsApi'
import { getAllArticles, searchArticles } from '@/services/api/articlesApi'
import { getAllBlogs, searchBlogs } from '@/services/api/blogsApi'
import { getAllReels, searchReels } from '@/services/api/reelsApi'
import { getAllDecisionGroups, searchDecisionGroups } from '@/services/api/decisionGroupsApi'
import { getAllContests, searchContests } from '@/services/api/contestsApi'
import type { PostResponse } from '@/types/responses/community'
import type { ArticleResponse } from '@/types/responses/community'
import type { BlogResponse } from '@/types/responses/community'
import type { ReelResponse } from '@/types/responses/community'
import type { DecisionGroupResponse } from '@/types/responses/community'
import type { LeaderboardContestResponse } from '@/types/responses/community'

/**
 * Hook to fetch all posts
 */
export const usePosts = (params?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery<PostResponse[]>({
    queryKey: ['community', 'posts', queryParams],
    queryFn: async () => {
      return await getAllPosts(queryParams)
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch all articles
 */
export const useArticles = (params?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery<ArticleResponse[]>({
    queryKey: ['community', 'articles', queryParams],
    queryFn: async () => {
      return await getAllArticles(queryParams)
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch all blogs
 */
export const useBlogs = (params?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery<BlogResponse[]>({
    queryKey: ['community', 'blogs', queryParams],
    queryFn: async () => {
      return await getAllBlogs(queryParams)
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch all reels
 */
export const useReels = (params?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery<ReelResponse[]>({
    queryKey: ['community', 'reels', queryParams],
    queryFn: async () => {
      return await getAllReels(queryParams)
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch all decision groups
 */
export const useDecisionGroups = (params?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery<DecisionGroupResponse[]>({
    queryKey: ['community', 'decision-groups', queryParams],
    queryFn: async () => {
      return await getAllDecisionGroups(queryParams)
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch all contests
 */
export const useContests = (params?: {
  page?: number
  pageSize?: number
  enabled?: boolean
}) => {
  const { enabled = true, ...queryParams } = params || {}

  return useQuery<LeaderboardContestResponse[]>({
    queryKey: ['community', 'contests', queryParams],
    queryFn: async () => {
      return await getAllContests(queryParams)
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to search posts
 */
export const usePostsSearch = (params?: {
  searchTerm?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...searchParams } = params || {}

  return useQuery<PostResponse[]>({
    queryKey: ['community', 'posts', 'search', searchParams],
    queryFn: async () => {
      return await searchPosts(searchParams)
    },
    enabled: enabled && !!searchParams.searchTerm,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to search articles
 */
export const useArticlesSearch = (params?: {
  searchTerm?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...searchParams } = params || {}

  return useQuery<ArticleResponse[]>({
    queryKey: ['community', 'articles', 'search', searchParams],
    queryFn: async () => {
      return await searchArticles(searchParams)
    },
    enabled: enabled && !!searchParams.searchTerm,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to search blogs
 */
export const useBlogsSearch = (params?: {
  searchTerm?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...searchParams } = params || {}

  return useQuery<BlogResponse[]>({
    queryKey: ['community', 'blogs', 'search', searchParams],
    queryFn: async () => {
      return await searchBlogs(searchParams)
    },
    enabled: enabled && !!searchParams.searchTerm,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to search reels
 */
export const useReelsSearch = (params?: {
  searchTerm?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...searchParams } = params || {}

  return useQuery<ReelResponse[]>({
    queryKey: ['community', 'reels', 'search', searchParams],
    queryFn: async () => {
      return await searchReels(searchParams)
    },
    enabled: enabled && !!searchParams.searchTerm,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to search decision groups
 */
export const useDecisionGroupsSearch = (params?: {
  searchTerm?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...searchParams } = params || {}

  return useQuery<DecisionGroupResponse[]>({
    queryKey: ['community', 'decision-groups', 'search', searchParams],
    queryFn: async () => {
      return await searchDecisionGroups(searchParams)
    },
    enabled: enabled && !!searchParams.searchTerm,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to search contests
 */
export const useContestsSearch = (params?: {
  searchTerm?: string
  enabled?: boolean
}) => {
  const { enabled = true, ...searchParams } = params || {}

  return useQuery<LeaderboardContestResponse[]>({
    queryKey: ['community', 'contests', 'search', searchParams],
    queryFn: async () => {
      return await searchContests(searchParams)
    },
    enabled: enabled && !!searchParams.searchTerm,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}





