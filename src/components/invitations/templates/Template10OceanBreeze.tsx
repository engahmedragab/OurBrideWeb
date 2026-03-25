'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 10: Ocean Breeze — Coastal teal and sand tones */
export function Template10OceanBreeze({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(180deg, #E0F4F4 0%, #F0FAFA 40%, #FFF8F0 100%)' }}>
      {/* Wave pattern */}
      <svg className="absolute bottom-0 left-0 right-0 opacity-10" viewBox="0 0 400 60" style={{ height: 40 * s }}>
        <path d="M0 30C50 10 100 50 150 30C200 10 250 50 300 30C350 10 400 50 400 30V60H0Z" fill="#2C7A7B" />
        <path d="M0 40C50 20 100 55 150 40C200 20 250 55 300 40C350 20 400 55 400 40V60H0Z" fill="#2C7A7B" opacity="0.5" />
      </svg>

      <div className="text-center relative">
        <p className="uppercase tracking-[0.25em] text-[#38B2AC]" style={{ fontSize: 9 * s }}>Beach Wedding</p>

        <div className="my-5" style={{ margin: `${20 * s}px 0` }}>
          <h2 className="text-[#234E52]" style={{ fontSize: 30 * s, fontWeight: 300 }}>{brideName}</h2>
          <p className="text-[#81E6D9] italic my-1" style={{ fontSize: 22 * s }}>&amp;</p>
          <h2 className="text-[#234E52]" style={{ fontSize: 30 * s, fontWeight: 300 }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#4FD1C5]" style={{ fontSize: 12 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4 inline-block px-5 py-2 rounded-full" style={{ background: 'rgba(56,178,172,0.08)', border: '1px solid rgba(56,178,172,0.15)' }}>
            <p className="text-[#234E52] font-medium" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#4FD1C5]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#234E52]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#68D1C8]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
