import { apiClient } from './apiClient'

/**
 * Files Service
 * Wraps the Files API endpoints for file operations
 */
export const FilesService = {
  /**
   * Upload a file
   * @param file - The file to upload
   * @returns Promise with the upload response containing URL
   */
  uploadFile: async (file: File): Promise<{ url: string; fileName?: string; mediaData?: Record<string, unknown> }> => {
    try {
      const response = await apiClient.api.postFilesUploadFile({ file })
      const responseAny = response as unknown as Record<string, unknown>
      
      // Log response for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
      }
      
      // Handle Axios response structure (response.data contains the actual data)
      // The API client might wrap the response in an Axios response object
      let actualData: Record<string, unknown> | string | null = responseAny
      if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
        // If response.data exists, it might be the actual response or an Axios wrapper
        // Check if it's an Axios response structure
        if ('status' in responseAny && 'headers' in responseAny && responseAny.data) {
          actualData = responseAny.data as Record<string, unknown>
        } else {
          actualData = responseAny.data as Record<string, unknown>
        }
      }
      
      // Handle different response structures
      let url = ''
      let fileName = ''
      
      // Store full media data for MediaRequest creation
      let mediaData: Record<string, unknown> | undefined = undefined
      
      // Try multiple possible response structures using actualData
      // 1. actualData.data.url (nested data structure) - This matches the user's response format
      if (actualData && typeof actualData === 'object' && 'data' in actualData) {
        const nestedData = actualData.data as Record<string, unknown>
        if (typeof nestedData === 'object' && nestedData !== null && 'url' in nestedData) {
          url = String(nestedData.url || '')
          fileName = String(nestedData.fileName || nestedData.fileId || '')
          mediaData = nestedData as Record<string, unknown>
        }
      }
      // 2. actualData.url (direct URL property)
      else if (actualData && typeof actualData === 'object' && 'url' in actualData) {
        url = String(actualData.url || '')
        fileName = String(actualData.fileName || actualData.fileId || '')
        mediaData = actualData as Record<string, unknown>
      }
      // 3. actualData as string (URL string directly)
      else if (typeof actualData === 'string' && actualData) {
        url = actualData
      }
      // 4. actualData as object with various URL properties
      else if (actualData && typeof actualData === 'object') {
        url = String(actualData.url || 
              actualData.fileId || 
              actualData.thumbnailUrl || 
              actualData.previewUrl || 
              actualData.originalUrl || 
              '')
        fileName = String(actualData.fileName || 
                   actualData.fileId || 
                   actualData.name || 
                   '')
      }
      // 5. Fallback: check responseAny structure again
      else if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
        const data = responseAny.data
        if (data && typeof data === 'object' && 'data' in data) {
          const nestedData = data.data as Record<string, unknown>
          if (typeof nestedData === 'object' && nestedData !== null && 'url' in nestedData) {
            url = String(nestedData.url || '')
            fileName = String(nestedData.fileName || nestedData.fileId || '')
            mediaData = nestedData as Record<string, unknown>
          }
        } else if (data && typeof data === 'object' && 'url' in data) {
          url = String((data as Record<string, unknown>).url || '')
          fileName = String((data as Record<string, unknown>).fileName || (data as Record<string, unknown>).fileId || '')
          mediaData = data as Record<string, unknown>
        }
      }
      else if (responseAny && typeof responseAny === 'object' && 'url' in responseAny) {
        url = String(responseAny.url || '')
        fileName = String(responseAny.fileName || responseAny.fileId || '')
        mediaData = responseAny as Record<string, unknown>
      }
      
      // If still no URL, check for fileId and construct download URL
      if (!url && fileName) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        url = `${baseUrl}/api/v1/files/download/${fileName}`
      }
      
      // If we have a fileId but no URL, try to construct it
      if (!url) {
        const fileId = (actualData && typeof actualData === 'object' && 'fileId' in actualData ? String(actualData.fileId) : null) ||
                      (responseAny && typeof responseAny === 'object' && 'data' in responseAny && 
                       responseAny.data && typeof responseAny.data === 'object' && 'fileId' in responseAny.data
                       ? String((responseAny.data as Record<string, unknown>).fileId) : null)
        if (fileId) {
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
          url = `${baseUrl}/api/v1/files/download/${fileId}`
          fileName = fileId
        }
      }
      
      // Ensure we have a full URL if we have a relative path
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        if (url.startsWith('/')) {
          url = `${baseUrl}${url}`
        } else if (url) {
          // If it's just a filename, construct download URL
          url = `${baseUrl}/api/v1/files/download/${url}`
        }
      }
      
      // If still no URL, throw error with response details
      if (!url) {
        const errorDetails = {
          response,
          responseAny,
          actualData,
          responseData: responseAny?.data,
          responseKeys: responseAny ? Object.keys(responseAny) : [],
          actualDataKeys: actualData ? Object.keys(actualData) : [],
        }
        throw new Error(
          `No URL found in upload response. ` +
          `Please check the server response structure. ` +
          `Response keys: ${responseAny ? Object.keys(responseAny).join(', ') : 'none'}`
        )
      }
      
      return { url, fileName, mediaData }
    } catch (error) {
      throw error
    }
  },

  /**
   * Upload multiple files
   * @param _files - Array of files to upload
   * @returns Promise with array of upload responses
   */
  uploadMultipleFiles: async (_files: File[]): Promise<Array<{ url: string; fileName?: string }>> => {
    try {
      // Note: The API endpoint may require FormData for multiple files
      // For now, we'll use the query parameter structure that matches the API signature
      const response = await apiClient.api.postFilesUploadFiles()
      const responseAny = response as unknown as Record<string, unknown>
      
      // Handle different response structures
      let results: Array<{ url: string; fileName?: string }> = []
      
      if (responseAny && typeof responseAny === 'object' && 'data' in responseAny && Array.isArray(responseAny.data)) {
        results = (responseAny.data as unknown[]).map((item: unknown) => {
          const itemObj = item as Record<string, unknown>
          let url = String(itemObj?.url || itemObj?.fileId || '')
          const fileName = String(itemObj?.fileName || itemObj?.fileId || '')
          
          // Ensure we have a full URL
          if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
            if (url.startsWith('/')) {
              url = `${baseUrl}${url}`
            } else {
              url = `${baseUrl}/api/v1/files/download/${url}`
            }
          }
          
          return { url, fileName }
        })
      }
      
      return results
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete a file by filename
   * @param fileName - The name of the file to delete
   * @returns Promise with the deletion response
   */
  deleteFile: async (fileName: string): Promise<void> => {
    try {
      await apiClient.api.deleteFilesDeleteFile(fileName)
    } catch (error) {
      throw error
    }
  },

  /**
   * Get download URL for a file
   * @param fileName - The name of the file
   * @returns Promise with the download URL
   */
  getDownloadUrl: async (fileName: string): Promise<string> => {
    try {
      const response = await apiClient.api.getFilesGetDownloadUrl(fileName)
      const responseAny = response as unknown as Record<string, unknown>
      
      if (responseAny && typeof responseAny === 'object' && 'data' in responseAny) {
        const data = responseAny.data
        if (data && typeof data === 'object' && 'url' in data) {
          return String((data as Record<string, unknown>).url || '')
        }
      }
      if (responseAny && typeof responseAny === 'object' && 'url' in responseAny) {
        return String(responseAny.url || '')
      }
      return ''
    } catch (error) {
      throw error
    }
  },
}

