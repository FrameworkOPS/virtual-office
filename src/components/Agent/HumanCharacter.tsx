'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Agent, AgentState } from '@/lib/agents/config';

// ─── Character appearance configs ────────────────────────────────────────────
type HairStyle = 'bun' | 'shortNatural' | 'wavy' | 'looseWaves' | 'shortCrop' | 'sidePart';
type TopStyle = 'blazer' | 'hoodie' | 'jacket' | 'blouse' | 'buttonUp' | 'structured';

interface CharConfig {
  skin: string; skinD: string;
  hair: string; hairStyle: HairStyle;
  eye: string;
  top: string; topStyle: TopStyle; topInner?: string;
  lip: string;
  blush?: boolean; glasses?: boolean; freckles?: boolean;
}

const CHARS: Record<string, CharConfig> = {
  aria:   { skin:'#C8845A', skinD:'#A86840', hair:'#140800', hairStyle:'bun',         eye:'#2D1A0A', top:'#7C3AED', topStyle:'blazer',    topInner:'white',   lip:'#A86050', blush:true },
  dev:    { skin:'#7B4E36', skinD:'#5C3420', hair:'#0A0400', hairStyle:'shortNatural', eye:'#1A0800', top:'#1D4ED8', topStyle:'hoodie',                       lip:'#8B5040', glasses:true },
  scout:  { skin:'#F0C4A0', skinD:'#D4A080', hair:'#8B2500', hairStyle:'wavy',         eye:'#4A7060', top:'#166534', topStyle:'jacket',    topInner:'#EFF6FF', lip:'#C87050', freckles:true },
  scribe: { skin:'#E8C09A', skinD:'#C89070', hair:'#C8A860', hairStyle:'looseWaves',   eye:'#3B6B9E', top:'#D97706', topStyle:'blouse',                       lip:'#B86050' },
  atlas:  { skin:'#4E2E1A', skinD:'#361A08', hair:'#0A0400', hairStyle:'shortCrop',    eye:'#1A0800', top:'#B91C1C', topStyle:'buttonUp',                     lip:'#6B3020' },
  ops:    { skin:'#C09070', skinD:'#A07050', hair:'#100808', hairStyle:'sidePart',      eye:'#2A1800', top:'#3730A3', topStyle:'structured',                   lip:'#985040' },
};

// ─── Hair renderers ───────────────────────────────────────────────────────────
function Hair({ c, style }: { c: string; style: HairStyle }) {
  switch (style) {
    case 'bun':
      return <>
        <ellipse cx="50" cy="13" rx="22" ry="15" fill={c} />
        <circle cx="50" cy="3" r="9" fill={c} />
        <path d="M28 18 Q21 30 25 46" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M72 18 Q79 30 75 46" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" />
      </>;
    case 'shortNatural':
      return <>
        <ellipse cx="50" cy="14" rx="23" ry="17" fill={c} />
        <ellipse cx="50" cy="10" rx="21" ry="12" fill={c} />
        <path d="M27 24 Q26 36 29 46" stroke={c} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M73 24 Q74 36 71 46" stroke={c} strokeWidth="7" fill="none" strokeLinecap="round" />
      </>;
    case 'wavy':
      return <>
        <ellipse cx="50" cy="12" rx="23" ry="16" fill={c} />
        <path d="M27 17 Q17 32 21 50 Q17 60 21 70" stroke={c} strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M73 17 Q83 32 79 50 Q83 60 79 70" stroke={c} strokeWidth="13" fill="none" strokeLinecap="round" />
      </>;
    case 'looseWaves':
      return <>
        <ellipse cx="50" cy="11" rx="23" ry="16" fill={c} />
        <path d="M27 15 Q15 28 18 45 Q13 56 17 68" stroke={c} strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M73 15 Q85 28 82 45 Q87 56 83 68" stroke={c} strokeWidth="14" fill="none" strokeLinecap="round" />
      </>;
    case 'shortCrop':
      return <>
        <ellipse cx="50" cy="15" rx="22" ry="14" fill={c} />
        <path d="M28 25 Q27 35 30 45" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M72 25 Q73 35 70 45" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
      </>;
    case 'sidePart':
      return <>
        <ellipse cx="50" cy="13" rx="22" ry="15" fill={c} />
        <path d="M42 9 Q48 7 54 9" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
        <path d="M28 20 Q26 32 28 44" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M72 20 Q74 32 72 44" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" />
      </>;
  }
}

