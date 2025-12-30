/**
 * Decision Option Response
 */

import type { BaseEntityResponse } from '../common'

export interface DecisionOptionResponse extends BaseEntityResponse {
  decisionGroupId: number
  optionText: string
  description: string
  imageUrl: string
  order: number
  voteCount: number
  percentage: number
}









