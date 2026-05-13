'use client';

import { motion } from 'framer-motion';

interface Props {
  color: string;
  agentId: string;
  width?: number;
}

const ACCESSORIES: Record<
  string,
  { cup?: boolean; plant?: boolean; papers?: boolean; notebook?: boolean }
> = {
  aria: { cup: true, plant: true },
  dev: { cup: true, papers: true },
  scout: { papers: true, notebook: true },
  scribe: { notebook: true, cup: true, plant: true },
  atlas: { papers: true, notebook: true },
  ops: { notebook: true, cup: true },
};

/**
 * A 2.5D desk drawn with three faces (top, front, side) for depth.
 * Sits underneath the seated character so the lower body is hidden.
 */
export default function AgentDesk({ color, agentId, width = 220 }: Props) {
  const acc = ACCESSORIES[agentId] ?? {};
  const frontH = Math.round(width * 0.22);
  const topH = Math.round(width * 0.18);

  return (
    <div
      className="relative"
      style={{
        width,
        height: topH + frontH + 10,
        filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.55))',
      }}
    >
      {/* Desk top (slightly skewed for perspective) */}
      <div
        className="absolute left-0 right-0 rounded-md"
        style={{
          top: 0,
          height: topH,
          background:
            'linear-gradient(180deg, #8B5E36 0%, #6B4423 50%, #5A3819 100%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -2px 4px rgba(0,0,0,0.35)',
          transform: 'perspective(800px) rotateX(28deg)',
          transformOrigin: '50% 100%',
        }}
      >
        {/* Wood grain hint */}
        <div
          className="absolute inset-0 rounded-md pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 22px)',
            opacity: 0.6,
          }}
        />
        {/* Monitor glow on surface */}
        <div
          className="absolute"
          style={{
            top: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.55,
            height: 12,
            borderRadius: 8,
            background: color,
            opacity: 0.18,
            filter: 'blur(10px)',
          }}
        />
      </div>

      {/* Desk front face */}
      <div
        className="absolute left-1 right-1"
        style={{
          top: topH - 4,
          height: frontH,
          background:
            'linear-gradient(180deg, #3A2410 0%, #20120A 100%)',
          borderRadius: '0 0 8px 8px',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 10px rgba(0,0,0,0.5)',
        }}
      >
        {/* Drawer line */}
        <div
          className="absolute"
          style={{
            top: 6,
            left: 12,
            right: 12,
            height: 1,
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        {/* Drawer handle */}
        <div
          className="absolute rounded-full"
          style={{
            top: frontH / 2 - 1.5,
            left: '52%',
            width: 18,
            height: 3,
            background: 'linear-gradient(180deg, #C0B090, #80715A)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        />

        {/* Name plate */}
        <div
          className="absolute rounded-sm flex items-center justify-center"
          style={{
            top: frontH - 14,
            left: 14,
            width: 60,
            height: 10,
            background: color,
            color: 'white',
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: '0.06em',
            boxShadow: `0 0 6px ${color}88`,
          }}
        >
          {agentId.toUpperCase()}
        </div>
      </div>

      {/* Desk legs */}
      {[6, width - 14].map((x) => (
        <div
          key={x}
          className="absolute"
          style={{
            top: topH + frontH - 6,
            left: x,
            width: 8,
            height: 14,
            background:
              'linear-gradient(180deg, #1A0E05 0%, #08040A 100%)',
            borderRadius: '0 0 3px 3px',
          }}
        />
      ))}

      {/* ── On-desk items ─────────────────────────────────────────────── */}

      {/* Monitor */}
      <div
        className="absolute"
        style={{
          top: -topH * 0.6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: width * 0.46,
          height: topH * 1.4,
          background: '#0E0E18',
          borderRadius: 6,
          border: '2px solid #2A2A38',
          overflow: 'hidden',
          boxShadow: `0 0 24px ${color}55, 0 6px 16px rgba(0,0,0,0.7)`,
        }}
      >
        <div className="absolute inset-1 rounded" style={{ background: '#06060C' }}>
          {[6, 12, 18, 24].map((y, i) => (
            <motion.div
              key={i}
              className="absolute rounded-sm"
              style={{
                top: y,
                left: 5,
                height: 2,
                width: `${30 + (i % 3) * 18}%`,
                backgroundColor: color,
                opacity: 0.4,
              }}
              animate={{ opacity: [0.25, 0.55, 0.25] }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 0.4 }}
            />
          ))}
          <motion.div
            className="absolute"
            style={{
              bottom: 4,
              left: 5,
              width: 2,
              height: 8,
              backgroundColor: color,
            }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.1 }}
          />
        </div>
      </div>

      {/* Monitor stand */}
      <div
        className="absolute"
        style={{
          top: topH - 6,
          left: '50%',
          width: 3,
          height: 8,
          background: '#3A3A44',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        className="absolute"
        style={{
          top: topH + 1,
          left: '50%',
          width: 28,
          height: 4,
          background: '#2A2A34',
          borderRadius: 2,
          transform: 'translateX(-50%)',
        }}
      />

      {/* Keyboard */}
      <div
        className="absolute rounded"
        style={{
          top: topH - 14,
          left: '50%',
          transform: 'translateX(-50%) perspective(400px) rotateX(45deg)',
          transformOrigin: '50% 100%',
          width: width * 0.5,
          height: 12,
          background:
            'linear-gradient(180deg, #E0DCD4 0%, #B6B0A4 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }}
      >
        {[0, 1].map((row) => (
          <div
            key={row}
            className="flex gap-px px-1.5"
            style={{ marginTop: row === 0 ? 2 : 1 }}
          >
            {Array.from({ length: 10 }).map((_, k) => (
              <div
                key={k}
                className="rounded-sm flex-1"
                style={{ height: 2, background: '#9C988C' }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Coffee */}
      {acc.cup && (
        <div className="absolute" style={{ top: -topH * 0.05, left: width * 0.1 }}>
          <div
            style={{
              width: 18,
              height: 22,
              background:
                'linear-gradient(180deg, #F4F0E8 0%, #C8C2B4 100%)',
              borderRadius: '2px 2px 6px 6px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
            }}
          >
            <div
              style={{
                margin: 3,
                height: 6,
                background:
                  'radial-gradient(ellipse, #4A2818 0%, #2A1408 100%)',
                borderRadius: 4,
              }}
            />
          </div>
          {/* Handle */}
          <div
            className="absolute"
            style={{
              top: 4,
              right: -7,
              width: 7,
              height: 12,
              border: '2px solid #C8C2B4',
              borderLeft: 'none',
              borderRadius: '0 8px 8px 0',
            }}
          />
          {/* Steam */}
          <motion.div
            className="absolute"
            style={{
              top: -10,
              left: 4,
              width: 2,
              height: 8,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.6), transparent)',
              borderRadius: 2,
              filter: 'blur(1.5px)',
            }}
            animate={{ y: [-2, -8, -2], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
          />
        </div>
      )}

      {/* Plant */}
      {acc.plant && (
        <div
          className="absolute"
          style={{
            top: -topH * 0.15,
            right: width * 0.08,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: 18,
              height: 14,
              background:
                'linear-gradient(180deg, #B0631F 0%, #7A3F0F 100%)',
              borderRadius: '2px 2px 6px 6px',
              transform: 'translateX(-50%)',
            }}
          />
          {[
            { x: -6, y: -16, s: 16, c: '#15803D' },
            { x: 4, y: -20, s: 14, c: '#166534' },
            { x: 0, y: -22, s: 18, c: '#16A34A' },
          ].map((leaf, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                bottom: 10,
                left: `calc(50% + ${leaf.x}px)`,
                transform: `translate(-50%, ${leaf.y}px) rotate(${i * 30 - 30}deg)`,
                width: leaf.s,
                height: leaf.s,
                background: leaf.c,
                boxShadow: 'inset -2px -2px 3px rgba(0,0,0,0.25)',
              }}
            />
          ))}
        </div>
      )}

      {/* Notebook */}
      {acc.notebook && (
        <div
          className="absolute"
          style={{
            top: -topH * 0.05,
            right: width * 0.18,
            filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.45))',
          }}
        >
          <div
            style={{
              width: 22,
              height: 28,
              background: `linear-gradient(135deg, ${color} 0%, ${color}AA 100%)`,
              borderRadius: 2,
              border: `1px solid ${color}DD`,
            }}
          >
            {[7, 13, 19].map((y) => (
              <div
                key={y}
                style={{
                  position: 'absolute',
                  top: y,
                  left: 3,
                  right: 3,
                  height: 1.5,
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: 1,
                }}
              />
            ))}
            {/* Spine */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                background: 'rgba(0,0,0,0.25)',
              }}
            />
          </div>
        </div>
      )}

      {/* Papers */}
      {acc.papers && (
        <div className="absolute" style={{ top: -topH * 0.02, left: width * 0.22 }}>
          {[2, 1, 0].map((i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                top: i * 2,
                left: i * 2,
                width: 24,
                height: 30,
                background: '#F4F1EA',
                boxShadow: '1px 2px 3px rgba(0,0,0,0.3)',
                transform: `rotate(${(i - 1) * 3}deg)`,
              }}
            >
              {i === 0 &&
                [5, 9, 13, 17, 21].map((y) => (
                  <div
                    key={y}
                    style={{
                      position: 'absolute',
                      top: y,
                      left: 3,
                      right: 3,
                      height: 1.5,
                      background: '#9A9588',
                      borderRadius: 1,
                    }}
                  />
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
