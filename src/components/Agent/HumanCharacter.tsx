'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Agent, AgentState } from '@/lib/agents/config';

interface Props {
  agent: Agent;
  agentState: AgentState;
  isActive: boolean;
  onClick: () => void;
  size?: number;
}

export default function HumanCharacter({
  agent,
  agentState,
  isActive,
  onClick,
  size = 96,
}: Props) {
  return (
    <motion.div
      className="relative select-none cursor-pointer flex flex-col items-center"
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      animate={{
        y:
          agentState === 'talking'
            ? [0, -2, 0]
            : agentState === 'thinking'
              ? [0, -3, 0]
              : [0, -1, 0],
      }}
      transition={{
        repeat: Infinity,
        duration:
          agentState === 'talking' ? 0.6 : agentState === 'thinking' ? 1.6 : 3.4,
        ease: 'easeInOut',
      }}
    >
      {/* Soft floor shadow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: size * 0.9,
          height: 10,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.6), transparent 70%)',
          filter: 'blur(4px)',
        }}
      />

      {/* Active aura */}
      {isActive && (
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: -8,
            left: -8,
            width: size + 16,
            height: size + 16,
            background: agent.color,
            filter: 'blur(24px)',
            opacity: 0.35,
          }}
          animate={{ opacity: [0.18, 0.4, 0.18] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        />
      )}

      {/* Thinking bubble */}
      {agentState === 'thinking' && (
        <motion.div
          className="absolute flex gap-1 items-end z-30"
          style={{ top: -22, right: -16 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {[6, 8, 10].map((s, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: s,
                height: s,
                backgroundColor: agent.color,
                boxShadow: `0 2px 8px ${agent.color}80`,
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.14 }}
            />
          ))}
        </motion.div>
      )}

      {/* Talking indicator */}
      {agentState === 'talking' && (
        <motion.div
          className="absolute rounded-full px-2 py-1 flex gap-1 z-30"
          style={{
            top: -14,
            right: -12,
            backgroundColor: agent.color,
            boxShadow: `0 4px 14px ${agent.color}80`,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="bg-white rounded-full"
              style={{ width: 4, height: 4 }}
              animate={{ scaleY: [1, 2.4, 1] }}
              transition={{ repeat: Infinity, duration: 0.42, delay: i * 0.12 }}
            />
          ))}
        </motion.div>
      )}

      {/* Portrait frame */}
      <motion.div
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          border: `2.5px solid ${agent.color}`,
          boxShadow: isActive
            ? `0 0 0 3px ${agent.color}33, 0 14px 28px rgba(0,0,0,0.6)`
            : '0 10px 22px rgba(0,0,0,0.55)',
        }}
        animate={
          agentState === 'talking'
            ? { scale: [1, 1.025, 1] }
            : { scale: 1 }
        }
        transition={{
          repeat: agentState === 'talking' ? Infinity : 0,
          duration: 0.45,
          ease: 'easeInOut',
        }}
      >
        <Image
          src={agent.avatar}
          alt={agent.name}
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
        {/* Color overlay for cohesion */}
        <div
          className="absolute inset-0 mix-blend-color"
          style={{ backgroundColor: agent.color, opacity: 0.06 }}
        />
        {/* Top light highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 35%, transparent 70%, rgba(0,0,0,0.25) 100%)',
          }}
        />
        {/* Eyes-closed mask while thinking — subtle */}
        {agentState === 'thinking' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(8,12,24,0.18)' }}
            animate={{ opacity: [0.55, 0.85, 0.55] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />
        )}
      </motion.div>

      {/* Status dot */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: size * 0.12,
          right: size * 0.05,
          width: 12,
          height: 12,
          backgroundColor: '#10B981',
          border: '2px solid #0B0E1A',
          boxShadow: '0 0 8px rgba(16,185,129,0.7)',
        }}
      />

      {/* Name badge */}
      <div className="mt-2 text-center">
        <span
          className="text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
          style={{
            backgroundColor: agent.color,
            color: 'white',
            fontSize: 10,
            boxShadow: `0 2px 8px ${agent.color}66`,
          }}
        >
          {agent.name}
        </span>
        <p className="text-gray-400 mt-0.5" style={{ fontSize: 9 }}>
          {agent.role}
        </p>
      </div>
    </motion.div>
  );
}
