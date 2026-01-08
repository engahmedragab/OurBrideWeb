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
      const responseAny: any = response
      
      // Log response for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('File upload response:', {
          response,
          responseType: typeof response,
          responseKeys: response ? Object.keys(response) : [],
          responseData: responseAny?.data,
          responseDataKeys: responseAny?.data ? Object.keys(responseAny.data) : [],
          fullResponse: JSON.stringify(responseAny, null, 2),
        })
      }
      
      // Handle Axios response structure (response.data contains the actual data)
      // The API client might wrap the response in an Axios response object
      let actualData = responseAny
      if (responseAny?.data !== undefined) {
        // If response.data exists, it might be the actual response or an Axios wrapper
        // Check if it's an Axios response structure
        if (responseAny.status && responseAny.headers && responseAny.data) {
          actualData = responseAny.data
        } else {
          actualData = responseAny.data
        }
      }
      
      // Handle different response structures
      let url = ''
      let fileName = ''
      
      // Store full media data for MediaRequest creation
      let mediaData: any = null
      
      // Try multiple possible response structures using actualData
      // 1. actualData.data.url (nested data structure) - This matches the user's response format
      if (actualData?.data?.url) {
        url = actualData.data.url
        fileName = actualData.data.fileName || actualData.data.fileId || ''
        mediaData = actualData.data // Store full media response for MediaRequest
      }
      // 2. actualData.url (direct URL property)
      else if (actualData?.url) {
        url = actualData.url
        fileName = actualData.fileName || actualData.fileId || ''
        mediaData = actualData // Store full media response
      }
      // 3. actualData as string (URL string directly)
      else if (typeof actualData === 'string' && actualData) {
        url = actualData
      }
      // 4. actualData as object with various URL properties
      else if (actualData && typeof actualData === 'object') {
        url = actualData.url || 
              actualData.fileId || 
              actualData.thumbnailUrl || 
              actualData.previewUrl || 
              actualData.originalUrl || 
              ''
        fileName = actualData.fileName || 
                   actualData.fileId || 
                   actualData.name || 
                   ''
      }
      // 5. Fallback: check responseAny structure again
      else if (responseAny?.data?.data?.url) {
        url = responseAny.data.data.url
        fileName = responseAny.data.data.fileName || responseAny.data.data.fileId || ''
        mediaData = responseAny.data.data // Store full media response
      }
      else if (responseAny?.data?.url) {
        url = responseAny.data.url
        fileName = responseAny.data.fileName || responseAny.data.fileId || ''
        mediaData = responseAny.data // Store full media response
      }
      else if (responseAny?.url) {
        url = responseAny.url
        fileName = responseAny.fileName || responseAny.fileId || ''
        mediaData = responseAny // Store full media response
      }
      
      // If still no URL, check for fileId and construct download URL
      if (!url && fileName) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        url = `${baseUrl}/api/v1/files/download/${fileName}`
      }
      
      // If we have a fileId but no URL, try to construct it
      if (!url && (actualData?.fileId || responseAny?.data?.fileId)) {
        const fileId = actualData?.fileId || responseAny?.data?.fileId
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        url = `${baseUrl}/api/v1/files/download/${fileId}`
        fileName = fileId
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
        console.error('Could not extract URL from upload response:', errorDetails)
        throw new Error(
          `No URL found in upload response. ` +
          `Please check the server response structure. ` +
          `Response keys: ${responseAny ? Object.keys(responseAny).join(', ') : 'none'}`
        )
      }
      
      return { url, fileName, mediaData }
    } catch (error) {
      console.error('File upload failed:', error)
      throw error
    }
  },

  /**
   * Upload multiple files
   * @param files - Array of files to upload
   * @returns Promise with array of upload responses
   */
  uploadMultipleFiles: async (files: File[]): Promise<Array<{ url: string; fileName?: string }>> => {
    try {
      // Note: The API endpoint may require FormData for multiple files
      // For now, we'll use the query parameter structure that matches the API signature
      const response = await apiClient.api.postFilesUploadFiles()
      const responseAny: any = response
      
      // Handle different response structures
      let results: Array<{ url: string; fileName?: string }> = []
      
      if (Array.isArray(responseAny?.data)) {
        results = responseAny.data.map((item: any) => {
          let url = item?.url || item?.fileId || ''
          const fileName = item?.fileName || item?.fileId || ''
          
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
      console.error('Multiple file upload failed:', error)
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
      console.error('File deletion failed:', error)
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
      const responseAny: any = response
      return responseAny?.data?.url || responseAny?.url || ''
    } catch (error) {
      console.error('Failed to get download URL:', error)
      throw error
    }
  },
}

