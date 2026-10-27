import React from 'react';
import { X, Github, ExternalLink, Radio, CheckCircle2, Shield, Award, Users } from 'lucide-react';
import { User } from '../types';
import { playTechClick } from '../utils/audio';

interface UserDetailModalProps {
  user: User | null;
  onClose: () => void;
  onStartPairWithUser: (user: User) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  onClose,
  onStartPairWithUser
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 text-left space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/40"
            />
            {user.isOnline && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
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

        {/* Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {user.name}
            </h3>
            <span className="text-xs font-mono text-slate-400">
              @{user.handle}
            </span>
          </div>

          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {user.headline}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {user.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-center font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block">Rep</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{user.reputation}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Stars</span>
            <span className="text-xs font-bold text-amber-500">★ {user.starsCount}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Pair Hours</span>
            <span className="text-xs font-bold text-emerald-500">{user.pairProgrammingHours}h</span>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 block">Verified Tech Stack:</span>
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map(s => (
              <span
                key={s.name}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono flex items-center gap-1"
              >
                <span>{s.name}</span>
                <span className="text-emerald-400 text-[10px] font-bold">{s.level}%</span>
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => {
              playTechClick(900);
              onStartPairWithUser(user);
            }}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Invite to Pair Live</span>
          </button>
        </div>

      </div>
    </div>
  );
};
