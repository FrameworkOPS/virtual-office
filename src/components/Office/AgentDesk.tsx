'use client';

import { motion } from 'framer-motion';

interface Props {
  color: string;
  agentId: string;
}

// Per-agent desk accessories
const ACCESSORIES: Record<string, { cup?: boolean; plant?: boolean; papers?: boolean; notebook?: boolean }> = {
  aria:   { cup: true, plant: true },
  dev:    { cup: true, papers: true },
  scout:  { papers: true, plant: false },
  scribe: { notebook: true, cup: true },
  atlas:  { papers: true, plant: true },
  ops:    { notebook: true, cup: true },
};

export default function AgentDesk({ color, agentId }: Props) {
  const acc = ACCESSORIES[agentId] ?? {};

  return (
    <div className="relative" style={{ width: 160, height: 95 }}>
      {/* Monitor ambient glow on desk */}
      <div className="absolute pointer-events-none" style={{
        top: -10, left: '50%', transform: 'translateX(-50%)',
        width: 90, height: 40,
        background: color,
        filter: 'blur(22px)',
        opacity: 0.12,
        borderRadius: '50%',
      }} />

      {/* ── Desk surface ── */}
      <div className="absolute rounded-lg" style={{
        top: 22, left: 0, right: 0, height: 54,
        background: 'linear-gradient(165deg, #6B4423 0%, #4A2C14 100%)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
      }} />

      {/* Desk front face (depth) */}
      <div className="absolute" style={{
        top: 74, left: 6, right: 6, height: 18,
        backgroundColor: '#2A1608',
        borderRadius: '0 0 6px 6px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
      }} />

      {/* Desk legs */}
      {[12, 140].map(x => (
        <div key={x} className="absolute" style={{
          top: 76, left: x, width: 8, height: 20,
          backgroundColor: '#1E1008',
          borderRadius: '0 0 3px 3px',
        }} />
      ))}

      {/* ── Monitor ── */}
      <div className="absolute" style={{
        top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 78, height: 54,
        backgroundColor: '#111118',
        borderRadius: 6,
        border: '2px solid #2A2A38',
        overflow: 'hidden',
        boxShadow: `0 0 18px ${color}44, 0 4px 12px rgba(0,0,0,0.6)`,
      }}>
        {/* Screen content */}
        <div className="absolute inset-1 rounded" style={{ backgroundColor: '#08080F' }}>
          {[7, 15, 23, 31, 39].map((y, i) => (
            <motion.div key={i} className="absolute rounded-sm" style={{
              top: y, left: 5, height: 3,
              width: `${35 + (i % 4) * 12}%`,
              backgroundColor: color,
              opacity: 0.45 - i * 0.04,
            }}
              animate={{ opacity: [0.25, 0.5, 0.25] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: i * 0.5 }}
            />
          ))}
          {/* Cursor blink */}
          <motion.div className="absolute" style={{
            top: 7, left: 5, width: 2, height: 10,
            backgroundColor: color,
          }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.1 }}
          />
        </div>
      </div>

      {/* Monitor stand stem */}
      <div className="absolute" style={{
        top: 54, left: '50%', transform: 'translateX(-50%)',
        width: 3, height: 8, backgroundColor: '#3A3A44',
      }} />
      {/* Stand base */}
      <div className="absolute" style={{
        top: 60, left: '50%', transform: 'translateX(-50%)',
        width: 22, height: 4,
        backgroundColor: '#2A2A34',
        borderRadius: 2,
      }} />

      {/* ── Keyboard ── */}
      <div className="absolute rounded" style={{
        bottom: 22, left: '50%', transform: 'translateX(-50%)',
        width: 68, height: 16,
        backgroundColor: '#DEDAD4',
        boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
      }}>
        {[0, 1, 2].map(row => (
          <div key={row} className="flex gap-px px-1.5" style={{ marginTop: row === 0 ? 3 : 2 }}>
            {Array.from({ length: 9 - row }).map((_, k) => (
              <div key={k} className="rounded-sm flex-1" style={{ height: 3, backgroundColor: '#C0BCB6' }} />
            ))}
          </div>
        ))}
      </div>

      {/* ── Mouse ── */}
      <div className="absolute rounded-full" style={{
        bottom: 22, right: 18,
        width: 12, height: 18,
        backgroundColor: '#CCCAC4',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />

      {/* ── Coffee cup ── */}
      {acc.cup && (
        <div className="absolute" style={{ top: 28, left: 10 }}>
          <div className="absolute rounded" style={{
            width: 14, height: 16,
            backgroundColor: '#E8E4DC',
            borderRadius: '2px 2px 4px 4px',
          }}>
            {/* Coffee */}
            <div className="absolute" style={{
              top: 4, left: 2, right: 2, bottom: 2,
              backgroundColor: '#6B3A28',
              borderRadius: '1px 1px 3px 3px',
            }} />
          </div>
          {/* Handle */}
          <div className="absolute" style={{
            top: 4, right: -5, width: 5, height: 8,
            border: '1.5px solid #C8C0B4',
            borderLeft: 'none',
            borderRadius: '0 4px 4px 0',
          }} />
        </div>
      )}

      {/* ── Plant ── */}
      {acc.plant && (
        <div className="absolute" style={{ top: 22, right: 10 }}>
          {/* Pot */}
          <div className="absolute" style={{
            bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: 14, height: 12,
            backgroundColor: '#8B4513',
            borderRadius: '2px 2px 5px 5px',
          }} />
          {/* Leaves */}
          {[[-4,-8,20], [4,-10,15], [0,-12,18]].map(([x,y,size], i) => (
            <div key={i} className="absolute rounded-full" style={{
              bottom: 10, left: `calc(50% + ${x}px)`,
              width: size, height: size,
              backgroundColor: '#166534',
              transform: `rotate(${i * 40}deg)`,
              opacity: 0.9,
            }} />
          ))}
        </div>
      )}

      {/* ── Notebook ── */}
      {acc.notebook && (
        <div className="absolute" style={{ top: 30, right: 14 }}>
          <div style={{
            width: 20, height: 24,
            backgroundColor: agent_notebook_color(agentId),
            borderRadius: 2,
            boxShadow: '1px 1px 3px rgba(0,0,0,0.4)',
          }}>
            {[6, 11, 16].map(y => (
              <div key={y} className="absolute" style={{
                top: y, left: 3, right: 3, height: 1.5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 1,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Papers ── */}
      {acc.papers && (
        <div className="absolute" style={{ top: 30, left: 14 }}>
          {[2, 1, 0].map(i => (
            <div key={i} className="absolute rounded-sm" style={{
              width: 22, height: 28,
              backgroundColor: '#F5F3EE',
              top: i * 2, left: i * 2,
              boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            }}>
              {i === 0 && [4, 8, 12, 16, 20].map(y => (
                <div key={y} style={{
                  position: 'absolute', top: y, left: 3, right: 3,
                  height: 1.5, backgroundColor: '#C0C0C0', borderRadius: 1,
                }} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function agent_notebook_color(id: string) {
  const colors: Record<string, string> = {
    scribe: '#D97706', ops: '#3730A3', aria: '#7C3AED',
    dev: '#1D4ED8', scout: '#166534', atlas: '#B91C1C',
  };
  return colors[id] ?? '#555';
}
