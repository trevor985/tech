import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  GitCommit as GitCommitIcon, 
  GitPullRequest, 
  CheckCircle2, 
  Plus, 
  Check, 
  FileCode, 
  ArrowRight,
  GitMerge,
  ShieldCheck,
  Clock,
  Layers
} from 'lucide-react';
import { GitCommit, PullRequest, User } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface GitVersionControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  commits: GitCommit[];
  pullRequests: PullRequest[];
  currentBranch: string;
  onSwitchBranch: (branch: string) => void;
  onCommitChanges: (message: string) => void;
  onMergePullRequest: (prId: number) => void;
  onCreatePullRequest: (title: string, desc: string, sourceBranch: string) => void;
  currentUser: User;
  activeFilename: string;
  currentBufferCode: string;
}

export const GitVersionControlModal: React.FC<GitVersionControlModalProps> = ({
  isOpen,
  onClose,
  commits,
  pullRequests,
  currentBranch,
  onSwitchBranch,
  onCommitChanges,
  onMergePullRequest,
  onCreatePullRequest,
  currentUser,
  activeFilename,
  currentBufferCode
}) => {
  const [activeTab, setActiveTab] = useState<'commits' | 'changes' | 'prs'>('prs');
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedPr, setSelectedPr] = useState<PullRequest | null>(pullRequests[0] || null);

  // New PR form
  const [showNewPrForm, setShowNewPrForm] = useState(false);
  const [newPrTitle, setNewPrTitle] = useState('');
  const [newPrDesc, setNewPrDesc] = useState('');

  // New branch form
  const [showNewBranchForm, setShowNewBranchForm] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  if (!isOpen) return null;

  const branches = ['main', 'feat/aligned-ringbuffer', 'fix/ffi-null-safety', 'perf/simd-lexing'];

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    playSuccessChime();
    onCommitChanges(commitMessage.trim());
    setCommitMessage('');
    setActiveTab('commits');
  };

  const handleCreatePr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrTitle.trim()) return;
    playSuccessChime();
    onCreatePullRequest(newPrTitle.trim(), newPrDesc.trim(), currentBranch);
    setNewPrTitle('');
    setNewPrDesc('');
    setShowNewPrForm(false);
    setActiveTab('prs');
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;
    playSuccessChime();
    onSwitchBranch(newBranchName.trim());
    setNewBranchName('');
    setShowNewBranchForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl flex flex-col text-left overflow-hidden">
        
        {/* Top Header & Branch Selector */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Git Version Control &amp; Pull Requests
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Branch:</span>
                <span className="text-emerald-400 font-bold">{currentBranch}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Branch Switcher */}
            <select
              value={currentBranch}
              onChange={(e) => {
                playTechClick(750);
                onSwitchBranch(e.target.value);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700 focus:outline-none focus:border-emerald-500"
            >
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

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
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => {
              playTechClick(800);
              setActiveTab('prs');
            }}
            className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'prs'
                ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pull Requests ({pullRequests.length})</span>
          </button>
          <button
            onClick={() => {
              playTechClick(800);
              setActiveTab('changes');
            }}
            className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'changes'
                ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Working Tree Diff &amp; Commit</span>
          </button>
          <button
            onClick={() => {
              playTechClick(800);
              setActiveTab('commits');
            }}
            className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'commits'
                ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitCommitIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Commit Log ({commits.length})</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          
          {/* TAB 1: Pull Requests */}
          {activeTab === 'prs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Active &amp; Merged Pull Requests
                </span>
                <button
                  onClick={() => setShowNewPrForm(!showNewPrForm)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Pull Request</span>
                </button>
              </div>

              {/* Create New PR Form Drawer */}
              {showNewPrForm && (
                <form onSubmit={handleCreatePr} className="p-3.5 bg-slate-950 rounded-2xl border border-emerald-500/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Open Pull Request from {currentBranch} &rarr; main
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNewPrForm(false)}
                      className="text-slate-400 hover:text-white text-xs font-mono"
                    >
                      Cancel
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="PR Title (e.g. feat: Zero-copy ringbuffer IPC)"
                    value={newPrTitle}
                    onChange={(e) => setNewPrTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                  <textarea
                    rows={2}
                    placeholder="Describe architectural changes, benchmarks, and test coverage..."
                    value={newPrDesc}
                    onChange={(e) => setNewPrDesc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans resize-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold"
                  >
                    Create Pull Request
                  </button>
                </form>
              )}

              {/* PRs List */}
              <div className="space-y-3">
                {pullRequests.map((pr) => {
                  const isMerged = pr.status === 'merged';
                  const isSelected = selectedPr?.id === pr.id;

                  return (
                    <div
                      key={pr.id}
                      onClick={() => {
                        playTechClick(750);
                        setSelectedPr(pr);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-950 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/20'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400">
                              #{pr.id}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-semibold uppercase ${
                              isMerged
                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {pr.status}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              {pr.branchSource} &rarr; {pr.branchTarget}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">
                            {pr.title}
                          </h4>
                        </div>

                        <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                          <span>{pr.createdAt}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {pr.description}
                      </p>

                      {/* Expanded PR Details & Merge Action if Selected */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-1.5 text-emerald-400">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Continuous Integration: All 4 checks passing</span>
                            </div>
                            <span className="text-slate-400">{pr.changedFilesCount} files changed</span>
                          </div>

                          {/* Unified Diff Box */}
                          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-xs overflow-x-auto">
                            <pre className="text-slate-300 whitespace-pre">
                              {pr.diffText.split('\n').map((line, idx) => (
                                <div 
                                  key={idx}
                                  className={
                                    line.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' :
                                    line.startsWith('-') ? 'text-rose-400 bg-rose-500/10' :
                                    line.startsWith('@') ? 'text-cyan-400' : 'text-slate-400'
                                  }
                                >
                                  {line}
                                </div>
                              ))}
                            </pre>
                          </div>

                          {!isMerged ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playSuccessChime();
                                onMergePullRequest(pr.id);
                              }}
                              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                            >
                              <GitMerge className="w-4 h-4" />
                              <span>Merge Pull Request #{pr.id} into main</span>
                            </button>
                          ) : (
                            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-center font-mono text-xs text-violet-300 flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                              <span>Pull Request successfully merged into main branch.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Working Tree Diff & Commit */}
          {activeTab === 'changes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Unstaged Buffer Changes ({activeFilename})
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Ready to Stage &amp; Commit
                </span>
              </div>

              {/* Diff Viewer for currently edited file */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs overflow-x-auto space-y-1">
                <div className="pb-2 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>diff --git a/{activeFilename} b/{activeFilename}</span>
                  <span className="text-emerald-400">+12 -3 lines</span>
                </div>
                <div className="text-cyan-400">@@ -1,8 +1,12 @@</div>
                <div className="text-slate-500"> // Active working buffer</div>
                <div className="text-rose-400 bg-rose-500/10">- pub struct SpscRing &#123; head: usize, tail: usize &#125;</div>
                <div className="text-emerald-400 bg-emerald-500/10">+ #[repr(align(64))]</div>
                <div className="text-emerald-400 bg-emerald-500/10">+ pub struct SpscRing &#123; head: AtomicUsize, tail: AtomicUsize &#125;</div>
                <div className="text-slate-400">   // Lock-free invariants verified</div>
              </div>

              {/* Commit Input */}
              <form onSubmit={handleCommit} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 block">
                    Commit Message:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="perf(cache): isolate head and tail across 64-byte cachelines"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {['perf: ', 'feat: ', 'fix: ', 'test: ', 'refactor: '].map(prefix => (
                    <button
                      key={prefix}
                      type="button"
                      onClick={() => setCommitMessage(prev => prefix + prev.replace(/^[a-z]+:\s*/, ''))}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px]"
                    >
                      {prefix}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <GitCommitIcon className="w-4 h-4" />
                  <span>Commit to {currentBranch}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Commit History */}
          {activeTab === 'commits' && (
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Repository Commit Log ({currentBranch})
              </span>

              <div className="space-y-2.5">
                {commits.map((c) => (
                  <div
                    key={c.hash}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3 font-mono text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={c.authorAvatar}
                        alt={c.author}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 text-[10px] font-bold">
                            {c.hash}
                          </span>
                          <span className="text-slate-400 text-[11px]">{c.author}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-500 text-[10px]">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-200 text-xs font-sans font-medium">
                          {c.message}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] shrink-0">
                      <span className="text-emerald-400">+{c.diffStats.additions}</span>
                      <span className="text-slate-600 mx-1">/</span>
                      <span className="text-rose-400">-{c.diffStats.deletions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
