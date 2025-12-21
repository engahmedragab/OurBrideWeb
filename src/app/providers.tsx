'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/reactQuery'
import { ToastProvider } from '@/components/ui/Toaster'
import { AuthProvider } from '@/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
