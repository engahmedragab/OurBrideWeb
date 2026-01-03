import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  generateOrderInvoice,
  downloadOrderInvoice,
  generatePaymentReceipt,
  downloadPaymentReceipt,
} from '@/services/api/orderApi'
import type { ServiceInvoiceResponse, ServiceReceiptResponse } from '@/types/responses'

/**
 * Hook to generate order invoice
 */
export const useOrderInvoice = (
  orderId: number | null,
  query?: {
    providerId?: number
    enabled?: boolean
  }
) => {
  const { enabled = true, ...queryParams } = query || {}

  return useQuery<ServiceInvoiceResponse>({
    queryKey: ['order', orderId, 'invoice', queryParams],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required')
      return await generateOrderInvoice(orderId, queryParams)
    },
    enabled: enabled && !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to download order invoice as PDF
 */
export const useDownloadOrderInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      query,
    }: {
      orderId: number
      query?: { providerId?: number }
    }) => {
      // Use downloadOrderInvoice API endpoint for PDF download
      const blob = await downloadOrderInvoice(orderId, query)
      return blob
    },
    onSuccess: (blob, variables) => {
      // Create download link for PDF
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-order-${variables.orderId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      // Invalidate invoice query
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId, 'invoice'] })
    },
  })
}

/**
 * Hook to generate payment receipt
 */
export const usePaymentReceipt = (
  orderId: number | null,
  paymentId: number | null,
  query?: {
    providerId?: number
    enabled?: boolean
  }
) => {
  const { enabled = true, ...queryParams } = query || {}

  return useQuery<ServiceReceiptResponse>({
    queryKey: ['order', orderId, 'payment', paymentId, 'receipt', queryParams],
    queryFn: async () => {
      if (!orderId || !paymentId) throw new Error('Order ID and Payment ID are required')
      return await generatePaymentReceipt(orderId, paymentId, queryParams)
    },
    enabled: enabled && !!orderId && !!paymentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to download payment receipt as PDF
 */
export const useDownloadPaymentReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      paymentId,
      query,
    }: {
      orderId: number
      paymentId: number
      query?: { providerId?: number }
    }) => {
      const blob = await downloadPaymentReceipt(orderId, paymentId, query)
      return blob
    },
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `receipt-order-${variables.orderId}-payment-${variables.paymentId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      // Invalidate receipt query
      queryClient.invalidateQueries({
        queryKey: ['order', variables.orderId, 'payment', variables.paymentId, 'receipt'],
      })
    },
  })
}

