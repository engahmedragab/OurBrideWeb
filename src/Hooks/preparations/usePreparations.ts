import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/api/apiClient'
import type { PreparationResponse } from '@/types/responses/preparation-response'

export interface PreparationsData {
  preparations: PreparationResponse[]
}

/**
 * Hook to fetch all preparations from the API
 */
export const usePreparations = (enabled = true) => {
  return useQuery({
    queryKey: ['preparations'],
    queryFn: async (): Promise<PreparationsData> => {
      try {
        const response = await apiClient.api.getPreparationsGetAll()
        
        // Handle different response structures
        let preparations: PreparationResponse[] = []
        const responseData = (response as { data?: unknown })?.data

        // Check if responseData is directly an array
        if (Array.isArray(responseData)) {
          preparations = responseData as PreparationResponse[]
        } else if (responseData && typeof responseData === 'object') {
          const dataObj = responseData as Record<string, unknown>
          if (Array.isArray(dataObj.data)) {
            preparations = dataObj.data as PreparationResponse[]
          } else if (Array.isArray(dataObj.items)) {
            preparations = dataObj.items as PreparationResponse[]
          } else if (Array.isArray(dataObj.result)) {
            preparations = dataObj.result as PreparationResponse[]
          } else if (Array.isArray(dataObj.results)) {
            preparations = dataObj.results as PreparationResponse[]
          } else if (Array.isArray(dataObj.content)) {
            preparations = dataObj.content as PreparationResponse[]
          }
        } else if (Array.isArray(response)) {
          preparations = response as PreparationResponse[]
        }

        // Filter only active preparations
        preparations = preparations.filter((prep) => prep.isActive !== false)

        return {
          preparations,
        }
      } catch (error) {
        console.error('Error fetching preparations:', error)
        throw error
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}


