'use client';

import { motion } from 'framer-motion';
import { AGENTS } from '@/lib/agents/config';
import { useOfficeStore } from '@/lib/store/office';
import AgentCharacter from '@/components/Agent/AgentCharacter';
import { AnimatePresence } from 'framer-motion';
import AgentChat from '@/components/Agent/AgentChat';
import { getAgent } from '@/lib/agents/config';

const ZONES = [
  { id: 'reception', label: 'Reception', x: 0, y: 45, w: 28, h: 48, color: '#7C3AED' },
  { id: 'ops', label: 'War Room', x: 0, y: 0, w: 28, h: 45, color: '#4F46E5' },
  { id: 'research', label: 'Research Lab', x: 28, y: 0, w: 44, h: 45, color: '#059669' },
  { id: 'data', label: 'Data Room', x: 28, y: 45, w: 44, h: 48, color: '#DC2626' },
  { id: 'engineering', label: 'Engineering Bay', x: 72, y: 0, w: 28, h: 45, color: '#0891B2' },
  { id: 'creative', label: 'Creative Studio', x: 72, y: 45, w: 28, h: 48, color: '#D97706' },
];

export default function OfficeFloor() {
  const { activeAgentId, setActiveAgent, getConversation } = useOfficeStore();
  const activeAgent = activeAgentId ? getAgent(activeAgentId) : null;

  return (
    <div className="flex h-screen w-screen bg-gray-950 overflow-hidden">
      {/* Office canvas */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient glow blobs */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #0891B2, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />

        {/* Office floor plan */}
        <div className="absolute inset-0 p-6 flex flex-col gap-1">
          {/* Top row: Ops | Research Lab | Engineering Bay */}
          <div className="flex gap-1 flex-1">
            <Zone zone={ZONES[1]} />
            <Zone zone={ZONES[2]} />
            <Zone zone={ZONES[4]} />
          </div>
          {/* Bottom row: Reception | Data Room | Creative Studio */}
          <div className="flex gap-1 flex-1">
            <Zone zone={ZONES[0]} />
            <Zone zone={ZONES[3]} />
            <Zone zone={ZONES[5]} />
          </div>
        </div>

        {/* Agents layer — positioned absolutely over zones */}
        <div className="absolute inset-6 pointer-events-none">
          <div className="relative w-full h-full">
            {AGENTS.map((agent) => {
              const conv = getConversation(agent.id);
              return (
                <div
                  key={agent.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${agent.position.x}%`,
                    top: `${agent.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <AgentCharacter
                    agent={agent}
                    agentState={conv.state}
                    isActive={activeAgentId === agent.id}
                    onClick={() =>
                      setActiveAgent(activeAgentId === agent.id ? null : agent.id)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 z-10">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: '#7C3AED' }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            >
              🏢
            </motion.div>
            <div>
              <h1 className="text-white font-bold text-sm">Framework HQ</h1>
              <p className="text-gray-500 text-xs">Virtual AI Office</p>
            </div>
          </div>

          <div className="flex gap-2">
            {AGENTS.map((a) => (
              <motion.button
                key={a.id}
                className="w-7 h-7 rounded-lg text-xs flex items-center justify-center"
                style={{
                  backgroundColor: activeAgentId === a.id ? a.color : `${a.color}33`,
                  border: `1px solid ${a.color}66`,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveAgent(activeAgentId === a.id ? null : a.id)}
              >
                {a.emoji}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {activeAgent && (
          <motion.div
            key={activeAgent.id}
            className="w-80 flex flex-col border-l border-white/10 bg-gray-900"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <AgentChat agent={activeAgent} onClose={() => setActiveAgent(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Zone({ zone }: { zone: typeof ZONES[0] }) {
  return (
    <div
      className="relative flex-1 rounded-xl border overflow-hidden"
      style={{
        borderColor: `${zone.color}22`,
        backgroundColor: `${zone.color}08`,
      }}
    >
      {/* Corner label */}
      <div
        className="absolute top-2 left-3 text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ backgroundColor: `${zone.color}22`, color: `${zone.color}` }}
      >
        {zone.label}
      </div>

      {/* Decorative desk/furniture */}
      <Desk color={zone.color} />
    </div>
  );
}

function Desk({ color }: { color: string }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-40">
      <div
        className="rounded-lg"
        style={{ width: 48, height: 28, backgroundColor: `${color}44`, border: `1px solid ${color}66` }}
      />
      <div
        className="rounded-lg"
        style={{ width: 28, height: 28, backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
      />
    </div>
  );
}
