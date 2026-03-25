'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 11: Midnight & Gold — Black with gold geometric art deco */
export function Template11MidnightGold({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: '#111111' }}>
      {/* Art deco geometric lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#C9A96E" strokeWidth="0.3" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#C9A96E" strokeWidth="0.3" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#C9A96E" strokeWidth="0.3" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#C9A96E" strokeWidth="0.3" />
      </svg>

      {/* Gold border */}
      <div className="absolute inset-4 border border-[#C9A96E] opacity-30" style={{ inset: 16 * s }} />

      <div className="text-center relative">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#C9A96E]" />
          <span className="text-[#C9A96E] text-[10px]" style={{ fontSize: 10 * s }}>&#9670;</span>
          <div className="h-px w-10 bg-[#C9A96E]" />
        </div>

        <p className="uppercase tracking-[0.4em] text-[#C9A96E]" style={{ fontSize: 8 * s }}>The Wedding of</p>

        <div className="my-6" style={{ margin: `${24 * s}px 0` }}>
          <h2 className="text-white font-light tracking-wider" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif' }}>{brideName}</h2>
          <p className="text-[#C9A96E] my-2" style={{ fontSize: 18 * s }}>&amp;</p>
          <h2 className="text-white font-light tracking-wider" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif' }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#888] tracking-wide" style={{ fontSize: 12 * s }}>{guestName}</p>}

        {weddingDate && (
          <div className="mt-5">
            <p className="text-[#C9A96E] font-medium" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#666]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-white" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#666]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mt-5">
          <span className="text-[#C9A96E]" style={{ fontSize: 10 * s }}>&#9670;</span>
        </div>
      </div>
    </div>
  )
}
