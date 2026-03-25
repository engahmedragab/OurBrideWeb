'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 1: Classic Gold — Timeless elegance with gold accents on cream */
export function Template01ClassicGold({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, area, mapsLink, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFDF5 50%, #FFF8F0 100%)' }}>
      {/* Gold corner ornaments */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C9A96E] opacity-60" style={{ width: 60 * s, height: 60 * s }} />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#C9A96E] opacity-60" style={{ width: 60 * s, height: 60 * s }} />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#C9A96E] opacity-60" style={{ width: 60 * s, height: 60 * s }} />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C9A96E] opacity-60" style={{ width: 60 * s, height: 60 * s }} />

      <div className="text-center relative">
        <p className="uppercase tracking-[0.3em] text-[#C9A96E]" style={{ fontSize: 10 * s }}>Together with their families</p>
        <div className="my-4" style={{ margin: `${16 * s}px 0` }}>
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-[#C9A96E]" />
            <span className="text-[#C9A96E]" style={{ fontSize: 14 * s }}>&#10047;</span>
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-[#C9A96E]" />
          </div>
        </div>

        <h2 className="font-light text-[#3D2B1F]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif' }}>{brideName}</h2>
        <p className="italic text-[#C9A96E] my-1" style={{ fontSize: 16 * s, fontFamily: 'Georgia, serif' }}>&amp;</p>
        <h2 className="font-light text-[#3D2B1F]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif' }}>{groomName}</h2>

        <div className="my-4" style={{ margin: `${16 * s}px 0` }}>
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent mx-auto" style={{ maxWidth: 200 * s }} />
        </div>

        <p className="uppercase tracking-[0.2em] text-[#8B7355]" style={{ fontSize: 10 * s }}>Request the pleasure of your company</p>
        {guestName && <p className="font-semibold text-[#3D2B1F] mt-2" style={{ fontSize: 14 * s }}>{guestName}</p>}

        {weddingDate && (
          <div className="mt-4" style={{ marginTop: 16 * s }}>
            <p className="font-semibold text-[#3D2B1F]" style={{ fontSize: 14 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#8B7355]" style={{ fontSize: 12 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3" style={{ marginTop: 12 * s }}>
            <p className="font-semibold text-[#3D2B1F]" style={{ fontSize: 13 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#8B7355]" style={{ fontSize: 11 * s }}>{weddingAddress}</p>}
            {area && <p className="text-[#A89070]" style={{ fontSize: 10 * s }}>{area}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
