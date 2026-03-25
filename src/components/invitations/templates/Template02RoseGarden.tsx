'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 2: Rose Garden — Soft rose watercolor with botanical frames */
export function Template02RoseGarden({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, area, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${36 * s}px`, background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 40%, #FFF0F3 100%)' }}>
      {/* Top floral accent */}
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <svg width={180 * s} height={50 * s} viewBox="0 0 180 50" fill="none">
          <path d="M90 5C70 5 55 20 40 25C25 30 10 25 0 20V0h180v20c-10 5-25 10-40 5C125 20 110 5 90 5z" fill="#FFD1DC" opacity="0.4" />
          <circle cx="60" cy="15" r="6" fill="#E8A0B5" opacity="0.5" />
          <circle cx="120" cy="15" r="6" fill="#E8A0B5" opacity="0.5" />
          <circle cx="90" cy="8" r="8" fill="#D4829D" opacity="0.4" />
          <circle cx="45" cy="22" r="4" fill="#F0C0D0" opacity="0.6" />
          <circle cx="135" cy="22" r="4" fill="#F0C0D0" opacity="0.6" />
        </svg>
      </div>

      {/* Bottom floral accent */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center rotate-180">
        <svg width={180 * s} height={50 * s} viewBox="0 0 180 50" fill="none">
          <path d="M90 5C70 5 55 20 40 25C25 30 10 25 0 20V0h180v20c-10 5-25 10-40 5C125 20 110 5 90 5z" fill="#FFD1DC" opacity="0.4" />
          <circle cx="60" cy="15" r="6" fill="#E8A0B5" opacity="0.5" />
          <circle cx="120" cy="15" r="6" fill="#E8A0B5" opacity="0.5" />
          <circle cx="90" cy="8" r="8" fill="#D4829D" opacity="0.4" />
        </svg>
      </div>

      <div className="text-center relative" style={{ paddingTop: 20 * s }}>
        <p className="uppercase tracking-[0.25em] text-[#C4748B]" style={{ fontSize: 9 * s }}>Wedding Invitation</p>

        <div className="my-5" style={{ margin: `${20 * s}px 0` }}>
          <h2 className="text-[#6B3A4F]" style={{ fontSize: 30 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{brideName}</h2>
          <div className="flex items-center justify-center gap-2 my-2">
            <div className="h-px flex-1 max-w-[40px] bg-[#E8A0B5]" />
            <span className="text-[#D4829D]" style={{ fontSize: 20 * s, fontFamily: 'Georgia, serif' }}>&hearts;</span>
            <div className="h-px flex-1 max-w-[40px] bg-[#E8A0B5]" />
          </div>
          <h2 className="text-[#6B3A4F]" style={{ fontSize: 30 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{groomName}</h2>
        </div>

        {guestName && (
          <div className="my-3 py-2 border-t border-b border-[#F0C0D0]" style={{ margin: `${12 * s}px auto`, maxWidth: 220 * s }}>
            <p className="text-[#A06070]" style={{ fontSize: 10 * s }}>Honoring</p>
            <p className="font-medium text-[#6B3A4F]" style={{ fontSize: 14 * s }}>{guestName}</p>
          </div>
        )}

        {weddingDate && (
          <div className="mt-3">
            <p className="font-medium text-[#6B3A4F]" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#A06070]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="font-medium text-[#6B3A4F]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#A06070]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
