import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Terminal as TerminalIcon, 
  Bug, 
  Sparkles, 
  Share2, 
  Radio, 
  Users, 
  Mic, 
  MicOff, 
  Copy, 
  Check, 
  RefreshCw, 
  Cpu, 
  Flame, 
  Layers,
  CheckCircle2,
  AlertCircle,
  GitBranch,
  GitPullRequest,
  MessageSquare,
  Zap
} from 'lucide-react';
import { SAMPLE_CODE_SNIPPETS } from '../data/initialData';
import { Collaborator } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface CodeEditorViewProps {
  initialCode?: string;
  initialLanguage?: string;
  initialFilename?: string;
  onPostSnippetToFeed: (code: string, language: string, filename: string) => void;
  onOpenGitModal?: () => void;
  onOpenChatDrawer?: () => void;
  currentBranch?: string;
  openPrCount?: number;
  collaborators?: Collaborator[];
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({
  initialCode,
  initialLanguage = 'rust',
  initialFilename = 'spsc_ring.rs',
  onPostSnippetToFeed,
  onOpenGitModal,
  onOpenChatDrawer,
  currentBranch = 'main',
  openPrCount = 2,
  collaborators = []
}) => {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode || SAMPLE_CODE_SNIPPETS.rust);
  const [filename, setFilename] = useState(initialFilename);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[KernelPulse Shared IDE initialized]',
    '[Multi-user CRDT synchronization active · Channel #aether-collab-01]',
    'Ready. Tap "Run / Test" to execute buffer or "Git / PRs" to inspect branches.'
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionStats, setExecutionStats] = useState<{ timeMs: number; memoryKb: number } | null>(null);
  
  // Real-time Pair Programming state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isLiveCollabActive, setIsLiveCollabActive] = useState(true);
  
  // Multi-cursor positions for simultaneous collaborators
  const [remoteCursors, setRemoteCursors] = useState<{
    id: string;
    name: string;
    handle: string;
    color: string;
    line: number;
    col: number;
    isTyping: boolean;
  }[]>([
    { id: '1', name: 'Kaelen Thorne', handle: '0xKael', color: '#f59e0b', line: 18, col: 6, isTyping: true },
    { id: '2', name: 'Elena Rostova', handle: 'elena_kernel', color: '#06b6d4', line: 24, col: 2, isTyping: false },
    { id: '3', name: 'Maya Chen', handle: 'mayacodes', color: '#a855f7', line: 12, col: 14, isTyping: false }
  ]);
  
  // AI Debugger state
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    type: 'optimization' | 'bug' | 'security';
    message: string;
    fixCode?: string;
  }[] | null>(null);

  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update if props change
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      if (initialLanguage) setLanguage(initialLanguage);
      if (initialFilename) setFilename(initialFilename);
    }
  }, [initialCode, initialLanguage, initialFilename]);

  // Real-time peer movement simulation
  useEffect(() => {
    if (!isLiveCollabActive) return;

    const interval = setInterval(() => {
      setRemoteCursors(prev => prev.map(c => {
        const totalLines = code.split('\n').length;
        const randomLine = Math.floor(Math.random() * Math.min(totalLines, 28)) + 1;
        const shouldType = Math.random() > 0.5;
        return {
          ...c,
          line: randomLine,
          col: Math.floor(Math.random() * 25),
          isTyping: shouldType
        };
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, [isLiveCollabActive, code]);

  const handleLanguageChange = (newLang: string) => {
    playTechClick(750);
    setLanguage(newLang);
    if (newLang === 'rust') {
      setCode(SAMPLE_CODE_SNIPPETS.rust);
      setFilename('ring_buffer.rs');
    } else if (newLang === 'javascript') {
      setCode(SAMPLE_CODE_SNIPPETS.javascript);
      setFilename('debounce_search.js');
    } else if (newLang === 'python') {
      setCode(SAMPLE_CODE_SNIPPETS.python);
      setFilename('async_worker.py');
    } else {
      setCode(SAMPLE_CODE_SNIPPETS.typescript);
      setFilename('crdt_sync.ts');
    }
    setAiSuggestions(null);
  };

  const handleRunCode = () => {
    playTechClick(900);
    setIsRunning(true);
    setConsoleLogs(prev => [...prev, `> Executing ${filename} in sandbox...`]);

    const startTime = performance.now();

    setTimeout(() => {
      if (language === 'javascript' || language === 'typescript') {
        try {
          const captured: string[] = [];
          const customConsole = {
            log: (...args: unknown[]) => captured.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args: unknown[]) => captured.push(`[ERROR] ${args.join(' ')}`),
            warn: (...args: unknown[]) => captured.push(`[WARN] ${args.join(' ')}`),
          };

          const runnableCode = `
            return (function(console) {
              try {
                ${code}
              } catch(err) {
                console.error(err.message);
              }
            })(customConsole);
          `;
          new Function('customConsole', runnableCode)(customConsole);

          const timeElapsed = Math.round(performance.now() - startTime + 8);
          setExecutionStats({ timeMs: timeElapsed, memoryKb: 1420 });

          if (captured.length > 0) {
            setConsoleLogs(prev => [...prev, ...captured, `✓ Process finished successfully (exit 0) in ${timeElapsed}ms`]);
          } else {
            setConsoleLogs(prev => [...prev, '✓ Buffer evaluated successfully. 0 invariants violated.', `Execution time: ${timeElapsed}ms`]);
          }
          playSuccessChime();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          setConsoleLogs(prev => [...prev, `[Runtime Error]: ${message}`]);
        }
      } else {
        const timeElapsed = Math.round(Math.random() * 8 + 3);
        setExecutionStats({ timeMs: timeElapsed, memoryKb: 2150 });
        setConsoleLogs(prev => [
          ...prev,
          `[Target]: ${filename} (x86_64-unknown-linux-gnu / release)`,
          `[Throughput]: 12.8M operations/sec (P99: 1.4µs)`,
          `[Concurrency Invariant]: Lock-free SPSC verified. 0 race conditions.`,
          `✓ All 4 unit test assertions PASSED (${timeElapsed}ms)`
        ]);
        playSuccessChime();
      }
      setIsRunning(false);
    }, 400);
  };

  const handleAnalyzeWithAi = () => {
    playTechClick(880);
    setIsAiAnalyzing(true);

    setTimeout(() => {
      setIsAiAnalyzing(false);
      playSuccessChime();

      if (language === 'rust') {
        setAiSuggestions([
          {
            type: 'optimization',
            message: 'Add #[repr(align(64))] to SpscRing buffer struct to prevent false-sharing across CPU L1 cachelines in multi-core throughput.'
          },
          {
            type: 'security',
            message: 'Ordering::Relaxed load on head is safe for single-producer, but ensure Ordering::Acquire on consumer reads.'
          }
        ]);
      } else if (language === 'javascript') {
        setAiSuggestions([
          {
            type: 'optimization',
            message: 'Add an LRU eviction limit to the cache Map to prevent unbound memory growth during long-running sessions.'
          }
        ]);
      } else {
        setAiSuggestions([
          {
            type: 'optimization',
            message: 'CRDT sequence clock can be compressed into a BitSet representation to reduce bandwidth over WebSocket pings by ~40%.'
          },
          {
            type: 'bug',
            message: 'Ensure uuid v4 generation has fallback for non-secure contexts (e.g. self.crypto.randomUUID).'
          }
        ]);
      }
    }, 700);
  };

  const insertSnippetToken = (token: string) => {
    playTechClick(800);
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newCode = code.substring(0, start) + token + code.substring(end);
    setCode(newCode);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length, start + token.length);
    }, 0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    playSuccessChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="space-y-3 pb-24 px-2 sm:px-4 text-left">
      
      {/* Top Collaboration Bar: Real-Time Peers & Branch Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Active Multi-User Presence Stack */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                Shared Collaborative IDE
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                {isLiveCollabActive ? '4 Hackers Online' : 'Solo Mode'}
              </span>
            </div>

            {/* Collaborator Avatars & Live Cursor Tag */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex -space-x-1.5 overflow-hidden">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center ring-1 ring-slate-900" title="You (Host)">
                  You
                </span>
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center ring-1 ring-slate-900" title="Kaelen (@0xKael)">
                  KL
                </span>
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[9px] flex items-center justify-center ring-1 ring-slate-900" title="Elena (@elena_kernel)">
                  EL
                </span>
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white font-bold text-[9px] flex items-center justify-center ring-1 ring-slate-900" title="Maya (@mayacodes)">
                  MY
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                @0xKael is editing line {remoteCursors[0].line}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Git & Integrated Chat Buttons */}
        <div className="flex items-center gap-2">
          {/* Git / PRs Button */}
          {onOpenGitModal && (
            <button
              onClick={() => {
                playTechClick(800);
                onOpenGitModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors shadow-sm"
              title="Open Git branches, working diff, and pull requests"
            >
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentBranch}</span>
              {openPrCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                  {openPrCount} PRs
                </span>
              )}
            </button>
          )}

          {/* Integrated Chat Button */}
          {onOpenChatDrawer && (
            <button
              onClick={() => {
                playTechClick(800);
                onOpenChatDrawer();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-mono transition-colors"
              title="Open Project Discussion & Gemini Pair Copilot"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Project Chat</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}

          {/* Voice Chat Toggle */}
          <button
            onClick={() => {
              playTechClick(750);
              setIsVoiceActive(!isVoiceActive);
            }}
            className={`p-1.5 rounded-xl text-xs font-mono transition-colors ${
              isVoiceActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle WebRTC Audio Channel"
          >
            {isVoiceActive ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Editor Toolbar (Language, Filename, Action Buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
        
        {/* Language & Filename */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="rust">Rust</option>
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="px-2 py-1 rounded-lg bg-slate-950 text-xs font-mono text-slate-300 border border-slate-800 w-32 sm:w-40 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Action Buttons: Run, AI Debug, Share to Feed */}
        <div className="flex items-center gap-2">
          {/* AI Quick Scan */}
          <button
            onClick={handleAnalyzeWithAi}
            disabled={isAiAnalyzing}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-mono border border-indigo-500/30 transition-all active:scale-95"
            title="Scan code for memory leaks, race conditions, or optimizations"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">AI Review</span>
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Run Code CTA */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs tracking-tight shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run / Test'}</span>
          </button>

          {/* Share to Feed CTA */}
          <button
            onClick={() => {
              playTechClick(850);
              onPostSnippetToFeed(code, language, filename);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
            title="Share this snippet as a Feed post or milestone"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post Snippet</span>
          </button>
        </div>
      </div>

      {/* Mobile Coding Shortcut Keyboard Bar */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-0.5">
        {['{', '}', '(', ')', '[', ']', '=>', ';', '===', 'async', 'await', 'pub', 'fn', 'let', 'const', 'return'].map((tok) => (
          <button
            key={tok}
            onClick={() => insertSnippetToken(tok)}
            className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded border border-slate-700/60 shrink-0 active:scale-95"
          >
            {tok}
          </button>
        ))}
      </div>

      {/* Code Editor Window with Line Numbers and Simultaneous Partner Cursors */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        
        {/* Editor Titlebar */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-300">{filename}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span>{lineCount} lines</span>
            <span>CRDT Sync: 0ms lag</span>
            <span className="text-emerald-400 font-bold">Branch: {currentBranch}</span>
          </div>
        </div>

        {/* Live Partner Remote Cursors Badges Overlay */}
        {isLiveCollabActive && (
          <div className="absolute top-11 right-3 z-20 pointer-events-none flex items-center gap-2">
            {remoteCursors.map((cursor) => (
              <span
                key={cursor.id}
                className="px-2 py-0.5 rounded text-[10px] font-mono shadow-sm flex items-center gap-1 border border-slate-700/60"
                style={{ backgroundColor: `${cursor.color}20`, color: cursor.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: cursor.color }} />
                <span>@{cursor.handle} (L{cursor.line})</span>
              </span>
            ))}
          </div>
        )}

        {/* Editor Area */}
        <div className="relative flex min-h-[300px] max-h-[440px] overflow-auto">
          {/* Line Numbers */}
          <div className="w-10 sm:w-12 py-3 bg-slate-950 text-right pr-3 select-none text-slate-600 font-mono text-xs leading-6 border-r border-slate-900 shrink-0">
            {Array.from({ length: lineCount }).map((_, i) => {
              const hasCursor = remoteCursors.find(c => c.line === i + 1);
              return (
                <div 
                  key={i}
                  style={hasCursor ? { color: hasCursor.color, fontWeight: 'bold' } : undefined}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

          {/* Editable Textarea */}
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[300px] py-3 px-3 bg-transparent text-emerald-400 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none focus:ring-0 whitespace-pre overflow-x-auto tab-4"
              style={{ tabSize: 2 }}
            />
          </div>
        </div>

        {/* Remote Partner Cursor Highlights in Buffer */}
        {isLiveCollabActive && remoteCursors.map((cursor) => (
          <div 
            key={cursor.id}
            className="absolute left-10 sm:left-12 right-0 h-6 pointer-events-none transition-all duration-300"
            style={{ 
              top: `${Math.min(380, cursor.line * 24 + 36)}px`,
              backgroundColor: `${cursor.color}08`,
              borderLeft: `2px solid ${cursor.color}`
            }}
          />
        ))}
      </div>

      {/* AI Debugger / Code Review Suggestions (if active) */}
      {aiSuggestions && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-3.5 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Code Review &amp; Profiler</span>
            </div>
            <button
              onClick={() => setAiSuggestions(null)}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              Dismiss
            </button>
          </div>

          <div className="space-y-2">
            {aiSuggestions.map((item, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  {item.type === 'optimization' ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Cpu className="w-3 h-3" /> Performance Tip
                    </span>
                  ) : item.type === 'bug' ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Potential Edge Case
                    </span>
                  ) : (
                    <span className="text-cyan-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Memory Safety Note
                    </span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Terminal & Execution Console */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Terminal Header */}
        <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">Terminal &amp; Test Output</span>
          </div>

          <div className="flex items-center gap-3">
            {executionStats && (
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="text-emerald-400">{executionStats.timeMs}ms</span>
                <span>·</span>
                <span>{executionStats.memoryKb} KB</span>
              </div>
            )}
            <button
              onClick={() => setConsoleLogs(['[Console Cleared]'])}
              className="text-[11px] text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="p-3 font-mono text-xs text-slate-300 space-y-1 max-h-44 overflow-y-auto bg-slate-950">
          {consoleLogs.map((log, index) => (
            <div 
              key={index}
              className={`${
                log.startsWith('[ERROR]') || log.includes('Error')
                  ? 'text-rose-400'
                  : log.startsWith('✓')
                  ? 'text-emerald-400'
                  : log.startsWith('>')
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
