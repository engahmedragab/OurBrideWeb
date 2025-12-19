'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { Toast } from './Toast'

export interface ToastData {
  id: string
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastContextType {
  toasts: ToastData[]
  addToast: (
    message: string,
    type?: ToastData['type'],
    duration?: number
  ) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback(
    (
      message: string,
      type: ToastData['type'] = 'info',
      duration: number = 3000
    ) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      setToasts(prev => [...prev, { id, message, type, duration }])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
