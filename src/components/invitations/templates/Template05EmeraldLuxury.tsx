'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 5: Emerald Luxury — Rich emerald green with gold filigree */
export function Template05EmeraldLuxury({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(160deg, #0D3B2E 0%, #164A38 50%, #0D3B2E 100%)' }}>
      {/* Gold filigree corners */}
      <svg className="absolute top-2 left-2" width={50 * s} height={50 * s} viewBox="0 0 50 50" fill="none">
        <path d="M0 0C0 0 15 2 20 10C25 18 20 30 10 35C5 25 2 15 0 0Z" fill="#C9A96E" opacity="0.3" />
        <path d="M0 0L25 5L5 25Z" fill="#C9A96E" opacity="0.15" />
      </svg>
      <svg className="absolute top-2 right-2 -scale-x-100" width={50 * s} height={50 * s} viewBox="0 0 50 50" fill="none">
        <path d="M0 0C0 0 15 2 20 10C25 18 20 30 10 35C5 25 2 15 0 0Z" fill="#C9A96E" opacity="0.3" />
        <path d="M0 0L25 5L5 25Z" fill="#C9A96E" opacity="0.15" />
      </svg>
      <svg className="absolute bottom-2 left-2 -scale-y-100" width={50 * s} height={50 * s} viewBox="0 0 50 50" fill="none">
        <path d="M0 0C0 0 15 2 20 10C25 18 20 30 10 35C5 25 2 15 0 0Z" fill="#C9A96E" opacity="0.3" />
      </svg>
      <svg className="absolute bottom-2 right-2 -scale-x-100 -scale-y-100" width={50 * s} height={50 * s} viewBox="0 0 50 50" fill="none">
        <path d="M0 0C0 0 15 2 20 10C25 18 20 30 10 35C5 25 2 15 0 0Z" fill="#C9A96E" opacity="0.3" />
      </svg>

      <div className="text-center relative">
        <p className="uppercase tracking-[0.3em] text-[#C9A96E]" style={{ fontSize: 9 * s }}>Joyfully invite you</p>

        <div className="my-5" style={{ margin: `${20 * s}px 0` }}>
          <h2 className="text-[#E8DFC8]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{brideName}</h2>
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px flex-1 max-w-[40px] bg-[#C9A96E] opacity-40" />
            <span className="text-[#C9A96E]" style={{ fontSize: 18 * s }}>&amp;</span>
            <div className="h-px flex-1 max-w-[40px] bg-[#C9A96E] opacity-40" />
          </div>
          <h2 className="text-[#E8DFC8]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#A8C8A0] font-medium" style={{ fontSize: 13 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
            <p className="text-[#E8DFC8] font-medium" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#8BAF80]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#C9A96E]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#6B8B7B]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
