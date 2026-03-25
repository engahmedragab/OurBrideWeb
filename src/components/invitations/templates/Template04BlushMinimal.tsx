'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 4: Blush Minimal — Clean modern minimalist with blush accents */
export function Template04BlushMinimal({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative" style={{ padding: `${44 * s}px ${36 * s}px`, background: '#FFFFFF' }}>
      <div className="text-center">
        <div className="inline-block px-3 py-1 rounded-full mb-4" style={{ background: '#FFF0F3', marginBottom: 16 * s }}>
          <p className="uppercase tracking-[0.3em] text-[#D4829D]" style={{ fontSize: 8 * s }}>Wedding</p>
        </div>

        <h2 className="text-[#2D2D2D]" style={{ fontSize: 32 * s, fontWeight: 300, letterSpacing: '-0.02em' }}>{brideName}</h2>
        <p className="text-[#D4829D] my-1" style={{ fontSize: 24 * s, fontWeight: 200 }}>&</p>
        <h2 className="text-[#2D2D2D]" style={{ fontSize: 32 * s, fontWeight: 300, letterSpacing: '-0.02em' }}>{groomName}</h2>

        <div className="mx-auto my-5" style={{ width: 40 * s, height: 1, background: '#E8C8D0', margin: `${20 * s}px auto` }} />

        {guestName && <p className="text-[#888] mb-3" style={{ fontSize: 12 * s }}>{guestName}</p>}

        {weddingDate && (
          <div className="mt-4">
            <p className="text-[#2D2D2D] font-medium" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#AAA]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid #F5E8EC' }}>
            <p className="text-[#555]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#AAA]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}

        {/* Bottom accent line */}
        <div className="mt-6 mx-auto" style={{ width: 60 * s, height: 3, background: 'linear-gradient(90deg, #FFD1DC, #E8A0B5)', borderRadius: 2, marginTop: 24 * s }} />
      </div>
    </div>
  )
}
