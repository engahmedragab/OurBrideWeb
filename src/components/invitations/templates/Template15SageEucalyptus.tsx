'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 15: Sage & Eucalyptus — Green botanical with natural rustic feel */
export function Template15SageEucalyptus({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${38 * s}px`, background: 'linear-gradient(180deg, #F5FAF0 0%, #FFFFFF 50%, #F0F5EB 100%)' }}>
      {/* Eucalyptus leaves */}
      <svg className="absolute top-2 left-2 opacity-15" width={60 * s} height={80 * s} viewBox="0 0 60 80">
        <ellipse cx="20" cy="15" rx="10" ry="14" fill="#6B8E6B" transform="rotate(-30 20 15)" />
        <ellipse cx="35" cy="35" rx="10" ry="14" fill="#7BA07B" transform="rotate(20 35 35)" />
        <ellipse cx="15" cy="55" rx="8" ry="12" fill="#8BB08B" transform="rotate(-15 15 55)" />
        <line x1="25" y1="5" x2="20" y2="70" stroke="#6B8E6B" strokeWidth="0.8" />
      </svg>
      <svg className="absolute bottom-2 right-2 opacity-15 -scale-x-100" width={60 * s} height={80 * s} viewBox="0 0 60 80">
        <ellipse cx="20" cy="15" rx="10" ry="14" fill="#6B8E6B" transform="rotate(-30 20 15)" />
        <ellipse cx="35" cy="35" rx="10" ry="14" fill="#7BA07B" transform="rotate(20 35 35)" />
        <ellipse cx="15" cy="55" rx="8" ry="12" fill="#8BB08B" transform="rotate(-15 15 55)" />
        <line x1="25" y1="5" x2="20" y2="70" stroke="#6B8E6B" strokeWidth="0.8" />
      </svg>

      <div className="text-center relative">
        <p className="uppercase tracking-[0.2em] text-[#6B8E6B]" style={{ fontSize: 9 * s }}>Together Forever</p>

        <div className="my-5" style={{ margin: `${20 * s}px 0` }}>
          <h2 className="text-[#3D5A3D]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{brideName}</h2>
          <p className="text-[#8BB08B] italic my-1" style={{ fontSize: 18 * s, fontFamily: 'Georgia, serif' }}>and</p>
          <h2 className="text-[#3D5A3D]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#6B8E6B]" style={{ fontSize: 12 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4">
            <p className="text-[#3D5A3D] font-medium" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#8BB08B]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#3D5A3D]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#6B8E6B]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
