/**
 * API Result Wrapper
 */

export interface ApiResult<T> {
  data: T
  success: boolean
  statusCode: number
  message: string
  errors?: string[]
}


