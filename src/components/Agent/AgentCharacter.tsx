'use client';

import { motion } from 'framer-motion';
import type { Transition, TargetAndTransition } from 'framer-motion';
import { Agent, AgentState } from '@/lib/agents/config';

interface Props {
  agent: Agent;
  agentState: AgentState;
  isActive: boolean;
  onClick: () => void;
}

type StateAnimations = {
  body: TargetAndTransition;
  head: TargetAndTransition;
  leftArm: TargetAndTransition;
  rightArm: TargetAndTransition;
  eyes: TargetAndTransition;
};

const t = (extra: Omit<Transition, 'ease'> & { ease?: Transition['ease'] }): Transition =>
  extra as Transition;

const STATES: Record<AgentState, StateAnimations> = {
  idle: {
    body: { y: [0, -2, 0], transition: t({ repeat: Infinity, duration: 3, ease: 'easeInOut' }) },
    head: { rotate: [0, 1, -1, 0], transition: t({ repeat: Infinity, duration: 4, ease: 'easeInOut' }) },
    leftArm: { rotate: [0, 3, 0], transition: t({ repeat: Infinity, duration: 3, ease: 'easeInOut' }) },
    rightArm: { rotate: [0, -3, 0], transition: t({ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }) },
    eyes: { scaleY: [1, 0.1, 1], transition: t({ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1], delay: 2 }) },
  },
  thinking: {
    body: { y: [0, -4, 0], transition: t({ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }) },
    head: { rotate: [-5, 5, -5], transition: t({ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }) },
    leftArm: { rotate: [0, 15, 0], transition: t({ repeat: Infinity, duration: 1.5 }) },
    rightArm: { rotate: [0, -15, 0], transition: t({ repeat: Infinity, duration: 1.5 }) },
    eyes: { scaleY: 1 },
  },
  talking: {
    body: { y: [0, -3, 0], transition: t({ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }) },
    head: { rotate: [0, 2, -2, 0], transition: t({ repeat: Infinity, duration: 0.4, ease: 'easeInOut' }) },
    leftArm: { rotate: [0, 20, -5, 0], transition: t({ repeat: Infinity, duration: 0.8 }) },
    rightArm: { rotate: [0, -20, 5, 0], transition: t({ repeat: Infinity, duration: 0.7 }) },
    eyes: { scaleY: 1 },
  },
};

export default function AgentCharacter({ agent, agentState, isActive, onClick }: Props) {
  const anim = STATES[agentState];

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{ width: 80, height: 130 }}
    >
      {/* Active glow */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: agent.color, filter: 'blur(20px)', opacity: 0.3 }}
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}

      {/* Hover ring */}
      <motion.div
        className="absolute -inset-2 rounded-2xl border-2"
        style={{ borderColor: agent.color }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      />

      {/* Character */}
      <motion.div
        className="relative flex flex-col items-center"
        animate={anim.body}
      >
        {/* Thinking bubble */}
        {agentState === 'thinking' && (
          <motion.div
            className="absolute -top-8 -right-4 flex gap-0.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{ backgroundColor: agent.color, width: 6, height: 6 }}
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}

        {/* Talk indicator */}
        {agentState === 'talking' && (
          <motion.div
            className="absolute -top-6 -right-6 rounded-2xl px-2 py-1 flex gap-1 items-center"
            style={{ backgroundColor: agent.color }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="bg-white rounded-full"
                style={{ width: 4, height: 4 }}
                animate={{ scaleY: [1, 2, 1] }}
                transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}

        {/* Head */}
        <motion.div
          className="relative rounded-2xl flex items-center justify-center overflow-hidden"
          style={{
            width: 52,
            height: 52,
            backgroundColor: agent.color,
            boxShadow: `0 4px 20px ${agent.color}66`,
          }}
          animate={anim.head}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-3">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-full"
                  style={{ width: 9, height: 9 }}
                  animate={anim.eyes}
                />
              ))}
            </div>
            <motion.div
              className="bg-white rounded-full"
              style={{ width: 18, height: 4 }}
              animate={{
                height: agentState === 'talking' ? [4, 8, 4] : 4,
              }}
              transition={agentState === 'talking' ? { repeat: Infinity, duration: 0.3 } : undefined}
            />
          </div>
          <div
            className="absolute top-2 left-3 rounded-full opacity-30"
            style={{ width: 12, height: 12, backgroundColor: 'white' }}
          />
        </motion.div>

        {/* Arms + torso */}
        <div className="flex items-start gap-1 mt-1">
          <motion.div
            style={{
              width: 10,
              height: 30,
              backgroundColor: agent.color,
              borderRadius: 9999,
              opacity: 0.85,
              originX: '50%',
              originY: '0%',
              marginTop: 8,
            }}
            animate={anim.leftArm}
          />

          <div
            className="rounded-xl flex items-center justify-center"
            style={{
              width: 36,
              height: 42,
              backgroundColor: agent.accentColor,
              border: `3px solid ${agent.color}`,
            }}
          >
            <span style={{ fontSize: 16 }}>{agent.emoji}</span>
          </div>

          <motion.div
            style={{
              width: 10,
              height: 30,
              backgroundColor: agent.color,
              borderRadius: 9999,
              opacity: 0.85,
              originX: '50%',
              originY: '0%',
              marginTop: 8,
            }}
            animate={anim.rightArm}
          />
        </div>

        {/* Legs */}
        <div className="flex gap-3 mt-1">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              style={{ width: 12, height: 20, backgroundColor: agent.color, borderRadius: 9999, opacity: 0.7 }}
              animate={{ y: agentState === 'talking' ? [0, -3, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.25 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Name tag */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
        <div
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: agent.color, color: 'white', fontSize: 10 }}
        >
          {agent.name}
        </div>
        <div className="text-gray-400 mt-0.5" style={{ fontSize: 9 }}>
          {agent.role}
        </div>
      </div>
    </motion.div>
  );
}
