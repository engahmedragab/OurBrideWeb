'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 18: Peach Watercolor — Soft peach blobs with handwritten style */
export function Template18PeachWatercolor({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: '#FFFFFF' }}>
      {/* Watercolor blobs */}
      <div className="absolute -top-5 -left-5 rounded-full" style={{ width: 100 * s, height: 80 * s, background: 'radial-gradient(ellipse, rgba(255,180,150,0.2), transparent 70%)' }} />
      <div className="absolute -top-3 -right-8 rounded-full" style={{ width: 80 * s, height: 100 * s, background: 'radial-gradient(ellipse, rgba(255,200,170,0.15), transparent 70%)' }} />
      <div className="absolute -bottom-5 left-1/4 rounded-full" style={{ width: 120 * s, height: 60 * s, background: 'radial-gradient(ellipse, rgba(255,190,160,0.15), transparent 70%)' }} />
      <div className="absolute -bottom-8 -right-5 rounded-full" style={{ width: 90 * s, height: 90 * s, background: 'radial-gradient(ellipse, rgba(255,170,140,0.12), transparent 70%)' }} />

      <div className="text-center relative">
        <p className="text-[#E08060] italic" style={{ fontSize: 11 * s, fontFamily: 'Georgia, serif' }}>you&apos;re invited to celebrate</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-[#7A4030] italic" style={{ fontSize: 32 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{brideName}</h2>
          <p className="text-[#E08060] my-1" style={{ fontSize: 22 * s, fontFamily: 'Georgia, serif' }}>&amp;</p>
          <h2 className="text-[#7A4030] italic" style={{ fontSize: 32 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{groomName}</h2>
        </div>

        <div className="mx-auto" style={{ width: 60 * s, height: 1, background: 'linear-gradient(90deg, transparent, #E8A888, transparent)' }} />

        {guestName && <p className="text-[#C07050] mt-3" style={{ fontSize: 12 * s }}>{guestName}</p>}

        {weddingDate && (
          <div className="mt-4">
            <p className="text-[#7A4030] font-medium" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#E08060]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#7A4030]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#C08060]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
