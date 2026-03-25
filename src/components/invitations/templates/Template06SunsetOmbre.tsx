'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 6: Sunset Ombré — Warm sunset gradient with flowing typography */
export function Template06SunsetOmbre({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(180deg, #FFF5EB 0%, #FFE8D6 30%, #FFDDC1 60%, #F8C8A8 100%)' }}>
      {/* Sun glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full" style={{
        width: 120 * s, height: 120 * s, marginTop: -40 * s,
        background: 'radial-gradient(circle, rgba(255,180,100,0.3) 0%, transparent 70%)',
      }} />

      <div className="text-center relative">
        <p className="uppercase tracking-[0.2em] text-[#C4875A]" style={{ fontSize: 9 * s }}>Save the Date</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-[#7A4B2A]" style={{ fontSize: 30 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{brideName}</h2>
          <p className="text-[#D4956A] italic" style={{ fontSize: 20 * s, fontFamily: 'Georgia, serif' }}>and</p>
          <h2 className="text-[#7A4B2A]" style={{ fontSize: 30 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{groomName}</h2>
        </div>

        <div className="mx-auto" style={{ width: 80 * s, height: 1, background: 'linear-gradient(90deg, transparent, #D4956A, transparent)' }} />

        {guestName && <p className="text-[#A06840] mt-3" style={{ fontSize: 12 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4">
            <p className="text-[#7A4B2A] font-semibold" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#C4875A]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#7A4B2A]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#B08060]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
