'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 20: Coral Reef (Brand) — OurBride brand coral with modern flair */
export function Template20CoralReef({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(160deg, #FFF5F3 0%, #FFFFFF 40%, #FFF0ED 100%)' }}>
      {/* Brand accent shapes */}
      <div className="absolute -top-6 -right-6 rounded-full" style={{ width: 80 * s, height: 80 * s, background: 'radial-gradient(circle, rgba(241,72,54,0.08), transparent)' }} />
      <div className="absolute -bottom-6 -left-6 rounded-full" style={{ width: 80 * s, height: 80 * s, background: 'radial-gradient(circle, rgba(241,72,54,0.06), transparent)' }} />

      {/* Brand stripe top */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 3 * s, background: 'linear-gradient(90deg, #F14836, #FF7B6B, #F14836)' }} />

      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#F14836] opacity-30" />
          <div className="h-2 w-2 rounded-full" style={{ background: '#F14836', opacity: 0.3 }} />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#F14836] opacity-30" />
        </div>

        <p className="uppercase tracking-[0.25em] text-[#F14836]" style={{ fontSize: 9 * s }}>We&apos;re Getting Married!</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-[#2D2D2D]" style={{ fontSize: 30 * s, fontWeight: 300 }}>{brideName}</h2>
          <p className="my-1" style={{ fontSize: 22 * s, color: '#F14836', fontWeight: 200 }}>&amp;</p>
          <h2 className="text-[#2D2D2D]" style={{ fontSize: 30 * s, fontWeight: 300 }}>{groomName}</h2>
        </div>

        <div className="mx-auto" style={{ width: 60 * s, height: 2, background: 'linear-gradient(90deg, transparent, #F14836, transparent)', borderRadius: 1 }} />

        {guestName && (
          <p className="mt-3 inline-block px-4 py-1 rounded-full text-[#F14836]" style={{ fontSize: 12 * s, background: 'rgba(241,72,54,0.06)' }}>
            {guestName}
          </p>
        )}

        {weddingDate && (
          <div className="mt-4">
            <p className="text-[#2D2D2D] font-semibold" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#F14836]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#2D2D2D]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#999]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}

        {/* Brand stripe bottom */}
        <div className="mx-auto mt-5" style={{ width: 40 * s, height: 3, background: '#F14836', borderRadius: 2, marginTop: 20 * s }} />
      </div>
    </div>
  )
}
