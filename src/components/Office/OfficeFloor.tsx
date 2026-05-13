'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AGENTS, getAgent, Agent, AgentState } from '@/lib/agents/config';
import { useOfficeStore } from '@/lib/store/office';
import HumanCharacter from '@/components/Agent/HumanCharacter';
import AgentDesk from '@/components/Office/AgentDesk';
import AgentChat from '@/components/Agent/AgentChat';

// ─── Workstation ─────────────────────────────────────────────────────────────
function Workstation({
  agent,
  isActive,
  state,
  onClick,
}: {
  agent: Agent;
  isActive: boolean;
  state: AgentState;
  onClick: () => void;
}) {
  // position.x: 0-100 (horizontal), position.z: 0-100 (depth, 100=front-closest)
  const { x, z } = agent.position;

  // Depth-driven scale + screen y placement → fake real 3D perspective.
  const depth = z / 100; // 0 = far back, 1 = front
  const scale = 0.62 + depth * 0.46;
  const bottomPercent = 4 + depth * 36;
  const zIndex = Math.round(z * 10);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        bottom: `${bottomPercent}%`,
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: '50% 100%',
        zIndex,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (1 - depth) * 0.15 }}
    >
      {/* Workstation container — vertical stack: zone sign, character, desk */}
      <div className="relative flex flex-col items-center" style={{ width: 280 }}>
        {/* Floor pad / rug under the workstation — gives grounding */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -22,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 280,
            height: 96,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at 50% 50%, ${agent.color}26 0%, ${agent.color}10 35%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
        />

        {/* Zone sign hanging above */}
        <motion.div
          className="absolute z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            top: -6,
            backgroundColor: 'rgba(15,17,28,0.85)',
            border: `1px solid ${agent.color}66`,
            backdropFilter: 'blur(8px)',
            boxShadow: `0 4px 14px rgba(0,0,0,0.5), 0 0 12px ${agent.color}33`,
          }}
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#10B981',
              boxShadow: '0 0 6px rgba(16,185,129,0.8)',
            }}
          />
          <span
            className="font-semibold uppercase tracking-wider"
            style={{ color: agent.color, fontSize: 9, letterSpacing: '0.1em' }}
          >
            {agent.zone}
          </span>
        </motion.div>

        {/* Chair back, visible behind character */}
        <div
          className="absolute"
          style={{
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 116,
            height: 130,
            background: `linear-gradient(180deg, ${agent.color}AA 0%, ${agent.color}66 100%)`,
            borderRadius: '18px 18px 6px 6px',
            border: `1.5px solid ${agent.color}DD`,
            boxShadow: `inset 0 2px 0 rgba(255,255,255,0.18), 0 8px 18px rgba(0,0,0,0.45), 0 0 24px ${agent.color}33`,
            zIndex: 0,
          }}
        >
          {/* Chair stitching */}
          <div
            className="absolute"
            style={{
              top: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70%',
              height: 100,
              borderLeft: '1px dashed rgba(255,255,255,0.18)',
              borderRight: '1px dashed rgba(255,255,255,0.18)',
            }}
          />
        </div>

        {/* Character — portrait peeking above desk */}
        <div className="relative z-10" style={{ marginTop: 30 }}>
          <HumanCharacter
            agent={agent}
            agentState={state}
            isActive={isActive}
            onClick={onClick}
            size={108}
          />
        </div>

        {/* Desk — sits in front of character, hides their lower body */}
        <div className="relative z-20" style={{ marginTop: -16 }}>
          <AgentDesk color={agent.color} agentId={agent.id} width={240} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Office Scene ─────────────────────────────────────────────────────────────
