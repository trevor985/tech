import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  GitBranch, 
  Star, 
  GitFork, 
  GitPullRequest, 
  AlertCircle, 
  Play, 
  Code2, 
  Users, 
  Clock, 
  Sparkles, 
  ArrowUpDown,
  CheckCircle2,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';
import { Project, ProjectStage, User } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface ProjectDiscoveryFeedProps {
  projects: Project[];
  currentUser: User;
  onStarProject: (projectId: string) => void;
  onOpenProjectInEditor: (project: Project) => void;
  onOpenProjectGit: (project: Project) => void;
  onOpenProjectChat: (project: Project) => void;
  onViewUserProfile?: (user: User) => void;
}

export const ProjectDiscoveryFeed: React.FC<ProjectDiscoveryFeedProps> = ({
  projects,
  currentUser,
  onStarProject,
  onOpenProjectInEditor,
  onOpenProjectGit,
  onOpenProjectChat,
  onViewUserProfile
}) => {
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedTechStack, setSelectedTechStack] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');

  // Sorting
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'recently_active'>('recently_active');

  // Code inspection preview modal
  const [previewingProject, setPreviewingProject] = useState<Project | null>(null);

  // Available options
  const languages = ['All', 'Rust', 'TypeScript', 'WebGPU/WGSL', 'C', 'Python', 'Go'];
  const techStacks = [
    'All',
    'Kernel & Systems',
    'Compilers & AST',
    'WebGPU / Graphics',
    'Security & eBPF',
    'CRDT & Networking',
    'AI & Neural Runtimes'
  ];
  const stages: { label: string; value: string }[] = [
    { label: 'All Stages', value: 'All' },
    { label: 'Seeking Contributors', value: 'seeking contributors' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'Completed', value: 'completed' },
  ];

  // Filtering & Sorting logic
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Language filter
      if (selectedLanguage !== 'All' && project.language.toLowerCase() !== selectedLanguage.toLowerCase()) {
        return false;
      }

      // Tech stack filter
      if (selectedTechStack !== 'All') {
        const hasTech = project.techStack.some(t => t.toLowerCase() === selectedTechStack.toLowerCase());
        if (!hasTech) return false;
      }

      // Stage filter
      if (selectedStage !== 'All' && project.stage !== selectedStage) {
        return false;
      }

      // Search query filter (matches title, description, repoName, or techStack)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesDesc = project.description.toLowerCase().includes(q);
        const matchesRepo = project.repoName.toLowerCase().includes(q);
        const matchesTech = project.techStack.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesRepo && !matchesTech) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'popular') {
        return (b.stars + b.forks) - (a.stars + a.forks);
      }
      if (sortBy === 'recently_active') {
        return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
      }
      return 0;
    });
  }, [projects, selectedLanguage, selectedTechStack, selectedStage, searchQuery, sortBy]);

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getStageBadgeColor = (stage: ProjectStage) => {
    switch (stage) {
      case 'seeking contributors':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'in progress':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
      case 'completed':
        return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-4 pb-24 px-3 sm:px-4 text-left">
      
      {/* Search & Top Action Bar */}
      <div className="pt-2 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              Open Source Project Discovery
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore cutting-edge projects, find active sprints, and pair with creators
            </p>
          </div>

          {/* Quick Sort Control */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 pl-2 hidden sm:inline">
              Sort:
            </span>
            <button
              onClick={() => {
                playTechClick(700);
                setSortBy('recently_active');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                sortBy === 'recently_active'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Recently Active
            </button>
            <button
              onClick={() => {
                playTechClick(700);
                setSortBy('popular');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                sortBy === 'popular'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Most Popular
            </button>
            <button
              onClick={() => {
                playTechClick(700);
                setSortBy('newest');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                sortBy === 'newest'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Newest
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects by name, kernel subsystem, shader, AST, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          
          {/* Programming Language filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-1 block">
              Language
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                playTechClick(750);
                setSelectedLanguage(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang === 'All' ? 'All Languages' : lang}</option>
              ))}
            </select>
          </div>

          {/* Tech Stack filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-1 block">
              Technology Domain
            </span>
            <select
              value={selectedTechStack}
              onChange={(e) => {
                playTechClick(750);
                setSelectedTechStack(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {techStacks.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Tech Stacks' : t}</option>
              ))}
            </select>
          </div>

          {/* Project Stage filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 px-1 block">
              Project Stage
            </span>
            <select
              value={selectedStage}
              onChange={(e) => {
                playTechClick(750);
                setSelectedStage(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {stages.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Results Count & Active Filters Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1 font-mono">
          <span>Found {filteredProjects.length} open source repositories</span>
          {(selectedLanguage !== 'All' || selectedTechStack !== 'All' || selectedStage !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedLanguage('All');
                setSelectedTechStack('All');
                setSelectedStage('All');
                setSearchQuery('');
                playTechClick(600);
              }}
              className="text-emerald-500 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Filter className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching projects found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your language, tech domain, or stage filters to discover more open repositories.
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            return (
              <div
                key={project.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden hover:border-emerald-500/50 transition-all p-4 sm:p-5 text-left group"
              >
                {/* Header Row: Author, Repo name & Stage Badge */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={project.author.avatar}
                      alt={project.author.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 cursor-pointer"
                      onClick={() => onViewUserProfile && onViewUserProfile(project.author)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          {project.repoName}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(project.lastActiveAt)}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5 leading-snug group-hover:text-emerald-500 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Stage Badge */}
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-xl uppercase font-bold border tracking-wider shrink-0 ${getStageBadgeColor(project.stage)}`}>
                    {project.stage}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Cover Image Preview (if present) */}
                {project.coverImage && (
                  <div className="my-3 rounded-xl overflow-hidden aspect-[21/9] bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Language & Tech Stack Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {project.language}
                  </span>
                  {project.techStack.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Seeking Contributors Callout if stage is seeking contributors */}
                {project.stage === 'seeking contributors' && project.seekingRoles && project.seekingRoles.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Seeking Roles:</span>
                      <span className="font-normal">{project.seekingRoles.join(' · ')}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                      Open Sprints
                    </span>
                  </div>
                )}

                {/* Quantitative Metrics & Collaboration CTAs */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Metrics: Stars, Forks, Active PRs, Open Issues */}
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <button
                      onClick={() => {
                        playTechClick(850);
                        onStarProject(project.id);
                      }}
                      className={`flex items-center gap-1 hover:text-amber-500 transition-colors ${
                        project.isStarred ? 'text-amber-500 font-bold' : ''
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${project.isStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{project.stars}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{project.forks}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <GitPullRequest className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{project.activePRs} PRs</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{project.openIssues} issues</span>
                    </div>
                  </div>

                  {/* Action Buttons: Inspect Code, Version Control, Pair in IDE */}
                  <div className="flex items-center gap-2">
                    {/* Inspect Code Sample */}
                    {project.codeSample && (
                      <button
                        onClick={() => {
                          playTechClick(750);
                          setPreviewingProject(project);
                        }}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                    )}

                    {/* Open Git Panel */}
                    <button
                      onClick={() => {
                        playTechClick(800);
                        onOpenProjectGit(project);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Git / PRs</span>
                    </button>

                    {/* Project Chat */}
                    <button
                      onClick={() => {
                        playTechClick(850);
                        onOpenProjectChat(project);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Chat</span>
                    </button>

                    {/* Pair Live in IDE */}
                    <button
                      onClick={() => {
                        playTechClick(900);
                        onOpenProjectInEditor(project);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Pair Live</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Code Sample Preview Modal */}
      {previewingProject && previewingProject.codeSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-5 space-y-3 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white">
                  {previewingProject.codeSample.filename}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  [{previewingProject.codeSample.language}]
                </span>
              </div>
              <button
                onClick={() => setPreviewingProject(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-72">
              {previewingProject.codeSample.code}
            </pre>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewingProject(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const proj = previewingProject;
                  setPreviewingProject(null);
                  onOpenProjectInEditor(proj);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono"
              >
                Open in Shared IDE &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
