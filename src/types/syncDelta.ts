export type DeltaSet<T> = {
  created: T[]
  updated: T[]
  deletedIds: number[]
  tempIdMap?: Record<string, number>
}

export type SyncBookDeltaRequest<TLine, TCategory> = {
  bookId?: number
  eventId?: number
  lastSyncAt?: string
  lines: DeltaSet<TLine>
  lineCategories: DeltaSet<TCategory>
}

export type SyncBookDeltaResponse<TBook> = {
  book: TBook
  serverTime?: string
  categoryIdMap: Record<string, number>
  lineIdMap: Record<string, number>
}
