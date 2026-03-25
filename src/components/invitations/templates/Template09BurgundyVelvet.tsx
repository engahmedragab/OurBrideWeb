'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 9: Burgundy Velvet — Deep burgundy with cream lettering, luxurious */
export function Template09BurgundyVelvet({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(160deg, #4A0E1F 0%, #6B1430 40%, #4A0E1F 100%)' }}>
      {/* Velvet texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />

      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }} />

      <div className="text-center relative">
        <p className="uppercase tracking-[0.35em] text-[#C9A96E]" style={{ fontSize: 8 * s }}>Together with their families</p>

        <div className="my-6" style={{ margin: `${24 * s}px 0` }}>
          <h2 className="text-[#F5E6D0]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif' }}>{brideName}</h2>
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px flex-1 max-w-[35px] bg-[#C9A96E] opacity-40" />
            <span className="text-[#C9A96E]" style={{ fontSize: 10 * s }}>&#9830;</span>
            <div className="h-px flex-1 max-w-[35px] bg-[#C9A96E] opacity-40" />
          </div>
          <h2 className="text-[#F5E6D0]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif' }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#D4A0A8]" style={{ fontSize: 13 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-5 py-3 border-t border-b border-[#8B2040]" style={{ marginTop: 20 * s }}>
            <p className="text-[#F5E6D0] font-medium" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#D4A0A8]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#C9A96E]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#9B6070]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
