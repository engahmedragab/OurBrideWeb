'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 8: Lavender Dream — Soft purple watercolor with dreamy aesthetic */
export function Template08LavenderDream({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(180deg, #F5F0FF 0%, #EDE5FF 40%, #F8F4FF 100%)' }}>
      {/* Watercolor blobs */}
      <div className="absolute -top-8 -right-8 rounded-full opacity-20" style={{ width: 100 * s, height: 100 * s, background: 'radial-gradient(circle, #B794F4, transparent)' }} />
      <div className="absolute -bottom-6 -left-6 rounded-full opacity-15" style={{ width: 80 * s, height: 80 * s, background: 'radial-gradient(circle, #9F7AEA, transparent)' }} />

      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="h-px w-8 bg-[#B794F4] opacity-50" />
          <p className="uppercase tracking-[0.25em] text-[#9F7AEA]" style={{ fontSize: 8 * s }}>We&apos;re Getting Married</p>
          <div className="h-px w-8 bg-[#B794F4] opacity-50" />
        </div>

        <div className="my-5" style={{ margin: `${20 * s}px 0` }}>
          <h2 className="text-[#553C9A]" style={{ fontSize: 30 * s, fontWeight: 300, letterSpacing: '0.02em' }}>{brideName}</h2>
          <p className="text-[#B794F4] italic my-1" style={{ fontSize: 20 * s }}>&amp;</p>
          <h2 className="text-[#553C9A]" style={{ fontSize: 30 * s, fontWeight: 300, letterSpacing: '0.02em' }}>{groomName}</h2>
        </div>

        {guestName && (
          <p className="text-[#805AD5] bg-[#FAF5FF] inline-block px-4 py-1 rounded-full" style={{ fontSize: 12 * s }}>
            {guestName}
          </p>
        )}

        {weddingDate && (
          <div className="mt-5">
            <p className="text-[#553C9A] font-medium" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#9F7AEA]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#553C9A]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#9F7AEA]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}

        <div className="mt-5 flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-full bg-[#B794F4]" style={{ width: 4 * s, height: 4 * s, opacity: 0.3 + i * 0.2 }} />
          ))}
        </div>
      </div>
    </div>
  )
}
