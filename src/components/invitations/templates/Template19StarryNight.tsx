'use client'

import type { InvitationTemplateProps } from './types'
import { formatInvDate, formatInvTime } from './types'

/** Template 19: Starry Night — Deep indigo sky with twinkling stars */
export function Template19StarryNight({ brideName, groomName, guestName, weddingDate, weddinghole, weddingAddress, preview }: InvitationTemplateProps) {
  const s = preview ? 0.55 : 1
  return (
    <div className="relative overflow-hidden" style={{ padding: `${40 * s}px`, background: 'linear-gradient(180deg, #0C1445 0%, #1A237E 50%, #1A1A5C 100%)' }}>
      {/* Stars */}
      {[
        { x: 12, y: 8, sz: 2.5 }, { x: 82, y: 15, sz: 1.5 }, { x: 30, y: 5, sz: 1 },
        { x: 60, y: 10, sz: 2 }, { x: 45, y: 20, sz: 1 }, { x: 92, y: 30, sz: 1.5 },
        { x: 8, y: 35, sz: 1 }, { x: 72, y: 40, sz: 2 }, { x: 20, y: 50, sz: 1 },
        { x: 88, y: 55, sz: 1.5 }, { x: 55, y: 60, sz: 1 }, { x: 35, y: 70, sz: 2 },
        { x: 75, y: 75, sz: 1 }, { x: 15, y: 80, sz: 1.5 }, { x: 50, y: 85, sz: 2 },
        { x: 90, y: 90, sz: 1 }, { x: 25, y: 95, sz: 1.5 },
      ].map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.sz * s, height: star.sz * s, opacity: 0.3 + Math.random() * 0.4 }}
        />
      ))}

      {/* Moon glow */}
      <div className="absolute top-3 right-8 rounded-full" style={{ width: 30 * s, height: 30 * s, background: 'radial-gradient(circle, rgba(255,255,200,0.15), transparent)' }} />

      <div className="text-center relative">
        <p className="uppercase tracking-[0.3em] text-[#7B8BD4]" style={{ fontSize: 9 * s }}>Under the Stars</p>

        <div className="my-5" style={{ margin: `${22 * s}px 0` }}>
          <h2 className="text-white" style={{ fontSize: 28 * s, fontWeight: 300, letterSpacing: '0.03em' }}>{brideName}</h2>
          <div className="flex items-center justify-center gap-2 my-2">
            <span className="text-[#FFD700]" style={{ fontSize: 16 * s }}>&#10022;</span>
          </div>
          <h2 className="text-white" style={{ fontSize: 28 * s, fontWeight: 300, letterSpacing: '0.03em' }}>{groomName}</h2>
        </div>

        {guestName && <p className="text-[#9FA8DA]" style={{ fontSize: 12 * s }}>Dear {guestName}</p>}

        {weddingDate && (
          <div className="mt-4 inline-block px-5 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[#E8EAFF] font-medium" style={{ fontSize: 13 * s }}>{formatInvDate(weddingDate)}</p>
            <p className="text-[#7B8BD4]" style={{ fontSize: 11 * s }}>{formatInvTime(weddingDate)}</p>
          </div>
        )}

        {weddinghole && (
          <div className="mt-3">
            <p className="text-[#E8EAFF]" style={{ fontSize: 12 * s }}>{weddinghole}</p>
            {weddingAddress && <p className="text-[#7B8BD4]" style={{ fontSize: 10 * s }}>{weddingAddress}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
