/**
 * SKU Conflict Info
 */

import type { ProviderConflictInfo } from './provider-conflict-info'

export interface SkuConflictInfo {
  sku: string
  providerCount: number
  providers: ProviderConflictInfo[]
}