// ─── Clothing renderers ───────────────────────────────────────────────────────
function Clothing({ c, style, inner }: { c: string; style: TopStyle; inner?: string }) {
  const dark = c + 'BB';
  switch (style) {
    case 'blazer':
      return <>
        <path d="M17 68 Q17 62 50 56 Q83 62 83 68 L83 130 L17 130 Z" fill={c} />
        <path d="M40 65 L50 73 L60 65 L60 100 L40 100 Z" fill={inner || 'white'} />
        <path d="M40 65 L50 73 L37 102" fill={dark} />
        <path d="M60 65 L50 73 L63 102" fill={dark} />
      </>;
    case 'hoodie':
      return <>
        <path d="M15 68 Q15 60 50 54 Q85 60 85 68 L85 130 L15 130 Z" fill={c} />
        <path d="M28 66 Q50 56 72 66 Q62 60 50 62 Q38 60 28 66 Z" fill={dark} />
        <rect x="28" y="98" width="44" height="22" rx="4" fill={dark} />
        <circle cx="41" cy="67" r="2.5" fill={dark} />
        <circle cx="59" cy="67" r="2.5" fill={dark} />
      </>;
    case 'jacket':
      return <>
        <path d="M17 68 Q17 62 50 56 Q83 62 83 68 L83 130 L17 130 Z" fill={c} />
        <path d="M40 65 L50 74 L60 65 L58 100 L42 100 Z" fill={inner || '#F0F9FF'} />
        <line x1="50" y1="74" x2="50" y2="128" stroke={dark} strokeWidth="1.5" />
      </>;
    case 'blouse':
      return <>
        <path d="M18 68 Q18 61 50 55 Q82 61 82 68 L82 130 L18 130 Z" fill={c} />
        <path d="M40 65 L50 78 L60 65" fill={dark} />
      </>;
    case 'buttonUp':
      return <>
        <path d="M18 68 Q18 62 50 56 Q82 62 82 68 L82 130 L18 130 Z" fill={c} />
        <path d="M40 64 L43 67 L50 64 L57 67 L60 64" fill={dark} stroke={dark} strokeWidth="0.5" />
        {[82, 93, 104, 115].map(y => <circle key={y} cx="50" cy={y} r="1.8" fill={dark} />)}
      </>;
    case 'structured':
    default:
      return <>
        <path d="M17 68 Q17 61 50 55 Q83 61 83 68 L83 130 L17 130 Z" fill={c} />
        <path d="M40 64 L44 68 L50 64 L56 68 L60 64" fill={dark} />
        <rect x="20" y="76" width="14" height="12" rx="2" fill={dark} opacity="0.6" />
      </>;
  }
}

// ─── Arms ─────────────────────────────────────────────────────────────────────
function Arms({ cfg, state }: { cfg: CharConfig; state: AgentState }) {
  if (state === 'thinking') {
    return <>
      <path d="M17 68 Q10 90 14 122" stroke={cfg.top} strokeWidth="17" strokeLinecap="round" fill="none" />
      <ellipse cx="14" cy="123" rx="9" ry="6.5" fill={cfg.skin} />
      <path d="M83 68 Q88 80 78 93" stroke={cfg.top} strokeWidth="17" strokeLinecap="round" fill="none" />
      <path d="M78 93 Q74 72 72 49" stroke={cfg.top} strokeWidth="15" strokeLinecap="round" fill="none" />
      <ellipse cx="72" cy="46" rx="9" ry="7" fill={cfg.skin} />
    </>;
  }
  return <>
    <path d="M17 68 Q10 90 14 122" stroke={cfg.top} strokeWidth="17" strokeLinecap="round" fill="none" />
    <ellipse cx="14" cy="123" rx="9" ry="6.5" fill={cfg.skin} />
    <path d="M83 68 Q90 90 86 122" stroke={cfg.top} strokeWidth="17" strokeLinecap="round" fill="none" />
    <ellipse cx="86" cy="123" rx="9" ry="6.5" fill={cfg.skin} />
  </>;
}