function OfficeScene({
  activeAgentId,
  setActiveAgent,
}: {
  activeAgentId: string | null;
  setActiveAgent: (id: string | null) => void;
}) {
  const { getConversation } = useOfficeStore();

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0D1A 0%, #0E1224 30%, #060810 100%)',
      }}
    >
      {/* ── Back wall with city window ─────────────────────────────────── */}
      <div className="absolute inset-x-0 top-0" style={{ height: '55%' }}>
        {/* Wall gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #131628 0%, #181C30 60%, #0F1220 100%)',
            boxShadow: 'inset 0 -40px 80px rgba(0,0,0,0.55)',
          }}
        />

        {/* Subtle wall panel lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0 200px, rgba(255,255,255,0.025) 200px 201px)',
          }}
        />

        {/* Window (city view at night) */}
        <div
          className="absolute"
          style={{
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '52%',
            height: '60%',
            background:
              'linear-gradient(180deg, #0E1530 0%, #1A2440 50%, #0B0F22 100%)',
            border: '3px solid #1C2138',
            borderRadius: 6,
            boxShadow:
              'inset 0 0 30px rgba(120,150,255,0.18), 0 0 40px rgba(80,100,200,0.12)',
            overflow: 'hidden',
          }}
        >
          {/* Window cross-frame */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(transparent calc(50% - 1px), #1C2138 calc(50% - 1px), #1C2138 calc(50% + 1px), transparent calc(50% + 1px)), linear-gradient(90deg, transparent calc(33% - 1px), #1C2138 calc(33% - 1px), #1C2138 calc(33% + 1px), transparent calc(33% + 1px)), linear-gradient(90deg, transparent calc(66% - 1px), #1C2138 calc(66% - 1px), #1C2138 calc(66% + 1px), transparent calc(66% + 1px))',
            }}
          />
          {/* City silhouette */}
          <svg
            viewBox="0 0 400 200"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-2/3"
          >
            <path
              d="M0 200 V120 L20 120 L20 100 L50 100 L50 80 L70 80 L70 110 L90 110 L90 70 L110 70 L110 95 L130 95 L130 60 L155 60 L155 100 L175 100 L175 50 L195 50 L195 85 L215 85 L215 95 L240 95 L240 65 L260 65 L260 90 L285 90 L285 75 L310 75 L310 105 L335 105 L335 85 L360 85 L360 120 L400 120 V200 Z"
              fill="#0C0F22"
              opacity="0.95"
            />
            {/* Random window lights */}
            {Array.from({ length: 60 }).map((_, i) => {
              const x = (i * 37) % 400;
              const y = 60 + ((i * 17) % 110);
              const opacity = 0.3 + ((i * 7) % 7) / 12;
              const hue = i % 7 === 0 ? '#FBBF24' : i % 5 === 0 ? '#A78BFA' : '#FCD34D';
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={2}
                  height={2}
                  fill={hue}
                  opacity={opacity}
                />
              );
            })}
          </svg>
          {/* Moon */}
          <div
            className="absolute"
            style={{
              top: '14%',
              right: '14%',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 35%, #F4EFD8 0%, #D4CCAB 60%, #B0A687 100%)',
              boxShadow:
                '0 0 24px rgba(244,239,216,0.45), 0 0 50px rgba(244,239,216,0.2)',
            }}
          />
        </div>

        {/* Framework logo on wall */}
        <div
          className="absolute flex items-center gap-2 px-3 py-1.5 rounded-md"
          style={{
            top: '6%',
            left: '6%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            className="w-4 h-4 rounded"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
          />
          <span
            className="font-semibold text-white"
            style={{ fontSize: 11, letterSpacing: '0.06em' }}
          >
            FRAMEWORK HQ
          </span>
        </div>

        {/* Wall art (right side) */}
        <div
          className="absolute"
          style={{
            top: '20%',
            right: '6%',
            width: 90,
            height: 60,
            background: 'linear-gradient(135deg, #7C3AED, #DC2626, #D97706)',
            border: '4px solid #1A1D2A',
            borderRadius: 3,
            boxShadow: '0 8px 18px rgba(0,0,0,0.5)',
          }}
        />

        {/* Wall art (left side) */}
        <div
          className="absolute"
          style={{
            top: '24%',
            left: '6%',
            width: 70,
            height: 90,
            background:
              'linear-gradient(180deg, #0891B2 0%, #059669 50%, #4F46E5 100%)',
            border: '4px solid #1A1D2A',
            borderRadius: 3,
            boxShadow: '0 8px 18px rgba(0,0,0,0.5)',
          }}
        />

        {/* Ceiling light strips */}
        {[20, 50, 80].map((leftPct) => (
          <div
            key={leftPct}
            className="absolute"
            style={{
              top: 8,
              left: `${leftPct}%`,
              transform: 'translateX(-50%)',
              width: 70,
              height: 3,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(180,200,255,0.4), rgba(255,255,255,0.05))',
              borderRadius: 4,
              boxShadow:
                '0 0 20px rgba(180,200,255,0.45), 0 4px 18px rgba(180,200,255,0.25)',
            }}
          />
        ))}
      </div>

      {/* ── Floor with perspective grid ────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: '55%',
          background:
            'linear-gradient(180deg, #161927 0%, #0E1120 60%, #060810 100%)',
          boxShadow: 'inset 0 30px 60px rgba(0,0,0,0.55)',
        }}
      >
        {/* Floor / wall seam */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(140,160,220,0.35), transparent)',
            boxShadow: '0 1px 8px rgba(140,160,220,0.25)',
          }}
        />

        {/* Perspective grid */}
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full opacity-30"
        >
          {/* Horizontal lines getting closer together as they recede */}
          {[0, 60, 130, 215, 320, 440].map((y, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={y}
              x2="1000"
              y2={y}
              stroke="rgba(120,140,200,0.45)"
              strokeWidth={0.5 + i * 0.3}
            />
          ))}
          {/* Vanishing-point vertical lines */}
          {Array.from({ length: 17 }).map((_, i) => {
            const x = (i - 8) * 125 + 500;
            return (
              <line
                key={`v-${i}`}
                x1={500}
                y1={0}
                x2={x}
                y2={500}
                stroke="rgba(120,140,200,0.18)"
                strokeWidth={0.6}
              />
            );
          })}
        </svg>

        {/* Floor reflection sheen */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: '15%',
            right: '15%',
            height: '40%',
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(160,180,240,0.06), transparent 70%)',
          }}
        />
      </div>

      {/* ── Ambient lighting ──────────────────────────────────────────── */}
      {AGENTS.map((a) => {
        const left = a.position.x;
        const bottom = 6 + (a.position.z / 100) * 28;
        return (
          <div
            key={`light-${a.id}`}
            className="absolute pointer-events-none"
            style={{
              left: `${left}%`,
              bottom: `${bottom}%`,
              transform: 'translateX(-50%)',
              width: 280,
              height: 280,
              background: `radial-gradient(circle, ${a.color}1A 0%, transparent 65%)`,
              filter: 'blur(2px)',
              zIndex: 1,
            }}
          />
        );
      })}

      {/* ── Workstations ───────────────────────────────────────────────── */}
      {AGENTS.map((agent) => {
        const conv = getConversation(agent.id);
        return (
          <Workstation
            key={agent.id}
            agent={agent}
            isActive={activeAgentId === agent.id}
            state={conv.state}
            onClick={() =>
              setActiveAgent(activeAgentId === agent.id ? null : agent.id)
            }
          />
        );
      })}

      {/* ── Dust / particles ───────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => {
          const left = (i * 53) % 100;
          const top = (i * 31 + 10) % 70;
          const delay = (i * 0.5) % 6;
          const size = 1 + (i % 3);
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                background: 'rgba(255,255,255,0.35)',
                boxShadow: '0 0 4px rgba(255,255,255,0.3)',
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.15, 0.55, 0.15],
              }}
              transition={{
                repeat: Infinity,
                duration: 8 + (i % 4),
                delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({
  activeAgentId,
  setActiveAgent,
}: {
  activeAgentId: string | null;
  setActiveAgent: (id: string | null) => void;
}) {
  const { getConversation } = useOfficeStore();
  const activeCount = AGENTS.filter(
    (a) => getConversation(a.id).state !== 'idle',
  ).length;

  return (
    <div
      className="relative z-30 flex items-center justify-between px-5 py-2.5 border-b"
      style={{
        borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(7,8,16,0.85)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
          }}
        >
          🏢
        </div>
        <div>
          <h1 className="text-white font-semibold text-sm tracking-tight">
            Framework HQ
          </h1>
          <p className="text-gray-500" style={{ fontSize: 10 }}>
            {activeCount > 0
              ? `${activeCount} agent${activeCount > 1 ? 's' : ''} active`
              : 'All agents available'}
          </p>
        </div>
      </div>

      <div className="flex gap-1.5">
        {AGENTS.map((a) => {
          const conv = getConversation(a.id);
          const isOpen = activeAgentId === a.id;
          return (
            <motion.button
              key={a.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all"
              style={{
                backgroundColor: isOpen ? a.color : `${a.color}22`,
                color: isOpen ? 'white' : a.color,
                border: `1px solid ${a.color}55`,
                fontSize: 10,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveAgent(isOpen ? null : a.id)}
            >
              <span>{a.emoji}</span>
              <span>{a.name}</span>
              {conv.state !== 'idle' && (
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-current"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OfficeFloor() {
  const { activeAgentId, setActiveAgent } = useOfficeStore();
  const activeAgent = activeAgentId ? getAgent(activeAgentId) : null;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: '#06070D' }}
    >
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <Header
          activeAgentId={activeAgentId}
          setActiveAgent={setActiveAgent}
        />
        <OfficeScene
          activeAgentId={activeAgentId}
          setActiveAgent={setActiveAgent}
        />
      </div>

      <AnimatePresence>
        {activeAgent && (
          <motion.div
            key={activeAgent.id}
            className="flex flex-col border-l"
            style={{
              width: 360,
              backgroundColor: '#0C0D1A',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <AgentChat
              agent={activeAgent}
              onClose={() => setActiveAgent(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
