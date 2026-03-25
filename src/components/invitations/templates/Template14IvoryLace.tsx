'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 14: Ivory Lace — Delicate lace pattern overlay on ivory */
export function Template14IvoryLace({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: '#FFFEF8' }}>
      {/* Lace pattern top */}
      <div className="absolute top-0 left-0 right-0 opacity-[0.06]" style={{ height: 30 * s }}>
        <svg width="100%" height="100%">
          <pattern id="lace" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="10" fill="none" stroke="#666" strokeWidth="0.3" />
            <circle cx="15" cy="15" r="5" fill="none" stroke="#666" strokeWidth="0.3" />
            <circle cx="0" cy="0" r="5" fill="none" stroke="#666" strokeWidth="0.3" />
            <circle cx="30" cy="0" r="5" fill="none" stroke="#666" strokeWidth="0.3" />
            <circle cx="0" cy="30" r="5" fill="none" stroke="#666" strokeWidth="0.3" />
            <circle cx="30" cy="30" r="5" fill="none" stroke="#666" strokeWidth="0.3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#lace)" />
        </svg>
      </div>

      {/* Same at bottom */}
      <div className="absolute bottom-0 left-0 right-0 opacity-[0.06]" style={{ height: 30 * s }}>
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#lace)" />
        </svg>
      </div>

      <div className="text-center relative">
        <p className="uppercase tracking-[0.3em] text-[#A89880]" style={{ fontSize: 9 * s }}>Mr. &amp; Mrs.</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-[#4A3F30] italic" style={{ fontSize: 30 * s, fontFamily: 'Georgia, serif' }}>{brideName}</h2>
          <p className="text-[#C9B896] my-1" style={{ fontSize: 18 * s, fontFamily: 'Georgia, serif' }}>&amp;</p>
          <h2 className="text-[#4A3F30] italic" style={{ fontSize: 30 * s, fontFamily: 'Georgia, serif' }}>{groomName}</h2>
        </div>

        <div className="mx-auto" style={{ width: 100 * s, height: 1, background: 'linear-gradient(90deg, transparent, #C9B896, transparent)' }} />

        {guestName && <p className="text-[#8B7355] mt-3" style={{ fontSize: 12 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4">
            <p className="text-[#4A3F30] font-medium" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#A89880]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#4A3F30]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#A89880]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
