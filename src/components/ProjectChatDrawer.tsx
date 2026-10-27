import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  Users, 
  Code2, 
  Copy, 
  Check, 
  Radio, 
  ArrowRight,
  RefreshCw,
  Cpu,
  Shield,
  Zap
} from 'lucide-react';
import { ChatMessage, User, Project } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface ProjectChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (content: string, model: string, systemInstruction: string) => void;
  onInsertCodeIntoEditor?: (code: string) => void;
  isSending?: boolean;
}

export const ProjectChatDrawer: React.FC<ProjectChatDrawerProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
  messages,
  onSendMessage,
  onInsertCodeIntoEditor,
  isSending = false
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedRole, setSelectedRole] = useState<'kernel' | 'speedy' | 'security'>('kernel');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // System instructions for the specific Gemini roles
  const roleConfigs = {
    kernel: {
      name: 'Systems Architect',
      model: 'gemini-3.8-flash',
      icon: Cpu,
      color: 'text-emerald-400',
      systemInstruction: 'You are an elite low-level systems architect, kernel hacker, and distributed runtimes engineer on KernelPulse. Provide concise, deep, high-performance guidance on lock-free concurrency, memory barriers, zero-copy I/O, cacheline alignment, and Rust/C systems code. Always write production-ready code with zero fluff.'
    },
    speedy: {
      name: 'Fast Code Reviewer',
      model: 'gemini-3.1-flash-lite',
      icon: Zap,
      color: 'text-cyan-400',
      systemInstruction: 'You are an ultra-fast, sharp code reviewer and pair programmer. Point out edge cases, syntax simplifications, and quick algorithmic wins in concise bullet points with quick code diffs.'
    },
    security: {
      name: 'Security & Race Auditor',
      model: 'gemini-3.8-flash',
      icon: Shield,
      color: 'text-violet-400',
      systemInstruction: 'You are an expert security auditor and eBPF/Linux memory safety researcher. Scrutinize code for data races, undefined behavior, atomics ordering pitfalls, buffer overflows, and FFI memory leaks.'
    }
  };

  const activeConfig = roleConfigs[selectedRole];

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isSending]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim() || isSending) return;
    playTechClick(850);
    onSendMessage(inputText.trim(), activeConfig.model, activeConfig.systemInstruction);
    setInputText('');
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    playSuccessChime();
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const quickPrompts = [
    'Audit buffer for data races & memory ordering',
    'Review active PR #24 cacheline alignment',
    'Generate benchmark test for 50k concurrent requests',
    'Explain ARM64 LDAR/STLR vs x86 TSO barriers'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md sm:max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-left">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  {project ? project.title.split(':')[0] : 'Pair Collaboration'} Chat
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  Gemini Multi-Turn
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {project ? project.repoName : 'kernelpulse/session-live'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playTechClick(600);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Role Switcher Strip */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Copilot Role &amp; Model:
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              {activeConfig.model}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(roleConfigs) as (keyof typeof roleConfigs)[]).map((key) => {
              const cfg = roleConfigs[key];
              const Icon = cfg.icon;
              const isSelected = selectedRole === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    playTechClick(750);
                    setSelectedRole(key);
                  }}
                  className={`px-2 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/50 text-white shadow-sm'
                      : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                  <span className="truncate text-[11px]">{cfg.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Chat Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            const isAi = msg.sender === 'assistant';

            return (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    {msg.authorAvatar ? (
                      <img 
                        src={msg.authorAvatar} 
                        alt={msg.authorName} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    ) : isAi ? (
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 px-1">
                    <span>{msg.authorName}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && (
                      <span className="px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>

                  <div 
                    className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                        : isAi
                        ? 'bg-slate-950 border border-emerald-500/30 text-slate-200 rounded-tl-sm shadow-md'
                        : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Code Snippet attachment in chat */}
                    {msg.codeSnippet && (
                      <div className="mt-2 rounded-xl bg-slate-900 border border-slate-800 p-2.5 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[9px] text-slate-400">
                          <span>{msg.codeSnippet.filename || 'snippet'}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                              className="hover:text-white"
                            >
                              {copiedCodeId === msg.id ? 'Copied' : 'Copy'}
                            </button>
                            {onInsertCodeIntoEditor && (
                              <button
                                onClick={() => {
                                  playSuccessChime();
                                  onInsertCodeIntoEditor(msg.codeSnippet!.code);
                                }}
                                className="text-emerald-400 hover:underline"
                              >
                                Insert into Buffer
                              </button>
                            )}
                          </div>
                        </div>
                        <pre className="whitespace-pre">{msg.codeSnippet.code}</pre>
                      </div>
                    )}
                  </div>
                </div>

                {isMe && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{activeConfig.name} is reasoning &amp; analyzing buffers...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-3 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                playTechClick(800);
                setInputText(prompt);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap shrink-0 border border-slate-700/60 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Ask ${activeConfig.name} or project peers... (Shift+Enter for newline)`}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isSending}
              className={`p-3 rounded-xl font-bold text-slate-950 transition-all ${
                inputText.trim() && !isSending
                  ? 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
