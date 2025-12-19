export type PreparationService = {
  id: string
  title: string
  icon: { kind: 'asset' | 'uploaded'; value: string }
  serviceType: string
  quantity: number
  cost: number
  advancePayment: number
  providerUserName: string
  purchaseDate: string // yyyy-mm-dd
  completed: boolean
}

export type ServiceType = {
  id: string
  label: string
}
