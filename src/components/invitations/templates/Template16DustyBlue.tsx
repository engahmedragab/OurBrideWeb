'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 16: Dusty Blue — Muted blue watercolor with silver accents */
export function Template16DustyBlue({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(160deg, #EEF2F7 0%, #F5F8FC 40%, #E8EEF5 100%)' }}>
      <div className="absolute -top-10 -right-10 rounded-full opacity-10" style={{ width: 100 * s, height: 100 * s, background: 'radial-gradient(circle, #7B9EC4, transparent)' }} />
      <div className="absolute -bottom-8 -left-8 rounded-full opacity-10" style={{ width: 90 * s, height: 90 * s, background: 'radial-gradient(circle, #8BAEC8, transparent)' }} />

      <div className="text-center relative">
        <p className="uppercase tracking-[0.3em] text-[#7B9EC4]" style={{ fontSize: 9 * s }}>With Great Joy</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-[#3A5A7C]" style={{ fontSize: 30 * s, fontWeight: 300 }}>{brideName}</h2>
          <div className="flex items-center justify-center gap-2 my-2">
            <div className="h-px w-8 bg-[#B0C8DC]" />
            <div className="h-2 w-2 rounded-full bg-[#7B9EC4] opacity-40" />
            <div className="h-px w-8 bg-[#B0C8DC]" />
          </div>
          <h2 className="text-[#3A5A7C]" style={{ fontSize: 30 * s, fontWeight: 300 }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#7B9EC4]" style={{ fontSize: 12 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4 inline-block px-5 py-2.5 rounded-xl" style={{ background: 'rgba(123,158,196,0.08)', border: '1px solid rgba(123,158,196,0.15)' }}>
            <p className="text-[#3A5A7C] font-medium" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#7B9EC4]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#3A5A7C]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#8BAEC8]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
