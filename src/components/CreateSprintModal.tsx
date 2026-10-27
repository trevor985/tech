import React, { useState } from 'react';
import { X, Target, GitBranch, Users, Calendar } from 'lucide-react';
import { Sprint, User } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface CreateSprintModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmit: (sprint: Sprint) => void;
}

export const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  currentUser,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [repoName, setRepoName] = useState('kernelpulse/my-new-runtime');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('Rust, WebAssembly, Systems');
  const [difficulty, setDifficulty] = useState<'Beginner Friendly' | 'Intermediate' | 'Hardcore Systems'>('Intermediate');
  const [rolesInput, setRolesInput] = useState('Core Driver Hacker, Benchmark Specialist');
  const [startDate, setStartDate] = useState('Oct 28, 2026');
  const [endDate, setEndDate] = useState('Nov 18, 2026');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    playSuccessChime();

    const requiredSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const openPositions = rolesInput.split(',').map(r => r.trim()).filter(Boolean);

    const newSprint: Sprint = {
      id: `sprint_${Date.now()}`,
      title: title.trim(),
      repoName: repoName.trim(),
      description: description.trim(),
      creator: currentUser,
      contributors: [currentUser],
      tags: requiredSkills,
      requiredSkills,
      difficulty,
      status: 'recruiting',
      startDate,
      endDate,
      openPositions,
      matchScore: 98,
      milestones: [
        {
          id: `m_${Date.now()}_1`,
          title: 'RFC & Architecture Definition',
          description: 'Define memory layouts, trait interfaces, and concurrency primitives.',
          status: 'in_progress',
          targetDate: startDate,
          assigneeName: currentUser.name,
          assigneeAvatar: currentUser.avatar
        },
        {
          id: `m_${Date.now()}_2`,
          title: 'Core Prototype Implementation',
          description: 'Implement first working pass with zero-allocation memory buffers.',
          status: 'upcoming',
          targetDate: endDate
        }
      ]
    };

    onSubmit(newSprint);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 text-left space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-500" />
              Launch Open Source Sprint
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Find collaborators with matching skill vectors
            </span>
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Sprint Project Title:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HyperKernel: Zero-Copy IPC"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              GitHub Repo Path:
            </label>
            <input
              type="text"
              required
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Sprint Objective &amp; Architecture:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain the technical goals, performance milestones, and why coders should join..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Required Skills (comma separated):
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Difficulty Tier:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="Beginner Friendly">Beginner Friendly</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Hardcore Systems">Hardcore Systems</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Open Contributor Roles:
            </label>
            <input
              type="text"
              value={rolesInput}
              onChange={(e) => setRolesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Start Date</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">End Date</label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

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
              Launch Sprint &rarr;
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
