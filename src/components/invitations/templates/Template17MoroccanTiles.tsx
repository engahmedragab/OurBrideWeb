'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 17: Moroccan Tiles — Zellige-inspired geometric tile border */
export function Template17MoroccanTiles({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: '#FFFDF5' }}>
      {/* Tile border pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg width="100%" height="100%">
          <pattern id="moroc" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="none" />
            <path d="M12 0L24 12L12 24L0 12Z" fill="none" stroke="#1A5F7A" strokeWidth="0.5" />
            <path d="M12 4L20 12L12 20L4 12Z" fill="#1A5F7A" opacity="0.3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#moroc)" />
        </svg>
      </div>

      {/* Inner border */}
      <div className="absolute inset-5 border-2 border-[#1A5F7A] opacity-15 rounded-lg" style={{ inset: 20 * s }} />

      <div className="text-center relative">
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg width={30 * s} height={16 * s} viewBox="0 0 30 16" fill="none">
            <path d="M15 0L30 8L15 16L0 8Z" fill="#C9A96E" opacity="0.3" />
            <path d="M15 4L22 8L15 12L8 8Z" fill="#C9A96E" opacity="0.2" />
          </svg>
        </div>

        <p className="uppercase tracking-[0.25em] text-[#1A5F7A]" style={{ fontSize: 9 * s }}>Wedding Celebration</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-[#0D3347]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{brideName}</h2>
          <div className="flex items-center justify-center gap-2 my-2">
            <div className="h-px w-8 bg-[#C9A96E] opacity-40" />
            <span className="text-[#C9A96E]" style={{ fontSize: 14 * s }}>&#10022;</span>
            <div className="h-px w-8 bg-[#C9A96E] opacity-40" />
          </div>
          <h2 className="text-[#0D3347]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#1A5F7A]" style={{ fontSize: 12 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4">
            <p className="text-[#0D3347] font-medium" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#1A5F7A]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#0D3347]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#2A7F9A]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
