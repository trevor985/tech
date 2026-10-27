import React, { useState } from 'react';
import { 
  Target, 
  Users, 
  GitBranch, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Calendar, 
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { Sprint, User } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface SprintMatchViewProps {
  sprints: Sprint[];
  currentUser: User;
  onJoinSprint: (sprintId: string, role: string, note: string) => void;
  onOpenCreateSprint: () => void;
  onViewSprintTimeline: (sprint: Sprint) => void;
}

export const SprintMatchView: React.FC<SprintMatchViewProps> = ({
  sprints,
  currentUser,
  onJoinSprint,
  onOpenCreateSprint,
  onViewSprintTimeline
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [joiningSprint, setJoiningSprint] = useState<Sprint | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [joinNote, setJoinNote] = useState<string>('');
  const [joinedToast, setJoinedToast] = useState<string | null>(null);

  // Calculate dynamic skill match score
  const calculateMatch = (sprint: Sprint): number => {
    const userSkillNames = currentUser.skills.map(s => s.name.toLowerCase());
    let matchedCount = 0;
    sprint.requiredSkills.forEach(req => {
      const match = userSkillNames.some(uSkill => uSkill.includes(req.toLowerCase()) || req.toLowerCase().includes(uSkill));
      if (match) matchedCount++;
    });
    const percentage = Math.round((matchedCount / sprint.requiredSkills.length) * 100);
    return Math.max(50, Math.min(98, percentage));
  };

  const filteredSprints = sprints.filter(sprint => {
    if (selectedSkillFilter !== 'all') {
      const hasSkill = sprint.requiredSkills.some(s => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()));
      if (!hasSkill) return false;
    }
    if (selectedDifficulty !== 'all') {
      if (sprint.difficulty !== selectedDifficulty) return false;
    }
    return true;
  });

  const handleOpenJoinModal = (sprint: Sprint) => {
    playTechClick(850);
    setJoiningSprint(sprint);
    setSelectedRole(sprint.openPositions[0] || 'Contributor');
    setJoinNote(`Hey! I would love to join this sprint. I have production experience in ${sprint.requiredSkills.join(', ')}.`);
  };

  const handleSubmitJoin = () => {
    if (!joiningSprint) return;
    playSuccessChime();
    onJoinSprint(joiningSprint.id, selectedRole, joinNote);
    const sprintTitle = joiningSprint.title;
    setJoiningSprint(null);
    setJoinedToast(`Joined sprint "${sprintTitle}"! Workspace access granted.`);
    setTimeout(() => setJoinedToast(null), 4000);
  };

  return (
    <div className="space-y-4 pb-24 px-3 sm:px-4 text-left">
      
      {/* Header and Start Sprint CTA */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            Skill-Based Sprint Matching
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Matched directly to your low-level systems &amp; runtime skills
          </p>
        </div>

        <button
          onClick={() => {
            playTechClick(900);
            onOpenCreateSprint();
          }}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-tight shadow-md shadow-emerald-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Launch Sprint</span>
        </button>
      </div>

      {/* User's Verified Skill Profile Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Your Active Tech Vector
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
              6 Verified Skills
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentUser.skills.map(skill => (
              <span
                key={skill.name}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1"
              >
                <span>{skill.name}</span>
                <span className="text-emerald-400 text-[10px]">{skill.level}%</span>
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 sm:border-l sm:border-slate-800 sm:pl-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Avg Match</span>
            <span className="text-lg font-bold font-mono text-emerald-400">92.4%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Skill filter */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {['all', 'Rust', 'WebAssembly', 'eBPF', 'WebGPU', 'TypeScript'].map(skill => (
            <button
              key={skill}
              onClick={() => {
                playTechClick(750);
                setSelectedSkillFilter(skill);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedSkillFilter === skill
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {skill === 'all' ? 'All Skills' : skill}
            </button>
          ))}
        </div>
      </div>

      {/* Sprints List */}
      <div className="space-y-4">
        {filteredSprints.map((sprint) => {
          const matchScore = calculateMatch(sprint);
          const isHighMatch = matchScore >= 85;

          return (
            <div
              key={sprint.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden p-4 sm:p-5 transition-all hover:border-emerald-500/50"
            >
              {/* Top Row: Repo & Match Badge */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                      {sprint.repoName}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                    {sprint.title}
                  </h3>
                </div>

                {/* Match Score Badge */}
                <div className={`px-2.5 py-1 rounded-xl text-center font-mono shrink-0 border ${
                  isHighMatch
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                }`}>
                  <span className="text-sm font-bold block leading-none">{matchScore}%</span>
                  <span className="text-[9px] uppercase tracking-tight block mt-0.5">MATCH</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-3 leading-relaxed">
                {sprint.description}
              </p>

              {/* Required Skills & Match Checklist */}
              <div className="mt-3.5 space-y-1.5">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                  Required Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sprint.requiredSkills.map(reqSkill => {
                    const isMatched = currentUser.skills.some(
                      s => s.name.toLowerCase().includes(reqSkill.toLowerCase()) || 
                           reqSkill.toLowerCase().includes(s.name.toLowerCase())
                    );

                    return (
                      <span
                        key={reqSkill}
                        className={`text-xs px-2.5 py-0.5 rounded-md font-mono flex items-center gap-1 ${
                          isMatched
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isMatched ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : null}
                        <span>{reqSkill}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Active Milestone & Contributors */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    {sprint.contributors.map(c => (
                      <img
                        key={c.id}
                        src={c.avatar}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>{sprint.contributors.length} active hackers</span>
                    <span> · </span>
                    <span className="text-amber-500 font-medium">
                      {sprint.openPositions.length} roles open
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playTechClick(800);
                      onViewSprintTimeline(sprint);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors"
                  >
                    View Timeline
                  </button>

                  <button
                    onClick={() => handleOpenJoinModal(sprint)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-tight shadow-sm active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>Request to Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Join Sprint Modal */}
      {joiningSprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Join Development Sprint
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {joiningSprint.title}
                </span>
              </div>
              <button
                onClick={() => setJoiningSprint(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select Your Desired Role:
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              >
                {joiningSprint.openPositions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
                <option value="General Open Source Contributor">General Open Source Contributor</option>
              </select>
            </div>

            {/* Pitch Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message to Sprint Maintainer:
              </label>
              <textarea
                rows={3}
                value={joinNote}
                onChange={(e) => setJoinNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Your 96% skill match will automatically grant sprint pair access upon submission.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setJoiningSprint(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitJoin}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Submit &amp; Enter Sprint
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Success Toast */}
      {joinedToast && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 p-3 rounded-xl bg-slate-900 text-white border border-emerald-500/60 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom">
          <div className="flex items-center gap-2 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{joinedToast}</span>
          </div>
          <button 
            onClick={() => setJoinedToast(null)}
            className="text-slate-400 hover:text-white text-xs font-mono"
          >
            &times;
          </button>
        </div>
      )}

    </div>
  );
};
