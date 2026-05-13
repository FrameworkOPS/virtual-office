'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent } from '@/lib/agents/config';
import { useOfficeStore, Message } from '@/lib/store/office';

interface Props {
  agent: Agent;
  onClose: () => void;
}

export default function AgentChat({ agent, onClose }: Props) {
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { getConversation, addMessage, updateLastMessage, setAgentState, clearConversation } =
    useOfficeStore();
  const conversation = getConversation(agent.id);
  const messages = conversation.messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(agent.id, userMsg);
    setInput('');
    setIsStreaming(true);
    setAgentState(agent.id, 'thinking');

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    addMessage(agent.id, assistantMsg);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id, messages: apiMessages }),
      });

      if (!response.ok) {
        const errBody = await response
          .json()
          .catch(() => ({ error: `Request failed (${response.status})` }));
        updateLastMessage(
          agent.id,
          `⚠️ ${errBody.error ?? 'The agent could not respond.'}`,
        );
        return;
      }

      if (!response.body) {
        updateLastMessage(agent.id, '⚠️ The server returned an empty stream.');
        return;
      }

      setAgentState(agent.id, 'talking');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        updateLastMessage(agent.id, accumulated);
      }

      accumulated += decoder.decode();
      if (accumulated.length === 0) {
        updateLastMessage(agent.id, '⚠️ The agent returned no content.');
      } else {
        updateLastMessage(agent.id, accumulated);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      updateLastMessage(agent.id, `⚠️ ${message}`);
    } finally {
      setIsStreaming(false);
      setAgentState(agent.id, 'idle');
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{ backgroundColor: `${agent.color}22` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: agent.color }}
          >
            {agent.emoji}
          </div>
          <div>
            <div className="text-white font-semibold text-sm">{agent.name}</div>
            <div className="text-gray-400 text-xs">{agent.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => clearConversation(agent.id)}
            className="text-gray-500 hover:text-gray-300 text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center h-full gap-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${agent.color}33` }}
            >
              {agent.emoji}
            </div>
            <div>
              <p className="text-white font-medium">{agent.name}</p>
              <p className="text-gray-400 text-sm mt-1">{agent.role}</p>
              <p className="text-gray-500 text-xs mt-2 max-w-xs">
                {getGreeting(agent.id)}
              </p>
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs mr-2 mt-1 flex-shrink-0"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.emoji}
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-tr-sm'
                    : 'text-gray-100 rounded-tl-sm'
                }`}
                style={{
                  backgroundColor:
                    msg.role === 'user' ? agent.color : 'rgba(255,255,255,0.08)',
                }}
              >
                {msg.content || (
                  <span className="flex gap-1 items-center py-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="block w-1.5 h-1.5 rounded-full bg-gray-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-white/10">
        <div className="flex gap-2 items-center bg-white/5 rounded-xl px-3 py-2 border border-white/10 focus-within:border-white/25 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Message ${agent.name}...`}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500 disabled:opacity-50"
          />
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-30"
            style={{ backgroundColor: agent.color }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </motion.button>
        </div>
        <p className="text-gray-600 text-xs text-center mt-2">↵ to send</p>
      </div>
    </motion.div>
  );
}

function getGreeting(agentId: string): string {
  const greetings: Record<string, string> = {
    aria: "I can help you coordinate tasks, plan projects, and connect you with the right team member.",
    dev: "Drop your code questions, bugs, or architecture ideas here. Let's build something great.",
    scout: "Give me a research question and I'll dig in. I'm great at synthesis and finding non-obvious insights.",
    scribe: "Need copy, docs, an email, or a proposal? Tell me the context and I'll craft it.",
    atlas: "Share your data or describe your metrics question. I turn numbers into decisions.",
    ops: "Process problems, runbooks, SOPs, or project planning — I've got you.",
  };
  return greetings[agentId] ?? "How can I help you today?";
}
