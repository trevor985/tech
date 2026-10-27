import React from 'react';
import { X, Radio, ArrowRight, Code2, Copy, Check } from 'lucide-react';
import { Story } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface StoryModalProps {
  story: Story | null;
  onClose: () => void;
  onJumpToPair: (story: Story) => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  story,
  onClose,
  onJumpToPair
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!story) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(story.previewSnippet);
    setCopied(true);
    playSuccessChime();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col">
        
        {/* Progress bar top */}
        <div className="w-full h-1 bg-slate-800">
          <div className="h-full bg-emerald-500 animate-pulse w-3/4" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <img
              src={story.user.avatar}
              alt={story.user.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-white">
                  {story.user.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  @{story.user.handle}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Sprint status · {story.timeAgo}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playTechClick(600);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {story.isLivePairing && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/30">
                  <Radio className="w-3 h-3 animate-pulse" />
                  LIVE PAIR SESSION IN PROGRESS
                </span>
              )}
            </div>
            <p className="text-sm text-slate-200 font-medium leading-relaxed mt-2">
              "{story.caption}"
            </p>
          </div>

          {/* Code snippet snapshot */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 relative font-mono text-xs text-emerald-400/90 leading-relaxed overflow-x-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-400">
                <Code2 className="w-3 h-3 text-emerald-400" />
                Live Editor Buffer
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap">{story.previewSnippet}</pre>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center gap-3">
          {story.isLivePairing ? (
            <button
              onClick={() => {
                playTechClick(900);
                onJumpToPair(story);
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
            >
              <Radio className="w-4 h-4" />
              JOIN PAIR PROGRAMMING ROOM
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                playTechClick(800);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center transition-colors"
            >
              Close
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
