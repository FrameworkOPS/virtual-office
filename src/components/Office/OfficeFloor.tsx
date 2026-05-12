'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AGENTS, getAgent, Agent } from '@/lib/agents/config';
import { useOfficeStore } from '@/lib/store/office';
import HumanCharacter from '@/components/Agent/HumanCharacter';
import AgentDesk from '@/components/Office/AgentDesk';
import AgentChat from '@/components/Agent/AgentChat';

// ─── Zone definitions ─────────────────────────────────────────────────────────
interface ZoneDef {
  agentId: string;
  label: string;
  icon: string;
  decoration: 'whiteboard' | 'bookshelf' | 'plant-wall' | 'monitor-wall' | 'board' | 'corkboard';
}

const ZONES: ZoneDef[] = [
  { agentId: 'ops',    label: 'War Room',        icon: '⚙️',  decoration: 'board' },
  { agentId: 'scout',  label: 'Research Lab',    icon: '🔍',  decoration: 'bookshelf' },
  { agentId: 'dev',    label: 'Engineering Bay', icon: '💻',  decoration: 'monitor-wall' },
  { agentId: 'aria',   label: 'Reception',       icon: '👩‍💼', decoration: 'plant-wall' },
  { agentId: 'atlas',  label: 'Data Room',       icon: '📊',  decoration: 'whiteboard' },
  { agentId: 'scribe', label: 'Creative Studio', icon: '✍️',  decoration: 'corkboard' },
];

