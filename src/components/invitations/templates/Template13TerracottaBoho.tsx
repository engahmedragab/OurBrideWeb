'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 13: Terracotta Boho — Earthy bohemian with terracotta and sage */
export function Template13TerracottaBoho({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${38 * s}px`, background: '#FDF6F0' }}>
      {/* Boho arch */}
      <div className="mx-auto relative" style={{ maxWidth: 260 * s }}>
        <svg className="w-full" viewBox="0 0 260 30" fill="none">
          <path d="M10 30C10 14 50 0 130 0S250 14 250 30" stroke="#C4856C" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M25 30C25 18 60 5 130 5S235 18 235 30" stroke="#C4856C" strokeWidth="0.5" fill="none" opacity="0.2" />
        </svg>
      </div>

      <div className="text-center relative">
        <p className="uppercase tracking-[0.2em] text-[#8B9F7B]" style={{ fontSize: 9 * s }}>You&apos;re Invited</p>

        <div className="my-5" style={{ margin: `${20 * s}px 0` }}>
          <h2 className="text-[#8B5A3C]" style={{ fontSize: 28 * s, fontWeight: 300, letterSpacing: '0.03em' }}>{brideName}</h2>
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px w-10 bg-[#C4856C] opacity-40" />
            <span className="text-[#8B9F7B]" style={{ fontSize: 12 * s }}>&#10048;</span>
            <div className="h-px w-10 bg-[#C4856C] opacity-40" />
          </div>
          <h2 className="text-[#8B5A3C]" style={{ fontSize: 28 * s, fontWeight: 300, letterSpacing: '0.03em' }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#A08060]" style={{ fontSize: 12 * s }}>{guestName}</p>}

        {weddingDate && (
          <div className="mt-4">
            <p className="text-[#8B5A3C] font-medium" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#C4856C]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#8B5A3C]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#A08060]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}

        {/* Boho leaf */}
        <svg className="mx-auto mt-4" width={40 * s} height={20 * s} viewBox="0 0 40 20" fill="none">
          <path d="M20 0C12 5 5 10 2 18C10 14 15 8 20 0Z" fill="#8B9F7B" opacity="0.2" />
          <path d="M20 0C28 5 35 10 38 18C30 14 25 8 20 0Z" fill="#8B9F7B" opacity="0.2" />
        </svg>
      </div>
    </div>
  )
}
