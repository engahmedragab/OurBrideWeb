/**
 * Payment Gateway Response
 */

import type { PaymentGatewaySettingResponse } from './payment-gateway-setting-response'

export interface PaymentGatewayResponse {
  id: string
  title: string
  description: string
  order: string
  enabled: boolean | null
  methodTitle: string
  methodDescription: string
  settings: { [key: string]: PaymentGatewaySettingResponse }
}
