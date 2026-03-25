'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 12: Cherry Blossom — Japanese-inspired with pink petals */
export function Template12CherryBlossom({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(180deg, #FFF5F7 0%, #FFFFFF 50%, #FFF0F3 100%)' }}>
      {/* Cherry blossom petals */}
      {[
        { x: '10%', y: '8%', r: 8, o: 0.3 }, { x: '85%', y: '12%', r: 6, o: 0.25 },
        { x: '15%', y: '85%', r: 7, o: 0.2 }, { x: '90%', y: '80%', r: 9, o: 0.3 },
        { x: '75%', y: '5%', r: 5, o: 0.2 }, { x: '5%', y: '50%', r: 6, o: 0.15 },
        { x: '95%', y: '45%', r: 7, o: 0.2 }, { x: '30%', y: '92%', r: 5, o: 0.25 },
      ].map((p, i) => (
        <svg key={i} className="absolute" style={{ left: p.x, top: p.y, opacity: p.o }} width={p.r * 2 * s} height={p.r * 2 * s} viewBox="0 0 20 20">
          <ellipse cx="10" cy="6" rx="4" ry="6" fill="#FFB6C1" transform="rotate(0 10 10)" />
          <ellipse cx="10" cy="6" rx="4" ry="6" fill="#FFB6C1" transform="rotate(72 10 10)" />
          <ellipse cx="10" cy="6" rx="4" ry="6" fill="#FFB6C1" transform="rotate(144 10 10)" />
          <ellipse cx="10" cy="6" rx="4" ry="6" fill="#FFB6C1" transform="rotate(216 10 10)" />
          <ellipse cx="10" cy="6" rx="4" ry="6" fill="#FFB6C1" transform="rotate(288 10 10)" />
          <circle cx="10" cy="10" r="2" fill="#FFD1DC" />
        </svg>
      ))}

      <div className="text-center relative">
        <p className="text-[#D4829D] tracking-[0.2em] uppercase" style={{ fontSize: 9 * s }}>Wedding Celebration</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-[#8B4060]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{brideName}</h2>
          <div className="flex items-center justify-center my-2">
            <svg width={30 * s} height={14 * s} viewBox="0 0 30 14">
              <path d="M5 7C8 3 12 1 15 1S22 3 25 7C22 11 18 13 15 13S8 11 5 7Z" fill="#FFB6C1" opacity="0.4" />
            </svg>
          </div>
          <h2 className="text-[#8B4060]" style={{ fontSize: 28 * s, fontFamily: 'Georgia, serif', fontWeight: 300 }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#C4748B]" style={{ fontSize: 12 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4">
            <p className="text-[#8B4060] font-medium" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#D4829D]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#8B4060]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#C4748B]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
