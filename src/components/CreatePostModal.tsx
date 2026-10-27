import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Target, 
  Sparkles, 
  Users, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { Post, User } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface CreatePostModalProps {
  currentUser: User;
  initialCode?: string;
  initialLanguage?: string;
  initialFilename?: string;
  onClose: () => void;
  onSubmit: (postData: Partial<Post>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  initialCode = '',
  initialLanguage = 'rust',
  initialFilename = 'lib.rs',
  onClose,
  onSubmit
}) => {
  const [type, setType] = useState<'milestone' | 'snippet' | 'sprint_update'>('milestone');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('rust, systems, open-source');
  
  // Code Snippet attachment
  const [includeCode, setIncludeCode] = useState(!!initialCode);
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [filename, setFilename] = useState(initialFilename);

  // Milestone attachment
  const [includeMilestone, setIncludeMilestone] = useState(true);
  const [milestoneLabel, setMilestoneLabel] = useState('Sprint Phase 2: Memory Buffer Verification');
  const [milestoneCurrent, setMilestoneCurrent] = useState(2);
  const [milestoneTotal, setMilestoneTotal] = useState(4);
  const [milestoneDate, setMilestoneDate] = useState('Nov 08, 2026');

  // Looking for contributors
  const [isLookingForContributors, setIsLookingForContributors] = useState(false);
  const [contributorRoles, setContributorRoles] = useState('Systems Engineer, Benchmark Tester');
  const [sprintGoal, setSprintGoal] = useState('Pair program on zero-copy serialization driver');

  // Media
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const availableMedia = [
    { label: 'Cyber Terminal', url: '/src/assets/images/project_cyber_terminal_1793109902793.jpg' },
    { label: 'AST Compiler Graph', url: '/src/assets/images/project_ai_compiler_1793109903124.jpg' },
    { label: 'WebGPU Shader', url: '/src/assets/images/project_webgpu_engine_1793109904558.jpg' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    playSuccessChime();

    const tags = tagsInput.split(',').map(t => t.trim().toLowerCase().replace('#', '')).filter(Boolean);

    const newPost: Partial<Post> = {
      type,
      title: title.trim(),
      content: content.trim(),
      tags,
      mediaUrl: selectedMedia || undefined,
      codeSnippet: includeCode && code.trim() ? {
        language,
        code: code.trim(),
        filename: filename.trim() || 'snippet.rs'
      } : undefined,
      milestone: includeMilestone ? {
        label: milestoneLabel,
        current: Number(milestoneCurrent),
        total: Number(milestoneTotal),
        targetDate: milestoneDate
      } : undefined,
      lookingForContributors: isLookingForContributors ? {
        active: true,
        roles: contributorRoles.split(',').map(r => r.trim()).filter(Boolean),
        sprintGoal: sprintGoal.trim(),
        openSeats: 2
      } : undefined,
    };

    onSubmit(newPost);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 text-left space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Share Dev Update &amp; Sprint Call
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Post milestone progress or recruit pair partners
            </p>
          </div>
          <button
            onClick={() => {
              playTechClick(600);
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Post Type Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType('milestone')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                type === 'milestone'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Milestone
            </button>
            <button
              type="button"
              onClick={() => {
                setType('snippet');
                setIncludeCode(true);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                type === 'snippet'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Code Snippet
            </button>
            <button
              type="button"
              onClick={() => {
                setType('sprint_update');
                setIsLookingForContributors(true);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                type === 'sprint_update'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sprint Call
            </button>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Update Title:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shipped v0.4 of AetherKernel lock-free ringbuffer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Technical Description &amp; Milestones:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what you built, throughput benchmarks, bugs fixed, or pair programming challenges solved..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-sans resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tech Tags (comma separated):
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Code Snippet Attachment Toggle */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCode}
                  onChange={(e) => setIncludeCode(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <Code2 className="w-4 h-4 text-emerald-500" />
                <span>Attach Executable Code Snippet</span>
              </label>
            </div>

            {includeCode && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="filename (e.g. ring_buf.rs)"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-300"
                  />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-300"
                  >
                    <option value="rust">Rust</option>
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="c">C / C++</option>
                  </select>
                </div>
                <textarea
                  rows={4}
                  placeholder="// Paste or write your source snippet here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 resize-none focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Looking for Contributors Toggle */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={isLookingForContributors}
                onChange={(e) => setIsLookingForContributors(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <Users className="w-4 h-4 text-amber-500" />
              <span>Looking for Sprint Contributors / Pair Partners</span>
            </label>

            {isLookingForContributors && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-[11px] text-slate-400 block">Roles Needed:</label>
                  <input
                    type="text"
                    value={contributorRoles}
                    onChange={(e) => setContributorRoles(e.target.value)}
                    placeholder="e.g. Systems Engineer, WASM SIMD Tester"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">Sprint Goal:</label>
                  <input
                    type="text"
                    value={sprintGoal}
                    onChange={(e) => setSprintGoal(e.target.value)}
                    placeholder="e.g. Benchmark lock-free queue with 10k concurrent clients"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Optional Media Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>Attach Visual Preview (Optional):</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableMedia.map(m => (
                <button
                  type="button"
                  key={m.label}
                  onClick={() => setSelectedMedia(selectedMedia === m.url ? null : m.url)}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    selectedMedia === m.url
                      ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={m.url}
                    alt={m.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-14 object-cover rounded-lg mb-1"
                  />
                  <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 truncate block">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              Broadcast Post &rarr;
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
