import React, { useState } from 'react';
import { 
  GitBranch, 
  GitPullRequest, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Calendar, 
  Users, 
  Layers, 
  ArrowUpRight,
  Code2,
  X,
  Radio
} from 'lucide-react';
import { Sprint, SprintMilestone } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface TimelineViewProps {
  sprints: Sprint[];
  selectedSprintId?: string;
  onOpenPairForMilestone: (milestone: SprintMilestone) => void;
  onAddMilestoneToSprint: (sprintId: string, milestone: Partial<SprintMilestone>) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  sprints,
  selectedSprintId,
  onOpenPairForMilestone,
  onAddMilestoneToSprint
}) => {
  const [activeSprintId, setActiveSprintId] = useState<string>(
    selectedSprintId || (sprints[0] ? sprints[0].id : '')
  );
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('Nov 15, 2026');

  const currentSprint = sprints.find(s => s.id === activeSprintId) || sprints[0];

  if (!currentSprint) {
    return <div className="p-8 text-center text-slate-500">No active sprints.</div>;
  }

  const completedCount = currentSprint.milestones.filter(m => m.status === 'completed').length;
  const progressPct = Math.round((completedCount / currentSprint.milestones.length) * 100);

  const handleSaveMilestone = () => {
    if (!newTitle.trim()) return;
    playSuccessChime();
    onAddMilestoneToSprint(currentSprint.id, {
      title: newTitle.trim(),
      description: newDesc.trim() || 'New collaborative milestone target.',
      status: 'upcoming',
      targetDate: newDate
    });
    setNewTitle('');
    setNewDesc('');
    setShowAddMilestoneModal(false);
  };

  return (
    <div className="space-y-4 pb-24 px-3 sm:px-4 text-left">
      
      {/* Header and Sprint Selector */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-500" />
            Project Collaboration Roadmap
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sprint timelines, open PRs, and verified milestone progression
          </p>
        </div>

        {/* Project Selector */}
        <select
          value={currentSprint.id}
          onChange={(e) => {
            playTechClick(750);
            setActiveSprintId(e.target.value);
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 self-start sm:self-auto"
        >
          {sprints.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      {/* Sprint Overview Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        
        {/* Repo & Velocity info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ACTIVE SPRINT · {currentSprint.difficulty.toUpperCase()}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {currentSprint.title}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {currentSprint.repoName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playTechClick(800);
                setShowAddMilestoneModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-300">
              Sprint Completion
            </span>
            <span className="font-bold text-emerald-500">
              {progressPct}% ({completedCount}/{currentSprint.milestones.length} Milestones)
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono block">Timeline</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                {currentSprint.startDate} – {currentSprint.endDate}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono block">Contributors</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                {currentSprint.contributors.length} Hackers
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-mono block">Open Roles</span>
              <span className="text-xs font-bold text-amber-500 font-mono">
                {currentSprint.openPositions.length} Available
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Timeline Stream */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
          Milestone Sequence
        </h4>

        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6">
          {currentSprint.milestones.map((milestone, idx) => {
            const isCompleted = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';

            return (
              <div key={milestone.id} className="relative group">
                
                {/* Timeline node icon */}
                <div 
                  className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-950 transition-transform ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : isInProgress
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isInProgress ? (
                    <span className="w-2 h-2 rounded-full bg-slate-950" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Milestone Card */}
                <div 
                  className={`p-4 rounded-2xl border transition-all ${
                    isInProgress
                      ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
                      : isCompleted
                      ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-800/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Phase 0{idx + 1}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : isInProgress
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {milestone.status.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-mono">
                      Target: {milestone.targetDate}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {milestone.description}
                  </p>

                  {/* Assignee & PR Info */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {milestone.assigneeAvatar ? (
                        <img
                          src={milestone.assigneeAvatar}
                          alt={milestone.assigneeName}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                        {milestone.assigneeName || 'Unassigned / Open'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {milestone.prLink && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <GitPullRequest className="w-3 h-3 text-emerald-500" />
                          <span>{milestone.prLink}</span>
                        </span>
                      )}

                      {isInProgress && (
                        <button
                          onClick={() => {
                            playTechClick(900);
                            onOpenPairForMilestone(milestone);
                          }}
                          className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                          <Radio className="w-3 h-3 animate-pulse" />
                          <span>Pair on PR &rarr;</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Milestone to {currentSprint.title}
              </h3>
              <button
                onClick={() => setShowAddMilestoneModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Milestone Title:
              </label>
              <input
                type="text"
                placeholder="e.g. SIMD Vectorization Benchmark"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Technical Deliverables:
              </label>
              <textarea
                rows={3}
                placeholder="Describe key PRs, tests, and target performance metrics..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-sans resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Date:
              </label>
              <input
                type="text"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowAddMilestoneModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMilestone}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Add to Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
