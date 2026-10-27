import React from 'react';
import { Plus, Radio, Code2 } from 'lucide-react';
import { Story, User } from '../types';
import { playTechClick } from '../utils/audio';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  onSelectStory: (story: Story) => void;
  onAddStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onSelectStory,
  onAddStory
}) => {
  return (
    <div className="w-full py-3 px-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/40">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        
        {/* User's own Add Story button */}
        <button
          onClick={() => {
            playTechClick(800);
            onAddStory();
          }}
          className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
        >
          <div className="relative w-15 h-15 rounded-full p-0.5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 transition-colors flex items-center justify-center">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-13 h-13 rounded-full object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[64px] truncate">
            Your Ping
          </span>
        </button>

        {/* Stories list */}
        {stories.map((story) => {
          return (
            <button
              key={story.id}
              onClick={() => {
                playTechClick(850);
                onSelectStory(story);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div 
                className={`relative w-15 h-15 rounded-full p-[2px] transition-transform active:scale-95 ${
                  story.isLivePairing
                    ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-slate-950'
                    : 'bg-gradient-to-tr from-indigo-500 via-violet-400 to-amber-500'
                }`}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 p-[2px]">
                  <img
                    src={story.user.avatar}
                    alt={story.user.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {story.isLivePairing && (
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-mono text-[8px] font-bold tracking-tight shadow flex items-center gap-0.5 animate-pulse">
                    <Radio className="w-2 h-2 text-slate-950" />
                    PAIR
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center max-w-[68px]">
                <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate w-full text-center">
                  @{story.user.handle}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                  {story.timeAgo}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