// ─── Face details ─────────────────────────────────────────────────────────────
function Eyes({ cfg, blinking }: { cfg: CharConfig; blinking: boolean }) {
  return <>
    <ellipse cx="40" cy="30" rx="5.5" ry={blinking ? 1.2 : 5} fill="white" />
    <ellipse cx="60" cy="30" rx="5.5" ry={blinking ? 1.2 : 5} fill="white" />
    {!blinking && <>
      <circle cx="41" cy="30.5" r="3.3" fill={cfg.eye} />
      <circle cx="61" cy="30.5" r="3.3" fill={cfg.eye} />
      <circle cx="42.5" cy="29" r="1.3" fill="white" />
      <circle cx="62.5" cy="29" r="1.3" fill="white" />
    </>}
    <path d="M34.5 25 Q40 23 45.5 25" stroke={cfg.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M54.5 25 Q60 23 65.5 25" stroke={cfg.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </>;
}

function Mouth({ cfg, open }: { cfg: CharConfig; open: boolean }) {
  if (open) return <>
    <path d="M42 44 Q50 51 58 44" fill="#5A1A1A" />
    <ellipse cx="50" cy="47" rx="7.5" ry="4.5" fill="#5A1A1A" />
    <path d="M42 44 Q50 40 58 44" fill={cfg.skin} />
    <rect x="43.5" y="44" width="13" height="4.5" rx="2.2" fill="#F0F0F0" />
  </>;
  return <path d="M42 44 Q50 49.5 58 44" stroke={cfg.lip} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
}

// ─── Main component ───────────────────────────────────────────────────────────
interface Props {
  agent: Agent;
  agentState: AgentState;
  isActive: boolean;
  onClick: () => void;
}

export default function HumanCharacter({ agent, agentState, isActive, onClick }: Props) {
  const [blinking, setBlinking] = useState(false);
  const cfg = CHARS[agent.id];

  useEffect(() => {
    const blink = () => { setBlinking(true); setTimeout(() => setBlinking(false), 130); };
    const id = setInterval(blink, 2800 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  if (!cfg) return null;

  return (
    <motion.div
      className="relative cursor-pointer select-none flex flex-col items-center"
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Active glow */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: agent.color, filter: 'blur(22px)', opacity: 0.25 }}
          animate={{ opacity: [0.12, 0.3, 0.12] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        />
      )}

      {/* Hover border */}
      <motion.div
        className="absolute -inset-3 rounded-2xl border-2 pointer-events-none"
        style={{ borderColor: agent.color }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.7 }}
        transition={{ duration: 0.15 }}
      />

      {/* Thinking bubble */}
      {agentState === 'thinking' && (
        <motion.div
          className="absolute -top-9 right-0 flex gap-1 items-end"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {[5, 7, 9].map((s, i) => (
            <motion.div key={i} className="rounded-full"
              style={{ width: s, height: s, backgroundColor: agent.color, opacity: 0.85 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.14 }}
            />
          ))}
        </motion.div>
      )}

      {/* Talk bubble */}
      {agentState === 'talking' && (
        <motion.div
          className="absolute -top-8 -right-2 rounded-2xl px-2.5 py-1.5 flex gap-1"
          style={{ backgroundColor: agent.color }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="bg-white rounded-full" style={{ width: 4, height: 4 }}
              animate={{ scaleY: [1, 2.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.12 }}
            />
          ))}
        </motion.div>
      )}

      {/* Character SVG */}
      <motion.svg
        viewBox="0 0 100 140"
        width="88"
        height="123"
        animate={{
          y: agentState === 'idle' ? [0, -1.5, 0]
            : agentState === 'talking' ? [0, -2.5, 0]
            : [0, -3.5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: agentState === 'idle' ? 3.5 : agentState === 'talking' ? 0.55 : 1.4,
          ease: 'easeInOut',
        }}
      >
        {/* Chair back */}
        <rect x="10" y="90" width="80" height="55" rx="10"
          fill={`${agent.color}22`} stroke={`${agent.color}55`} strokeWidth="1.2" />

        {/* Clothing */}
        <Clothing c={cfg.top} style={cfg.topStyle} inner={cfg.topInner} />

        {/* Arms (render after clothing so they layer correctly) */}
        <Arms cfg={cfg} state={agentState} />

        {/* Neck */}
        <rect x="43" y="51" width="14" height="17" rx="6" fill={cfg.skin} />

        {/* Head */}
        <ellipse cx="50" cy="32" rx="22" ry="24" fill={cfg.skin} />

        {/* Ears */}
        <ellipse cx="28.5" cy="33" rx="4" ry="5.5" fill={cfg.skinD} />
        <ellipse cx="71.5" cy="33" rx="4" ry="5.5" fill={cfg.skinD} />
        <ellipse cx="28.5" cy="33" rx="2" ry="3" fill={cfg.skin} opacity="0.5" />
        <ellipse cx="71.5" cy="33" rx="2" ry="3" fill={cfg.skin} opacity="0.5" />

        {/* Hair (rendered on top of head) */}
        <Hair c={cfg.hair} style={cfg.hairStyle} />

        {/* Eyebrows */}
        <path d="M33 21 Q39 18.5 44 21" stroke={cfg.hair} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M56 21 Q61 18.5 67 21" stroke={cfg.hair} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Eyes */}
        <Eyes cfg={cfg} blinking={blinking} />

        {/* Glasses (Dev) */}
        {cfg.glasses && <>
          <rect x="32" y="25" width="15" height="11" rx="4" fill="none" stroke="#1A1A2E" strokeWidth="1.8" />
          <rect x="53" y="25" width="15" height="11" rx="4" fill="none" stroke="#1A1A2E" strokeWidth="1.8" />
          <line x1="47" y1="30" x2="53" y2="30" stroke="#1A1A2E" strokeWidth="1.5" />
          <line x1="28" y1="28.5" x2="32" y2="29.5" stroke="#1A1A2E" strokeWidth="1.5" />
          <line x1="72" y1="28.5" x2="68" y2="29.5" stroke="#1A1A2E" strokeWidth="1.5" />
        </>}

        {/* Freckles (Scout) */}
        {cfg.freckles && [
          [36,36],[38,38],[33,37],[64,36],[62,38],[67,37],
        ].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="1.2" fill={cfg.skinD} opacity="0.55" />
        ))}

        {/* Nose */}
        <path d="M47 37 Q50 42 53 37" stroke={cfg.skinD} strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Mouth */}
        <Mouth cfg={cfg} open={agentState === 'talking'} />

        {/* Blush (Aria) */}
        {cfg.blush && <>
          <ellipse cx="32" cy="38" rx="5.5" ry="3" fill="#FF7050" opacity="0.16" />
          <ellipse cx="68" cy="38" rx="5.5" ry="3" fill="#FF7050" opacity="0.16" />
        </>}
      </motion.svg>

      {/* Name badge */}
      <div className="mt-1 text-center">
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: agent.color, color: 'white', fontSize: 10 }}>
          {agent.name}
        </span>
        <p className="text-gray-500 mt-0.5" style={{ fontSize: 9 }}>{agent.role}</p>
      </div>
    </motion.div>
  );
}
