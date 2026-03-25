'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 3: Royal Navy — Deep navy with silver/white lettering, regal feel */
export function Template03RoyalNavy({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, area, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(135deg, #1B2A4A 0%, #0F1F3D 50%, #1B2A4A 100%)' }}>
      {/* Silver star accents */}
      <div className="absolute inset-0" style={{ opacity: 0.08 }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }} />
        ))}
      </div>

      {/* Silver frame border */}
      <div className="absolute inset-3 border border-[#C0C0C0] opacity-30 rounded-lg" style={{ inset: 12 * s }} />

      <div className="text-center relative">
        <p className="uppercase tracking-[0.35em] text-[#8896B5]" style={{ fontSize: 9 * s }}>You are invited to celebrate</p>
        <p className="uppercase tracking-[0.2em] text-[#6B7DA0]" style={{ fontSize: 8 * s, marginTop: 4 * s }}>the union of</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-white font-light" style={{ fontSize: 30 * s, fontFamily: 'Georgia, serif' }}>{brideName}</h2>
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px flex-1 max-w-[50px] bg-gradient-to-r from-transparent to-[#8896B5]" />
            <span className="text-[#C0C0C0]" style={{ fontSize: 12 * s }}>&#10022;</span>
            <div className="h-px flex-1 max-w-[50px] bg-gradient-to-l from-transparent to-[#8896B5]" />
          </div>
          <h2 className="text-white font-light" style={{ fontSize: 30 * s, fontFamily: 'Georgia, serif' }}>{groomName}</h2>
        </div>

        {guestName && (
          <p className="text-[#B0BFD8] font-medium" style={{ fontSize: 13 * s }}>
            Dear {guestName}
          </p>
        )}

        {weddingDate && (
          <div className="mt-4 py-3 border-t border-b border-[#2A3C62]" style={{ marginTop: 16 * s }}>
            <p className="font-semibold text-[#D4DCE8]" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#8896B5]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#D4DCE8]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#6B7DA0]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
