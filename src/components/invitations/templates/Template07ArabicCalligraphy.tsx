'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 7: Arabic Calligraphy — Islamic geometric patterns with arabesque borders */
export function Template07ArabicCalligraphy({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${38 * s}px`, background: 'linear-gradient(135deg, #F8F4E8 0%, #FFF9EE 50%, #F8F4E8 100%)' }}>
      {/* Islamic geometric border pattern */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="opacity-[0.06]">
          <pattern id="islamic" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#8B6914" strokeWidth="0.5" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="#8B6914" strokeWidth="0.3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic)" />
        </svg>
      </div>

      {/* Ornate inner frame */}
      <div className="absolute inset-5 border-2 border-[#C9A96E] opacity-20 rounded" style={{ inset: 20 * s }} />
      <div className="absolute inset-6 border border-[#C9A96E] opacity-10 rounded" style={{ inset: 24 * s }} />

      <div className="text-center relative">
        {/* Bismillah-style ornament */}
        <div className="flex items-center justify-center mb-3">
          <svg width={80 * s} height={24 * s} viewBox="0 0 80 24" fill="none">
            <path d="M0 12H15M65 12H80" stroke="#C9A96E" strokeWidth="0.5" />
            <path d="M20 12C20 6 30 2 40 2S60 6 60 12S50 22 40 22S20 18 20 12Z" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.5" />
            <path d="M30 12C30 9 35 6 40 6S50 9 50 12S45 18 40 18S30 15 30 12Z" fill="#C9A96E" opacity="0.1" />
          </svg>
        </div>

        <p className="text-[#8B6914] uppercase tracking-[0.2em]" style={{ fontSize: 9 * s }}>بسم الله الرحمن الرحيم</p>
        <p className="text-[#A08040] tracking-[0.15em] mt-1" style={{ fontSize: 8 * s }}>With the blessing of the Almighty</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-[#5A4010]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{brideName}</h2>
          <div className="flex items-center justify-center gap-2 my-2">
            <div className="h-px flex-1 max-w-[30px] bg-[#C9A96E] opacity-50" />
            <span className="text-[#C9A96E]" style={{ fontSize: 16 * s }}>&#10041;</span>
            <div className="h-px flex-1 max-w-[30px] bg-[#C9A96E] opacity-50" />
          </div>
          <h2 className="text-[#5A4010]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#8B6914]" style={{ fontSize: 12 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}>
            <p className="text-[#5A4010] font-medium" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#A08040]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#5A4010]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#A08040]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
