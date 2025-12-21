/**
 * Queue Status Response
 */

export interface QueueStatusResponse {
  queueItemId: number
  status: string // "Queued", "Processing", "Completed", "Failed", "Retrying"
  jobType: string
  processingStartedAt: string | null // ISO DateTime string
  processingCompletedAt: string | null // ISO DateTime string
  processingDurationMs: number | null
  retryCount: number
  maxRetryAttempts: number
  errorMessage: string
  entityType: string
  entityId: string
  creationDate: string // ISO DateTime string
}