// ─── Zone decoration ──────────────────────────────────────────────────────────
function ZoneDecoration({ type, color }: { type: ZoneDef['decoration']; color: string }) {
  switch (type) {
    case 'whiteboard':
      return (
        <div className="absolute top-8 right-4 rounded-sm flex flex-col gap-1 p-1.5" style={{
          width: 52, height: 38,
          backgroundColor: '#F0EEE8',
          border: '2px solid #888',
          boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              height: 3, backgroundColor: color,
              opacity: 0.6, borderRadius: 1,
              width: `${60 + i * 15}%`,
            }} />
          ))}
        </div>
      );
    case 'bookshelf':
      return (
        <div className="absolute top-6 right-3 flex gap-0.5" style={{ height: 44 }}>
          {['#B91C1C','#1D4ED8','#166534','#D97706','#7C3AED'].map((c, i) => (
            <div key={i} className="rounded-sm" style={{
              width: 8, height: 28 + (i % 3) * 8,
              alignSelf: 'flex-end',
              backgroundColor: c,
              opacity: 0.85,
              boxShadow: '1px 1px 3px rgba(0,0,0,0.4)',
            }} />
          ))}
        </div>
      );
    case 'plant-wall':
      return (
        <div className="absolute top-4 right-4 flex gap-1">
          {[20, 26, 18].map((h, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="rounded-full" style={{
                width: h, height: h,
                backgroundColor: i === 1 ? '#15803D' : '#166534',
                opacity: 0.9,
              }} />
              <div style={{ width: 5, height: 8, backgroundColor: '#8B4513', borderRadius: 2 }} />
            </div>
          ))}
        </div>
      );
    case 'monitor-wall':
      return (
        <div className="absolute top-5 right-4 flex gap-1.5">
          {[color, '#6B7280'].map((c, i) => (
            <div key={i} className="rounded" style={{
              width: 28, height: 20,
              backgroundColor: '#111118',
              border: '1.5px solid #2A2A38',
              overflow: 'hidden',
              boxShadow: `0 0 8px ${c}44`,
            }}>
              <div className="m-0.5 rounded-sm" style={{
                height: '100%',
                backgroundColor: '#08080F',
              }}>
                <div className="mt-1 mx-1 rounded-sm" style={{ height: 2, backgroundColor: c, opacity: 0.6 }} />
                <div className="mt-1 mx-1 rounded-sm" style={{ height: 2, backgroundColor: c, opacity: 0.4, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      );
    case 'board':
      return (
        <div className="absolute top-6 right-3 rounded p-1.5" style={{
          width: 50, height: 40,
          backgroundColor: '#1A2F1A',
          border: '2px solid #374151',
          boxShadow: '2px 2px 6px rgba(0,0,0,0.4)',
        }}>
          {[[color, 0],[color+'99', 1],['#F59E0B88', 2]].map(([c,i]) => (
            <div key={String(i)} style={{
              height: 2.5,
              backgroundColor: String(c),
              borderRadius: 1,
              marginBottom: 4,
              width: `${50 + Number(i) * 15}%`,
            }} />
          ))}
        </div>
      );
    case 'corkboard':
      return (
        <div className="absolute top-5 right-3 rounded p-1" style={{
          width: 50, height: 40,
          backgroundColor: '#C8A46E',
          border: '3px solid #7C5C30',
          boxShadow: '2px 2px 6px rgba(0,0,0,0.4)',
        }}>
          {[
            { top: 2, left: 2, w: 16, h: 12, bg: '#FDE68A' },
            { top: 6, left: 22, w: 14, h: 10, bg: '#BFDBFE' },
            { top: 18, left: 4, w: 12, h: 14, bg: '#D1FAE5' },
            { top: 16, left: 22, w: 18, h: 16, bg: '#FCE7F3' },
          ].map((s, i) => (
            <div key={i} className="absolute" style={{
              top: s.top, left: s.left, width: s.w, height: s.h,
              backgroundColor: s.bg,
              borderRadius: 1,
              transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (2 + i)}deg)`,
              boxShadow: '1px 1px 2px rgba(0,0,0,0.15)',
            }} />
          ))}
        </div>
      );
  }
}

// ─── Individual zone ──────────────────────────────────────────────────────────
function Officezone({ zone, agent, isActive, onClick, agentState }: {
  zone: ZoneDef;
  agent: Agent;
  isActive: boolean;
  onClick: () => void;
  agentState: 'idle' | 'thinking' | 'talking';
}) {
  return (
    <div
      className="relative flex-1 rounded-xl overflow-hidden flex flex-col"
      style={{
        border: isActive
          ? `2px solid ${agent.color}88`
          : `1px solid rgba(255,255,255,0.06)`,
        background: `radial-gradient(ellipse at 50% 30%, ${agent.color}0A 0%, transparent 70%), rgba(255,255,255,0.02)`,
        minHeight: 0,
      }}
    >
      {/* Floor tile pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />

      {/* Zone label */}
      <div className="absolute top-2 left-3 flex items-center gap-1.5 z-10">
        <span style={{ fontSize: 11 }}>{zone.icon}</span>
        <span className="font-medium" style={{
          fontSize: 9,
          color: agent.color,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {zone.label}
        </span>
      </div>

      {/* Zone decoration */}
      <ZoneDecoration type={zone.decoration} color={agent.color} />

      {/* Character + desk — centered, desk below character */}
      <div className="flex-1 flex flex-col items-center justify-center gap-0 relative z-10">
        {/* Status dot */}
        <motion.div
          className="absolute top-2 right-3 w-2 h-2 rounded-full"
          style={{ backgroundColor: isActive ? agent.color : '#374151' }}
          animate={isActive ? { scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        />

        {/* Character */}
        <div style={{ marginBottom: -18, zIndex: 2 }}>
          <HumanCharacter
            agent={agent}
            agentState={agentState}
            isActive={isActive}
            onClick={onClick}
          />
        </div>

        {/* Desk */}
        <div style={{ zIndex: 1 }}>
          <AgentDesk color={agent.color} agentId={agent.id} />
        </div>
      </div>
    </div>
  );
}

// ─── Main office floor ────────────────────────────────────────────────────────
export default function OfficeFloor() {
  const { activeAgentId, setActiveAgent, getConversation } = useOfficeStore();
  const activeAgent = activeAgentId ? getAgent(activeAgentId) : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: '#070810' }}>

      {/* ── Office canvas ── */}
      <div className="relative flex-1 flex flex-col overflow-hidden">

        {/* Ambient ceiling lights */}
        {AGENTS.map((a, i) => (
          <div key={a.id} className="absolute pointer-events-none" style={{
            top: -40,
            left: `${(i % 3) * 33 + 16}%`,
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${a.color}18, transparent 70%)`,
            borderRadius: '50%',
          }} />
        ))}

        {/* Header */}
        <div className="relative z-20 flex items-center justify-between px-5 py-2.5 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(7,8,16,0.8)', backdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}>
              🏢
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm tracking-tight">Framework HQ</h1>
              <p className="text-gray-500" style={{ fontSize: 10 }}>
                {AGENTS.filter(a => getConversation(a.id).state !== 'idle').length > 0
                  ? `${AGENTS.filter(a => getConversation(a.id).state !== 'idle').length} agents active`
                  : 'All agents available'}
              </p>
            </div>
          </div>

          {/* Agent quick-select pills */}
          <div className="flex gap-1.5">
            {AGENTS.map(a => {
              const conv = getConversation(a.id);
              return (
                <motion.button
                  key={a.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    backgroundColor: activeAgentId === a.id ? a.color : `${a.color}22`,
                    color: activeAgentId === a.id ? 'white' : a.color,
                    border: `1px solid ${a.color}44`,
                    fontSize: 10,
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveAgent(activeAgentId === a.id ? null : a.id)}
                >
                  <span>{a.emoji}</span>
                  <span>{a.name}</span>
                  {conv.state !== 'idle' && (
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-current"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Office grid */}
        <div className="flex-1 p-3 flex flex-col gap-2 min-h-0">
          {/* Row 1 */}
          <div className="flex gap-2 flex-1 min-h-0">
            {ZONES.slice(0, 3).map(zone => {
              const agent = getAgent(zone.agentId)!;
              const conv = getConversation(zone.agentId);
              return (
                <Officezone
                  key={zone.agentId}
                  zone={zone}
                  agent={agent}
                  isActive={activeAgentId === zone.agentId}
                  onClick={() => setActiveAgent(activeAgentId === zone.agentId ? null : zone.agentId)}
                  agentState={conv.state}
                />
              );
            })}
          </div>

          {/* Row 2 */}
          <div className="flex gap-2 flex-1 min-h-0">
            {ZONES.slice(3, 6).map(zone => {
              const agent = getAgent(zone.agentId)!;
              const conv = getConversation(zone.agentId);
              return (
                <Officezone
                  key={zone.agentId}
                  zone={zone}
                  agent={agent}
                  isActive={activeAgentId === zone.agentId}
                  onClick={() => setActiveAgent(activeAgentId === zone.agentId ? null : zone.agentId)}
                  agentState={conv.state}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {activeAgent && (
          <motion.div
            key={activeAgent.id}
            className="flex flex-col border-l"
            style={{
              width: 340,
              backgroundColor: '#0C0D1A',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <AgentChat agent={activeAgent} onClose={() => setActiveAgent(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
