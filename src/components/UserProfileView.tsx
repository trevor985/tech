import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Award, 
  Shield, 
  Users, 
  Moon, 
  Bug, 
  Github, 
  MapPin, 
  Flame, 
  Clock, 
  Star, 
  Edit3, 
  CheckCircle2, 
  Plus, 
  ExternalLink,
  X,
  Code2
} from 'lucide-react';
import { User, Badge, Skill, Post } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface UserProfileViewProps {
  user: User;
  onUpdateProfile: (updated: Partial<User>) => void;
  onAddSkill: (skill: Skill) => void;
  userPosts: Post[];
  onOpenInEditor: (code: string, language: string, filename: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onUpdateProfile,
  onAddSkill,
  userPosts,
  onOpenInEditor
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'badges' | 'skills' | 'snippets'>('badges');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState(user.name);
  const [editHeadline, setEditHeadline] = useState(user.headline);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location);

  // Add skill fields
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(85);
  const [newSkillCategory, setNewSkillCategory] = useState<'systems' | 'web' | 'ai' | 'security' | 'cloud'>('systems');

  const handleSaveProfile = () => {
    playSuccessChime();
    onUpdateProfile({
      name: editName,
      headline: editHeadline,
      bio: editBio,
      location: editLocation
    });
    setIsEditingProfile(false);
  };

  const handleSaveSkill = () => {
    if (!newSkillName.trim()) return;
    playSuccessChime();
    onAddSkill({
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory,
      verified: true,
      endorsements: 1
    });
    setNewSkillName('');
    setShowAddSkillModal(false);
  };

  // Helper for badge icon mapping
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-5 h-5 text-amber-400" />;
      case 'Users': return <Users className="w-5 h-5 text-indigo-400" />;
      case 'Moon': return <Moon className="w-5 h-5 text-cyan-400" />;
      case 'Bug': return <Bug className="w-5 h-5 text-emerald-400" />;
      default: return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-24 px-3 sm:px-4 text-left">
      
      {/* Profile Header Card */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        
        {/* Cover Backdrop */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 flex items-end justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 text-[10px] font-mono text-emerald-400">
            KERNEL_PULSE_SYS_ID: 0x{user.id.toUpperCase()}
          </div>
          <button
            onClick={() => {
              playTechClick(750);
              setIsEditingProfile(true);
            }}
            className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-mono border border-slate-700/80 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* User Avatar & Identity Details */}
        <div className="px-4 sm:px-6 pb-5 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 -mt-12 sm:-mt-14 mb-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl bg-slate-800"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className="flex items-center gap-2">
              <a
                href={user.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user.name}
              </h1>
              <span className="text-sm font-mono text-slate-400">
                @{user.handle}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {user.headline}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {user.bio}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active in {user.activeSprintTitle || 'Kernel Sprints'}</span>
              </div>
            </div>
          </div>

          {/* Quantitative Performance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-5 border-t border-slate-100 dark:border-slate-800 mt-5">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">Reputation XP</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {user.reputation.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">Stars Earned</span>
              <span className="text-base font-bold font-mono text-amber-500">
                ★ {user.starsCount.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">Collaborations</span>
              <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {user.collaborationsCount} Sprints
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 font-mono block">Pair Coding</span>
              <span className="text-base font-bold font-mono text-emerald-500">
                {user.pairProgrammingHours} hrs
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs: Badges / Skills / Snippets */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
        <button
          onClick={() => {
            playTechClick(800);
            setActiveProfileTab('badges');
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeProfileTab === 'badges'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Badges &amp; Honors ({user.badges.length})
        </button>
        <button
          onClick={() => {
            playTechClick(800);
            setActiveProfileTab('skills');
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeProfileTab === 'skills'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Skill Matrix ({user.skills.length})
        </button>
        <button
          onClick={() => {
            playTechClick(800);
            setActiveProfileTab('snippets');
          }}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeProfileTab === 'snippets'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Published Snippets
        </button>
      </div>

      {/* Tab 1: Badges Showcase */}
      {activeProfileTab === 'badges' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Verified Coding Achievements
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Tap badge for criteria &amp; verification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.badges.map((badge) => {
              const isLegendary = badge.rarity === 'legendary';
              const isEpic = badge.rarity === 'epic';

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    playTechClick(850);
                    setSelectedBadge(badge);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-start gap-3.5 ${
                    isLegendary
                      ? 'bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/40 shadow-sm'
                      : isEpic
                      ? 'bg-gradient-to-br from-violet-500/10 via-slate-900 to-slate-900 border-violet-500/40 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    isLegendary
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : isEpic
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-400'
                      : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                  }`}>
                    {renderBadgeIcon(badge.icon)}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {badge.title}
                      </h4>
                      <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                        isLegendary
                          ? 'bg-amber-500 text-slate-950'
                          : isEpic
                          ? 'bg-violet-500 text-white'
                          : 'bg-cyan-500 text-slate-950'
                      }`}>
                        {badge.rarity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {badge.description}
                    </p>

                    <span className="text-[10px] text-slate-400 font-mono block pt-0.5">
                      Unlocked {badge.unlockedAt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Skill Matrix */}
      {activeProfileTab === 'skills' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Proficiency &amp; Peer Endorsements
            </span>
            <button
              onClick={() => {
                playTechClick(800);
                setShowAddSkillModal(true);
              }}
              className="flex items-center gap-1 text-xs font-mono text-emerald-500 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {user.skills.map((skill) => (
              <div
                key={skill.name}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {skill.name}
                    </span>
                    {skill.verified && (
                      <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400">
                      {skill.endorsements} endorsements
                    </span>
                    <span className="font-bold text-emerald-400">
                      {skill.level}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Published Snippets */}
      {activeProfileTab === 'snippets' && (
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Your Code Releases &amp; Milestones
          </div>

          {userPosts.filter(p => p.codeSnippet).length === 0 ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No code snippets published yet. Use the IDE tab to run and post code!
            </div>
          ) : (
            userPosts.filter(p => p.codeSnippet).map(p => (
              <div 
                key={p.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {p.title}
                  </h4>
                  <button
                    onClick={() => {
                      playTechClick(850);
                      onOpenInEditor(p.codeSnippet!.code, p.codeSnippet!.language, p.codeSnippet!.filename);
                    }}
                    className="text-xs font-mono text-emerald-500 hover:underline flex items-center gap-1"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Open in Editor</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-36">
                  {p.codeSnippet!.code}
                </pre>
              </div>
            ))
          )}
        </div>
      )}

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-5 text-center space-y-4">
            
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              {renderBadgeIcon(selectedBadge.icon)}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                {selectedBadge.rarity} Coding Badge
              </span>
              <h3 className="text-lg font-bold text-white">
                {selectedBadge.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Unlock Requirement
              </span>
              <p className="text-xs text-slate-200 font-sans">
                {selectedBadge.criteria}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80">
                <span>Status: Verified &amp; Merged</span>
                <span>Date: {selectedBadge.unlockedAt}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Developer Profile
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Technical Headline</label>
              <input
                type="text"
                value={editHeadline}
                onChange={(e) => setEditHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bio</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Technical Skill
              </h3>
              <button
                onClick={() => setShowAddSkillModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Skill / Tech Name</label>
              <input
                type="text"
                placeholder="e.g. Zig, Vulkan, SIMD"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Proficiency Level ({newSkillLevel}%)
              </label>
              <input
                type="range"
                min="40"
                max="100"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowAddSkillModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSkill}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
