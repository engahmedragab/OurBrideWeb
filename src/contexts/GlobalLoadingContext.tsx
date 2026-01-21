'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { GlobalLoader } from '@/components/ui/GlobalLoader'

interface GlobalLoadingContextType {
  isLoading: boolean
  loadingText: string
  setLoading: (isLoading: boolean, text?: string) => void
  showLoading: (text?: string) => void
  hideLoading: () => void
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined)

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading...')

  const setLoading = useCallback((loading: boolean, text: string = 'Loading...') => {
    setIsLoading(loading)
    setLoadingText(text)
  }, [])

  const showLoading = useCallback((text: string = 'Loading...') => {
    setIsLoading(true)
    setLoadingText(text)
  }, [])

  const hideLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <GlobalLoadingContext.Provider
      value={{
        isLoading,
        loadingText,
        setLoading,
        showLoading,
        hideLoading,
      }}
    >
      {children}
      <GlobalLoader isLoading={isLoading} text={loadingText} />
    </GlobalLoadingContext.Provider>
  )
}

export function useGlobalLoader() {
  const context = useContext(GlobalLoadingContext)
  if (context === undefined) {
    throw new Error('useGlobalLoader must be used within a GlobalLoadingProvider')
  }
  return context
}
