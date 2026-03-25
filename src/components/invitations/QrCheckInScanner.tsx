'use client'

import { useState } from 'react'
import { ScanLine, CheckCircle2, AlertTriangle, X, Camera, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { WeddingCheckInResponse } from '@/types/responses/invitation-book-response'

interface QrCheckInScannerProps {
  isOpen: boolean
  onClose: () => void
  onCheckIn: (qrPayload: string) => Promise<WeddingCheckInResponse>
}

export function QrCheckInScanner({ isOpen, onClose, onCheckIn }: QrCheckInScannerProps) {
  const [mode, setMode] = useState<'scan' | 'manual'>('manual')
  const [manualCode, setManualCode] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<WeddingCheckInResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCheckIn = async (payload: string) => {
    if (!payload.trim()) return
    setIsChecking(true)
    setError(null)
    setResult(null)
    try {
      const res = await onCheckIn(payload.trim())
      setResult(res)
      setManualCode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-in failed')
    } finally {
      setIsChecking(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setManualCode('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-purple-600 to-brand-500 px-6 pt-6 pb-8 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-3">
            <ScanLine className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-20 font-bold text-white">Wedding Check-In</h3>
          <p className="text-13 text-white/70 mt-1">Scan QR code or enter manually</p>
        </div>

        {/* Mode Tabs */}
        <div className="flex mx-6 -mt-4 relative z-10">
          <button
            type="button"
            onClick={() => { setMode('scan'); reset() }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-l-xl text-13 font-medium border-2 transition-all ${
              mode === 'scan'
                ? 'bg-purple-50 border-purple-300 text-purple-700'
                : 'bg-white border-gray-200 text-gray-500'
            }`}
          >
            <Camera className="h-4 w-4" />
            Camera
          </button>
          <button
            type="button"
            onClick={() => { setMode('manual'); reset() }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-r-xl text-13 font-medium border-2 border-l-0 transition-all ${
              mode === 'manual'
                ? 'bg-purple-50 border-purple-300 text-purple-700'
                : 'bg-white border-gray-200 text-gray-500'
            }`}
          >
            <Keyboard className="h-4 w-4" />
            Manual
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Camera Mode - Placeholder */}
          {mode === 'scan' && !result && !error && (
            <div className="aspect-square bg-gray-900 rounded-2xl flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-13">Camera QR scanning</p>
                <p className="text-11">Use manual entry for now</p>
              </div>
            </div>
          )}

          {/* Manual Mode */}
          {mode === 'manual' && !result && !error && (
            <div className="space-y-3">
              <div>
                <label className="text-12 font-medium text-gray-600 mb-1.5 block">QR Code / Token</label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckIn(manualCode)}
                  placeholder="Paste QR payload or invitation token..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-14 focus:border-purple-300 focus:ring-1 focus:ring-purple-200 outline-none transition-colors"
                  autoFocus
                />
              </div>
              <Button
                variant="brand"
                className="w-full text-white"
                onClick={() => handleCheckIn(manualCode)}
                disabled={!manualCode.trim() || isChecking}
                type="button"
              >
                <ScanLine className="h-4 w-4 mr-2" />
                {isChecking ? 'Checking in...' : 'Check In Guest'}
              </Button>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="text-center py-4">
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                result.alreadyCheckedIn ? 'bg-amber-100' : 'bg-green-100'
              }`}>
                {result.alreadyCheckedIn ? (
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                )}
              </div>
              <h4 className="text-18 font-bold text-gray-900 mb-1">{result.guestName}</h4>
              <p className={`text-14 font-medium mb-2 ${result.alreadyCheckedIn ? 'text-amber-600' : 'text-green-600'}`}>
                {result.message}
              </p>
              <div className="inline-flex items-center gap-1 text-13 text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                Party size: <span className="font-bold text-gray-700">{result.numberOfGuests}</span>
              </div>
              <div className="mt-4">
                <Button variant="outline" onClick={reset} type="button" className="mr-2">
                  Scan Next
                </Button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-14 font-medium text-red-600 mb-2">Check-in Failed</p>
              <p className="text-13 text-gray-500 mb-4">{error}</p>
              <Button variant="outline" onClick={reset} type="button">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
